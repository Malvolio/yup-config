import { env } from "process";
import * as yup from "yup";
import { runYupConfiguration } from "./util";

const SomeConfigSchema = yup.object({
  HOST: yup.string().required(),
  PORT: yup.number().required(),
});

function someConfiguredService({
  HOST,
  PORT,
}: yup.InferType<typeof SomeConfigSchema>) {
  return `https:${HOST}:${PORT}`;
}

function runSomeConfiguredService() {
  runYupConfiguration(() =>
    console.log(someConfiguredService(SomeConfigSchema.validateSync(env)))
  );
}

runSomeConfiguredService();
