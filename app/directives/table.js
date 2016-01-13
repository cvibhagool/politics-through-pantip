app.directive('topTable', ['postService',function(postService){

  function link(scope, el, attr){
    scope.$watchGroup(['startDate','endDate'], function(){
      if (scope.startDate !== undefined && scope.endDate !== undefined){
        var startDate = scope.startDate.toISOString();
        var endDate = scope.endDate.toISOString();
        var keywordsStr = scope.keywords.join(',');
        console.log("Requesting " + keywordsStr);
        postService.getTopPosts(keywordsStr, startDate, endDate, 'comment_count', function(data){
          scope.topPosts = data.posts;
          console.log("got new data");
        });
      }
    });
  }

  return {
    link: link,
    restrict: 'E',
    scope: {startDate: '=', endDate: '=', keywords: '='},
    templateUrl: 'app/templates/topTable.html'
  };
}]);