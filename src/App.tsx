import * as React from 'react'
import './App.css'
import { NeuralNetwork } from './nn'
// import { myFft } from './utils/fft/fft'
import {getIndexOfMax, getItemThatAppearsMost} from './utils/helpers'

interface MyState {
    nn: any,
    guessedString: string
    lastTen: string[]
}

class App extends React.Component <any, MyState> {

    constructor(props: any) {
        super(props)
        const nn: any = new NeuralNetwork(512, 5, 4)
        nn.loadWeights()
        this.state = {
            nn,
            guessedString: '',
            lastTen: []
        }
    }

    componentDidMount() {
        const audioContext: AudioContext = new AudioContext()
        let gainNode: GainNode | null = null
        let micStream: MediaStreamAudioSourceNode | null = null
        let scriptProcessorAnalysisNode: ScriptProcessorNode | null = null
        let analyserNode: AnalyserNode | null = null

        const startMicrophone = (stream: MediaStream) => {
            gainNode = audioContext.createGain() // get rid of??
            gainNode.gain.value = 0
            gainNode.connect(audioContext.destination)
            micStream = audioContext.createMediaStreamSource(stream)
            micStream.connect(gainNode)
            scriptProcessorAnalysisNode = audioContext.createScriptProcessor(1024, 1, 1)
            scriptProcessorAnalysisNode.connect(gainNode)
            analyserNode = audioContext.createAnalyser()
            analyserNode.smoothingTimeConstant = 0
            analyserNode.fftSize = 1024
            micStream.connect(analyserNode)
            analyserNode.connect(scriptProcessorAnalysisNode)
            const freqDomain = new Uint8Array(1024)
            scriptProcessorAnalysisNode.onaudioprocess = () => {
                analyserNode && analyserNode.getByteFrequencyData(freqDomain)
                const idx: number = getIndexOfMax(this.state.nn.query(Array.from(freqDomain.slice(0, 512))))
                const guessedString: string = ['g', 'd', 'a', 'e'][idx]
                const lastTen = this.state.lastTen.slice(0, 9)
                lastTen.unshift(guessedString)
                this.setState({ guessedString, lastTen })

            }
        }

        if (navigator.getUserMedia){
            navigator.getUserMedia({ audio:true },
                (stream) => {
                    startMicrophone(stream)
                },(e) => alert('Error capturing audio.')
            )

        } else { alert('getUserMedia not supported in this browser.'); }

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
                <h1>
                    {getItemThatAppearsMost(this.state.lastTen)}
                </h1>
            </div>
        );
    }
}

export default App;
