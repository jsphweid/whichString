import { Graph, Tensor } from 'deeplearn'
import NodeBuilders from './variable-builders'

interface VariablesType {
    w_conv1: any
    b_conv1: any
    w_conv2: any
    b_conv2: any
    w_fc1: any
    b_fc1: any
    w_fc2: any
    b_fc2: any
}

export default class Model {

    static FFT_SIZE: number = 1024
    static FFT_SQRT: number = 32
    static NUM_STRINGS: number = 4

    public graph: Graph
    private inputShape: number[]
    public x_: Tensor
    public y_: Tensor
    public costTensor: Tensor
    private variables: VariablesType = {
        w_fc1: null,
        w_conv1: null,
        w_conv2: null,
        w_fc2: null,
        b_conv2: null,
        b_conv1: null,
        b_fc1: null,
        b_fc2: null
    }

    constructor() {
        this.inputShape = [Model.FFT_SIZE]
        this.graph = new Graph()
        const g: Graph = this.graph
        this.x_ = g.placeholder('input', this.inputShape)
        this.y_ = g.placeholder('expected-output', [Model.NUM_STRINGS])

        this.variables.w_conv1 = NodeBuilders.buildVariable(g, [5, 5, 1, 32], 'w_conv1')
        this.variables.b_conv1 = NodeBuilders.buildVariable(g, [32], 'b_conv1')

        const x_reshaped = g.reshape(this.x_, [Model.FFT_SQRT, Model.FFT_SQRT, 1])
        const conv1 = g.conv2d(x_reshaped, this.variables.w_conv1, this.variables.b_conv1, 5, 32, 1, 2)
        const relu1 = g.relu(conv1)
        const maxPool1 = g.maxPool(relu1, 2, 2, 0)

        this.variables.w_conv2 = NodeBuilders.buildVariable(g, [5, 5, 32, 64], 'w_conv2')
        this.variables.b_conv2 = NodeBuilders.buildVariable(g, [64], 'b_conv2')
        const conv2 = g.conv2d(maxPool1, this.variables.w_conv2, this.variables.b_conv2, 5, 64, 1, 2)
        const relu2 = g.relu(conv2)
        const maxPool2 = g.maxPool(relu2, 2, 2, 0)

        const currentSize: number = (Model.FFT_SQRT / 4) * (Model.FFT_SQRT / 4) * 64
        this.variables.w_fc1 = NodeBuilders.buildVariable(g, [currentSize, 1024], 'w_fc1')
        this.variables.b_fc1 = NodeBuilders.buildVariable(g, [1024], 'b_fc1')

        const h_pool2_flat = g.reshape(maxPool2, [currentSize])
        const f_fc1 = g.relu(g.add(g.matmul(h_pool2_flat, this.variables.w_fc1), this.variables.b_fc1))

        this.variables.w_fc2 = NodeBuilders.buildVariable(g, [1024, 4], 'w_fc2')
        this.variables.b_fc2 = NodeBuilders.buildVariable(g, [4], 'b_fc2')

        const y_conv = g.add(g.matmul(f_fc1, this.variables.w_fc2), this.variables.b_fc2)

        this.costTensor = g.softmaxCrossEntropyCost(y_conv, this.y_)

    }

    public getVariables() {

        return this.variables

    }

    // save weights

    // load weights

}