app.directive('news', ['$location', function($location){
  var curUrl = $location.absUrl();
  var templateUrl;

  if (curUrl.indexOf('localhost') > -1){
    templateUrl = 'app/templates/_news.html';
  } else {
    templateUrl = 'politics-through-pantip/app/templates/_news.html';
  }
  console.log(curUrl);
  console.log(templateUrl);

  function link(scope, el, attr){
    el = el[0];
    scope.newsItems = [];

    scope.$watch('keywords', function(){
      if (!scope.data){return;}
      scope.newsItems = scope.data.series[0].spikes[0].news;
    });

    scope.$watch('curSpike', function(){
      if (!scope.curSpike){return;}
      for (var i = 0; i < scope.data.series[0].spikes.length; i++){
        if (scope.data.series[0].spikes[i].date_time === scope.curSpike){
          scope.newsItems = scope.data.series[0].spikes[i].news;
        }
      }
    },true);
  }


  return {
    link: link,
    restrict: 'E',
    scope: { data: '=', curSpike: '='},
    templateUrl: templateUrl
  };
}]);