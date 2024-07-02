const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Uncaught Error
process.on("uncaughtException",()=>{
  console.log(`Error: ${err.message}`);
  console.log(`Shuting down the server due to uncaught exception`);
  process.exit(1);
});

//config
dotenv.config({ path: "backend/config/config.env" });

//Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});

//Unhandled Rejection Error
process.on("unhandledRejection", err => {
  console.log(`Error: ${err.message}`);
  console.log(`Shuting down the server due to unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});