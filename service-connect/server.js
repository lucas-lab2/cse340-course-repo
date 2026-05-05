import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

app.get("/organizations", async (req, res) => {
  const organizations = [
    {
      name: "Helping Hands Community Center",
      description:
        "A local organization focused on connecting volunteers with meaningful service opportunities.",
      image: "/images/organization.svg",
    },
    {
      name: "Green Future Initiative",
      description:
        "An organization that supports environmental projects such as cleanup events and recycling education.",
      image: "/images/organization.svg",
    },
  ];

  res.render("organizations", {
    title: "Organizations",
    organizations,
  });
});

app.get("/projects", async (req, res) => {
  const projects = [
    "Neighborhood cleanup project",
    "School supplies donation drive",
    "Community garden support",
    "Health and wellness awareness event",
  ];

  res.render("projects", {
    title: "Service Projects",
    projects,
  });
});

app.get("/categories", async (req, res) => {
  const categories = [
    "Environmental",
    "Educational",
    "Community Service",
    "Health and Wellness",
  ];

  res.render("categories", {
    title: "Service Project Categories",
    categories,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
