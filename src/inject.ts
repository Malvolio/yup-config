import { env } from "process";
import * as yup from "yup";
import { tokens, rootInjector, Injector, TChildContext } from "typed-inject";

const SomeConfigSchema = yup.object({
  HOST: yup.string().required(),
  PORT: yup.number().required(),
});

class SomeConfiguredService {
  constructor(private readonly conf: yup.InferType<typeof SomeConfigSchema>) {}
  static inject = tokens("SomeConfig");
  exec(): string {
    return `https:${this.conf.HOST}:${this.conf.PORT}`;
  }
}

/* 
 I derived this type by setting it to "number" first and examining the error message in detail.  It was: 
   Argument of type 'Injector<TChildContext<TChildContext<{}, { HOST: string; PORT: number; }, "SomeConfig">, 
                                            SomeConfiguredService, "SomeConfiguredService">>' 
    is not assignable to parameter of type 'number'.ts(2345)
 The part about the SomeConfig was irrelevent, so I omitted it, with the results you see.  The type means
 "This is an injector can resolve the token 'SomeConfiguredService' to an object with the same interface as
 the class SomeConfiguredService."
*/
type SomeConfiguredServiceInjector = Injector<
  TChildContext<{}, SomeConfiguredService, "SomeConfiguredService">
>;

function extractValidationError(e: any): yup.ValidationError | undefined {
  // a peculiarity of typed-inject: it buries a validation error two levels down
  return e.innerError?.innerError instanceof yup.ValidationError
    ? e.innerError.innerError
    : undefined;
}

/*
  This is the actual program: using the given injector, try to construct the service;
  if you succeed, run it.
*/
function runSomeConfiguredService(
  injectorName: string,
  injector: SomeConfiguredServiceInjector
) {
  try {
    const service = injector.resolve("SomeConfiguredService");
    console.log(`using ${injectorName} succeeded: ${service.exec()}`);
  } catch (e) {
    const validationError = extractValidationError(e);
    if (validationError) {
      console.log(`using ${injectorName} failed: ${validationError}`);
    } else {
      // Something else went wrong.  Implausible.
      throw e;
    }
  }
}

/*
  This is what I am actually demonstrating.  This line applies the Yup schema against the
  environment variables.
  */
function typedConfigFactory<T>(schema: yup.Schema<T>): () => T {
  return () => schema.validateSync(env);
}

/*
 I make two injectors, one with a hard-coded configuration for some development or testing I might 
 be doing, and another using the environment variables for staging, production, demo, &c.
 */
const testInjector = rootInjector
  .provideFactory("SomeConfig", () => ({
    HOST: "hardcoded.service.com",
    PORT: 0,
  }))
  .provideClass("SomeConfiguredService", SomeConfiguredService);

const productionInjector = rootInjector
  .provideFactory("SomeConfig", typedConfigFactory(SomeConfigSchema))
  .provideClass("SomeConfiguredService", SomeConfiguredService);

/*
  Run it with each injector.  The testInjector should always work, of course; the productionInjector 
  is dependent on the environment variables.
*/
runSomeConfiguredService("testInjector", testInjector);
runSomeConfiguredService("productionInjector", productionInjector);
