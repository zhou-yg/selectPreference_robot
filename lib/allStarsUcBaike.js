var Q = require('q');
var before = require('./before');

var querySummaryPic = function () {
    var selector = '#sc_baike_person_1_1 > a .img',   //词条的主图
        result = null;

    var reg = /url\(([\S]+)\)/;

    var mainImg = document.querySelector(selector);
    if(mainImg){
        var imgUrl = mainImg.style.background.match(reg);
        if(imgUrl){
            result = {
                ucPic:imgUrl[1]
            }
        }
    }
    return result;
};

var urlCreator = function(name){
    return 'http://m.sm.cn/s?q='+encodeURIComponent(name);
};

module.exports = function (allStars,stTime,callback) {
    var allStarsWidthUcPic = [];
    var urlIterator = before.createIterator(allStars,function(obj){
        return [obj.name,obj]
    });

    urlIterator(-1,function(i,name,starObj){
        console.log('name:',i,'=>',name);
        var d = Q.defer();

        //链接不为空，则爬。否则结束
        if(name){
            before.openCreator(urlCreator(name),querySummaryPic).done(function(resultObj){
                if(resultObj){
                    starObj.ucPic = resultObj.ucPic;

                    console.log('summaryPic:',resultObj.ucPic);
                    console.log('starObj:',JSON.stringify(starObj,null,2));

                    allStarsWidthUcPic.push(starObj);
                    callback(allStarsWidthUcPic);

                    console.log('==== 爬取第<'+i+'>个 UC主图 累计耗时 ',(+new Date() - stTime)/1000,' 秒 ====');
                }
                d.resolve();
            });
        }else{
            callback(allStarsWidthUcPic,true);
        }
        return d.promise;
    });
};