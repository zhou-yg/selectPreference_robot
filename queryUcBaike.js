/**
 * Created by zyg on 15/10/3.
 */
var fs = require('fs');

var stTime = +new Date();

var queryUcBaike = require('./lib/allStarsUcBaike');
var saveUcBaikeFile = './data/allUcBaikeStars__'+stTime+'.json';

module.exports = function(allStarsArr,whenEnd){

    queryUcBaike(allStarsArr,stTime,function(allStarsArr,isExit){

        console.log('UC Baike len:',allStarsArr.length);
        console.log('===== 当前写入 '+allStarsArr.length+' 条 UC ,耗时 ',(+new Date() - stTime)/1000,' 秒  ========');

        fs.write(saveUcBaikeFile,JSON.stringify(allStarsArr,null,2),'w');

        if(isExit){
            whenEnd(allStarsArr)
        }
    });
};