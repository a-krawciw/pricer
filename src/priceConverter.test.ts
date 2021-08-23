import {convertValue} from "./priceConverter";
import {randomInt} from "crypto";

test("valid same units don't change", () => {
    let value = randomInt(0, 1000)
    let result = convertValue(value, "lb", "lb")
    expect(result).toEqual(value)
})

test("gram to kilogram", () => {
    let value = randomInt(0, 1000)
    let result = convertValue(value, "g", "kg")
    expect(result).toBeCloseTo(value/1000.0)
})

test("kilogram to gram", () => {
    let value = randomInt(0, 1000)
    let result = convertValue(value, "kg", "g")
    expect(result).toBeCloseTo(value*1000.0)
})

test("pound to kilogram", ()=>{
    let value = 1
    let result = convertValue(value, "lb", "kg")
    expect(result).toBeCloseTo(0.4536)
})