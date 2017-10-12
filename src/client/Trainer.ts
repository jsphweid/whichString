import {
    Array1D, CostReduction, FeedEntry, Graph,
    InGPUMemoryShuffledInputProviderBuilder,
    NDArrayMathGPU, Session, SGDOptimizer
} from 'deeplearn'
import Model from './model'
import axios from 'axios'

interface PairedDataType {
    inputs: Array1D[]
    labels: Array1D[]
}

interface AllDataType {
    training: PairedDataType
    test: PairedDataType
}

export default class Trainer {

    static BATCH_SIZE: number = 50
    static NUM_ITERATIONS: number = 20
    private graph: Graph
    private model: Model
    private math: NDArrayMathGPU
    private data: AllDataType
    private session: Session

    constructor(model: Model) {
        this.model = model
        this.graph = this.model.graph
        this.math = new NDArrayMathGPU()
        this.session = new Session(this.graph, this.math)

    }

    public loadData(): Promise<any> {

        return axios.get(`/getAllData`)
            .then((response) => {

                const transformArr = (item: number[]) => Array1D.new(item)

                this.data = {
                    training: {
                        inputs: response.data.inputs.map(transformArr),
                        labels: response.data.labels.map(transformArr)
                    },
                    test: {
                        inputs: response.data.testInputs.map(transformArr),
                        labels: response.data.testLabels.map(transformArr)
                    }
                }

                return

            })
            .catch((error) => console.log(error))

    }

    public train(): void {

        const shuffledInputProviderBuilder = new InGPUMemoryShuffledInputProviderBuilder([
            this.data.training.inputs,
            this.data.training.labels
        ])

        const [inputProvider, labelProvider] = shuffledInputProviderBuilder.getInputProviders()

        const feedEntries: FeedEntry[] = [
            { tensor: this.model.x_, data: inputProvider },
            { tensor: this.model.y_, data: labelProvider }
        ]

        const optimizer = new SGDOptimizer(0.001)


        for (let i = 0; i < Trainer.NUM_ITERATIONS; i++) {
            this.math.scope(() => {
                const cost = this.session.train(
                    this.model.costTensor,
                    feedEntries,
                    Trainer.BATCH_SIZE,
                    optimizer,
                    CostReduction.MEAN
                )

                console.log('last average cost (' + i + '): ' + cost.get())
            })
        }

    }


}