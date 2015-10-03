/**
 * Created by zyg on 15/10/3.
 */
var fs = require('fs');
var queryMessageStarsBaike = require('./lib/allStarsBaike');

var stTime = +new Date();
var saveBaikeFile = './data/allBaikeStars__'+stTime+'.json';


module.exports = function(allStarsArr,whenEnd){

    queryMessageStarsBaike(allStarsArr,stTime,function(allStarsArr,isExit){
        console.log('allBaikeStars len:',allStarsArr.length);
        console.log('===== 当前写入 '+allStarsArr.length+' 条百科 ,耗时 ',(+new Date() - stTime)/1000,' 秒  ========');

        fs.write(saveBaikeFile,JSON.stringify(allStarsArr,null,2),'w');

        if(isExit){

            whenEnd(allStarsArr);
        }
    });
};