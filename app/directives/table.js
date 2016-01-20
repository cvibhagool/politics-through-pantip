app.directive('topTable', ['postService',function(postService){

  function link(scope, el, attr){

    scope.$watchGroup(['startDate','endDate', 'sortBy'], function(){
      if (scope.startDate !== undefined && scope.endDate !== undefined && scope.sortBy !== undefined){
        var startDate = scope.startDate.toISOString();
        var endDate = scope.endDate.toISOString();
        var keywordsStr = scope.keywords.join(',');
        var sortBy = scope.sortBy;
        scope.loading = true;
        postService.getTopPosts(keywordsStr, startDate, endDate, sortBy, function(data){
          scope.topPosts = data.posts;
          scope.loading = false;
        });
      }
    });
    
    scope.sortBy = 'comment_count';
    scope.loading = true;
  }

  return {
    link: link,
    restrict: 'E',
    scope: {startDate: '=', endDate: '=', keywords: '='},
    templateUrl: 'app/templates/topTable.html'
  };
}]);