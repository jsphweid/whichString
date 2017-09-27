// import * as React from 'react'
// import './App.css'
// import { myFft } from './utils/fft/fft'
// import {getIndexOfMax, getItemThatAppearsMost} from './utils/helpers'
//
// interface MyState {
//     nn: any,
//     guessedString: string
//     lastTen: string[]
// }
//
// class App extends React.Component <any, MyState> {
//
//     constructor(props: any) {
//         super(props)
//         const nn: any = new NeuralNetwork(512, 500, 4)
//         nn.loadWeights()
//         this.state = {
//             nn,
//             guessedString: '',
//             lastTen: []
//         }
//     }
//
//     componentDidMount() {
//         const audioContext: AudioContext = new AudioContext()
//         let gainNode: GainNode | null = null
//         let micStream: MediaStreamAudioSourceNode | null = null
//         let scriptProcessorAnalysisNode: ScriptProcessorNode | null = null
//         let analyserNode: AnalyserNode | null = null
//
//         const startMicrophone = (stream: MediaStream) => {
//             gainNode = audioContext.createGain() // get rid of??
//             gainNode.gain.value = 0
//             gainNode.connect(audioContext.destination)
//             micStream = audioContext.createMediaStreamSource(stream)
//             micStream.connect(gainNode)
//             scriptProcessorAnalysisNode = audioContext.createScriptProcessor(1024, 1, 1)
//             scriptProcessorAnalysisNode.connect(gainNode)
//             analyserNode = audioContext.createAnalyser()
//             analyserNode.smoothingTimeConstant = 0
//             analyserNode.fftSize = 1024
//             micStream.connect(analyserNode)
//             analyserNode.connect(scriptProcessorAnalysisNode)
//
//             scriptProcessorAnalysisNode.onaudioprocess = (event) => {
//                 const buffer: number[] = Array.from(event.inputBuffer.getChannelData(0))
//                 const fft: any = myFft(buffer).slice(0, 512)
//
//                 const idx: number = getIndexOfMax(this.state.nn.query(fft))
//                 const guessedString: string = ['g', 'd', 'a', 'e'][idx]
//                 const lastTen = this.state.lastTen.slice(0, 9)
//                 lastTen.unshift(guessedString)
//                 this.setState({ guessedString, lastTen })
//             }
//         }
//
//         if (navigator.getUserMedia){
//             navigator.getUserMedia({ audio:true },
//                 (stream) => {
//                     startMicrophone(stream)
//                 },(e) => alert('Error capturing audio.')
//             )
//
//         } else { alert('getUserMedia not supported in this browser.'); }
//
//     }
//
//     render() {
//
//         return (
//             <div className="App">
//                 <div className="App-header">
//                     <h2>whichString</h2>
//                 </div>
//                 <p className="App-intro">
//                     Play that violin!
//                 </p>
//                 <h1>
//                     {getItemThatAppearsMost(this.state.lastTen)}
//                 </h1>
//             </div>
//         )
//     }
// }
//
// export default App