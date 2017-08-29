const url= require('./url')
const axios = require('axios')
const moment = require('moment')
const iconv = require('iconv-lite')
const gm = require('gm')
const fs = require('fs')

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
        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                resolve('延时完成')
            }, time)
        })
    }
    //初始化，绑定用户
    async init () {
        this.initRes = await this.getData(url.account, this.config) 
    }
    //打印文字功能
    async printText (content) {
        console.log('printText开始')
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
    async printImg (path) {
        console.log('printImg开始')
        let Content = 
            `T:${iconv.encode('来自node平台\n', 'gbk').toString('base64')}|${await this.encodeImg(path)}|T:${iconv.encode(moment().format('YYYY-MM-DD HH:mm:ss'), 'gbk').toString('base64')}`
        let print = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ak: this.config.ak,
            memobirdID: this.config.memobirdID,
            userID: this.initRes.showapi_userid,
            printcontent: Content
        }
        return await this.getData(url.print, print)
    }
    //打印混合内容
    async printMutilContent (arr) {
        arr = arr.filter((item) => {
            return item.content !== '' && (item.type === 'text' || item.type === 'image')
        })
        let tmpArr = []
        for(let i = 0;i < arr.length; i++) {
            if (arr[i].type === 'text') {
                tmpArr.push('T:'+iconv.encode(arr[i].content+'\n', 'gbk').toString('base64'))
            }
            if (arr[i].type === 'image') {
                tmpArr.push(await this.encodeImg(arr[i].content))
            }
        }
        tmpArr.unshift('T:'+iconv.encode('来自node平台'+'\n', 'gbk').toString('base64'))
        tmpArr.push('T:'+iconv.encode(moment().format('YYYY-MM-DD HH:mm:ss'), 'gbk').toString('base64'))
        let data = tmpArr.join('|')
        console.log(data)
        let print = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ak: this.config.ak,
            memobirdID: this.config.memobirdID,
            userID: this.initRes.showapi_userid,
            printcontent: data
        }
        return await this.getData(url.print, print)
    }
    encodeImg (path) {
        return new Promise((resolve, reject) => {
            gm(path).resize(384).flip().type('Bilevel').colors(2).toBuffer('bmp', (error, buffer) => {
                if (error) {
                reject(error);
                } else {
                resolve(`P:${buffer.toString('base64')}`);
                }
            });
        })
    }
    //检测是否打印完成
    async status (id, time) {
        let times = 1
        let printflag = 0
        let status = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ak: this.config.ak,
            printcontentid: id
        }
        do {
            await this.timeOut(time)
            let res = await this.getData(url.status, status)
            printflag = res.printflag
            console.log(`开始检测 第${times}次  延时${time}ms  ${printflag === 1 ? '打印完成' : '打印未完成'}`)
            times++;
            if(times === 6)
                break
        }
        while (printflag !== 1);
        return printflag
    }  
}
module.exports = Memobird