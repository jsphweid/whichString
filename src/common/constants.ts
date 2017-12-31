import { ViolinRawCoordinatesType, ViolinCoordinatesType, BasicDimensionType, ViolinRawPointType, ViolinPointType,
    ViolinStringLengthType, ViolinStringLengthsType, PairOfPointsType, StringLetterType } from './types'

export const SAMPLING_RATE: number = 44100

export const VIOLIN_PIC_ORIGINAL_WIDTH: number = 2000
const VIOLIN_PIC_ORIGINAL_HEIGHT: number = 1333

export const VIOLIN_LOWEST_FREQ: { e: number, a: number, d: number, g: number } = {
    e: 659.3,
    a: 440,
    d: 293.7,
    g: 196
}

const VIOLIN_RAW_COORDS: ViolinRawCoordinatesType = {
    eNeck: { x: 328, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 605 },
    aNeck: { x: 328, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 592 },
    dNeck: { x: 325, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 576 },
    gNeck: { x: 325, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 555 },
    eBridge: { x: 1355, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 656 },
	aBridge: { x: 1356, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 623 },
	dBridge: { x: 1358, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 584 },
    gBridge: { x: 1355, y: VIOLIN_PIC_ORIGINAL_HEIGHT - 543 }
}

const getBasicXYs = (string: StringLetterType): PairOfPointsType => {
    const neck = `${string}Neck` as ViolinRawPointType
    const bridge = `${string}Bridge` as ViolinRawPointType
    return {
        x1: VIOLIN_RAW_COORDS[neck].x,
        x2: VIOLIN_RAW_COORDS[bridge].x,
        y1: VIOLIN_RAW_COORDS[neck].y,
        y2: VIOLIN_RAW_COORDS[bridge].y
    }
}

export const VIOLIN_ALL_COORDS = ((): ViolinCoordinatesType => {
    const centerCoordinates = {} as ViolinCoordinatesType
    ['e', 'a', 'd', 'g'].forEach((letter: StringLetterType) => {
        const center = `${letter}Center` as ViolinPointType
        const { x1, x2, y1, y2 } = getBasicXYs(letter)
        centerCoordinates[center] = {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2
        }
    })    
    return { ...VIOLIN_RAW_COORDS, ...centerCoordinates }
})()

export const VIOLIN_STRING_LENGTHS = ((): ViolinStringLengthsType => {
    const stringLengths = {} as ViolinStringLengthsType
    ['e', 'a', 'd', 'g'].forEach((letter: StringLetterType) => {
        const stringLength = `${letter}Length` as ViolinStringLengthType
        const { x1, x2, y1, y2 } = getBasicXYs(letter)
        stringLengths[stringLength] = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    })    
    return stringLengths
})()

export const ROTATION_DEGREES: { e: string, a: string, d: string, g: string } = {
    e: '-2.8',
    a: '-1.8',
    d: '-0.5',
    g: '0.8'
}
