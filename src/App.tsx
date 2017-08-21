import * as React from 'react';
import './App.css';
import { NeuralNetwork } from './nn';
import AudioRecorder from './recorder/AudioRecorder'

const logo = require('./logo.svg');

interface MyState {
  nn: any
}

class App extends React.Component <any, MyState> {

  constructor(props: any) {
    super(props)
    const nn: any = new NeuralNetwork(512, 5, 4)
    nn.loadWeights()
    this.state = { nn }
  }

  render() {

    console.log(this.state.nn)
    console.log('www')

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <AudioRecorder />
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.s
        </p>
      </div>
    );
  }
}

export default App;
