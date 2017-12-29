export function getMostCommonElementInArray<T>(arr: T[]): T {
    if (arr.length === 0)
        return null
    const countMap: any = {}
    let maxEl: T = arr[0]
    let maxCount: number = 1
    for (let i = 0; i < arr.length; i++) {
        const el: T = arr[i]
        countMap[el] = (countMap[el]) ? countMap[el]++ : 1
        if (countMap[el] > maxCount) {
            maxEl = el
            maxCount = countMap[el]
        }
    }
    return maxEl

}
