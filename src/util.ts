import { ValidationError } from "yup";

export function runYupConfiguration<T>(f: () => T): T {
  try {
    return f();
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new Error(`Error in configuration: ${e}`);
    }
    throw e;
  }
}
