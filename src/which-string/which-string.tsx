import * as React from 'react'
import { AdaptiveType, FFTSizeType } from '../common/types'

import { CheckpointLoader, Array1D } from 'deeplearn'
import WhichStringModel from './model'

import { SAMPLING_RATE } from '../common/constants'

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
	loop: any
}

export default class WhichString extends React.Component<WhichStringProps, WhichStringState> {

	constructor(props: WhichStringProps) {
		super(props)
		
		this.state = {
			model: null,
			error: null,
			audioContext: null,
			analyserNode: null,
			loop: null
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
			analyserNode.fftSize = this.props.fftSize * 2
			microphone.connect(analyserNode)
			this.process(audioContext, analyserNode)
		}, (error) => this.setState({ error }))
		
	}

	process = (audioContext: AudioContext, analyserNode: AnalyserNode) => {
		const myDataArray: Uint8Array = new Uint8Array(analyserNode.frequencyBinCount)		
		const loop: any = setInterval(() => {
			
			if (this.state.model) {
				analyserNode.getByteFrequencyData(myDataArray)
				const guess: number = this.state.model.infer(myDataArray)
				console.log(guess);
			}
		}, SAMPLING_RATE / (this.props.fftSize * 2))

		this.setState({ loop })
	}

	render() {

		return (
			<div>
				{this.state.model ? <h1>model loaded!!</h1> : <span>loading...</span>}
				{this.state.error ? <h1>error: {this.state.error}</h1> : null}
				<button onClick={() => clearInterval(this.state.loop)}>STOP</button>
			</div>
		)

	}

}
