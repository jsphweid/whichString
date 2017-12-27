const fft = require('fft-js').fft
const fftUtil = require('fft-js').util

export default class FFTProcessor {

    static getMags(signal: Float32Array): Float32Array {
        return new Float32Array(fftUtil.fftMag(fft(signal)))
    }

}
