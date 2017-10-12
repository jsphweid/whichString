import * as express from 'Express'
const { join } = require('path')
const jsonfile = require('jsonfile')
const path = require('path')
import { Array1D } from 'deeplearn'

interface allData {
    trainingInputs: Array1D[] | null
    trainingLabels: Array1D[] | null
    testInputs: Array1D[] | null
    testLabels: Array1D[] | null
}

type Request = express.Request
type Response = express.Response

const possibleData: allData = {
    trainingInputs: null,
    trainingLabels: null,
    testInputs: null,
    testLabels: null
}

const isDev: boolean = process.env.NODE_ENV === 'development'

if (isDev) {

    const whichVersion = 'buf2048_fft1024_h55348_v1'
    const basePath = '/tmp/whichString/data'

    possibleData.trainingInputs = jsonfile.readFileSync(join(basePath, whichVersion, 'data_training.json'))//.map(transformArr)
    possibleData.trainingLabels = jsonfile.readFileSync(join(basePath, whichVersion, 'labels_training.json'))//.map(transformArr)
    possibleData.testInputs = jsonfile.readFileSync(join(basePath, whichVersion, 'data_test.json'))//.map(transformArr)
    possibleData.testLabels = jsonfile.readFileSync(join(basePath, whichVersion, 'labels_test.json'))//.map(transformArr)

}

import { RenderReact } from './render'

const getAssetPaths = () => {

    return (isDev)
        ? jsonfile.readFileSync(join(__dirname, '..', 'build', 'webpack-assets.json'))
        : jsonfile.readFileSync(join(__dirname, 'webpack-assets.json'))

}

export default (app: express.Application) => {

    const localOnlyMessage: string = 'This data is only available when running locally.'

    app.get('/getAllData', (req: Request, res: Response): Response => {
        return isDev
            ? res.status(200).json({
                inputs: possibleData.trainingInputs,
                labels: possibleData.trainingLabels,
                testInputs: possibleData.testInputs,
                testLabels: possibleData.testLabels
            })
            : res.status(400).json({ message: localOnlyMessage })
    })

    app.get('*', (req: Request, res: Response): Response => {

        const html: string = RenderReact(req.url, getAssetPaths())
        return res.status(200).send(html)

    })

}
