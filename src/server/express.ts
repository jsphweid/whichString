import * as express from 'Express'
import * as bodyParser from 'body-parser'


export default (app: express.Application) => {

    app.disable('x-powered-by')
    app.set('trust proxy', 1)

    app.use(bodyParser.json({ limit: '5mb' }))
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/wsassets', express.static(__dirname))

}
