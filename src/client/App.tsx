import * as React from 'react'
import Trainer from './Trainer'
import Model from './model'

interface Props {

}
interface State {
}

class App extends React.Component <Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
        }

    }

    handleTrain() {

        const model = new Model()
        const trainer = new Trainer(model)
        trainer.loadData()
            .then(() => {

                trainer.train()

            }).catch((err) => console.log(err))

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
                <button onClick={this.handleTrain}>Train</button>
            </div>
        )
    }
}

export default App
