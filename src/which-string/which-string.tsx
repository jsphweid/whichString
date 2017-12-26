import * as React from 'react'
import { AdaptiveType } from '../common/types'

export interface WhichStringProps {
	adaptive: AdaptiveType
}

interface WhichStringState {

}

export default class WhichString extends React.Component<WhichStringProps, WhichStringState> {

	constructor(props: WhichStringProps) {
		super(props)
	}

	render() {

		return (
			<div>hi there</div>
		)

	}

}
