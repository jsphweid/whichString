const express = require('express')
const app = express()
const PythonShell = require('python-shell')
const path = require('path')

const fs = require('fs')

const base_dir: string = '/tmp/tensorflow/whichString/v0.06__1024_fft-size/'

const options = { scriptPath: path.resolve(__dirname, 'python-script-helpers') }
const pyshell = new PythonShell('next-batch.py', options, { mode: 'text' })

const whichVersion = 'buf2048_fft1024_h55348_v1'
const basePath = 'tmp/whichString/data'
const trainingInputs = require(path.join(basePath, whichVersion, 'data_training.json'))
const trainingLabels = require(path.join(basePath, whichVersion, 'labels_training.json'))
const testInputs = require(path.join(basePath, whichVersion, 'data_test.json'))
const testLabels = require(path.join(basePath, whichVersion, 'labels_test.json'))

app.get('/getAllTrainingData', (req: any, res:any) => {

})

app.get('/getAllTestData', (req: any, res:any) => {

})

app.listen(3100, function () {
    console.log('Example app listening on port 3100!')
})