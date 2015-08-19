/**
 * 内地，香港，台湾
 */
var Promise = require('promise');
var webpage = require('webpage');

/*
 * 百度明星简介数据接口
 *
 * STAR_REGION            明星地区，可选的有[内地，香港，台湾，日本，韩国，欧美]
 * STAR_START_INDEX       明星列表的开始开始下标
 * EVERY_PAGE_STAR_NUMBER 每页的返回的数量
 */
var starApi = 'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?resource_id=28226&from_mid=1&&format=json&ie=utf-8&oe=utf-8&query=%E6%98%8E%E6%98%9F&sort_key=&sort_type=1&stat0=&stat1=STAR_REGION&stat2=&stat3=&pn=STAR_START_INDEX&rn=EVERY_PAGE_STAR_NUMBER';
/**
 * @returns [{
 *   name:'',     //明星的名字
 *   basicImg:'', //明星的初始小头像
 *   url:'',      //进一步的百度百科的
 * }]
 */
var query = function(){
    var allStars = [],
        selector = 'pre';

    var json = document.querySelector(selector).innerText;
    var jsonObj = JSON.parse(json);

    var result = jsonObj.data.result;

    allStars = result.map(function(star){
        return {
            name:star.ename,
            basicImg:star.image,
            url:star.source[0]
        }
    });

    return allStars;
};

var setUrl = function(region,startIndex,everyNum){
    console.log('star api arguments : ',region,startIndex,everyNum);
    return starApi.replace('STAR_REGION',region)
        .replace('STAR_START_INDEX',startIndex)
        .replace('EVERY_PAGE_STAR_NUMBER',everyNum);
};

var openPage = function(region,startIndex,everyNum){
    var url = setUrl(region,startIndex,everyNum);

    var page = webpage.create();
    page.settings.resourceTimeout = 1000;

    return new Promise(function(resolve){
        page.open(url,function(status){
            console.log('allStars open status:',status);
            if(status === 'success'){

                var allStars = page.evaluate(query);
                resolve(allStars);
            }
        });
    });
};


module.exports = function(region,startIndex,everyNum){

    return openPage(region,startIndex,everyNum);
};