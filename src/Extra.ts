import { ValidatorFunction } from "./Types";

export function assertVF<T>(
  validator: ValidatorFunction<T>,
  val: any,
  name = "Not setted"
): asserts val is T {
  const res = validator(val);
  if (res === false) {
    const error = new Error(`Error de validacion en ${name}`);
    throw error;
  }
}
