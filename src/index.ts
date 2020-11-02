import { ValienteSymbol } from "./Symbols";
import { assertVF, generateKeysUnion } from "./Extra";
import {
  ValienteDefinition,
  ValienteObject,
  ValienteCreatorOptions,
  ValienteData,
  ValidatorsFromDefinition,
  IndexedObject,
  ValienteClass,
} from "./Types";
import { ValienteError } from "./ValidatorError";

export function createValienteClass<T extends ValienteDefinition>(
  validators: T,
  options: ValienteCreatorOptions = {
    ExtraProps: false,
    DefaultNilValue: null,
    DefaultInitialData: false,
  }
) {
  const ValienteClass = class {
    static get Validators() {
      return validators;
    }
    static get Options() {
      return options;
    }
    static [ValienteSymbol.TYPE] = "ValienteClass";
    /*
    constructor(data?: ValidObject<T>) {
      const keys = Object.keys(ValienteClass.Validators);
      keys.forEach((key) => {
        const validator = validators[key];
        Object.defineProperties(this, {
          [`__${key}__`]: {
            value: options.DefaultNilValue,
            writable: true,
            enumerable: false,
          },
          [key]: {
            get() {
              return this[`__${key}__`];
            },
            set(val: any) {
              assertVF(validator, val, key);
              this[`__${key}__`] = val;
            },
            enumerable: true,
          },
        });
      });
      if (data) {
        keys.forEach((key) => {
          this[key as keyof this] =
            this[key as keyof this] ?? data[key as keyof typeof data] ?? options?.DefaultNilValue;
        });
      }
    }
    */
    static createValienteObject(data?: any): ValienteObject<T> {
      const valienteObj = {} as ValienteObject<T>;
      Object.defineProperties(valienteObj, {
        [ValienteSymbol.TYPE]: {
          value: "ValienteObject",
          enumerable: false,
        },
        [ValienteSymbol.VALIDATORS]: {
          value: {},
          writable: true,
          enumerable: false,
        },
        [ValienteSymbol.OPTIONS]: {
          value: ValienteClass.Options,
          writable: true,
          enumerable: false,
        },
        [ValienteSymbol.DATA]: {
          value: {},
          writable: true,
          enumerable: false,
        },
      });
      const KeysUnion = generateKeysUnion(ValienteClass.Options, ValienteClass.Validators, data);

      const keys = Object.keys(KeysUnion);
      for (const key of keys) {
        const keyUnion = KeysUnion[key];
        if (keyUnion.type === "validator") {
          valienteObj[ValienteSymbol.VALIDATORS][
            key as keyof ValidatorsFromDefinition<T>
          ] = keyUnion.validator as any;
          valienteObj[ValienteSymbol.DATA][key as keyof ValienteData<T>] = keyUnion.default;
          Object.defineProperty(valienteObj, key, {
            get: function () {
              return this[ValienteSymbol.DATA][key];
            },
            set: function (val: any) {
              const validator = this[ValienteSymbol.VALIDATORS][
                key as keyof ValidatorsFromDefinition<T>
              ];
              if (validator) {
                assertVF(validator, val, key);
              }
              this[ValienteSymbol.DATA][key as keyof ValienteData<T>] = val;
            },
            enumerable: true,
          });
        } else if (keyUnion.type === "valiente") {
          valienteObj[ValienteSymbol.DATA][key as keyof ValienteData<T>] = keyUnion.object;
          Object.defineProperty(valienteObj, key, {
            get: function () {
              return this[ValienteSymbol.DATA][key];
            },
            set: function (val: IndexedObject<any>) {
              const valKeys = Object.keys(val);
              for (const valKey of valKeys) {
                this[ValienteSymbol.DATA][key][valKey] = val[valKey];
              }
            },
            enumerable: true,
          });
        } else {
          if (!options.ExtraProps) {
            Object.defineProperty(valienteObj, key, {
              get: function () {
                return this[ValienteSymbol.DATA][key];
              },
              set: function (val: any) {
                this[ValienteSymbol.DATA][key] = val;
              },
              enumerable: true,
            });
          }
        }
        if (keyUnion.value !== null && keyUnion.value !== undefined) {
          valienteObj[key as keyof typeof valienteObj] = keyUnion.value;
        }
      }
      return valienteObj;
    }
  } as ValienteClass<T>;
  if (!options.ExtraProps) {
    Object.seal(ValienteClass);
  }
  return ValienteClass;
}
