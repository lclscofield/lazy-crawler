const Crawler = require('./lib/crawler.js')
const ipsFn = require('./test/testIps.js')
const path = require('path')

let crawler = new Crawler()

crawler.test()
// crawler.queueIps(ipsFn, path.join(__dirname, './data'))
// crawler.start()
