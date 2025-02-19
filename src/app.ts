import "reflect-metadata";
import app from "./config/server";
import { config } from "./config/env";

app.listen(config.server.port, () => {
  console.log(
    `Server is running in ${config.server.nodeEnv} mode on port ${config.server.port}`,
  );
  if (config.swagger.enabled) {
    console.log(`Swagger documentation available at ${config.swagger.path}`);
  }
});
