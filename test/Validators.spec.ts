import * as V from "../src/Validators";
import { expect } from "chai";
import "mocha";
import { Validator } from "../src/Types";

const tests = [null, undefined, "Con texto", "", 0, 3423432, true, false, new Date(), {}, []];

function testValidator<T>(validator: Validator<T>, idsTrue: number[]) {
  for (let i = 0; i < tests.length; i++) {
    if (idsTrue.includes(i)) {
      expect(validator(tests[i])).to.equal(true);
    } else {
      expect(validator(tests[i])).to.equal(false);
    }
  }
}

describe("function isAny(obj:any)", function () {
  it("Debe retornar true siempre", async function () {
    tests.forEach((val) => {
      expect(V.isAny(val)).to.equal(true);
    });
  });
});

describe("function isNull(obj:any)", function () {
  it("Debe retornar true si el valor es null y false de otra forma", async function () {
    testValidator(V.isNull, [0]);
  });
});

describe("function isUndefined(obj:any)", function () {
  it("Debe retornar true si el valor es undefined y false de otra forma", async function () {
    testValidator(V.isUndefined, [1]);
  });
});

describe("function isNil(obj:any)", function () {
  it("Debe retornar true si es number y false de otra forma", async function () {
    testValidator(V.isNil, [0, 1]);
  });
});

describe("function isString(obj:any)", function () {
  it("Debe retornar true si es string y false de otra forma", async function () {
    testValidator(V.isString, [2, 3]);
  });
});

describe("function isNumber(obj:any)", function () {
  it("Debe retornar true si es number y false de otra forma", async function () {
    testValidator(V.isNumber, [4, 5]);
  });
});

describe("function isBoolean(obj:any)", function () {
  it("Debe retornar true si es boolean y false de otra forma", async function () {
    testValidator(V.isBoolean, [6, 7]);
  });
});

describe("function isNumber(obj:any)", function () {
  it("Debe retornar true si es number y false de otra forma", async function () {
    testValidator(V.isNumber, [4, 5]);
  });
});
