app.directive('postsSingle', function(){
  function link(scope, el, attr){
    el = el[0];
    var margin = {top: 50, right: 10, bottom: 100, left: 40},
      margin2 = {top: 320, right: 10, bottom: 20, left: 40};

    var width, height, height2, cW, cH;

    var svg = d3.select(el).append('svg');

    var x = d3.time.scale(),
        x2 = d3.time.scale(),
        y = d3.scale.linear(),
        y2 = d3.scale.linear();

    var format;

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");

    var area = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x(d.date_time);})
      .y1(function(d) { return y(d.posts_count); });

    var area2 = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x2(d.date_time); })
      .y1(function(d) { return y2(d.posts_count); });

    var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

    var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var areaG = focus.append("path");

    var xAxisG = focus.append("g")
        .attr("class", "x axis");

    var yAxisG = focus.append("g")
        .attr("class", "y axis");

    var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var area2G = context.append("path");

    var xAxis2G = context.append("g")
        .attr("class", "x axis");

    var clip = svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect");

    var rect = context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect");

    var eventMarkersArea = focus.append("g")
      .attr("class", "eventMarkersArea");

    scope.$watch(function(){ 
      cH = el.clientHeight;
      cW = el.clientWidth;

      width = cW - margin.left - margin.right;
      height = cH - margin.top - margin.bottom;
      height2 = cH - margin2.top - margin2.bottom;

      return cW + cH;
    }, resize);

    function resize(){
      //Resize SVG element
      svg
        .attr("width", cW)
        .attr("height", cH);

      clip
        .attr("width", width)
        .attr("height", height);
        
      //Resize area charts
      area.y0(height);
      area2.y0(height2);

      //Update range
      x.range([0, width]);
      x2.range([0, width]);
      y.range([height, 0]);
      y2.range([height2, 0]);

      update();
    }

    scope.$watch('data', update);

    function update(){
      if(!scope.data){ return;}

      if (data.type === 'absolute'){
        format = d3.format(",.0f");
      } else {
        format = d3.format(".0%");
      }

      yAxis.tickFormat(format);

      var keyword = scope.data.series[0].keyword;
      var posts = scope.data.series[0].posts;
      var spikes = scope.data.series[0].spikes;

      //Update domain
      x.domain(d3.extent(posts.map(function(d) { return d.date_time; })));
      y.domain([0, d3.max(posts.map(function(d) { return d.posts_count; }))]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      //Add data to to focus area
      areaG.datum(posts)
        .attr("class", "area")
        .attr("d", area);

      //Add data to context area
      area2G.datum(posts)
        .attr("class", "area")
        .attr("d", area2);

      rect.attr("y", -6)
        .attr("height", height2 + 7);

      //Update markers
      updateMarkers();

      //Redraw axis
      xAxisG
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      yAxisG.call(yAxis);
      xAxis2G       
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

      var title;

      if (keyword === '_all'){
        title = 'Number of Total Posts Per Day';
      } else {
        title = 'Proportion of Posts with' + ' "'+ keyword + '" ' + 'Per Day';
      }

      svg.select(".title").remove();
      svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px")
        .text(title);
    }

    function updateMarkers(){
      if(!scope.data){ return;}
      var spikes = scope.data.series[0].spikes;
      //Select all existing makers
      var eventMarkers = eventMarkersArea.selectAll('.event-marker');
      //Remove them from svg
      eventMarkers.remove();
      //Add data to empty selection of markers
      eventMarkers = eventMarkersArea.selectAll('.event-marker');
      eventMarkers = eventMarkers.data(spikes);

      eventMarkers.enter().append("g")
        .attr("class", "event-marker")
        .on("mouseover", function(d){
          scope.curSpike = d.date_time;
          scope.$apply();
        });

      //Draw the event markers
      eventMarkers.append('line')
        .attr("x1", function(d) { return x(d.date_time); })  
        .attr("x2", function(d) { return x(d.date_time); })        
        .attr("y1", function(d) { return y(d.posts_count); })
        .attr("y2", function(d) { return 0 + y(d.posts_count) - 20; })     
        .attr("stroke-width", 1.5)
        .style("stroke-dasharray", ("3, 3"))
        .style("stroke", "red")
        .style("fill", "none");

      //Add red circle
      eventMarkers.append('circle')
        .attr("r", 3)
        .attr("cx", function(d) { return x(d.date_time); }) 
        .attr("cy", function(d) { return 0 + y(d.posts_count) - 20; }) 
        .style("fill", "red");
    }

    function brushed() {
      //Update the scale of x
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      //Update the area graph
      focus.select(".area").attr("d", area);
      //Update the x axis
      focus.select(".x.axis").call(xAxis);

      updateMarkers();
    }

  }
  return {
    link: link,
    restrict: 'E',
    scope: { data: '=', curSpike: '='}
  };
});