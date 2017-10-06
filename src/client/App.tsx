import * as React from 'react'
import Train from './train'

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

    render() {

        return (
            <div className="App">
                <div className="App-header">
                    <h2>whichString</h2>
                </div>
                <p className="App-intro">
                    Play that violin!
                </p>
                <button onClick={Train.buildGraphAndStartTraining}>Train</button>
            </div>
        )
    }
}

export default App
