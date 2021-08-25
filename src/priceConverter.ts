const units = ['lb', 'kg', 'g'] as const
export type Unit = typeof units[number]

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

export function isUnit(str: string) {
    const sheepName = units.find((validName) => validName === str);
    return !!sheepName;

}


export function convertValue(value: number, input_unit: Unit, output_unit: Unit) {
    return value * scale_unit(input_unit) / scale_unit(output_unit)
}