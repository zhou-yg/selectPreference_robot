/**
 * 内地，香港，台湾
 */
var Promise = require('promise');
var Q = require('q');
var webpage = require('webpage');

//手动encode中文字符
var encodeChinese = function(region){
    var map = {
        '内地': '%E5%86%85%E5%9C%B0',
        '香港': "%E9%A6%99%E6%B8%AF",
        '台湾': '%E5%8F%B0%E6%B9%BE'
    };

    var regionCode = map[region];

    return regionCode?regionCode:map['内地'];
};
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

    if(jsonObj.data){}
    var result = jsonObj.data[0].result;

//    console.log(location.href);
//    console.log(JSON.stringify(result,null,2));

    allStars = result.map(function(star){
        return {
            name:star.ename,
            basicImg:star.image,
            url:star.source[0]
        }
    });

    return allStars;
};

//创建超链接
var createUrl = function(starApi){
    return function(region,startIndex,everyNum){
        return starApi.replace('STAR_REGION',region)
            .replace('STAR_START_INDEX',startIndex)
            .replace('EVERY_PAGE_STAR_NUMBER',everyNum);
    }
};

var createPage = function(){

    var page = webpage.create();
    page.settings.resourceTimeout = 1000;
    page.onConsoleMessage = function(message){
      console.log('CONSOLE:==>',message);
    };

    return page;
};

var createOpen = function(pageCreate,createUrl){
    /*
     * 百度明星简介数据接口
     *
     * STAR_REGION            明星地区，可选的有[内地，香港，台湾，日本，韩国，欧美]
     * STAR_START_INDEX       明星列表的开始开始下标
     * EVERY_PAGE_STAR_NUMBER 每页的返回的数量
     */
    var starApi = 'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?resource_id=28226&from_mid=1&&format=json&ie=utf-8&oe=utf-8&query=%E6%98%8E%E6%98%9F&sort_key=&sort_type=1&stat0=&stat1=STAR_REGION&stat2=&stat3=&pn=STAR_START_INDEX&rn=EVERY_PAGE_STAR_NUMBER';

    var urlCreator = createUrl(starApi);

    return function(region,startIndex,everyNum,openHandler){

        var page = pageCreate(),
            url = urlCreator(region,startIndex,everyNum);

        console.log('open url:',url);

        page.open(url, function (status) {
            openHandler(status, page);
        });
    }
};

var openHandler = function(query,createOpen){
    return function(region,startIndex,everyNum){
        var d = Q.defer();

        createOpen(region,startIndex,everyNum,function(status,page){
            console.log('allStars open status:',status);
            if(status === 'success'){
                var allStars = page.evaluate(query);
                page.close();
                console.log('allStars:0:',allStars);
                d.resolve(allStars);
            }
        });

        return d.promise;
    }
};

var createQuery = function(pageOpen){

    return function(region,startIndex,everyNum){
        var d= Q.defer();

        pageOpen(region,startIndex,everyNum).done(function(allStars){
            console.log('allStars:1:',allStars);
            return new Promise(function(resolve){
                d.resolve(allStars);
            });
        });
        return d.promise;
    }
};

module.exports = function(){

    var queryPage = createQuery(openHandler(query,createOpen(createPage,createUrl)));

    return function(arg){
        var d = Q.defer();
        var region = encodeChinese(arg.region),//‘内地’ ,经过encodeURIComponent
            startIndex = arg.startIndex || 0,
            everyNum = arg.everyNum || 12;

        queryPage(region, startIndex, everyNum).done(function(allStars){
            d.resolve(allStars);
        });
        return d.promise;
    }
};