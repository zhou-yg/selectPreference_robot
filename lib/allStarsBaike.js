var Promise = require('promise');
var Q = require('q');
var webpage = require('webpage');

var querySummaryPic = function () {
    var selector = '.summary-pic img',
        result = null;

    var mainImg = document.querySelector(selector);
    if(mainImg){
        result = {
            summaryPic:mainImg.src
        }
    }
    return result;
};

var createUrlIterator = function(allStars){
    var i = 0,
        max = allStars.length-1;

    function fn(time,callback){
        console.log('i:',i);
        console.log('starObj:',JSON.stringify(allStars[i],null,2));
        var p = callback(i,allStars[i].url,allStars[i]);
        p.done(function(){
            if(i<time){
                fn(time,callback);
                i++;
            }else{
                callback(null);
            }
        });
    }

    return function(time,callback){
        time = parseInt(time);
        if(time < 1){
            time = max;
        }else{
            time += i;
        }

        fn(time,callback);
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

var createOpen = function(createPage){

    return function(url,query){
        var d = Q.defer();
        var page = createPage();

        page.open(url,function(status){

            var queryResult = page.evaluate(query);
            page.close();
            d.resolve(queryResult);
        });

        return d.promise;
    }
};

module.exports = function (allStars,callback) {
    console.log(JSON.stringify(allStars,null,2));

    var allStarsWithSummary = [];
    var urlIterator = createUrlIterator(allStars);

    urlIterator(10,function(i,url,starObj){
        console.log('url:',i,'=>',url);
        var d = Q.defer();
        var openCreator = createOpen(createPage);

        //链接不为空，则爬。否则结束
        if(url){
            openCreator(url,querySummaryPic).done(function(resultObj){
                if(resultObj){
                    starObj.summaryPic = resultObj.summaryPic;
                    console.log('summaryPic:',resultObj.summaryPic);
                    console.log('starObj:',JSON.stringify(starObj,null,2));
                    allStarsWithSummary.push(starObj);
                }
                d.resolve();
            });
        }else{
            callback(allStarsWithSummary);
        }
        return d.promise;
    });
};