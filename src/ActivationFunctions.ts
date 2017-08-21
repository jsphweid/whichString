import { ActivationFunction } from './types'

export default class ActivationFunctions {

    public static LINEAR: ActivationFunction = {
        output: x => x,
        derivative: x => 1
    }

    public static RELU: ActivationFunction = {
        output: x => Math.max(0, x),
        derivative: x => x <= 0 ? 0 : 1
    }

    public static SIGMOID: ActivationFunction = {

        output: x => 1 / (1 + Math.exp(-x)),
        derivative: x => {
            let output = ActivationFunctions.SIGMOID.output(x)
            return output * (1 - output)
        }

    }

    public static TANH: ActivationFunction = {
        output: x => Math.tanh(x),
        derivative: x => {
            let output = ActivationFunctions.TANH.output(x)
            return 1 - output * output
        }
    }

}