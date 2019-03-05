const _ = require('lodash')
const path = require('path')
const { getHtml } = require('../fn/common.js')
const getIps = require('../fn/getIps.js')
const testIp = require('../test/testIps.js')
const testTarget = require('../test/testTarget.js')

const ctrlConfig = ['connections', 'rateLimit'] // 控制器配置
const defaultconfig = {
  timeout: 1000, // 超时时间默认 10s
  connections: 10, // 并发数默认 10，最大限制为100
  rateLimit: 0 // 请求间隔默认 0
}

// 错误日志
function log (str, obj) {
  throw new Error(str + JSON.stringify(obj))
}

// 分离请求与控制器配置
function separateConfig (config) {
  let arr = [{}, {}]
  for (let value of Object.keys(config)) {
    if (ctrlConfig.indexOf(value) !== -1) {
      arr[0][value] = config[value]
    } else {
      arr[1][value] = config[value]
    }
  }
  return arr
}

// 请求 push 进队列
function pushQueue (options) {
  let queues = []
  options = _.isArray(options) ? options : [options]
  for (let i = 0, len = options.length; i < len; i++) {
    if (
      _.isNull(options[i]) ||
      _.isUndefined(options[i]) ||
      (!_.isString(options[i]) && !_.isPlainObject(options[i]))
    ) {
      log('options 格式错误', options[i])
    }
    queues.push(_.isString(options[i]) ? { url: options[i] } : options[i])
  }
  return queues
}

// 并发调度
async function limitDispatch (list = [], ctrlConfig, reqConfig) {
  let limit = ctrlConfig.connections
  let interval = ctrlConfig.rateLimit
  if (!limit) limit = 10

  let recursion = arr => {
    if (!arr.length) return
    let options = arr.shift()
    let callback = options.callback || (reqConfig.callback || (() => {}))
    _.isFunction(callback) || (callback = () => {})

    return getHtml({
      ...reqConfig,
      ...options
    })
      .then(res => {
        callback(res)
        delayed(arr)
      })
      .catch(err => {
        console.log(err)
        delayed(arr)
      })
  }

  let delayed = arr => {
    // 请求间隔
    setTimeout(() => {
      if (arr.length !== 0) {
        recursion(arr) // 递归调用，保证请求完成后接上下一个请求
      }
    }, interval)
  }

  let listCopy = [].concat(list)
  let asyncList = []
  while (limit--) {
    asyncList.push(recursion(listCopy)) // 根据 limit 控制传给 Promise.all 的参数
  }
  return Promise.all(asyncList) // Promise.all 控制最大同时请求数
}

class Crawler {
  constructor (config = {}) {
    !_.isPlainObject(config) && log('config not object', config)
    this.init(config)
  }

  init (config) {
    let allConfig = {
      ...defaultconfig,
      ...config
    }
    let configList = separateConfig(allConfig)
    this.ctrlConfig = configList[0] // 全局控制器配置
    this.reqConfig = configList[1] // 全局请求配置

    this.testIp = testIp // 测试 ip
    this.ipsPath = path.join(__dirname, '../data/ips.json') // 默认 ip 池路径
    this.reqQueues = [] // 普通请求队列
    this.ipQueues = [] // ip 请求队列
  }

  // 添加获取 ip 的请求进入队列
  queueIps (options, ipsPath) {
    this.reqQueues = pushQueue(options)
    this.ipsPath = path.join(ipsPath, 'ips.json') // 自定义 ip 池路径
  }

  // 添加请求进入队列
  queue (options) {
    this.reqQueues = pushQueue(options)
  }

  // 启动
  async start () {
    let ips = require(this.ipsPath)
    if (!ips && this.ipQueues.length) {
      console.log('开始获取 ip 池:')
      ips = await getIps(this.ipQueues, this.ipsPath)
    }
    this.reqConfig.proxy = ips[parseInt(Math.random() * ips.length)] // 随机抽取代理 ip
    if (this.reqQueues.length) {
      console.log('开始爬取目标:')
      await limitDispatch(this.reqQueues, this.ctrlConfig, this.reqConfig)
    }
  }

  // 测试用例
  test () {
    this.queueIps(this.testIp, path.join(__dirname, '../data'))
    this.queue(testTarget)
    this.start()
  }
}

module.exports = Crawler
