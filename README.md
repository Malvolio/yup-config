# Yup-Config

This repo is just a collection of files demonstrating how to use Yup to validate
environment variables to perform system configuration.  Only the following files are
interesting

* `src/badcode.ts` — hand-crafted validation
* `src/goodcode.ts` — the same program, with Yup validation
* `src/inject.ts` — Yup validation and dependency injection


The `package.json` has scripts to run each file with a "good" configuration, a "bad" configuration (a variable that should be number is not), and a "missing" configuration (a required variable is omitted).