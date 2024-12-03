// Secret .env stuff
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

// Needed for schemas in order to model your data easier and more straight forward. Does more than that too.
const mongoose = require("mongoose");
// Needed to set up sessions in express
const session = require("express-session");
// Using connect-mongo for session stores.
const MongoStore = require("connect-mongo");
// Needed to trick express into thinking post can be "put", "patch" "delete" and more.
const methodOverride = require("method-override");
// Needed for easier authentication and registering for users. Automates alot.
const passport = require("passport");
const LocalStrategy = require("passport-local");
// Just requiring the user model.
const User = require("./models/user");
// Needed to prevent Mongo Injection.
const mongoSanitize = require("express-mongo-sanitize");
// Helmet helps secure Express apps by setting HTTP response headers.
const helmet = require("helmet");

// DB URL FROM .ENV
const dbUrl = process.env.DB_URL;

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(helmet());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from the frontend
    methods: ["GET", "POST"],
  },
});

// Session config with Mongo

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret,
  },
  autoRemove: "interval",
  autoRemoveInterval: "5",
});

const sessionConfig = {
  store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // If you have secure: true, that means that the cookies can only be configured/changed over HTTPS. YES FOR PRODUCTION
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

////////////////////////////////////////////////

app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Setting up and using passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to database
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
  });

io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit a welcome message to the newly connected user
  socket.emit("message", "Welcome to the chat!");

  // Handle incoming messages from the client
  socket.on("sendMessage", (msg) => {
    console.log("Message received:", msg);

    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
