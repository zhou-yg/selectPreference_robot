var Promise = require('promise');
var Q = require('q');
var webpage = require('webpage');



var createUrlIterator = function(allStars){
    var i = 0,
        max = allStars.length-1;

    function fn(time,callback){
        console.log('i:',i);
        var p = callback(allStars[i].url);
        p.done(function(){
            if(i<time){
                i++;
                fn(time,callback);
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

    return function(query){
        var page = createPage();

    }
};

module.exports = function (allStars,callback) {

    var urlIterator = createUrlIterator(allStars);

    urlIterator(10,function(url){
        var d = Q.defer();
        var openCreator = createOpen(createPage);

        return d.promise;
    });
};