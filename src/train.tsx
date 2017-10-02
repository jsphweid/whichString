import {
    Array1D, NDArrayMathGPU, Scalar, Graph, Array2D, Array4D, SGDOptimizer, GraphRunner, Session,
    GraphRunnerEventObserver, FeedEntry
} from 'deeplearn'
import axios from 'axios'
import NodeBuilders from "./node-builders";

interface BatchType {
    data: number[][]
    labels: number[][]
}


export default class Train {

    static BUFFER_SIZE: number = 2048
    static FFT_SIZE: number = 1024
    static FFT_SQRT: number = 32
    static BATCH_SIZE: number = 50
    static NUM_STRINGS: number = 4


    static buildGraph() {

        const g = new Graph()

        const x_ = g.placeholder('input', [Train.BATCH_SIZE, Train.FFT_SIZE])
        const y_ = g.placeholder('expected output', [Train.BATCH_SIZE, Train.NUM_STRINGS])

        const w_conv1 = NodeBuilders.buildVariable(g, [5, 5, 1, 32], 'w_conv1')
        const b_conv1 = NodeBuilders.buildVariable(g, [32], 'b_conv1')

        // does dljs not support batch processing convolution???
        const x_reshaped = g.reshape(x_, [Train.BATCH_SIZE, Train.FFT_SQRT, Train.FFT_SQRT, 1])
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

        const h_pool2_flat = g.reshape(maxPool2, [Train.BATCH_SIZE, currentSize])
        const f_fc1 = g.relu(g.add(g.matmul(h_pool2_flat, w_fc1), b_fc1))

        const w_fc2 = NodeBuilders.buildVariable(g, [1024, 4], 'w_fc2')
        const b_fc2 = NodeBuilders.buildVariable(g, [4], 'b_fc2')

        const y_conv = g.add(g.matmul(f_fc1, w_fc2), b_fc2)

        const costTensor = g.softmaxCrossEntropyCost(y_conv, y_)

        const optimizer = new SGDOptimizer(0.5)

        const mathGpuInstance = new NDArrayMathGPU()
        const session: Session = new Session(g, mathGpuInstance)
        const eventObserver: GraphRunnerEventObserver = {
            batchesTrainedCallback: (batchesTrained: number) => console.log(batchesTrained),
            avgCostCallback: (avgCost: Scalar) => console.log('avgCost', avgCost),
            metricCallback: (metric: Scalar) => console.log('metric', metric),
            inferenceExamplesCallback: () => {},
            inferenceExamplesPerSecCallback: (examplesPerSec: number) => console.log('examplesPerSec', examplesPerSec),
            trainExamplesPerSecCallback: (examplesPerSec: number) => console.log('examplesPerSec', examplesPerSec),
            totalTimeCallback: (totalTimeSec: number) => () => {}
        }
        const graphRunner = new GraphRunner(mathGpuInstance, session, eventObserver)

        return Train.getBatch()
            .then((response) => {

                const feedEntries: FeedEntry[] = [
                    {tensor: x_, data: response.data},
                    {tensor: y_, data: response.labels}
                ]

                graphRunner.train(
                    costTensor,
                    feedEntries,
                    50,
                    optimizer
                )


            })


    }

    static runBatch(batch: BatchType) {

        console.log(batch)

    }

    static getBatch(): Promise<any> {

        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            timeout: 10000,
            headers: {
                'Access-Control-Allow-Origin': 'localhost'
            }
        })

        return axiosInstance.get(`/?batchsize=${Train.BATCH_SIZE}`)
            .then((response) => Train.runBatch(response.data))
            .catch((error) => console.log(error))

    }

}