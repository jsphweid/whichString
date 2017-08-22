export const randomMatrix = (rows: number, columns: number): number[][] => {
    const result: number[][] = []
    for (let i: number = 0; i < rows; i++) {
        result[i] = []
        for (let j: number = 0; j < columns; j++) {
            result[i][j] = Math.random() - 0.5
        }
    }
    return result
}

export const numToTarget = (num: number): number[] => {

    switch(num) {
        case 0: return [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        case 1: return [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        case 2: return [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
        case 3: return [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
        case 4: return [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
        case 5: return [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        case 6: return [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
        case 7: return [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
        case 8: return [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
        case 9: return [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    }
    return []

}

export const stringNameToNumberArr = (str: string): number[] => {

    switch(str) {
        case 'g': return [1, 0, 0, 0]
        case 'd': return [0, 1, 0, 0]
        case 'a': return [0, 0, 1, 0]
        case 'e': return [0, 0, 0, 1]
    }
    return []

}

export const readTextFile = (file: any, callback: Function) => {
    var rawFile: any = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

export const turnIndexToStr = (idx: number):string => {

    switch(idx) {
        case 0: return 'g'
        case 1: return 'd'
        case 2: return 'a'
        case 3: return 'e'
    }
    return ''
}

export const getIndexOfMax = (arr: number[]): number => {

    let max: number = arr[0]
    let maxIndex: number = 0

    for (let i: number = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i
            max = arr[i]
        }
    }

    return maxIndex
}

export const getItemThatAppearsMost = (arr: string[]): string => {

    let max: string = arr[0]
    let maxIndex: number = 0

    for (let i: number = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i
            max = arr[i]
        }
    }

    return max
}

export const flatten = (arr: any[][]): any[] => [].concat.apply([], arr)

export const countCorrect = (arr: string[]): number => {
    let count: number = 0
    arr.forEach((item: string) => {
        if (item === 'CORRECT') count++
    })
    return count
}