const url= require('./url')
const axios = require('axios')
const moment = require('moment')
const iconv = require('iconv-lite')
const gm = require('gm')

class Memobird {
    constructor (userInfo) {
        this.config = {
            ak: userInfo.ak,
            memobirdID: userInfo.memobirdID,
            useridentifying: userInfo.useridentifying,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        }        
    }
    getData (url, data) {
        return new Promise((resolve, reject) => {
            axios.post(url, data)
            .then((res) => {
                if (res.data.showapi_res_code === 1) {
                    console.log('异步请求ok')
                    resolve(res.data)
                } else {
                    console.log('失败! 原因：', res.data.showapi_res_error )
                    reject(res.data)
                }
            })
        })
    }
    //延时
    timeOut (time = 3000) {
        console.log(`延时${time}ms`)
        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                resolve('延时完成')
            }, time)
        })
    }
    //初始化，绑定用户
    async init () {
        try { this.initRes = await this.getData(url.account, this.config) } 
        catch (err) { console.log(err) }
    }
    //打印文字功能
    async printText (content) {
        console.log('print开始')
        let Content = 
            `来自node平台
            ${content}
            ${moment().format('YYYY-MM-DD HH:mm:ss')}`
        let print = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ak: this.config.ak,
            memobirdID: this.config.memobirdID,
            userID: this.initRes.showapi_userid,
            printcontent: `T:${iconv.encode(Content, 'gbk').toString('base64')}`
        }
        return await this.getData(url.print, print)
    }
    //打印图片功能
    async printImg (url) {
        console.log('print开始')
        let Content = 
            `来自node平台
            ${content}
            ${moment().format('YYYY-MM-DD HH:mm:ss')}`
        let print = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ak: this.config.ak,
            memobirdID: this.config.memobirdID,
            userID: this.initRes.showapi_userid,
            printcontent: `T:${iconv.encode(Content, 'gbk').toString('base64')}`
        }
        return await this.getData(url.print, print)
    }
    //检测是否打印完成
    async status (id, time) {
         console.log('开始检测')
        let status = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ak: this.config.ak,
            printcontentid: id
        }
        console.log(await this.timeOut(time))
        return await this.getData(url.status, status)
    }  
}
module.exports = Memobird