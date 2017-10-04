import * as express from 'Express'
const { join } = require('path')
const jsonfile = require('jsonfile')
const path = require('path')
import { Array1D } from 'deeplearn'
const whichVersion = 'buf2048_fft1024_h55348_v1'
const basePath = '/tmp/whichString/data'
const trainingInputs: Array1D[] = jsonfile.readFileSync(join(basePath, whichVersion, 'data_training.json')).map((item: number[]) => Array1D.new(item))
const trainingLabels: Array1D[] = jsonfile.readFileSync(join(basePath, whichVersion, 'labels_training.json')).map((item: number[]) => Array1D.new(item))
const testInputs: Array1D[] = jsonfile.readFileSync(join(basePath, whichVersion, 'data_test.json')).map((item: number[]) => Array1D.new(item))
const testLabels: Array1D[] = jsonfile.readFileSync(join(basePath, whichVersion, 'labels_test.json')).map((item: number[]) => Array1D.new(item))


import { RenderReact } from './render'
import { BatchType } from '../shared/types'

const getAssetPaths = () => {

    return (process.env.NODE_ENV !== 'development')
        ? jsonfile.readFileSync(join(__dirname, 'webpack-assets.json'))
        : jsonfile.readFileSync(join(__dirname, '..', 'build', 'webpack-assets.json'))

}

export default (app: express.Application) => {

    app.get('/getAllTrainingData', (req: any, res:any): BatchType => ({ inputs: trainingInputs, labels: trainingLabels }))
    app.get('/getAllTestData', (req: any, res:any): BatchType => ({ inputs: testInputs, labels: testLabels }))

    app.get('*', (req, res) => {

        const html: string = RenderReact(req.url, getAssetPaths())
        res.status(200).send(html)

    })

}
