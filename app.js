var Promise = require('promise');
var Q = require('q');
var fs = require('fs');

var allStars = require('./lib/allStars'),
    queryMessageStarsBaike = require('./lib/allStarsBaike')

var allStarsMain = allStars();

var oneNum = 100;

var saveFile = './data/allStars.json',
    saveBaikeFile = './data/allBaikeStars.json';

//爬百科
var queryBaike = function (allStarsArr) {
    var d = Q.defer();

    queryMessageStarsBaike(allStarsArr,function(allStarsBaikeArr){
        d.resolve(allStarsBaikeArr)
    });

    return d.promise;
};

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

            if(allStars.length>0){
                queryFn(allStarsArr,unitNum,number+1,whenEnd);
            }else{
                whenEnd(allStarsArr);
            }
        }catch (e){
            console.log(e);
        }
    });
};

queryFn([],oneNum,0,function(allStarsArr){
    queryBaike(allStarsArr).done(function(allStarsArr){
        fs.write(saveBaikeFile,JSON.stringify(allStarsArr,null,2),'w');
    });
});