import { assertVF } from "./Extra";
import {
  ValidatorObject,
  ValidatorObjectCleaned,
  constructor,
  createValidatorFunctionOption,
} from "./Types";
import { ValidatorError } from "./ValidatorError";

export function createValienteClass<T extends ValidatorObject>(
  validators: T,
  DefaultNilValue?: any
): constructor<ValidatorObjectCleaned<T>, [ValidatorObjectCleaned<T>]> {
  return class {
    constructor(data: ValidatorObjectCleaned<T>) {
      const keys = Object.keys(validators);
      keys.forEach((key) => {
        const validator = validators[key];
        Object.defineProperty(this, `__${key}__`, {
          value: DefaultNilValue,
          writable: true,
          enumerable: false,
        });
        Object.defineProperty(this, key, {
          get() {
            return this[`__${key}__`];
          },
          set(val: any) {
            assertVF(validator, val, key);
            this[`__${key}__`] = val;
          },
          enumerable: true,
        });
      });
      keys.forEach((key) => {
        this[key as keyof this] =
          this[key as keyof this] ?? data[key as keyof typeof data] ?? DefaultNilValue;
      });
    }
  } as any;
}
export function createValienteFunction<T extends ValidatorObject>(
  validators: T,
  options: createValidatorFunctionOption = {
    DefaultNilValue: undefined,
    strict: false,
    throwErrors: false,
  }
) {
  return (val: any): val is ValidatorObjectCleaned<T> => {
    const valKeys = Object.keys(val);
    const validatorsKeys = Object.keys(validators);
    // Validar si las keys son identicas en el objeto a validar y en el objeto de validadores
    if (options.strict) {
      valKeys.sort().toString() === validatorsKeys.sort().toString();
    }

    for (let key of validatorsKeys) {
      const validator = validators[key];
      const value = val[key] ?? options.DefaultNilValue;
      if (!validator(value)) {
        if (options.throwErrors) {
          throw new ValidatorError(
            `Tipo de dato invalido se requeria ${validator.name} y se encontro ${typeof value} en`,
            key.toString()
          );
        }
        return false;
      }
    }

    return true;
  };
}

export function createValienteObject<T extends ValidatorObject>(
  validators: T,
  options: createValidatorFunctionOption = {
    DefaultNilValue: null,
    strict: true,
    throwErrors: true,
  }
) {}
