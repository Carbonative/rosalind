import { WebApp } from 'meteor/webapp'
import parse from 'co-body'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ContactForm, handleContactForm } from './contactForm'
import { portalCss } from './portalCss'

const ErrorMessage = () =>
  <div>
    <h2>Entschuldigung!</h2>
    <p>
      Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später noch ein Mal, oder kontaktieren Sie uns telefonisch.
    </p>
    <p>Vielen Dank</p>
  </div>

const respondWith = (res, Component) => {
  const rendered = ReactDOMServer.renderToString(<Component />)
    html = `<!DOCTYPE html>
<html>
  <head>
    <style>${portalCss}</style>
  </head>
  <body>
    <div id="portal">${rendered}</div>
  </body>
</html>
`

  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.write(html)
  res.end()

  return null
}

export default () => {
  WebApp.connectHandlers.use('/contact', async (req, res, next) => {
    switch (req.method) {
      case 'GET':
        try {
          return respondWith(res, ContactForm)
        } catch (e) {
          console.error(e)
          return respondWith(res, ErrorMessage)
        }
      case 'POST':
        try {
          const body = await parse.form(req)
          const Response = await handleContactForm(body)
          return respondWith(res, Response)
        } catch (e) {
          console.error(e)
          return respondWith(res, ErrorMessage)
        }
      default: return respondWith(res, ErrorMessage)
    }
  })
}
