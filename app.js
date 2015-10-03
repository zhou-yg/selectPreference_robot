var fs = require('fs');

var oneNum = 70;

var queryBasicFn = require('./queryBasic');
var queryBaiduBaikeFn = require('./queryBaiduBaike');
var queryUcBaikeFn = require('./queryUcBaike');

function uc(){
    var allStarsArr = JSON.parse(fs.read('./data/allBaikeStars.json'));
    queryUcBaikeFn(allStarsArr,function(){
        phantom.exit();
    })
}
function totalProgress(){
    queryBasicFn([],oneNum,0,function(allStarsArr){
        queryBaiduBaikeFn(allStarsArr,function(allStarsArr){
            queryUcBaikeFn(allStarsArr,function(){
                phantom.exit();
            })
        });
    });
}

uc();