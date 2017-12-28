import { NDArrayMath, Array1D, Array2D, Array3D, Array4D, ENV } from 'deeplearn'
import { FFTSizeType } from '../common/types'

export default class WhichStringModel {

    // make singleton?
	private fftSize: FFTSizeType

	private math: NDArrayMath

	private wConv1: Array4D
	private bConv1: Array1D
	private wConv2: Array4D
	private bConv2: Array1D
	private wFc1: Array2D
	private bFc1: Array1D
	private wFc2: Array2D
	private bFc: Array1D

	constructor(loadedVars: any, fftSize: FFTSizeType) {
		this.math = ENV.math
		this.fftSize = fftSize

		this.wConv1 = loadedVars['weight-conv1'] as Array4D
		this.bConv1 = loadedVars['bias-conv1'] as Array1D
		this.wConv2 = loadedVars['weight-conv2'] as Array4D
		this.bConv2 = loadedVars['bias-conv2'] as Array1D
		this.wFc1 = loadedVars['weight-fully-connected1'] as Array2D
		this.bFc1 = loadedVars['bias-fully-connected1'] as Array1D
		this.wFc2 = loadedVars['weight-fully-connected2'] as Array2D
		this.bFc = loadedVars['bias-fully-connected2'] as Array1D
	}

	public infer(rawX: Uint8Array): number {
		const sqrtFft: number = Math.sqrt(this.fftSize)
		const x: Array1D = Array1D.new(rawX)
		const reshapedX: Array3D = x.reshape([sqrtFft, sqrtFft, 1]) as Array3D
		const hConv1 = this.math.relu(this.conv2d(reshapedX, this.wConv1, this.bConv1))
		const hPool1 = this.maxPool(hConv1)
		const hConv2 = this.math.relu(this.conv2d(hPool1, this.wConv2, this.bConv2))
		const hPool2 = this.maxPool(hConv2)

        // when fft size is 1024, this is 4096
		const hPool2Flat: Array1D = hPool2.reshape([4096]) as Array1D
		const hFc1: Array1D = this.math.relu(this.math.add(this.math.vectorTimesMatrix(hPool2Flat, this.wFc1), this.bFc1)) as Array1D
		const yConv: Array1D = this.math.add(this.math.vectorTimesMatrix(hFc1, this.wFc2), this.bFc) as Array1D
		const result: Array1D = this.math.argMax(this.math.softmax(yConv)) as Array1D
		const resultValues: Int32Array = result.dataSync() as Int32Array
		return resultValues[0]
	}

	private conv2d(x: Array3D, W: Array4D, b: Array1D): Array3D {
		return this.math.conv2d(x, W, b, [1, 1, 1, 1], 'same')
	}

	private maxPool(x: Array3D) {
		return this.math.maxPool(x, [2, 2], [2, 2], 'same')
	}

}
