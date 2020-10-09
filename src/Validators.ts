import { Nil, ValidatorFunction, ValidatorFunctionsTypesArray, ValidatorFunctionType, Optional } from "./types"

export function isAny(_val: any) { return true }
export function isUndefined(val: any): val is undefined { return val === undefined }
export function isNull(val: any): val is null { return val === null }
export function isNil(val: any): val is Nil { return val === null || val === undefined }
export function isString(val: any): val is string { return typeof val === "string" }
export function isText<T extends string[]>(...words: T) { return (val: any): val is T[number] => { return words.includes(val) } }
export function isNumber(val: any): val is number { return typeof val === "number" }
export function isBigInt(val: any): val is bigint { return typeof val === "bigint" }
export function isBoolean(val: any): val is boolean { return typeof val === "boolean" }
export function isObject(val: any): val is object { return typeof val === "object" }
export function isFunction(val: any): val is () => any { return typeof val === "function" }
export function isArray<T>(validator: ValidatorFunction<T>) { return (val: any): val is T[] => { return Array.isArray(val) && val.every(data => validator(data)) } }
export function isTuple<T extends ValidatorFunction<any>[]>(...validators: T) { return (val: any): val is ValidatorFunctionsTypesArray<T> => { return Array.isArray(val) && validators.length === val.length && val.every((data, idx) => validators[idx](data)) } }
export function isNotNull<T>(validator: ValidatorFunction<T>) { return (val: any): val is NonNullable<T> => { return val !== null && val !== undefined && validator(val) } }
export function or<T extends ValidatorFunction<any>[]>(...validators: T) { return (val: any): val is ValidatorFunctionType<T[number]> => { return validators.some(validator => validator(val)) } }
export function optional<T extends ValidatorFunction<any>>(validator: T) { return (val: any): val is Optional<ValidatorFunctionType<T>> => { return val === null || val === undefined || validator(val) } }
