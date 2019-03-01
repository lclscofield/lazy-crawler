const _ = require('lodash')
const getUserAgent = require('../fn/userAgents.js')

const globalConfig = ['connections', 'rateLimit']  // 本地配置
const defaultconfig = {
  timeout: 10000,  // 超时时间默认 10s
  connections: 10,  // 并发数默认 10
  rateLimit: 0  // 请求间隔默认 0
}
const queues = []

function log (str, obj) {
  throw new Error(str + JSON.stringify(obj))
}

function separateConfig (config) {  // 分离请求与本地配置
  let arr = []
  for (let key in Object.keys(config)) {
    if (globalConfig.indexOf(key) === -1) {
      arr[0][key] = config[key]
    } else {
      arr[1][key] = config[key]
    }
  }
  return arr
}

class Crawler {
  constructor(config = {}) {
    !_.isPlainObject(options[i]) && log('config not object', config)
    this.init(config)
  }

  init (config) {
    allConfig = {
      ...defaultconfig,
      ...config
    }
    let configList = separateConfig(allConfig)
    this.globalConfig = configList[0]  // 全局本地配置
    this.reqConfig = configList[1]  // 全局请求配置
  }

  queue (options) {  // 添加请求进入队列
    options = _.isArray(options) ? options : [options]
    queues.push(options)
    for (let i = 0, len = options.length; i < len; i++) {
      if (_.isNull(options[i]) || _.isUndefined(options[i]) || (!_.isString(options[i]) && !_.isPlainObject(options[i]))) {
        log('options 格式错误', options[i])
      }
      queues.push(_.isString(options[i]) ? { uri: options[i] } : options[i])
    }
  }
}
