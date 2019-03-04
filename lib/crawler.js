const _ = require('lodash')
const getIps = require('../fn/getIps.js')
const ipsFn = require('../test/testIps.js')
const path = require('path')

const ctrlConfig = ['connections', 'rateLimit'] // 控制器配置
const defaultconfig = {
  timeout: 10000, // 超时时间默认 10s
  connections: 10, // 并发数默认 10，最大限制为100
  rateLimit: 0 // 请求间隔默认 0
}
const reqQueues = [] // 普通请求队列
const ipQueues = [] // ip 请求队列

// 错误日志
function log(str, obj) {
  throw new Error(str + JSON.stringify(obj))
}

// 分离请求与控制器配置
function separateConfig(config) {
  let arr = [{}, {}]
  for (let key in Object.keys(config)) {
    if (ctrlConfig.indexOf(key) === -1) {
      arr[0][key] = config[key]
    } else {
      arr[1][key] = config[key]
    }
  }
  return arr
}

// 请求 push 进队列
function pushQueue(options, queues) {
  options = _.isArray(options) ? options : [options]
  for (let i = 0, len = options.length; i < len; i++) {
    if (
      _.isNull(options[i]) ||
      _.isUndefined(options[i]) ||
      (!_.isString(options[i]) && !_.isPlainObject(options[i]))
    ) {
      log('options 格式错误', options[i])
    }
    if (queues === 'reqQueues') {
      queues.push(_.isString(options[i]) ? { url: options[i] } : options[i])
    } else {
      queues.push(options[i])
    }
  }
}

class Crawler {
  constructor(config = {}) {
    !_.isPlainObject(config) && log('config not object', config)
    this.init(config)
  }

  init(config) {
    let allConfig = {
      ...defaultconfig,
      ...config
    }
    let configList = separateConfig(allConfig)
    this.ctrlConfig = configList[0] // 全局控制器配置
    this.reqConfig = configList[1] // 全局请求配置
  }

  // 添加获取 ip 的请求进入队列
  queueIps(options, path) {
    pushQueue(options, ipQueues)
    this.ipsPath = path
  }

  // 添加请求进入队列
  queue(options) {
    pushQueue(options, reqQueues)
  }

  // 启动
  async start() {
    if (ipQueues.length) {
      console.log('开始获取 ip 池')
      await getIps(ipQueues, this.ipsPath)
    }
    if (reqQueues.length) {
      console.log('开始爬取目标')
    }
  }

  // 测试用例
  test() {
    this.queueIps(ipsFn, path.join(__dirname, '../data'))
    this.start()
  }
}

module.exports = Crawler
