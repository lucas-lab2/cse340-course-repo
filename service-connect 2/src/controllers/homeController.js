export const showHome = async (req, res) => {
  res.render("index", {
    title: "Home",
  });
};
