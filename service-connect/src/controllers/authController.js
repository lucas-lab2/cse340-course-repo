import { createUser, getUserByEmail } from "../models/users.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const getRegisterFormData = (body) => ({
  name: body.name?.trim() || "",
  email: body.email?.trim().toLowerCase() || "",
  password: body.password || "",
  confirmPassword: body.confirmPassword || "",
});

const getLoginFormData = (body) => ({
  email: body.email?.trim().toLowerCase() || "",
  password: body.password || "",
});

const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = [];

  if (!name) {
    errors.push("Name is required.");
  }

  if (name && name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (!email) {
    errors.push("Email is required.");
  }

  if (email && !email.includes("@")) {
    errors.push("Email must be a valid email address.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  if (password !== confirmPassword) {
    errors.push("Password and confirmation password must match.");
  }

  return errors;
};

const validateLoginForm = ({ email, password }) => {
  const errors = [];

  if (!email) {
    errors.push("Email is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return errors;
};

const setAuthenticatedUser = (req, user) => {
  req.session.user = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const showRegisterForm = (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }

  res.render("register", {
    title: "Register",
    formData: { name: "", email: "" },
    errors: [],
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const formData = getRegisterFormData(req.body);
    const errors = validateRegisterForm(formData);

    if (errors.length > 0) {
      res.status(400).render("register", {
        title: "Register",
        formData: { name: formData.name, email: formData.email },
        errors,
      });
      return;
    }

    const passwordHash = hashPassword(formData.password);
    const user = await createUser({
      name: formData.name,
      email: formData.email,
      passwordHash,
      role: "user",
    });

    setAuthenticatedUser(req, user);
    req.flash("success", "Your account was created successfully.");
    res.redirect("/dashboard");
  } catch (error) {
    if (error.code === "23505") {
      const formData = getRegisterFormData(req.body);
      res.status(400).render("register", {
        title: "Register",
        formData: { name: formData.name, email: formData.email },
        errors: ["An account with that email already exists."],
      });
      return;
    }

    next(error);
  }
};

export const showLoginForm = (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login", {
    title: "Log In",
    formData: { email: "" },
    errors: [],
  });
};

export const loginUser = async (req, res, next) => {
  try {
    const formData = getLoginFormData(req.body);
    const errors = validateLoginForm(formData);

    if (errors.length > 0) {
      res.status(400).render("login", {
        title: "Log In",
        formData: { email: formData.email },
        errors,
      });
      return;
    }

    const user = await getUserByEmail(formData.email);
    const passwordIsValid = user
      ? verifyPassword(formData.password, user.passwordHash)
      : false;

    if (!user || !passwordIsValid) {
      res.status(401).render("login", {
        title: "Log In",
        formData: { email: formData.email },
        errors: ["Invalid email or password."],
      });
      return;
    }

    setAuthenticatedUser(req, user);
    req.flash("success", `Welcome back, ${user.name}.`);
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

export const showDashboard = (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
  });
};
