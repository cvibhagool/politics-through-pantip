app.factory('postService', ['$http','$location', function($http,$location) {
  
  //Ghetto way of detecting environment
  var curUrl = $location.absUrl();
  var apiRoot;
  if ((curUrl.indexOf('localhost') > -1) || (curUrl.indexOf('127.0.0.1') > -1)){
    apiRoot = 'http://localhost:5000/';
  } else {
    apiRoot = 'http://openkala.com/';
  }

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

  var cleanTopData = function(data){
    var posts = data.posts;
    var curPosts;
    var curDateTime;

    //For each data series
    for (var i = 0; i < posts.length;i++){
      //Clean posts data
      curPosts = posts[i];

      //Get date time of current post
      curDateTime = curPosts.date_time;
      //Convert the date time
      if (!(curDateTime instanceof Date)){
        curPosts.date_time = new Date(parseInt(curDateTime));
      }
    }

    return data;
  };



  var getPosts = function(keywords, callback){
    var key_list = keywords.slice().sort();
    var key = key_list.toString();
    if (clientCache[key]){
      rawData = clientCache[key];
      data = cleanData(rawData);
      callback(data);
    }
    else{
      var keywordsStr = keywords.join(',');
      var requestUrl = apiRoot + 'pantip/series?keyword=' + keywordsStr;
      $http.get(requestUrl).
        success(function(rawData, status, headers, config) {
          clientCache[key] = rawData;
          data = cleanData(rawData);
          callback(data);
        });
      }
    };

  var getTopPosts = function(keyword, start_date, end_date, order_by, callback){
    var requestUrl = apiRoot + 'pantip/top?start_date=' + start_date + '&end_date=' + end_date + '&keyword=' + keyword;
    $http.get(requestUrl).
      success(function(rawData, status, headers, config) {
        data = cleanTopData(rawData);
        callback(data);
      });
  };
  return {getPosts : getPosts, getTopPosts : getTopPosts};
  
}]);