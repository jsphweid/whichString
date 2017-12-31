export interface AdaptiveType {
	phone: boolean
	tablet: boolean
}

export type StringLetterType = 'e' | 'a' | 'd' | 'g'

export type FFTSizeType =  256 | 512 | 1024 | 2048 | 4096

export interface PointType {
	x: number
	y: number
}

export interface PairOfPointsType {
	x1: number
	x2: number
	y1: number
	y2: number
}

export interface BasicDimensionType {
	width: number
	height: number
}

export type ViolinRawPointType = 'eNeck' | 'aNeck' | 'dNeck' | 'gNeck' | 'eBridge' | 'aBridge' | 'dBridge' | 'gBridge'
export type ViolinPointType = ViolinRawPointType | 'eCenter' | 'aCenter' | 'dCenter' | 'gCenter'
export type ViolinStringLengthType = 'eLength' | 'aLength' | 'dLength' | 'gLength'
export type ViolinImgInfoKeyType = ViolinPointType | ViolinStringLengthType

export interface ViolinRawCoordinatesType {
	eNeck: PointType
	aNeck: PointType
	dNeck: PointType
	gNeck: PointType
	eBridge: PointType
	aBridge: PointType
	dBridge: PointType
	gBridge: PointType
}

export interface ViolinCoordinatesType extends ViolinRawCoordinatesType {
	eCenter: PointType
	aCenter: PointType
	dCenter: PointType
	gCenter: PointType
}

export interface ViolinStringLengthsType {
	eLength: number
	aLength: number
	dLength: number
	gLength: number
}

export interface ViolinImgInfoType extends ViolinCoordinatesType, ViolinStringLengthsType {}
