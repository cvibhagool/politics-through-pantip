app.directive('postsMultiple', function(){
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

    var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.date_time);})
      .y(function(d) { return y(d.posts_count);});

    var line2 = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x2(d.date_time);})
      .y(function(d) { return y2(d.posts_count);});

    var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

    var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lineG = focus.selectAll(".series");

    var xAxisG = focus.append("g")
        .attr("class", "x axis");

    var yAxisG = focus.append("g")
        .attr("class", "y axis");

    var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var line2G = context.selectAll(".series");

    var xAxis2G = context.append("g")
        .attr("class", "x axis");

    var clip = svg.append("defs").append("clipPath")
      .attr("id", "clip-m")
      .append("rect");

    var rect = context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect");

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

      //Update range
      x.range([0, width]);
      x2.range([0, width]);
      y.range([height, 0]);
      y2.range([height2, 0]);

      update();
    }

    scope.$watch('data', update);

    function update(){
      var color = d3.scale.category10();

      if(!scope.data){ return;}

      if (data.type === 'absolute'){
        format = d3.format(",.0f");
      } else {
        format = d3.format(".0%");
      }

      yAxis.tickFormat(format);

      var series = scope.data.series;
      //Update domain
      var firstSeries = series[0];

      x.domain(d3.extent(firstSeries.posts.map(function(d) { return d.date_time; })));
      y.domain([d3.min(series, function(s) { return d3.min(s.posts, function(p) { return p.posts_count;});} ), 
               d3.max(series, function(s) { return d3.max(s.posts, function(p) { return p.posts_count;});} )]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      //Clean up old data
      svg.selectAll('.series').remove();

      var seriesLine = lineG
          .data(series)
        .enter().append("g")
          .attr("class", "series");

      seriesLine.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.posts); })
        .style("stroke", function(d) { return color(d.keyword); });

      var seriesLine2 = line2G
          .data(series)
        .enter().append("g")
          .attr("class", "series");

      seriesLine2.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line2(d.posts); })
        .style("stroke", function(d) { return color(d.keyword); });

      rect.attr("y", -6)
        .attr("height", height2 + 7);

      //Redraw axis
      xAxisG
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      yAxisG.call(yAxis);
      xAxis2G       
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

      var legend = focus.selectAll(".legend");
      legend.remove();

      legend = focus.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "13px")
        .text(function(d) { return d;});

      svg.select(".title").remove();
      svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px")
        .text("Proportion of Posts");
    }

    function brushed() {
      //Update the scale of x
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      //Update the area graph
      focus.selectAll(".line").attr("d", function(d) { return line(d.posts); });
      //Update the x axis
      focus.select(".x.axis").call(xAxis);
    }

  }
  return {
    link: link,
    restrict: 'E',
    scope: { data: '=', curSpike: '='}
  };
});