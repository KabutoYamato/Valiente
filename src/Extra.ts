import { OpenObject, ValidatorFunction, ValidatorObject } from "./Types";

export function strictCheck(validators: ValidatorObject, data: OpenObject<any>) {
  return Object.keys(data).sort().toString() === Object.keys(validators).sort().toString();
}

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
