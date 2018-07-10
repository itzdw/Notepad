// 工具函数库
import config from './config'

// http get工具函数 获取数据
const get=(url,data)=> {
  return request(url, 'GET', data)
}
const post=(url,data)=> {
  return request(url, 'POST', data)
}

function request (url, method, data, header = {'content-type':'application/x-www-form-urlencoded'}) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header,
      url: config.host + url,
      success:res=>{
        // console.log(res)
        if (res.data.Status === 200) {
          resolve(res.data.Data)
        } else {
          showModal('失败', res.data.Message)
          reject(res.data)
        }
      }
    })
  })
}

//显示模态框
const showModal= (title, content)=> {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

//成功显示
const showSuccess = (text)=> {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}

//显示提示内容
const showMsg = (text)=> {
  wx.showToast({
    title: text,
    icon: 'none'
  })
}

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

const formatDate = (seconds,formate="YYYY-MM-DD hh:mm:ss")=>{
  const t = new Date(seconds)
  const year = t.getFullYear()
  const month = formatNumber(t.getMonth()+1)
  const date = formatNumber(t.getDate())
  const hour = formatNumber(t.getHours())
  const minute = formatNumber(t.getMinutes())
  const second = formatNumber(t.getSeconds())

  let json={
    'YYYY':year,
    'MM':month,
    'DD':date,
    'hh':hour,
    'mm':minute,
    'ss':second
  }

  let result = formate
  for (let key in json){
    result = result.replace(key,json[key])
  }

  return result
}

export default {
  showModal,//显示模态框
  showSuccess,//成功显示
  showMsg,//显示提示内容
  get, //http get工具函数 获取数据
  post, //http post工具函数 获取数据
  formatNumber,//格式化数字
  formatTime,//格式化时间 2018/6/27 09：32：35
  formatDate,//格式化时间 YYYY-MM-DD hh:mm:ss
}
