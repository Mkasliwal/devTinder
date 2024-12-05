const admin = (req, res, next) => {
    const reqToken = "adminTkn";

    if(reqToken == "adminTkn") {
        next();
    } else {
        res.status(401).send("🔴 Unauthorized User");
    }
}

const user = (req, res, next) => {
    const reqToken = "userTkn";

    if(reqToken == "userTkn") {
        next();
    } else {
        res.status(401).send("🔴 Unauthorized User");
    }
}

module.exports = { admin, user };