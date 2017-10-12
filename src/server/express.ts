import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'


export default (app: express.Application) => {

    app.disable('x-powered-by')
    app.set('trust proxy', 1)

    app.use(compression())

    app.use(bodyParser.json({ limit: '5mb' }))
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/wsassets', express.static(__dirname))

}
