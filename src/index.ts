export type ExprValue = string | boolean;

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
