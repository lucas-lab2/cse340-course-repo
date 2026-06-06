import { getAllUsers } from "../models/users.js";

export const showUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.render("users", {
      title: "Registered Users",
      users,
    });
  } catch (error) {
    next(error);
  }
};
