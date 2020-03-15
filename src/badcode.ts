import { env } from "process";

function someConfiguredService(HOST: string, PORT: number) {
  return `https:${HOST}:${PORT}`;
}

function runSomeConfiguredService() {
  const host = env.HOST;
  if (!host) {
    console.error(`environment variable HOST required`);
    return;
  }
  const port = env.PORT;
  if (!port) {
    console.error(`environment variable PORT required`);
    return;
  }
  const portN = Number.parseInt(port);
  if (Number.isNaN(portN)) {
    console.error(`environment variable PORT must be a number`);
    return;
  }
  console.log(someConfiguredService(host, portN));
}

runSomeConfiguredService();
