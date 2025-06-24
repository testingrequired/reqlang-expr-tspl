type ArgsMap = {
  vars: Record<string, string>;
  prompts: Record<string, string>;
  secrets: Record<string, string>;
  clients: Record<string, string>;
};

function parseArgs(args: string): ArgsMap {
  const argMap: ArgsMap = {
    vars: {},
    prompts: {},
    secrets: {},
    clients: {},
  };

  const parts = args.split(/\s+/);
  let i = 0;

  while (i < parts.length) {
    const currentPart = parts[i];

    if (i + 1 < parts.length && parts[i + 1].includes("=")) {
      const [key, value] = parts[i + 1].split("=");

      switch (currentPart) {
        case "--var":
          argMap.vars[key] = value;
          break;
        case "--prompt":
          argMap.prompts[key] = value;
          break;
        case "--secret":
          argMap.secrets[key] = value;
          break;
        case "--client":
          argMap.clients[key] = value;
          break;
        default:
          break;
      }
      i++; // Skip the next part since it's processed here
    }
    i++;
  }

  return argMap;
}

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
  let args_string = (process as any).argv.splice(2).join(" ");
  const args = parseArgs(args_string);

  return {
    vars: args.vars,
    prompts: args.prompts,
    secrets: args.secrets,
    client: args.clients,
  };
};

export type Args = {
  vars: Record<string, string>;
  prompts: Record<string, string>;
  secrets: Record<string, string>;
  client: Record<string, string>;
};

declare const process: any;
