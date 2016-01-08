app.directive('topTable', ['postService',function(postService){

  function link(scope, el, attr){
    scope.$watchGroup(['startDate','endDate'], function(){
      if (scope.startDate !== undefined && scope.endDate !== undefined){
        console.log("getting new top");
        var startDate = scope.startDate.toISOString();
        var endDate = scope.endDate.toISOString();
        postService.getTopPosts('_all', startDate, endDate, 'comment_count', function(data){
          scope.topPosts = data.posts;
          console.log("got new data");
        });
      }
    });
  }

  return {
    link: link,
    restrict: 'E',
    scope: {startDate: '=', endDate: '='},
    templateUrl: 'app/templates/topTable.html'
  };
}]);