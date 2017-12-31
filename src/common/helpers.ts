import { ViolinImgInfoType, ViolinPointType, ViolinStringLengthType } from './types'
import { VIOLIN_ALL_COORDS, VIOLIN_STRING_LENGTHS, VIOLIN_PIC_ORIGINAL_WIDTH } from './constants'

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

export const getAllViolinImgInfo = (width: number): ViolinImgInfoType => {

    const adjustmentRatio: number = width / VIOLIN_PIC_ORIGINAL_WIDTH
    const ret = {} as ViolinImgInfoType
    Object.keys(VIOLIN_ALL_COORDS).forEach((key: ViolinPointType) => {
        ret[key] = { x: VIOLIN_ALL_COORDS[key].x * adjustmentRatio, y: VIOLIN_ALL_COORDS[key].y * adjustmentRatio }
    })
    Object.keys(VIOLIN_STRING_LENGTHS).forEach((key: ViolinStringLengthType) => {
        ret[key] = VIOLIN_STRING_LENGTHS[key] * adjustmentRatio
    })
    return ret
}
