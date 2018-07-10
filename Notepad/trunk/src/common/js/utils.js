/**
 *整合post请求的json数据请求
 */
export const rqData = (options)=>{
    const data = Object.assign({},options)
    // data.sign = md5(toSign(data))
    let qs = require('qs').stringify(data)
    return qs
}

