import {
    Array1D, NDArrayMathGPU, Scalar, Graph, Array2D, Array4D, SGDOptimizer, GraphRunner, Session,
    GraphRunnerEventObserver, FeedEntry, InCPUMemoryShuffledInputProviderBuilder, CostReduction, NDArrayMathCPU,
    InGPUMemoryShuffledInputProviderBuilder
} from 'deeplearn'
const math: any = (typeof(window) !== 'undefined') ? new NDArrayMathGPU() : null
import axios from 'axios'
import NodeBuilders from './variable-builders'
import { BatchType } from '../shared/types'

export default class Train {

    static BUFFER_SIZE: number = 2048
    static FFT_SIZE: number = 1024
    static FFT_SQRT: number = 32
    static BATCH_SIZE: number = 50
    static NUM_STRINGS: number = 4


    static buildGraphAndStartTraining() {
console.log('start')
        const g = new Graph()

        const x_ = g.placeholder('input', [Train.FFT_SIZE])
        const y_ = g.placeholder('expected output', [Train.NUM_STRINGS])

        const w_conv1 = NodeBuilders.buildVariable(g, [5, 5, 1, 32], 'w_conv1')
        const b_conv1 = NodeBuilders.buildVariable(g, [32], 'b_conv1')

        // does dljs not support batch processing convolution???
        const x_reshaped = g.reshape(x_, [Train.FFT_SQRT, Train.FFT_SQRT, 1])
        const conv1 = g.conv2d(x_reshaped, w_conv1, b_conv1, 5, 32, 1, 2)
        const relu1 = g.relu(conv1)
        const maxPool1 = g.maxPool(relu1, 2, 2, 0)

        const w_conv2 = NodeBuilders.buildVariable(g, [5, 5, 32, 64], 'w_conv2')
        const b_conv2 = NodeBuilders.buildVariable(g, [64], 'b_conv2')
        const conv2 = g.conv2d(maxPool1, w_conv2, b_conv2, 5, 64, 1, 2)
        const relu2 = g.relu(conv2)
        const maxPool2 = g.maxPool(relu2, 2, 2, 0)

        const currentSize: number = (Train.FFT_SQRT / 4) * (Train.FFT_SQRT / 4) * 64
        const w_fc1 = NodeBuilders.buildVariable(g, [currentSize, 1024], 'w_fc1')
        const b_fc1 = NodeBuilders.buildVariable(g, [1024], 'b_fc1')

        const h_pool2_flat = g.reshape(maxPool2, [currentSize])
        const f_fc1 = g.relu(g.add(g.matmul(h_pool2_flat, w_fc1), b_fc1))

        const w_fc2 = NodeBuilders.buildVariable(g, [1024, 4], 'w_fc2')
        const b_fc2 = NodeBuilders.buildVariable(g, [4], 'b_fc2')

        const y_conv = g.add(g.matmul(f_fc1, w_fc2), b_fc2)

        const costTensor = g.softmaxCrossEntropyCost(y_conv, y_)

        const optimizer = new SGDOptimizer(0.005)

        const session: Session = new Session(g, math)
        // const eventObserver: GraphRunnerEventObserver = {
        //     batchesTrainedCallback: (batchesTrained: number) => console.log(batchesTrained),
        //     avgCostCallback: (avgCost: Scalar) => console.log('avgCost', avgCost),
        //     metricCallback: (metric: Scalar) => console.log('metric', metric),
        //     inferenceExamplesCallback: () => {},
        //     inferenceExamplesPerSecCallback: (examplesPerSec: number) => console.log('examplesPerSec', examplesPerSec),
        //     trainExamplesPerSecCallback: (examplesPerSec: number) => console.log('examplesPerSec', examplesPerSec),
        //     totalTimeCallback: (totalTimeSec: number) => () => {}
        // }
        // const graphRunner = new GraphRunner(mathGpuInstance, session, eventObserver)
        console.log('graph built... fetching data')
        Train.getAllData(true)
            .then((response: any) => {
                console.log('data fetched... running graph with data')

                // for some reason this can't go on the server...
                const transformArr = (item: number[]) => Array1D.new(item)
                const inputs: Array1D[] = response.data.inputs.map(transformArr)
                const labels: Array1D[] = response.data.labels.map(transformArr)

                const shuffledInputProviderBuilder =
                    new InGPUMemoryShuffledInputProviderBuilder([inputs, labels])
                const [inputProvider, labelProvider] =
                    shuffledInputProviderBuilder.getInputProviders()

                const feedEntries: FeedEntry[] = [
                    {tensor: x_, data: inputProvider},
                    {tensor: y_, data: labelProvider}
                ]

                for (let i = 0; i < 20; i++) {
                    math.scope(() => {
                        const cost = session.train(
                            costTensor, feedEntries, 50, optimizer, CostReduction.MEAN)

                        console.log('last average cost (' + i + '): ' + cost.get())
                    })
                }


            })


    }

    static getAllData(training: boolean = true): Promise<any> {

        const type: string = training ? 'Training' : 'Test'

        return axios.get(`/getAll${type}Data`)
            .then((response) => response)
            .catch((error) => console.log(error))

    }

}