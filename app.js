require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authJob = require("./middleware/authentication");
const connectDB = require("./db/connect");
const authRoute = require("./routes/auth");
const jobRoute = require("./routes/jobs");


app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.set("trust proxy",1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}));


app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/jobs",authJob,jobRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
