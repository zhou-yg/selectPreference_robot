/**
 * Created by zyg on 15/10/2.
 */
var Q = require('q');
var webpage = require('webpage');

var createPage = function(){

    var page = webpage.create();
    page.settings.resourceTimeout = 10000;
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

var createIterator = function(allStars,getProperties){
    var i = 0,
        max = allStars.length-1;

    function fn(time,callback){

        console.log('starObj:',JSON.stringify(allStars[i],null,2));

        var args = [i],
            properties = getProperties(allStars[i]);

        if(!Array.isArray(properties)){
            properties = [properties]
        }

        var p = callback.apply(null,args.concat(properties));
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

module.exports = {
    createIterator:createIterator,
    openCreator:createOpen(createPage)
};