import { ValienteSymbol } from "./Symbols";
import {
  IndexedObject,
  Validator,
  ValienteClass,
  ValienteCreatorOptions,
  ValienteDefinition,
  ValienteObject,
} from "./Types";
import { ValienteError } from "./ValidatorError";

type Union<T, K> = T & K;
type KeyUnionObj<T extends IndexedObject<any>, K extends IndexedObject<any>> = {
  [Key in keyof Union<T, K>]: KeyUnion<Union<T, K>[Key]>;
};
type KeyUnion<T> =
  | {
      type: "validator";
      validator: Validator<T>;
      value?: T;
      default: any;
    }
  | {
      type: "valiente";
      object: T extends ValienteObject<any> ? T : never;
      value?: T;
      default: any;
    }
  | {
      type: "data";
      default: any;
      value: T;
    };

export function strictCheck(validators: ValienteDefinition, data: IndexedObject<any>) {
  return Object.keys(data).sort().toString() === Object.keys(validators).sort().toString();
}

export function assertVF<T>(
  validator: Validator<T>,
  val: any,
  name = "Not setted"
): asserts val is T {
  let res = false;
  try {
    res = validator(val);
  } catch (err) {
    if (err instanceof ValienteError) {
      err.addPropToTheStart(name);
      throw err;
    } else {
      throw err;
    }
  }
  if (res === false) {
    const error = new ValienteError(`Error de validacion en`, name);
    throw error;
  }
}

export function isValienteObject(val: any): val is ValienteObject<any> {
  return val?.[ValienteSymbol.TYPE] === "ValienteObject";
}

export function isValienteClass(val: any): val is ValienteClass<any> {
  return val?.[ValienteSymbol.TYPE] === "ValienteClass";
}

export function generateKeysUnion<T extends ValienteDefinition, K>(
  options: ValienteCreatorOptions,
  validators: T,
  data?: K
) {
  const retKeysUnion = {} as KeyUnionObj<T, K>;
  for (const key of Object.keys(validators)) {
    const validator = validators[key];
    if (isValienteClass(validator)) {
      retKeysUnion[key as keyof typeof retKeysUnion] = {
        type: "valiente",
        object: validator.createValienteObject() as any,
        default: options.DefaultNilValue,
      };
    } else {
      retKeysUnion[key as keyof typeof retKeysUnion] = {
        type: "validator",
        validator: validators[key] as any,
        default: options.DefaultNilValue,
      };
    }
  }

  if (data) {
    for (const key of Object.keys(data)) {
      if (retKeysUnion[key]) {
        retKeysUnion[key].value = data[key as keyof typeof data] as any;
      } else {
        retKeysUnion[key as keyof typeof retKeysUnion] = {
          type: "data",
          default: options.DefaultNilValue,
          value: data[key as keyof typeof data] as any,
        };
      }
    }
  }
  return retKeysUnion;
}
