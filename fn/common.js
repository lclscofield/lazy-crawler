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

async function getHtml (options, proxy) {
  return new Promise((resolve, reject) => {
    request(
      {
        ...defaultOptions,
        ...options,
        proxy
      },
      (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(cheerio.load(body, { decodeEntities: false }))
        } else {
          reject(err || '请求错误')
        }
      }
    )
  })
}

async function saveIps (ips, ipsPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(ipsPath, 'ips.json'),
      JSON.stringify(ips, null, 2),
      err => {
        if (err) console.log(err)
        console.log('ip 池文件已保存')
        resolve()
      }
    )
  })
}

// 验证代理可用性
async function check (ips) {
  console.log('获取页面 ip 数量：' + ips.length)
  console.log('开始验证 ip')
  try {
    let valid = [] // 有效数据
    // 对每一个请求进行Promise包装,验证网页内容,获取网页
    let pros = ips.map(item => {
      return new Promise((resolve, reject) => {
        const options = {
          url: 'http://www.baidu.com',
          proxy: item.ip,
          timeout: 5000
        }
        request.get(options, (err, res, body) => {
          if (!err && res.statusCode === 200) {
            resolve(body)
          } else {
            resolve(false)
          }
        })
      })
    })
    const bodys = await Promise.all(pros)
    // 筛选有效代理
    bodys.forEach((val, index) => {
      if (val) {
        const $ = cheerio.load(val, { decodeEntities: false })
        const title = $('title').text()
        if (title === '百度一下，你就知道') {
          valid.push(ips[index])
        }
      }
    })
    console.log('有效 ip 数量:' + valid.length)
    return valid
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getHtml,
  saveIps,
  check
}
