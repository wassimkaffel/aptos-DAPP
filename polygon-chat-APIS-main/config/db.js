require("dotenv").config();
const mongoose = require("mongoose");

// DB Config
const db = require("./keys").mongoURI;

function connectDB() {
    //Database connection
    mongoose.connect(db, { useNewUrlParser: true });
    const connection = mongoose.connection;
    connection.once("open", () => {
        console.log("Database Connected");
    }).on("error", function (err) {
        console.log("Database Connection Failed", err);
    });
}

module.exports = connectDB;