import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const renderDatabaseError = (res, error) => {
  console.error(error);

  res.status(500).render("error", {
    title: "Database Error",
    message: "The site could not retrieve information from the database. Check your DATABASE_URL and make sure src/setup.sql has been run.",
  });
};

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();

    res.render("organizations", {
      title: "Organizations",
      organizations,
    });
  } catch (error) {
    renderDatabaseError(res, error);
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.render("projects", {
      title: "Service Projects",
      projects,
    });
  } catch (error) {
    renderDatabaseError(res, error);
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Service Project Categories",
      categories,
    });
  } catch (error) {
    renderDatabaseError(res, error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
