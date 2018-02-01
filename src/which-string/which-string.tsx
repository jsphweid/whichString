import * as React from 'react'
import { AdaptiveType, FFTSizeType, BasicDimensionType, ViolinImgInfoType, ViolinImgInfoKeyType,
	ViolinStringLengthType, ViolinPointType, StringLetterType, ViolinRawPointType } from '../common/types'
import { getMostCommonElementInArray, getAllViolinImgInfo } from '../common/helpers'
import * as PitchFinder from 'pitchfinder'
const detectPitch = PitchFinder.AMDF()

import { CheckpointLoader, Array1D } from 'deeplearn'
import WhichStringModel from './model'

import { SAMPLING_RATE, ROTATION_DEGREES, VIOLIN_LOWEST_FREQ } from '../common/constants'
import FFTProcessor from './fft-processor'

export interface WhichStringProps {
	adaptive: AdaptiveType
	modelUrl: string
	fftSize: FFTSizeType
}

export interface WhichStringState {
	model: WhichStringModel
	error: any
	audioContext: AudioContext
	analyserNode: AnalyserNode
	listening: boolean
	guesses: number[]
	numToSmooth: number
	violinImgInfo: ViolinImgInfoType
	pitchGuess: number
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
			guesses: [],
			numToSmooth: 3,
			violinImgInfo: null,
			pitchGuess: null
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

	addToAndUpdateGuesses = (stringGuessIndex: number, pitchGuess: number): void => {
		let newGuesses: number[] = this.state.guesses.slice()
		newGuesses.push(stringGuessIndex)
		newGuesses = newGuesses.slice(this.state.numToSmooth * -1)
		this.setState({ pitchGuess, guesses: newGuesses })
	}

	process = (audioContext: AudioContext, analyserNode: AnalyserNode): void => {
		const loop: any = setInterval(() => {
			if (this.state.model && this.state.listening) {
				const myDataArray: Float32Array = new Float32Array(analyserNode.frequencyBinCount)				
				analyserNode.getFloatTimeDomainData(myDataArray)
				const guess: number = this.state.model.infer(FFTProcessor.getMags(myDataArray))
				detectPitch(myDataArray)
				this.addToAndUpdateGuesses(guess, detectPitch(myDataArray))
			}
		}, SAMPLING_RATE / (this.props.fftSize * 2))
	}
	
	updateImageDimensions = (something: any): void => {
		const { width } = document.querySelector('.ws-violin-img') as HTMLImageElement
		const violinImgInfo: ViolinImgInfoType = getAllViolinImgInfo(width)
		this.setState({ violinImgInfo })
	}

	updateNumToSmooth = (val: 1 | -1): void => {
		const newNumToSmooth: number = this.state.numToSmooth + val
		if (newNumToSmooth > 0 && newNumToSmooth <= 20) {
			this.setState({ numToSmooth: newNumToSmooth })
		}
	}
	
	renderSquares(string: number): JSX.Element[] {
		return [0, 1, 2, 3].map((num: number) => {
			const activeClass: string = (num === string) ? 'ws-squares-square--active' : ''
			return (
				<div key={num} className={`ws-squares-square ${activeClass}`} />
			)
		})
	}

	renderLine = (string: number): JSX.Element => {
		if (!this.state.violinImgInfo || string === null || string === 4 || !this.state.pitchGuess) return null
		const stringLetter = ['g', 'd', 'a', 'e'][string] as StringLetterType
		const lengthKey = stringLetter + 'Length' as ViolinStringLengthType
		const bridgeKey = stringLetter + 'Bridge' as ViolinPointType
		const centerKey = stringLetter + 'Center' as ViolinPointType
		const style: any = {
			width: `${this.state.violinImgInfo[lengthKey]}px`,
			left: `${this.state.violinImgInfo[centerKey].x - (this.state.violinImgInfo[lengthKey] / 2)}px`,
			top: `${this.state.violinImgInfo[centerKey].y}px`,
			transform: `rotate(${ROTATION_DEGREES[stringLetter]}deg)`
		}
		return <div className="ws-active-string-line" style={style} />
	}
	
	renderDot = (string: number): JSX.Element => {
		const { violinImgInfo, pitchGuess } = this.state
		if (!violinImgInfo || string === null || string === 4 || !pitchGuess) return null
		const stringLetter = ['g', 'd', 'a', 'e'][string] as StringLetterType
		const lowestFreq: number = VIOLIN_LOWEST_FREQ[stringLetter]
		const percentUpOnString: number = 1 - (lowestFreq / pitchGuess)
		const bridgeKey = (stringLetter + 'Bridge') as ViolinRawPointType
		const neckKey = (stringLetter + 'Neck') as ViolinRawPointType
		const x: number = violinImgInfo[neckKey].x + ((violinImgInfo[bridgeKey].x - violinImgInfo[neckKey].x) * percentUpOnString)
		const y: number = violinImgInfo[neckKey].y + ((violinImgInfo[bridgeKey].y - violinImgInfo[neckKey].y) * percentUpOnString)
		const style: any = {
			left: `${x}px`,
			top: `${y}px`
		}
		return <div className="ws-active-string-dot" style={style} />
	}

	renderTitle = (): JSX.Element => {
		return (
			<div className="ws-title">
				<h1>whichString</h1>
				<p>Play on the violin and see the model work!</p>
			</div>
		)
	}

	render() {

		const averagedString: number = getMostCommonElementInArray(this.state.guesses)

		return (
			<div className="ws">
				{this.renderTitle()}
				{this.renderLine(averagedString)}
				{this.renderDot(averagedString)}
				<img
					className="ws-violin-img"
					src="https://s3.us-east-2.amazonaws.com/which-string-samples/violinPicture.jpg"
					alt="violin"
					onLoad={this.updateImageDimensions.bind(this)}
				/>
				<span className="dottt" style={{ color: 'black', height: '5px', width: '5px', position: 'absolute' }} />

				{this.state.error ? <h1>error: {this.state.error}</h1> : null}
				<span>smoothing number: {this.state.numToSmooth}</span>
				<button onClick={() => this.updateNumToSmooth(1)}>Smooth More</button>
				<button onClick={() => this.updateNumToSmooth(-1)}>Smooth Less</button>
				<button onClick={() => this.setState({ listening: !this.state.listening })}>{this.state.listening ? 'OFF' : 'ON'}</button>
			</div>
		)

	}

}
