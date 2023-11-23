const express = require("express");
const logger = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const compression = require("compression");
const config = require("./config");
const router = require("./routes/routes");
const { gatewayLogger } = require("./utils");
const errorMiddleware = require("./middleware/error");

// Swagger configuration
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const port = config.PORT;
const app = express();
const startServer = async () => {
  try {
    console.log("NODE_ENV: ", process.env.NODE_ENV);

    // Connect Database
    await connectDB();

    // Middleware
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(
      cors({
        credentials: true,
        origin: ["http://localhost:8888"],
      })
    );
    // app.use(cors());
    app.use(cookieParser());
    app.use(helmet());
    app.use(
      session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
      })
    );
    app.use(logger("dev"));
    app.use(compression());

    // Winston gateway logger
    app.use(function (request, response, next) {
      gatewayLogger(request, response);
      next();
    });

    // Swagger API Documentation
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // API Route handlers Version 1.0
    app.use("/api/v1", router);
    app.use(errorMiddleware);

    app.listen(port, () =>
      console.log(`🚀 Server ready at http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};
startServer();
