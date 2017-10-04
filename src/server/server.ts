import * as express from 'express'
import configureExpress from './express'
import routeApplication from './routes'


const app: express.Application = express()

configureExpress(app)

routeApplication(app)

export default app
