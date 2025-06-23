import arg from "arg";
import type { Spec } from "arg";

export type ExprValue = string | boolean | ((value: ExprValue) => ExprValue);

export type Expression = (context: RuntimeContext) => ExprValue;

export type RuntimeContext = {
  env: Env;
  builtins: typeof builtinFns;
};

export const run = (expression: Expression): ExprValue => {
  const env = Env.new();

  const context = { env, builtins: builtinFns };

  const value = expression(context);

  return value;
};

export const builtinFns = {
  id(value: ExprValue): ExprValue {
    return value;
  },
  concat(...value: string[]): string {
    return value.join("");
  },
};

export class Env {
  constructor(
    private vars: Record<string, string>,
    private prompts: Record<string, string>,
    private secrets: Record<string, string>,
    private client: Record<string, ExprValue>
  ) {}

  static new(): Env {
    return new Env({}, {}, {}, {});
  }

  public getVar(key: string): string {
    return this.vars[key];
  }

  public setVar(key: string, value: string): void {
    this.vars[key] = value;
  }

  public getPrompt(key: string): string {
    return this.prompts[key];
  }

  public setPrompt(key: string, value: string): void {
    this.prompts[key] = value;
  }

  public getSecret(key: string): string {
    return this.secrets[key];
  }

  public setSecret(key: string, value: string): void {
    this.secrets[key] = value;
  }

  public getClient(key: string): ExprValue {
    return this.client[key];
  }

  public setClient(key: string, value: ExprValue): void {
    this.client[key] = value;
  }
}

export const getArgs: () => Args = () => {
  const cliArgs = arg({
    "--var": [String],
    "--prompt": [String],
    "--secret": [String],
    "--client": [String],
  });

  const vars =
    cliArgs["--var"]?.reduce((acc, val) => {
      const [key, value] = val.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) ?? {};

  const prompts =
    cliArgs["--prompt"]?.reduce((acc, val) => {
      const [key, value] = val.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) ?? {};

  const secrets =
    cliArgs["--secret"]?.reduce((acc, val) => {
      const [key, value] = val.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) ?? {};

  const client =
    cliArgs["--client"]?.reduce((acc, val) => {
      const [key, value] = val.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) ?? {};

  return {
    vars,
    prompts,
    secrets,
    client,
  };
};

export type Args = {
  vars: Record<string, string>;
  prompts: Record<string, string>;
  secrets: Record<string, string>;
  client: Record<string, string>;
};
