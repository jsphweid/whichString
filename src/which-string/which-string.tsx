import * as React from 'react'
import { AdaptiveType, FFTSizeType } from '../common/types'

import { CheckpointLoader, Array1D } from 'deeplearn'
import WhichStringModel from './model'

import { SAMPLING_RATE } from '../common/constants'
import FFTProcessor from './fft-processor'

export interface WhichStringProps {
	adaptive: AdaptiveType
	modelUrl: string
	fftSize: FFTSizeType
}

interface WhichStringState {
	model: WhichStringModel
	error: any
	audioContext: AudioContext
	analyserNode: AnalyserNode
	listening: boolean
	string: number
}

export default class WhichString extends React.Component<WhichStringProps, WhichStringState> {

	constructor(props: WhichStringProps) {
		super(props)
		
		this.state = {
			model: null,
			error: null,
			audioContext: null,
			analyserNode: null,
			listening: true,
			string: null
		}

	}

	componentDidMount() {
		
		// load model
		const checkpointLoader = new CheckpointLoader(this.props.modelUrl)
		checkpointLoader.getAllVariables().then((vars: any) => {
			const model = new WhichStringModel(vars, this.props.fftSize)
			this.setState({ model })
		})

		// set up mic stream
		navigator.getUserMedia({ audio: true }, (stream: MediaStream) => {
			const audioContext: AudioContext = new AudioContext()
			const microphone: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream)
			const analyserNode: AnalyserNode = audioContext.createAnalyser()
			analyserNode.smoothingTimeConstant = 0
			analyserNode.fftSize = this.props.fftSize * 4
			microphone.connect(analyserNode)
			this.process(audioContext, analyserNode)
		}, (error) => this.setState({ error }))
		
	}

	process = (audioContext: AudioContext, analyserNode: AnalyserNode) => {
		const loop: any = setInterval(() => {
			if (this.state.model && this.state.listening) {
				const myDataArray: Float32Array = new Float32Array(analyserNode.frequencyBinCount)				
				analyserNode.getFloatTimeDomainData(myDataArray)
				const guess: number = this.state.model.infer(FFTProcessor.getMags(myDataArray))
				this.setState({ string: guess })
			}
		}, SAMPLING_RATE / (this.props.fftSize * 2))
	}

	renderSquares() {
		return [0, 1, 2, 3].map((num: number) => {
			const activeClass: string = (num === this.state.string) ? 'ws-squares-square--active' : ''
			return (
				<div key={num} className={`ws-squares-square ${activeClass}`} />
			)
		})
	}

	render() {

		return (
			<div>
				<div className="ws-squares">
					{this.state.model ? this.renderSquares() : <span>loading...</span>}
				</div>
				{this.state.error ? <h1>error: {this.state.error}</h1> : null}
				<button onClick={() => this.setState({ listening: !this.state.listening })}>STOP</button>
			</div>
		)

	}

}
