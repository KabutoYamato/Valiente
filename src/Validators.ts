import {
  Nil,
  Validator,
  ValidatorType,
  ValidatorTypeObject,
  ValidatorTypeTuple,
  Optional,
  ValienteCreatorOptions,
  ValidatorObject,
} from "./Types";

export function isAny(_val: any) {
  return true;
}
export function isUndefined(val: any): val is undefined {
  return val === undefined;
}
export function isNull(val: any): val is null {
  return val === null;
}
export function isNil(val: any): val is Nil {
  return val === null || val === undefined;
}
export function isString(val: any): val is string {
  return typeof val === "string";
}
export function isText<T extends string[]>(...words: T) {
  return (val: any): val is T[number] => {
    return words.includes(val);
  };
}
export function isNumber(val: any): val is number {
  return typeof val === "number";
}
export function isBigInt(val: any): val is bigint {
  return typeof val === "bigint";
}
export function isBoolean(val: any): val is boolean {
  return typeof val === "boolean";
}
export function isFunction(val: any): val is () => any {
  return typeof val === "function";
}
export function isArray<T>(validator: Validator<T>) {
  return (val: any): val is T[] => {
    return Array.isArray(val) && val.every((data) => validator(data));
  };
}
export function isMap<T>(validator: Validator<T>) {
  return (val: any): val is { [key: string]: T } => {
    return typeof val === "object" && Object.values(val).every((data) => validator(data));
  };
}
export function isObject<T extends ValidatorObject>(
  validators?: T,
  options: Required<Pick<ValienteCreatorOptions, "ExtraProps" | "DefaultNilValue">> = {
    ExtraProps: false,
    DefaultNilValue: null,
  }
) {
  if (!validators) {
    return (obj: any): obj is object => {
      return typeof obj === "object";
    };
  }
  return (obj: any): obj is ValidatorTypeObject<T> => {
    if (obj) {
      const validatorsKeys = Object.keys(validators).sort();
      const objKeys = Object.keys(obj).sort();
      let ptr1 = 0,
        ptr2 = 0;
      while (ptr1 < validatorsKeys.length && ptr2 < objKeys.length) {
        const validatorKey = validatorsKeys[ptr1];
        const objKey = objKeys[ptr2];
        if (validatorKey === objKey) {
          const validator = validators[validatorKey];
          const val = obj[objKey];
          if (!validator(val)) {
            return false;
          }
          ptr1++;
          ptr2++;
        } else if (validatorKey < objKey) {
          const validator = validators[validatorKey];
          validator(options.DefaultNilValue);
          ptr1++;
        } else {
          if (!options.ExtraProps) return false;
          ptr2++;
        }
      }
      if (ptr1 === validatorsKeys.length && (ptr2 === objKeys.length || options.ExtraProps)) {
        return true;
      } else {
        for (let i = ptr1; i < validatorsKeys.length; i++) {
          const validator = validators[i];
          if (!validator(options.DefaultNilValue)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  };
}
export function isTuple<T extends Validator<any>[]>(...validators: T) {
  return (val: any): val is ValidatorTypeTuple<T> => {
    return (
      Array.isArray(val) &&
      validators.length === val.length &&
      val.every((data, idx) => validators[idx](data))
    );
  };
}
export function isNotNull<T>(validator: Validator<T>) {
  return (val: any): val is NonNullable<T> => {
    return val !== null && val !== undefined && validator(val);
  };
}
export function union<T extends Validator<any>[]>(...validators: T) {
  return (val: any): val is ValidatorType<T[number]> => {
    return validators.some((validator) => validator(val));
  };
}
export function optional<T extends Validator<any>>(validator: T) {
  return (val: any): val is Optional<ValidatorType<T>> => {
    return val === null || val === undefined || validator(val);
  };
}
