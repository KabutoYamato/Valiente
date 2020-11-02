import mocha from "mocha";
import { expect } from "chai";
import * as V from "../src/Validators";
import { createValienteClass } from "../src/index";

const TrabajoDefinition = {
  nombre: V.isString,
  sueldo: V.isNumber,
};
export const Trabajo = createValienteClass(TrabajoDefinition, {
  DefaultNilValue: null,
  ExtraProps: false,
});
const PersonaDefinition = {
  nombre: V.isString,
  edad: V.isNumber,
  sexo: V.isText("M", "F"),
  vivo: V.isBoolean,
  peso: V.optional(V.isNumber),
  trabajo: Trabajo,
};
export const Persona = createValienteClass(PersonaDefinition, {
  DefaultNilValue: null,
  ExtraProps: true,
});

export const Persona1 = Persona.createValienteObject({
  nombre: "Pedro Pablo Romero Martinez",
  peso: 81,
  sexo: "M",
  vivo: true,
  edad: 23,
  trabajo: {
    nombre: "Programador Web JR",
    sueldo: 12000,
  },
});
export const Persona2 = Persona.createValienteObject({
  nombre: "Juan Pablo Segundo",
  edad: 84,
  peso: undefined,
  sexo: "M",
  vivo: false,
  trabajo: {
    nombre: "Papa",
    sueldo: 100000,
  },
});

console.log(JSON.stringify(Persona1));
console.log(JSON.stringify(Persona2));
Persona2.peso = "10" as any;

//console.log(PersonaValiente);
//console.log(JSON.stringify(PersonaValiente));
