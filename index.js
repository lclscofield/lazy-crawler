const Crawler = require('./lib/crawler.js')
const ipsFn = require('./target/testIps.js')

let crawler = new Crawler()

crawler.queueIps(ipsFn, './')
crawler.start()

module.exports = Crawler
