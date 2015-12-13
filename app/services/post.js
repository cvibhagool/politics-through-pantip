app.factory('postService', ['$http', function($http) {

  var cleanData = function(data){
    var series = data.series;
    var curSeries;
    var curDateTime;

    //For each data series
    for (var i = 0; i < series.length;i++){
      //Clean posts data
      curSeries = series[i];

      for (var j = 0; j < curSeries.posts.length; j++){
        //Get date time of current post
        curDateTime = curSeries.posts[j].date_time;
        //Turn it into date object
        if (!(curDateTime instanceof Date)){
          curSeries.posts[j].date_time = new Date(parseInt(curDateTime));
        }
      }

      for (var k = 0; k < curSeries.spikes.length; k++){
        //Get date time of current spike
        curDateTime = curSeries.spikes[k].date_time;
        //Turn it into date object
        if (!(curDateTime instanceof Date)){
          curSeries.spikes[k].date_time = new Date(parseInt(curDateTime));
        }
      }
    }
    
    return data;
  };

  var getPosts = function(keywords, callback){
    var key_list = keywords.sort();
    var key = key_list.toString();
    if (clientCache[key]){
      rawData = clientCache[key];
      data = cleanData(rawData);
      callback(data);
    }
    else{
      var apiRoot = 'http://localhost:5000/';
      var keywordsStr = keywords.join(',');
      var requestUrl = apiRoot + 'pantip?keyword=' + keywordsStr;
      $http.get(requestUrl).
        success(function(rawData, status, headers, config) {
          clientCache[key] = rawData;
          data = cleanData(rawData);
          callback(data);
        });
      }
    };
  return {getPosts : getPosts};
  
}]);