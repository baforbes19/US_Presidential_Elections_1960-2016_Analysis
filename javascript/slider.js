//creates the slider
//no functionality with map in this file

var sliderValue = 1960;
var sliderFormat = d3.format('.0f');
var yearSlider = d3.slider().min(1960).max(2016).tickFormat(sliderFormat).value(sliderValue)
    .tickValues([1960,1964,1968,1972,1976,1980,1984,1988,1992,1996,2000,2004,2008,2012,2016])
    .stepValues([1960,1964,1968,1972,1976,1980,1984,1988,1992,1996,2000,2004,2008,2012,2016])

d3.select('#sliderBox').call(yearSlider);
