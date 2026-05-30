import flash from "connect-flash";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { categoryRouter } from "./src/routes/categoryRoutes.js";
import { homeRouter } from "./src/routes/homeRoutes.js";
import { organizationRouter } from "./src/routes/organizationRoutes.js";
import { projectRouter } from "./src/routes/projectRoutes.js";
import { showNotFound, showServerError } from "./src/controllers/errorController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "service-connect-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  next();
});

app.use(homeRouter);
app.use(organizationRouter);
app.use(projectRouter);
app.use(categoryRouter);

app.use(showNotFound);
app.use(showServerError);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
