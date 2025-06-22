# reqlang-expr-tspl

A toy transpiler to convert [reqlang-expr](https://github.com/testingrequired/reqlang-expr) expressions to Typescript.

## Example

```
(id `foo`)
```

transpiles to

```typescript
/// <reference path="../reqlang-expr.d.ts" />
export const expression: Expression = (env: Env) => () => {
  return id("foo");
};
```

See: [reqlang-expr.d.ts](./reqlang-expr.d.ts)

## Tests

The [spec](./spec/) directory has several input `*.expr` with corrosponding `.ts` expected output.

- `cargo test` Transpiles the `*.expr` files and checks the `*.ts` files for equality.
- `npm run test` Typechecks the `*.ts` files
