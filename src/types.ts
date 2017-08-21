export interface ActivationFunction {
    output: (input: number) => number,
    derivative: (input: number) => number
}

export interface iNeuralNetwork {
    numANodes: number
    numBNodes: number
    numCNodes: number
    learningRate: number
    abWeights: number[][]
    bcWeights: number[][]
    activationFunction: ActivationFunction
    query: (inputs: number[]) => number[]
}

export interface Point {
    x: number,
    y: number
}
