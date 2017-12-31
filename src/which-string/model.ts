import { NDArrayMath, Array1D, Array2D, Array3D, Array4D, ENV } from 'deeplearn'
import { FFTSizeType } from '../common/types'

export default class WhichStringModel {

    // make singleton?
	private fftSize: FFTSizeType

	private math: NDArrayMath
    
	private finalLayerSize: number

	private wConv1: Array3D
	private bConv1: Array1D
	private wConv2: Array3D
	private bConv2: Array1D
	private wFc1: Array2D
	private bFc1: Array1D
	private wFc2: Array2D
	private bFc: Array1D

	constructor(loadedVars: any, fftSize: FFTSizeType) {
		this.math = ENV.math
		this.fftSize = fftSize

		this.finalLayerSize = (this.fftSize - 4 - 4) * 64 // minus 2 convolutional layers times output shape of wConv2

		this.wConv1 = loadedVars['weight-conv1'] as Array3D
		this.bConv1 = loadedVars['bias-conv1'] as Array1D
		this.wConv2 = loadedVars['weight-conv2'] as Array3D
		this.bConv2 = loadedVars['bias-conv2'] as Array1D
		this.wFc1 = loadedVars['weight-fully-connected1'] as Array2D
		this.bFc1 = loadedVars['bias-fully-connected1'] as Array1D
		this.wFc2 = loadedVars['weight-fully-connected2'] as Array2D
		this.bFc = loadedVars['bias-fully-connected2'] as Array1D
	}

	public infer(rawX: Uint8Array): number {
		const x: Array1D = Array1D.new(rawX)
		const reshapedX: Array2D = x.reshape([this.fftSize, 1]) as Array2D
		const hConv1 = this.math.relu(this.conv1d(reshapedX, this.wConv1, this.bConv1)) as Array2D
		const hConv2 = this.math.relu(this.conv1d(hConv1, this.wConv2, this.bConv2)) as Array2D

		const hPool2Flat: Array1D = hConv2.reshape([this.finalLayerSize]) as Array1D
		const hFc1: Array1D = this.math.relu(this.math.add(this.math.vectorTimesMatrix(hPool2Flat, this.wFc1), this.bFc1)) as Array1D
		const yConv: Array1D = this.math.add(this.math.vectorTimesMatrix(hFc1, this.wFc2), this.bFc) as Array1D
        const result: Array1D = this.math.argMax(this.math.softmax(yConv)) as Array1D
		const resultValues: Int32Array = result.dataSync() as Int32Array
        return resultValues[0]
	}

	private conv1d(x: Array2D, W: Array3D, b: Array1D): Array2D {
		return this.math.conv1d(x, W, b, 1, 'valid')
	}

}
