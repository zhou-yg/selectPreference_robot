/**
 * Created by zyg on 15/10/2.
 */
var Q = require('q');
var before = require('./before');

var querySummaryPic = function () {
    var selector = '.summary-pic img',   //词条的主图
        posterSelector = '.lemmaWgt-posterBg', //词条的海报背景
        result = null;

    var mainImg = document.querySelector(selector);
    if(mainImg){
        result = {
            summaryPic:mainImg.src
        }
    }else{
        var poster = document.querySelector(posterSelector);
        poster = getComputedStyle(poster).backgroundImage;
        poster = poster.substr(4,poster.length-4-1);

        if(poster){
            result = {
                summaryPic:poster
            }
        }
    }
    return result;
};

module.exports = function (allStars,stTime,callback) {
    var allStarsWithSummary = [];
    var urlIterator = before.createIterator(allStars,function(obj){
        return [obj.url,obj]
    });

    urlIterator(-1,function(i,url,starObj){
        console.log('url:',i,'=>',url);
        var d = Q.defer();

        //链接不为空，则爬。否则结束
        if(url){
            before.openCreator(url,querySummaryPic).done(function(resultObj){
                if(resultObj){
                    starObj.summaryPic = resultObj.summaryPic;

                    console.log('summaryPic:',resultObj.summaryPic);
                    console.log('starObj:',JSON.stringify(starObj,null,2));

                    allStarsWithSummary.push(starObj);
                    callback(allStarsWithSummary);

                    console.log('==== 爬取第<'+i+'>个star 累计耗时 ',(+new Date() - stTime)/1000,' 秒 ====');
                }
                d.resolve();
            });
        }else{
            callback(allStarsWithSummary,true);
        }
        return d.promise;
    });
};