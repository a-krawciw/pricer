type Unit = "lb" |  "kg" | "g"

/*
Convert unit to kg
 */
function scale_unit(unit: Unit) {
    if (unit === "lb")
        return 0.453592
    else if (unit === "g")
        return 0.001
    else
        return 1
}


export function convertValue(value: number, input_unit: Unit, output_unit: Unit) {
    return value * scale_unit(input_unit) / scale_unit(output_unit)
}