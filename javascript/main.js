var elections = [];

class year{
  constructor(){
    this.total = 0;
    this.gop = 0;
    this.dem = 0;
  }
}

function poop(){
  return new Promise(function (resolve, reject) {
    d3.tsv("data/elections.tsv", function(data){
      // do shit

      elections = data;
      resolve(elections);
    });


  });
}

poop().then(function (value) {
  if (value == 'poop')
    console.log('Promise was resolved');
});


////////////////////////////////////////////////////////

//maps width and height
var width = 1500,
    height = 960,
    extra = 800;

//creates map of usa
var projection = d3.geo.albersUsa()
    .scale(2000)
    .translate([width / 2, height / 2]);

//creates path generator for map
var path = d3.geo.path()
    .projection(projection);


var counties = d3.set();

var color = d3.scale.ordinal().domain(d3.range(10)).range(["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]),
    selectedColor = 0,
    dragColor;

var components = color.domain().map(function() { return []; });

/////////////////////////////////////////////////////////////


var svg = d3.select("#svg");

var buttonBox0 = d3.select('body').append('div')
    .attr('id', 'all-button-box');


var sliderValue = 1960;

var sliderBox = d3.select('body').append('div').attr('id', 'sliderBox');
var sliderFormat = d3.format('.0f');
var yearSlider = d3.slider().min(1960).max(2016).tickFormat(sliderFormat)
    .tickValues([1960,1964,1968,1972,1976,1980,1984,1988,1992,1996,2000,2004,2008,2012,2016])
    .stepValues([1960,1964,1968,1972,1976,1980,1984,1988,1992,1996,2000,2004,2008,2012,2016])
    .callback(function(){ sliderValue = yearSlider.value(); showSliderValue()});

function showSliderValue(){
   d3.select("#population-box").text(sliderValue);
}
d3.select('#sliderBox').call(yearSlider);


//////////////////////////////////////////////////////////

d3.json("data/us.json", function(error, us) {
  if (error) throw error;

  var bisectId = d3.bisector(function(d) { return d.id; }).left;

  var features = topojson.feature(us, us.objects.counties).features;

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.counties))
      .attr("class", "background")
      .attr("d", path);

  var highlight = svg.append("g")
      .attr("class", "highlight")
    .selectAll("path")
      .data(components)
    .enter().append("path")
      .style("fill", function(d, i) { return color(i); })
      .style("stroke", function(d, i) { return d3.lab(color(i)).darker(); });

  svg.append("g")
      .attr("class", "foreground")
      .style("cursor", "pointer")
      .style("stroke-opacity", .5)
    .selectAll("path")
      .data(features)
    .enter().append("path")
      .attr("d", function(d) { d.color = null; return path(d); })
      .on("mouseover", function() { this.style.stroke = "black"; })
      .on("mouseout", function() { this.style.stroke = "none"; })
      .call(d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", drag));

////////////////////////////////////////////////////////

d3.select("#selectAllButoon").on("click", function(){select_all();});
d3.select("#clearAllButton").on("click", function(){clear_all();});

/////////////////////////////////////////

  redraw();

  function find_color(feature){
    var ratio = NaN;
    var c;
    elections.forEach(function(d){
      if(d.id == feature.id){
        ratio = (parseInt(d.gop_1984) - parseInt(d.dem_1984)) / parseInt(d.total_1984)*100;
      }
    });

    if(ratio == NaN){c = null;}
    else if(ratio > 40){c = 0;}
    else if(ratio > 30){c = 1;}
    else if(ratio > 20){c = 2;}
    else if(ratio > 10){c = 3;}
    else if(ratio > 0){c = 4;}
    else if(ratio > -10){c = 5;}
    else if(ratio > -20){c = 6;}
    else if(ratio > -30){c = 7;}
    else if(ratio > -40){c = 8;}
    else{c = 9;}

    return c;
  }

  function dragstart() {
    var feature = d3.event.sourceEvent.target.__data__;

    selectedColor = find_color(feature);

    if (assign(feature, dragColor = feature.color === selectedColor ? null : selectedColor)) redraw();
  }

  function drag() {
    var feature = d3.event.sourceEvent.target.__data__;
    if(dragColor!==null){dragColor = find_color(feature);}
    if (assign(feature, dragColor)) redraw();
  }

  // function pop_sum(){
  //   var population = 0;
  //   info.forEach(function(d){
  //     if(counties.has(d.id)){
  //       population = population + parseInt(d.pop);
  //     }
  //   });
  //   return population;
  // }



  function assign(feature, color) {
    if (feature.color === null && color === null) return false;
    if (feature.color !== null && color !== null) return false;
    if (feature.color !== null) {
      var component = components[feature.color];
      component.splice(bisectId(component, feature.id), 1);
      feature.color = null;
      counties.remove(feature.id)
    }
    else if (color !== null) {
      var component = components[color];
      component.splice(bisectId(component, feature.id), 0, feature);
      feature.color = color;
      counties.add(feature.id);
    }

    return true;
  }

  function redraw() {
    var f = d3.format(",");

    highlight.data(components).attr("d", function(d) { return path({type: "FeatureCollection", features: d}) || "M0,0"; });

  }

  function select_all(){

     features.forEach(function(d){
          selectedColor = find_color(d);
          assign(d,selectedColor);
     });
     redraw();
  }

  function clear_all(){
      features.forEach(function(d){
          assign(d,null);
     });
      redraw();
    }
});
