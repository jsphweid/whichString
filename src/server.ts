const express = require('express')
const app = express()
const PythonShell = require('python-shell')
const path = require('path')

const fs = require('fs')

const base_dir: string = '/tmp/tensorflow/whichString/v0.06__1024_fft-size/'

const options = { scriptPath: path.resolve(__dirname, 'python-script-helpers') }
const pyshell = new PythonShell('next-batch.py', options, { mode: 'text' })

pyshell.on('message', (message: any) => {
    console.log('message has arrived!!!', message)
})

app.get('/getTrainBatch', function (req: any, res: any) {

    const batchSize = req.query.size || 50

    // pyshell.stdout.on('data', (data: any) => {
    //     console.log('what is this data......?!?!?!', data)
    //
    //
    // })
    res.send('sent')


// inefficient because it has to re-import numpy and shit every request... use events??
//     PythonShell.run('./python-script-helpers/next-batch.py', options, (error: any, results: any) => {
//         return error
//             ? res.status(400).json({ error })
//             : res.send(results)
//     })
//
//     const data = JSON.parse(fs.readFileSync(base_dir + 'data_training.json', 'utf8'))
//     const labels = JSON.parse(fs.readFileSync(base_dir + 'labels_training.json', 'utf8'))

})

app.get('/send', (req: any, res: any) => {
    pyshell.send('hello').end((err: any) => console.log('hmm', err))
    res.send('maybe i did it')
})

app.listen(3100, function () {
    console.log('Example app listening on port 3100!')
})