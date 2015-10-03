var fs = require('fs');

var oneNum = 70;

var queryBasicFn = require('./queryBasic');
var queryBaiduBaikeFn = require('./queryBaiduBaikeFn');
var queryUcBaikeFn = require('./queryUcBaikeFn');

queryBasicFn([],oneNum,0,function(allStarsArr){
    queryBaiduBaikeFn(allStarsArr,function(allStarsArr){
       queryUcBaikeFn(allStarsArr,function(){
           phantom.exit();
       })
    });
});