import { ValienteSymbol } from "./Symbols";

export type Json = string | number | boolean | undefined | null | Json[] | { [key: string]: Json };
export type Nil = null | undefined;
export type Optional<T> = null | undefined | void | T;
export interface IndexedObject<T> {
  [key: string]: T;
}
export interface Validator<T> {
  (obj: any): obj is T;
}
export interface ValidatorObject extends IndexedObject<Validator<any>> {}
export interface ValienteDefinition extends IndexedObject<Validator<any> | ValienteClass<any>> {}
export type ValidatorType<T> = T extends Validator<infer R> ? R : never;
export type ValidatorTypeTuple<U extends Validator<any>[] = []> = {
  [K in keyof U]: ValidatorType<U[K]>;
};
export type ValidatorTypeExclude<T extends ValidatorObject> = {
  [K in keyof T]: Exclude<Optional<ValidatorType<T[K]>>, ValidatorType<T[K]>>;
};
export type ValidatorTypeObject<T extends ValidatorObject> = {
  [K in keyof T]: T[K] extends Validator<infer R>
    ? Exclude<Optional<R>, R> extends never
      ? Exclude<R, void> | undefined
      : R
    : never;
};
/** Obtener los keys de los validadores */
type PickValidatorsKey<T extends ValienteDefinition> = {
  [K in keyof T]: T[K] extends Validator<infer H> ? (H extends never ? never : K) : never;
}[keyof T];
export type ValidatorsFromDefinition<T extends ValienteDefinition> = {
  [K in PickValidatorsKey<T>]: T[K];
} &
  ValidatorObject;

export type ValienteObject<T extends ValienteDefinition> = {
  [K in keyof T]: T[K] extends Validator<infer R>
    ? Exclude<Optional<R>, R> extends never
      ? Exclude<R, void> | undefined
      : R
    : T[K] extends ValienteClass<infer H>
    ? ValienteData<H>
    : never;
} & {
  [ValienteSymbol.TYPE]: "ValienteObject";
  [ValienteSymbol.OPTIONS]: ValienteCreatorOptions;
  [ValienteSymbol.VALIDATORS]: ValidatorsFromDefinition<T>;
  [ValienteSymbol.DATA]: ValienteData<T>;
};
export type ValienteData<T extends ValienteDefinition> = {
  [K in keyof T]: T[K] extends Validator<infer R>
    ? Exclude<Optional<R>, R> extends never
      ? Exclude<R, void> | undefined
      : R
    : T[K] extends ValienteClass<infer H>
    ? Omit<
        ValienteObject<H>,
        | typeof ValienteSymbol.TYPE
        | typeof ValienteSymbol.OPTIONS
        | typeof ValienteSymbol.DATA
        | typeof ValienteSymbol.VALIDATORS
      >
    : never;
};
export interface ValienteCreatorOptions {
  ExtraProps?: boolean;
  DefaultNilValue?: any;
  DefaultInitialData?: any;
}
export type constructor<T, K extends any[] = []> = new (...params: K) => T;
export interface ValienteCreatorOptions {
  ExtraProps?: boolean;
  DefaultNilValue?: any;
  DefaultInitialData?: any;
}
interface IValienteClass<T extends ValienteDefinition> {
  readonly Options: ValienteCreatorOptions;
  readonly Validators: T;
  readonly [ValienteSymbol.TYPE]: "ValienteClass";
  createValienteObject(val?: ValienteData<T>): ValienteObject<T>;
}
export type ValienteClass<T extends ValienteDefinition> = constructor<any, any[]> &
  IValienteClass<T>;
/** Monstruo para hacer cosas chidas -- Convertir en opcional las propiedas nill */
/** Privados */
/*
interface RequiredKeys<T>  {
  [K in keyof T]: Exclude<Optional<T[K]>, T[K]> extends never ? never : K;
}[keyof T];
type PickRequired<T extends ValienteDefinition> = Pick<T, RequiredKeys<T>>;
type PickOptional<T extends ValienteDefinition> = {
  [K in Exclude<keyof T, RequiredKeys<T>>]?: Exclude<T[K], void>;
};
type ToOptional<T extends ValienteDefinition> = PickRequired<T> & PickOptional<T>;

///// Object validatet with a Validator
export type ValidObject<T extends ValienteDefinition> = ToOptional<
  {
    [K in keyof T]: T[K] extends ValienteObject<infer R> ? IValidObject<R> : ValidatorType<T[K]>;
  }
>;
export interface IValidObject<T extends ValienteDefinition> extends ValidObject<T> {}

//////
export type ValienteValidator<T extends ValienteDefinition> = (obj: any) => obj is ValidObject<T>;

///// VALIENTE Class
export type ValienteClass<T extends ValienteDefinition> = constructor<
  ValidObject<T> & { [Symbol.toStringTag]: "ValienteClass" },
  [ValienteObject<T>]
> &
  ValienteClassStatic<T>; //Static Values and functions

interface ValienteClassStatic<T extends ValienteDefinition> {
  readonly Validators: T;
  readonly Options: ValienteCreatorOptions;
  createValienteObject(data?: any): ValienteObject<T>;
  createValienteFunction(data?: any): data is ValienteObject<T>;
}

///// VALIENTE Function
export type ValienteFunction<T extends ValienteDefinition> = (
  obj: any
) => obj is ValienteObject<T> | ValienteClass<T>;
*/
