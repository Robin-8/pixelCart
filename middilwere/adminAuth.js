const isLogin = (req, res, next) => {
    try {
      if (!req.session.admin) {
        res.redirect("/admin");
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  };
  

const isLogout = async (req, res, next) => {
    try {
        if (!req.session.user_id) {
            // If the user is not logged in, proceed to the next middleware or route handler
            next();
        } else {
            // If the user is logged in, redirect to the appropriate page (not the login page)
            res.redirect('/admin/home'); // Redirect to the dashboard or another page
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};

