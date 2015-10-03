var Promise = require('promise');
var Q = require('q');
var fs = require('fs');

var allStars = require('./lib/allStars'),
    queryMessageStarsBaike = require('./lib/allStarsBaike'),
    queryUcBaike = require('./lib/allStarsUcBaike');

var stTime = +new Date();

var allStarsMain = allStars();

var oneNum = 70;

var saveFile = './data/allStars__'+stTime+'.json',
    saveBaikeFile = './data/allBaikeStars__'+stTime+'.json',
    saveUcBaikeFile = './data/allUcBaikeStars__'+stTime+'.json';

//递归的爬
var queryFn = function(allStarsArr,unitNum,number,whenEnd){
    if(!number){
        number = 0;
    }
    allStarsMain({
        startIndex:unitNum*number,
        everyNum:unitNum
    }).done(function(allStars){
        try{
            allStarsArr = allStarsArr.concat(allStars);
            console.log('allStars:out:',allStars.length);

            fs.write(saveFile,JSON.stringify(allStarsArr,null,2),'w');

            if(allStars && allStars.length>0){
                queryFn(allStarsArr,unitNum,number+1,whenEnd);
            }else{
                console.log('===== 爬取接口完成,耗时 ',(+new Date() - stTime)/1000,' 秒  ========');
                whenEnd(allStarsArr);
            }
        }catch (e){
            console.log(e);
        }
    });
};

queryFn([],oneNum,0,function(allStarsArr){

    queryMessageStarsBaike(allStarsArr,stTime,function(allStarsArr,isExit){
        console.log('allBaikeStars len:',allStarsArr.length);
        console.log('===== 当前写入 '+allStarsArr.length+' 条百科 ,耗时 ',(+new Date() - stTime)/1000,' 秒  ========');

        fs.write(saveBaikeFile,JSON.stringify(allStarsArr,null,2),'w');

        if(isExit){

            queryUcBaikeFn(allStarsArr);
        }
    });
});

var queryUcBaikeFn = function(allStarsArr){

    queryUcBaike(allStarsArr,stTime,function(allStarsArr,isExit){

        console.log('UC Baike len:',allStarsArr.length);
        console.log('===== 当前写入 '+allStarsArr.length+' 条 UC ,耗时 ',(+new Date() - stTime)/1000,' 秒  ========');

        fs.write(saveUcBaikeFile,JSON.stringify(allStarsArr,null,2),'w');

        if(isExit){
            phantom.exit();
        }
    });
}