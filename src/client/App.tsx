import * as React from 'react'

const isBrowser = typeof window !== 'undefined'
const Train = isBrowser ? require('./train') : null

interface MyState {
    nn: any,
    guessedString: string
    lastTen: string[]
}

class App extends React.Component <any, MyState> {

    constructor(props: any) {
        super(props)

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
