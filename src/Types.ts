export interface OpenObject<T> {
  [key: string]: T;
}
export type Json = null | undefined | string | number | boolean | { [key: string]: Json } | Json[];
export type Nil = null | undefined;
export type Optional<T> = null | undefined | void | T;
export interface ValidatorFunction<T> {
  (obj: any): obj is T;
}
export interface ValidatorObject extends OpenObject<ValidatorFunction<any>> {}
export type ValidatorFunctionType<T> = T extends ValidatorFunction<infer R> ? R : never;
export type ValidatorFunctionsTypesArray<U extends any[] = []> = {
  [K in keyof U]: ValidatorFunctionType<U[K]>;
};
export type ValidatorFunctionsTypesObject<T extends ValidatorObject> = {
  [K in keyof T]: T[K] extends T ? never : ValidatorFunctionType<T[K]>;
};
export type constructor<T, K extends any[] = []> = new (...params: K) => T;
export type createValidatorFunctionOption = {
  throwErrors?: boolean;
  strict?: boolean;
  DefaultNilValue?: any;
};
/** Monstruo para hacer cosas chidas -- Convertir en opcional las propiedas nill */
/** Privados */
type RequiredKeys<T> = {
  [K in keyof T]: Exclude<Optional<T[K]>, T[K]> extends never ? never : K;
}[keyof T];
type PickRequired<T extends ValidatorObject> = Pick<T, RequiredKeys<T>>;
type PickOptional<T extends ValidatorObject> = {
  [K in Exclude<keyof T, RequiredKeys<T>>]?: T[K] extends Optional<infer R> ? R | Nil : never;
};
type ToOptional<T extends ValidatorObject> = PickRequired<T> & PickOptional<T>;
/** */
export type ValidatorObjectCleaned<T extends ValidatorObject> = ToOptional<
  { [K in keyof T]: ValidatorFunctionType<T[K]> }
>;
