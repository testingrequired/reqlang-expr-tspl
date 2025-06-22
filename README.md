# reqlang-expr-tspl

A toy transpiler to convert [reqlang-expr](https://github.com/testingrequired/reqlang-expr) expressions to Typescript.

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
npx tsx spec/bool_true.expr.ts

# true
```

## Tests

The [spec](./spec/) directory has several input `*.expr` with corrosponding `.ts` expected output.

- `cargo test` Transpiles the `*.expr` files and checks the `*.ts` files for equality.
- `npm run test` Typechecks the `*.ts` files
