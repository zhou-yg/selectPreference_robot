var Promise = require('promise');
var Q = require('q');
var fs = require('fs');

var allStars = require('./lib/allStars');

var allStarsMain = allStars();

var allStarsArr = [];

var oneNum = 20;

var saveFile = './data/allStars.json';

for(var i=0;i<2;i++){
    allStarsMain({
        startIndex:oneNum*i,
        everyNum:oneNum
    }).done(function(allStars){
        try{
            allStarsArr = allStarsArr.concat(allStars);
            console.log('allStars:out:',allStars.length);

            fs.write(saveFile,JSON.stringify(allStarsArr,null,2),'w');

        }catch (e){
            console.log(e);
        }
    });
}
