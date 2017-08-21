const ADD = (x: number, y: number) => x + y
const SUBTRACT = (x: number, y: number) => x - y
const MULTIPLY = (x: number, y: number) => x * y
const DIVIDE = (x: number, y: number) => x / y

export const dotProduct = (a: number[][], b: number[][]): number[][] => {

    const numAColumns: number = a[0].length
    const numBRows: number = b.length

    if (numAColumns != numBRows) {
        throw 'Incompatible matrix sizes!'
    }

    let result: number[][] = []
    for (let i = 0; i < a.length; i++) {
        result[i] = []
        for (let j = 0; j < b[0].length; j++) {
            let sum: number = 0
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j]
            }
            result[i][j] = sum
        }
    }
    return result

}

export const add = (a: number[][], b: number[][]): number[][] => simpleMatrixFn(a, b, ADD)
export const subtract = (a: number[][], b: number[][]): number[][] => simpleMatrixFn(a, b, SUBTRACT)
export const multiply = (a: number[][], b: number[][]): number[][] => simpleMatrixFn(a, b, MULTIPLY)
export const divide = (a: number[][], b: number[][]): number[][] => simpleMatrixFn(a, b, DIVIDE)

export const simpleMatrixFn = (a: number[][], b: number[][], fn: Function): number[][] => {

    const aLengths: number[] = a.map((num: number[]) => num.length)
    const bLengths: number[] = b.map((num: number[]) => num.length)

    if ((a.length !== b.length) || (JSON.stringify(aLengths) !== JSON.stringify(bLengths))) {
        throw new Error('Incompatible matrix sizes!')
    }

    return a.map((row, i) => row.map((item, j) => fn(item, b[i][j])))

}

export const scaleMatrix = (a: number[][], scale: number | Function): number[][] => {

    const scaling = (typeof scale === 'function') ?
        (num: number) => scale(num) :
        (num: number) => num * scale

    return a.map((row) => row.map((num) => scaling(num)))

}

export const transpose = (a: number[][]): number[][] => a[0].map((col, i) => a.map((row) => row[i]))

export const arrToMatrix = (a: number[]): number[][] => [a]

export const arrToMatrixAvoid0 = (a: number[]): number[][] => arrToMatrix(a.map((b: number) => b === 0 ? 0.01 : b))

