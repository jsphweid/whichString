import * as React from 'react'
import './App.css'
import { CheckpointLoader, Graph, NDArrayMathGPU, Session } from 'deeplearn'

interface MyState {
    nn: any,
    guessedString: string
    lastTen: string[]
}

class App extends React.Component <any, MyState> {

    constructor(props: any) {
        super(props)

        const varLoader = new CheckpointLoader('./models/')
        varLoader.getAllVariables().then(vars => {
            const g = new Graph()
            const input = g.placeholder('input', [1024])
            const weightConv1 = g.constant(vars['weight-conv1'])
            const biasConv1 = g.constant(vars['bias-conv1'])
            const hidden1 = g.relu(g.add(g.matmul(input, weightConv1), biasConv1))
            console.log('hidden1', hidden1)
            const math = new NDArrayMathGPU()
            const sess = new Session(g, math)
            console.log(sess)
            math.scope(() => {
                // const result = sess.eval(...)
                // console.log(result.getValues())
            })
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
            </div>
        )
    }
}

export default App
