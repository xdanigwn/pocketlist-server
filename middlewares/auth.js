const isLogin = (req, res, next) => {
    if (req.session.userSession == null || req.session.userSession == undefined) {
        req.flash("alertMessage", "Session telah habis, silahkan login kembali!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
    } else {
        next();
    }
}

module.exports = isLogin;