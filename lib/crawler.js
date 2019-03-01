const _ = require('lodash')
const getIps = require('../fn/getIps.js')

const globalConfig = ['connections', 'rateLimit']  // 本地配置
const defaultconfig = {
  timeout: 10000,  // 超时时间默认 10s
  connections: 10,  // 并发数默认 10
  rateLimit: 0  // 请求间隔默认 0
}
const reqQueues = []
const ipQueues = []

function log (str, obj) {
  throw new Error(str + JSON.stringify(obj))
}

function separateConfig (config) {  // 分离请求与本地配置
  let arr = [{}, {}]
  for (let key in Object.keys(config)) {
    if (globalConfig.indexOf(key) === -1) {
      arr[0][key] = config[key]
    } else {
      arr[1][key] = config[key]
    }
  }
  return arr
}

function pushQueue (options, queues) {
  options = _.isArray(options) ? options : [options]
  for (let i = 0, len = options.length; i < len; i++) {
    if (_.isNull(options[i]) || _.isUndefined(options[i]) || (!_.isString(options[i]) && !_.isPlainObject(options[i]))) {
      log('options 格式错误', options[i])
    }
    if (queues === reqQueues) {
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

  init (config) {
    let allConfig = {
      ...defaultconfig,
      ...config
    }
    let configList = separateConfig(allConfig)
    this.globalConfig = configList[0]  // 全局本地配置
    this.reqConfig = configList[1]  // 全局请求配置
  }

  queueIps (options) {  // 添加获取 ip 的请求进入队列
    pushQueue(options, ipQueues)
  }

  queue (options) {  // 添加请求进入队列
    pushQueue(options, reqQueues)
  }

  async start () {  // 启动
    if (ipQueues.length) {
      console.log('开始获取 ip 池')
      await getIps(ipQueues)
    }
  }
}

module.exports = Crawler
