export const showNotFound = (req, res) => {
  res.status(404).render("not-found", {
    title: "Page Not Found",
    message: "The page you requested could not be found.",
  });
};

export const showServerError = (error, req, res, next) => {
  console.error(error);

  res.status(500).render("error", {
    title: "Server Error",
    message: "The site could not retrieve the requested information. Please check the database connection and try again.",
  });
};
