const validUser = function(userId) {
    if (
        userId === "" ||
        userId === null ||
        userId === undefined ||
        userId === "undefined" ||
        userId.length > 10
    ) {
        let mat = Math.floor(Math.random() * 10) + 1;
        let str = Math.random().toString(36).substr(2, 3);
        return `user-${mat}${str}`;
    } else {
        return userId;
    }
};
exports.validUser = validUser;