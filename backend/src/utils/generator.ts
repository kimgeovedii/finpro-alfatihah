export const randomEnumValue = <T>(values: readonly T[]): T => values[Math.floor(Math.random() * values.length)]
