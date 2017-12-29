import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './which-string.scss'

import { WhichString } from './index'

import { AdaptiveType } from './common/types'

export const adaptive: AdaptiveType = {
	phone: false,
	tablet: false
}

ReactDOM.render(
    <WhichString
        adaptive={adaptive}
        modelUrl={'.'}
        fftSize={512}
    />,
    document.getElementById('root')
)

if (module.hot) module.hot.accept()
