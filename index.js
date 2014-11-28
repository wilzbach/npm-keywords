var registry = require("npm-registry");
var q = require('bluebird');

var workmen = function(keywords,npm){
  if(this.constructor != workmen){
    return new workmen(keywords);
  }
  if(npm == undefined){
    npm = new registry();
  }
  this.keywords = keywords;
  self = this;
  return load(npm,keywords);
}

// downloads all packages found for the defined keywords
function load(npm,keywords){
  pkgs = [];

  function downloadKeys(keyword){
    return new q.Promise(function(resolve,reject){
      npm.packages.keyword(keyword, function(err, packages){
        if(err == undefined){
          for(var i in packages){
            // filter duplicates
            if(pkgs.indexOf(packages[i]) < 0){
              pkgs.push(packages[i]);
            }
          }
        }else{
          reject(err);
        }
        resolve(packages);
      });
    });
  }

  var ps = [];
  for(var index in keywords){
    ps.push(downloadKeys(keywords[index]));
  }

  // wait until all keywords are downloaded
  return q.all(ps).then(function(){
    return pkgs;
  });
}

module.exports = workmen;
