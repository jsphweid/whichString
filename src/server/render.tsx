import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from '../client/App'

interface WebpackAssetsType {
    client: {
        js: string,
        css: string
    },
    vendor: {
        js: string
    }
}

export const RenderReact = (url: string, webpackAssets: WebpackAssetsType): string => {

    const renderedContent: any = (
        <StaticRouter location={url} context={{}} >
            <App />
        </StaticRouter>
    )

    const body = renderToString(renderedContent)

    const meta: string = `<meta charset="UTF-8"><meta http-equiv="x-ua-compatible" content="ie=edge">`
    const meta2: string = `<meta name="viewport" content="width=device-width, initial-scale=1">`

    const bundleBase: string = process.env.NODE_ENV === 'development' ? '' : '/wsassets/'

    const css: string = `<link rel="stylesheet" href="${bundleBase}${webpackAssets['client']['css']}" />`

    return `
        <!doctype html>
        <html lang="en">
            <head>
                <title>whichString App</title>
                ${ meta }
                ${ meta2 }
                ${ css }
            </head>
            <body>
                <div id="app">${body}</div>
                <script type="text/javascript" src="${bundleBase}${webpackAssets['vendor']['js']}"></script>
                <script type="text/javascript" src="${bundleBase}${webpackAssets['client']['js']}"></script>
            </body>
        </html>
    `

}
