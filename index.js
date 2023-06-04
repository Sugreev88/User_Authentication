const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./utils/dbUtils");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./utils/swagger.json");
const authRoute = require("./routes/authRoute");
app.use(express.json());
app.use("/user", authRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

const error = async function (err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
};

app.use(error);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
db.connectDb();
process.on("SIGINT", () => {
  console.log("Closing server");
  dbUtils.disconnectDB();
  process.exit();
});

process.on("exit", () => {
  console.log("Server closed");
});

app.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});
