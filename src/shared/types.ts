import { Array1D, Graph, Tensor } from 'deeplearn'

export interface BatchType {
    inputs: Array1D[]
    labels: Array1D[]
}


export type LayerName = 'Fully connected' | 'ReLU' | 'Convolution' | 'Max pool' | 'Reshape' | 'Flatten'

export type LayerWeightsDict = { [name: string]: number[] }

export interface LayerParam {
    label: string
    initialValue(inputShape: number[]): number|string
    type: 'number'|'text'
    min?: number
    max?: number
    setValue(value: number|string): void
    getValue(): number|string
}

export interface LayerBuilder {
    layerName: LayerName
    getLayerParams(): LayerParam[]
    getOutputShape(inputShape: number[]): number[]
    addLayer(
        g: Graph, network: Tensor, inputShape: number[], index: number,
        weights?: LayerWeightsDict | null): Tensor
    // Return null if no errors, otherwise return an array of errors.
    validate(inputShape: number[]): string[]|null
}