/**
 * Created by zyg on 15/10/3.
 */
var fs = require('fs');
var allStars = require('./lib/allStars')

var stTime = +new Date();
var saveFile = './data/allStars__'+stTime+'.json';

var allStarsMain = allStars();

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
            console.log(e,number);
        }
    });
};


module.exports = queryFn;