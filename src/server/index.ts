const http = require('http')
import app from './server'

const server = http.createServer(app)

let currentapp = app

server.listen(8080, () => {
    console.log('server running on port 8080...')
})

if (module.hot) {
    module.hot.accept('./server', () => {
        server.removelistener('request', currentapp)
        const newapp = require('./server').default
        server.on('request', newapp)
        currentapp = newapp
    })
}
