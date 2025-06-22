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
