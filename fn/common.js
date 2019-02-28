const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const getUserAgent = require('./userAgents.js')

const defaultOptions = {
  headers: {
    'User-Agent': getUserAgent()
  }
}

async function getHtml(options) {
  return new Promise((resolve, reject) => {
    request.get({
      ...defaultOptions,
      ...options
    }, (err, res, body) => {
      if (err) throw new Error(err)
      if (res.statusCode < 400) {
        resolve(cheerio.load(body, { decodeEntities: false }))
      } else {
        throw new Error(err)
      }
    })
  })
}

async function saveIps(ips) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname + '/../data/ips.json'), JSON.stringify(ips, null, 2), err => {
      if (err) throw new Error(err)
      console.log('ip 池文件已保存')
      resolve()
    })
  })
}

module.exports = {
  getHtml,
  saveIps
}
