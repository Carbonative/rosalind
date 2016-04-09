locale = require('./fixtures/locale')
database = require('./fixtures/database')
user = require('./fixtures/user')

module.exports = ->
  failOnError = ->
    lastError = browser.execute(-> window.lastError).value
    message = lastError and lastError.message
    expect(lastError).toBeNull(message)
    browser.execute(-> window.lastError = null)

  @Before ->
    browser.url(process.env.ROOT_URL)
    browser.windowHandleMaximize()
    browser.timeoutsImplicitWait(3 * 1000)
    browser.waitForExist('#loaded')
    user.logout()
    database.reset()
    locale.reset()

  @Before failOnError
  @After failOnError

  @After ->
    user.logout()
    database.reset()
    locale.reset()
