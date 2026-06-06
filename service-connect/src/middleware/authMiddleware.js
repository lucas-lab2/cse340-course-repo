export const requireLogin = (req, res, next) => {
  if (req.session?.user) {
    next();
    return;
  }

  req.flash("error", "Please log in to access that page.");
  res.redirect("/login");
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.session?.user) {
    req.flash("error", "Please log in to access that page.");
    res.redirect("/login");
    return;
  }

  if (req.session.user.role === role) {
    next();
    return;
  }

  req.flash("error", "You do not have permission to access that page.");
  res.redirect("/dashboard");
};
