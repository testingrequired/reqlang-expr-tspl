# reqlang-expr-tspl

A toy transpiler to convert [reqlang-expr](https://github.com/testingrequired/reqlang-expr) expressions to Typescript.

This is not a serious project.

## Example

```
(id `foo`)
```

transpiles to

```typescript
import * as ReqlangExpr from "@reqlang-expr-tspl/runtime";

const args = ReqlangExpr.getArgs();

const expression: ReqlangExpr.Expression = (ctx) => {
  return ctx.builtins.id("foo");
};

const env = new ReqlangExpr.Env(
  args.vars,
  args.prompts,
  args.secrets,
  args.client
);

const context = {
  env,
  builtins: ReqlangExpr.builtinFns,
};

const value = expression(context);

console.log(JSON.stringify(value));
```

See: [@reqlang-expr-tspl/runtime](./src/index.ts)

## Running Transpiled Files

The transpiled typescript code can be ran using `npm tsx`

```bash
npx tsx spec/greeting_name.expr.ts \
  --var 'greeting=Hello' \
  --prompt 'name=World'

# "Hello World"
```

## Tests

The [spec](./spec/) directory has several input `*.expr` with corrosponding `*.expr.ts` expected generated code.

- `cargo test` Transpiles the `*.expr` files and checks the `*.expr.ts` files for equality.
- `npm run test` Runs the `*.expr.ts` files using `npx tsx` and compares results against `*.expr.ts.interpreted` files
- `npm run check` Typechecks the `*.expr.ts` files
