const express = require("express");
const router = express.Router();
const UserCtr = require("../controller/UserControl.js");


// middleware
const validationPostRequest = (keys) => {
    return function (req, res, next) {
        keys.forEach(key => {
            if (!req.body[key]) res.status(404).json({ message: `Not found ${key} field!` });
        });
        next();
    }
}

router.get("/v1/user-login/:id", UserCtr.userLogin);

router.post("/v1/set-user-profile/", validationPostRequest(["account","firstname", "lastname", "username", "bio", "email"]), UserCtr.setUserProfile);
router.post("/v1/get-user-profile/", validationPostRequest(["account"]), UserCtr.getUserProfile);

router.post("/v1/friend/add_friend/", validationPostRequest(["Toaccount", "account"]), UserCtr.Add_friend);
router.post("/v1/friend/add_block/", validationPostRequest(["Toaccount", "account"]), UserCtr.Add_Block);
router.post("/v1/friend/add_favorite/", validationPostRequest(["Toaccount", "account"]), UserCtr.Add_Favorite);

router.post("/v1/friend/remove_friend/", validationPostRequest(["Toaccount", "account"]), UserCtr.RemoveFriend);
router.post("/v1/friend/remove_blocklist/", validationPostRequest(["Toaccount", "account"]), UserCtr.Remove_Blocklist);
router.post("/v1/friend/remove_favorite/", validationPostRequest(["Toaccount", "account"]), UserCtr.Remove_Favorite);

router.post("/user/friend/setFriendRequest", validationPostRequest(["Toaccount", "account"]), UserCtr.SetRequestFriends);
router.post("/user/friend/setFriendSentRequest", validationPostRequest(["Toaccount", "account"]), UserCtr.SetFriendSentRequest);

router.post("/user/friend/Remove_Request", validationPostRequest(["account", "index"]), UserCtr.Remove_Request);
router.post("/user/friend/Remove_SentRequest", validationPostRequest(["account", "index"]), UserCtr.Remove_SentRequest);

router.post("/user/friend/getRequestFriends/", validationPostRequest(["account"]), UserCtr.GetRequestFriends);
router.post("/user/friend/getsentRequestFriends/", validationPostRequest(["account"]), UserCtr.GetSentRequestFriends);

router.post("/user/friend/getFriends/", validationPostRequest(["account"]), UserCtr.Getfriends);
router.post("/user/friend/getBlocklist/", validationPostRequest(["account"]), UserCtr.GetBlocklist);
router.post("/user/friend/getFavorite/", validationPostRequest(["account"]), UserCtr.Getfavorite);


module.exports = router;