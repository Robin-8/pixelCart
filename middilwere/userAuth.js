const isLogin = async (req, res, next) => {
    try {
        if (req.session && req.session.user_id) {
            next(); // If the user is logged in, proceed to the next middleware or route handler
        } else {
            res.redirect('/login'); // If the user is not logged in, redirect them to the login page
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/'); // If the user is logged in, redirect them to the home page or appropriate page after logout
        } else {
            next(); // If the user is not logged in, proceed to the next middleware or route handler
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};
