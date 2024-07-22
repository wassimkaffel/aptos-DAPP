let mongoose = require("mongoose");

var objUserInfo = {
    userId: {
        type: Number,
        required: false,
        default: 1,
    },
    account: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: false,
        default: "John",
    },
    lastname: {
        type: String,
        required: false,
        default: "Dao",
    },
    username: {
        type: String,
        required: false,
        default: "SCENEZuser",
    },
    bio: {
        type: String,
        required: false,
        default:
            "I make art with the simple goal of giving you something pleasing to look at for a few seconds.",
    },
    email: {
        type: String,
        required: false,
        default: "yourid@4dfun.io",
    },
    accessDate: {
        type: Date,
        required: false,
        default: Date.now,
    },
    onlineStatus: {
        type: Boolean,
        required: true,
    },
    sentRequest: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "userinfoSchemas",
            },
            account: {
                type: String,
            },
        },
    ],
    request: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "userinfoSchemas",
            },
            account: {
                type: String,
            },
        },
    ],
    FriendList: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "userinfoSchemas",
            },
            account: {
                type: String,
            },
            isblock: {
                type: Boolean,
            },
            isfavorite: {
                type: Boolean,
            },
        },
    ],
    inviteRequest: [
        {
            channelName: {
                type: String,
            },
            creater: {
                type: String,
            },
            token: {
                type: String,
            },
        },
    ],
};

let userinfoSchema = mongoose.Schema(objUserInfo);
var UserinfoSchemas = (module.exports = mongoose.model(
    "userinfoSchemas",
    userinfoSchema
));

module.exports.getUsers = function (callback, limit) {
    UserinfoSchemas.find(callback).limit(limit);
};
