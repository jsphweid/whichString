import * as React from 'react'
import './App.css'
import {Array1D, CheckpointLoader, Graph, NDArrayMathGPU, Session, Tensor} from 'deeplearn'

import Train from './train'

interface MyState {
    nn: any,
    guessedString: string
    lastTen: string[]
}

class App extends React.Component <any, MyState> {

    constructor(props: any) {
        super(props)

        const FFT_SIZE = 1024
        const SQRT = 32

        const varLoader = new CheckpointLoader('./model')
        varLoader.getAllVariables().then(vars => {
            // const g = new Graph()
            // const input = g.placeholder('input', [FFT_SIZE])
            // const weightConv1 = g.constant(vars['weight-conv1'])
            // const biasConv1 = g.constant(vars['bias-conv1'])
            // const x_image = g.reshape(input, [SQRT, SQRT, 1])
            // const h_conv1 = g.relu(g.conv2d(x_image, weightConv1, biasConv1, 1, 1))
            // const h_pool1 = g.maxPool(h_conv1, 2, 2)
            //
            // const weightConv2 = g.constant(vars['weight-conv2'])
            // const biasConv2 = g.constant(vars['bias-conv2'])
            //
            // const h_conv2 = g.relu(g.conv2d(h_pool1, weightConv2, biasConv2, 1, 1))
            // const h_pool2 = g.maxPool(h_conv2, 2, 2)

            // const hidden1 = g.relu(g.add(g.matmul(input, weightConv1), biasConv1))
            // const math = new NDArrayMathGPU()
            // const sess = new Session(g, math)
            // console.log(sess)
            // math.scope(() => {
                // const result = sess.eval(...)
                // console.log(result.getValues())
            // })
        })


        // this.state = {
        //
        // }

    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="App">
                <div className="App-header">
                    <h2>whichString</h2>
                </div>
                <p className="App-intro">
                    Play that violin!
                </p>
                <button onClick={Train.buildModel}>Train</button>
            </div>
        )
    }
}

export default App
