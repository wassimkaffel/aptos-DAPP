const bcrypt = require("bcryptjs");
const userinfoSchema = require("../models/userinfo.js");

// Save all user infos when he login with their metamask
exports.userLogin = async (req, res) => {
    userinfoSchema
        .findOne({ account: req.params.id })
        .then(async (user_management) => {
            if (user_management) {
                return res.json({ msg: "account already exist" });
            } else {
                if (req.params.id !== undefined) {
                    userinfoSchema
                        .find()
                        .sort({ _id: 1 })
                        .then(async (user) => {
                            const newuserinfoSchema = new userinfoSchema({
                                account: req.params.id,
                                userId: user.length ? user[user.length - 1].userId + 1 : 1,
                                onlineStatus: true,
                            });
                            bcrypt.genSalt(10, (err, salt) => {
                                if (err) throw err;
                                newuserinfoSchema
                                    .save()
                                    .then((userinfo) => {
                                        return res.json({ msg: userinfo });
                                    })
                                    .catch((err) => console.warn("warning", err));
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    res.json({ status: false, msg: "account is undefined" });
                }
            }
        });
};

exports.setUserProfile = async (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                user_management.firstname = req.body.firstname;
                user_management.lastname = req.body.lastname;
                user_management.username = req.body.username;
                user_management.bio = req.body.bio;
                user_management.email = req.body.email;
                user_management
                    .save()
                    .then((userinfoSchema) => res.json({ results: userinfoSchema }))
                    .catch((err) => console.warn("warning", err));
            } else {
                res.json({ msg: "something went wrong!" });
            }
        });
};

exports.getUserProfile = async (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                res.json(user_management);
            } else {
                res.json({ msg: "something went wrong!" });
            }
        });
};

exports.Add_friend = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_Friend = user_management.FriendList;
            var update_friend = {
                account: req.body.account,
                isblock: false,
                isfavorite: false,
            };
            for (var i = 0; i < new_Friend.length; i++) {
                if (new_Friend[i].account === update_friend.account) {
                    isExist = true;
                }
            }
            if (!isExist) {
                new_Friend.push(update_friend);
                userinfoSchema
                    .findOneAndUpdate(
                        { account: req.body.Toaccount },
                        { FriendList: new_Friend }
                    )
                    .then((update) => {
                        res.json({ result: true });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                res.json({ result: "fail" });
            }
        })
        .catch((err) => console.error(err));
};

exports.Add_Block = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_Friend = user_management.FriendList;

            for (var i = 0; i < new_Friend.length; i++) {
                if (new_Friend[i].account === req.body.account) {
                    new_Friend[i].isblock = true;
                    isExist = true;
                }
            }
            if (isExist) {
                user_management
                    .save()
                    .then((update) => {
                        res.json({ result: true });
                    })
                    .catch((err) => console.error(err));
            } else {
                res.json({ result: false });
            }
        })
        .catch((err) => console.error(err));
};

exports.Add_Favorite = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_Friend = user_management.FriendList;

            for (var i = 0; i < new_Friend.length; i++) {
                if (new_Friend[i].account === req.body.account) {
                    new_Friend[i].isfavorite = true;
                    isExist = true;
                }
            }
            if (isExist) {
                user_management
                    .save()
                    .then((update) => {
                        res.json({ result: true });
                    })
                    .catch((err) => console.error(err));
            } else {
                res.json({ result: false });
            }
        })
        .catch((err) => console.error(err));
};

exports.RemoveFriend = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var friendsAccount = req.body.account;

            userinfoSchema
                .findOne({ account: friendsAccount })
                .then((myfriends_management) => {
                    if (myfriends_management) {
                        var friends = myfriends_management.FriendList;
                        var itemFrombeRemoved = { account: req.body.Toaccount };
                        friends.splice(
                            friends.findIndex((a) => a.account === itemFrombeRemoved.account),
                            1
                        );
                        userinfoSchema
                            .findOneAndUpdate(
                                { account: friendsAccount },
                                { FriendList: friends }
                            )
                            .then((update) => { })
                            .catch((err) => console.error(err));
                    }
                })
                .catch((err) => console.error(err));

            var new_Friend = user_management.FriendList;
            var itemToBeRemoved = { account: req.body.account };
            new_Friend.splice(
                new_Friend.findIndex((a) => a.account === itemToBeRemoved.account),
                1
            );
            userinfoSchema
                .findOneAndUpdate(
                    { account: req.body.Toaccount },
                    { FriendList: new_Friend }
                )
                .then((update) => {
                    res.json({ result: true });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => console.error(err));
};

exports.Remove_Favorite = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_Friend = user_management.FriendList;

            for (var i = 0; i < new_Friend.length; i++) {
                if (new_Friend[i].account === req.body.account) {
                    new_Friend[i].isfavorite = false;
                    isExist = true;
                }
            }
            if (isExist) {
                user_management
                    .save()
                    .then((update) => {
                        res.json({ result: true });
                    })
                    .catch((err) => console.error(err));
            } else {
                res.json({ result: false });
            }
        })
        .catch((err) => console.error(err));
};

exports.Remove_Blocklist = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_Friend = user_management.FriendList;

            for (var i = 0; i < new_Friend.length; i++) {
                if (new_Friend[i].account === req.body.account) {
                    new_Friend[i].isblock = false;
                    isExist = true;
                }
            }
            if (isExist) {
                user_management
                    .save()
                    .then((update) => {
                        res.json({ result: true });
                    })
                    .catch((err) => console.error(err));
            } else {
                res.json({ result: false });
            }
        })
        .catch((err) => console.error(err));
};

exports.SetRequestFriends = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_request = user_management.request;
            var update_item = {
                account: req.body.account,
            };
            for (var i = 0; i < new_request.length; i++) {
                if (new_request[i].account === update_item.account) {
                    isExist = true;
                }
            }
            if (!isExist) {
                new_request.push(update_item);
                userinfoSchema
                    .findOneAndUpdate(
                        { account: req.body.Toaccount },
                        { request: new_request }
                    )
                    .then((updated) => {

                        res.json(updated);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                res.json({ result: "fail" });
            }
        })
        .catch((err) => console.error(err));
};

exports.SetFriendSentRequest = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.Toaccount })
        .then((user_management) => {
            var isExist = false;
            var new_request = user_management.sentRequest;
            var update_item = {
                account: req.body.account,
            };
            for (var i = 0; i < new_request.length; i++) {
                if (new_request[i].account === update_item.account) {
                    isExist = true;
                }
            }
            if (!isExist) {
                new_request.push(update_item);
                userinfoSchema
                    .findOneAndUpdate(
                        { account: req.body.Toaccount },
                        { sentRequest: new_request }
                    )
                    .then((updated) => {
                        res.json(updated);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                res.json({ result: "fail" });
            }
        })
        .catch((err) => console.error(err));
};

exports.Remove_Request = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            var new_request = user_management.request;
            var itemToBeRemoved = { account: req.body.index };
            new_request.splice(
                new_request.findIndex((a) => a.account === itemToBeRemoved.account),
                1
            );
            userinfoSchema
                .findOneAndUpdate(
                    { account: req.body.account },
                    { request: new_request }
                )
                .then((update) => {
                    res.json({ result: true });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => console.error(err));
};

exports.Remove_SentRequest = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            var new_request = user_management.sentRequest;
            var itemToBeRemoved = { account: req.body.index };
            new_request.splice(
                new_request.findIndex((a) => a.account === itemToBeRemoved.account),
                1
            );
            userinfoSchema
                .findOneAndUpdate(
                    { account: req.body.account },
                    { sentRequest: new_request }
                )
                .then((update) => {
                    res.json({ result: true });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => console.error(err));
};

exports.Getfriends = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                var Friends = user_management.FriendList;
                var RealFriendsAccounts = [];
                var resultdata = [];
                for (var i = 0; i < Friends.length; i++) {
                    if (!Friends[i].isblock) {
                        RealFriendsAccounts.push(Friends[i].account);
                    }
                }
                if (RealFriendsAccounts.length == 0) {
                    res.json({ msg: "No Data" });
                } else {
                    for (var j = 0; j < RealFriendsAccounts.length; j++) {
                        userinfoSchema
                            .findOne({ account: RealFriendsAccounts[j] })
                            .then((resdata) => {
                                if (resdata) {
                                    resultdata.push({
                                        firstname: resdata.firstname,
                                        lastname: resdata.lastname,
                                        username: resdata.username,
                                        account: resdata.account,
                                        onlineStatus: resdata.onlineStatus,
                                        accessDate: resdata.accessDate,
                                        email: resdata.email,
                                    });

                                    if (resultdata.length == RealFriendsAccounts.length) {
                                        res.json(resultdata);
                                    }
                                } else {
                                    resdata.json({ msg: "Something went wrong!" });
                                }
                            })
                            .catch((err) => console.error(err));
                    }
                }

            } else {
                res.json({ msg: "Nothing!" });
            }
        })
        .catch((err) => console.error(err));
};

exports.GetRequestFriends = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                var myfriendsAccounts = [];
                var resultdata = [];
                var myrequestdata = user_management.request;
                if (myrequestdata.length !== 0) {
                    for (var i = 0; i < myrequestdata.length; i++) {
                        myfriendsAccounts.push(myrequestdata[i].account);
                    }

                    for (var j = 0; j < myfriendsAccounts.length; j++) {
                        userinfoSchema
                            .findOne({ account: myfriendsAccounts[j] })
                            .then((resdata) => {
                                if (resdata) {
                                    resultdata.push({
                                        firstname: resdata.firstname,
                                        lastname: resdata.lastname,
                                        username: resdata.username,
                                        account: resdata.account,
                                        accessDate: resdata.accessDate,
                                        onlineStatus: resdata.onlineStatus,
                                    });

                                    if (resultdata.length == myfriendsAccounts.length) {
                                        res.json(resultdata);
                                    }
                                } else {
                                    resdata.json({ msg: "Something went wrong!" });
                                }
                            })
                            .catch((err) => console.error(err));
                    }
                } else {
                    res.json({ msg: "No Data" });
                }

            } else {
                res.json({ msg: "Your account is wrong" });
            }
        })
        .catch((err) => console.error(err));
};

exports.GetSentRequestFriends = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                var myfriendsAccounts = [];
                var resultdata = [];
                var myrequestdata = user_management.sentRequest;
                if (myrequestdata.length !== 0) {
                    for (var i = 0; i < myrequestdata.length; i++) {
                        myfriendsAccounts.push(myrequestdata[i].account);
                    }

                    for (var j = 0; j < myfriendsAccounts.length; j++) {
                        userinfoSchema
                            .findOne({ account: myfriendsAccounts[j] })
                            .then((resdata) => {
                                if (resdata) {
                                    resultdata.push({
                                        firstname: resdata.firstname,
                                        lastname: resdata.lastname,
                                        username: resdata.username,
                                        account: resdata.account,
                                        accessDate: resdata.accessDate,
                                        onlineStatus: resdata.onlineStatus,
                                    });

                                    if (resultdata.length == myfriendsAccounts.length) {
                                        res.json(resultdata);
                                    }
                                } else {
                                    resdata.json({ msg: "Something went wrong!" });
                                }
                            })
                            .catch((err) => console.error(err));
                    }
                } else {
                    res.json({ msg: "No Data" });
                }

            } else {
                res.json({ msg: "Your account is wrong" });
            }
        })
        .catch((err) => console.error(err));
};

exports.GetBlocklist = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                var Friends = user_management.FriendList;
                var blocklist = [];
                var resultdata = [];
                for (var i = 0; i < Friends.length; i++) {
                    if (Friends[i].isblock) {
                        blocklist.push(Friends[i].account);
                    }
                }
                if (blocklist.length == 0) {
                    res.json({ msg: "No Data" });
                } else {
                    for (var j = 0; j < blocklist.length; j++) {
                        userinfoSchema
                            .findOne({ account: blocklist[j] })
                            .then((resdata) => {
                                if (resdata) {
                                    resultdata.push({
                                        firstname: resdata.firstname,
                                        lastname: resdata.lastname,
                                        username: resdata.username,
                                        account: resdata.account,
                                        onlineStatus: resdata.onlineStatus,
                                        email: resdata.email,
                                        accessDate: resdata.accessDate,
                                    });

                                    if (resultdata.length == blocklist.length) {
                                        res.json(resultdata);
                                    }
                                } else {
                                    resdata.json({ msg: "Something went wrong!" });
                                }
                            })
                            .catch((err) => console.error(err));
                    }
                }

            } else {
                res.json({ msg: "something went wrong!" });
            }
        })
        .catch((err) => console.error(err));
};

exports.Getfavorite = (req, res) => {
    userinfoSchema
        .findOne({ account: req.body.account })
        .then((user_management) => {
            if (user_management) {
                var Friends = user_management.FriendList;
                var favorite = [];
                var resultdata = [];
                for (var i = 0; i < Friends.length; i++) {
                    if (Friends[i].isfavorite) {
                        favorite.push(Friends[i].account);
                    }
                }
                if (favorite.length == 0) {
                    res.json({ msg: "No Data" });
                } else {
                    for (var j = 0; j < favorite.length; j++) {
                        userinfoSchema
                            .findOne({ account: favorite[j] })
                            .then((resdata) => {
                                if (resdata) {
                                    resultdata.push({
                                        firstname: resdata.firstname,
                                        lastname: resdata.lastname,
                                        username: resdata.username,
                                        account: resdata.account,
                                        onlineStatus: resdata.onlineStatus,
                                        email: resdata.email,
                                        accessDate: resdata.accessDate,
                                    });

                                    if (resultdata.length == favorite.length) {
                                        res.json(resultdata);
                                    }
                                } else {
                                    resdata.json({ msg: "Something went wrong!" });
                                }
                            })
                            .catch((err) => console.error(err));
                    }
                }

            } else {
                res.json({ msg: "Something went Wrong!" });
            }
        })
        .catch((err) => console.error(err));
};