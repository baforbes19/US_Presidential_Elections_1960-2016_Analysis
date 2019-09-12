var elections = [];

class year{
  constructor(total, gop, dem){
    this.total = total;
    this.gop = gop;
    this.dem = dem;
  }
}

var counties = d3.map();

function foo(){
  return new Promise(function (resolve, reject) {
    d3.tsv("data/elections.tsv", function(data){

      elections = data;
      elections.forEach(function(d){
        var years = new d3.map();
        years.set(1960, new year(d.total_1960,d.gop_1960,d.dem_1960));
        years.set(1964, new year(d.total_1964,d.gop_1964,d.dem_1964));
        years.set(1968, new year(d.total_1968,d.gop_1968,d.dem_1968));
        years.set(1972, new year(d.total_1972,d.gop_1972,d.dem_1972));
        years.set(1976, new year(d.total_1976,d.gop_1976,d.dem_1976));
        years.set(1980, new year(d.total_1980,d.gop_1980,d.dem_1980));
        years.set(1984, new year(d.total_1984,d.gop_1984,d.dem_1984));
        years.set(1988, new year(d.total_1988,d.gop_1988,d.dem_1988));
        years.set(1992, new year(d.total_1992,d.gop_1992,d.dem_1992));
        years.set(1996, new year(d.total_1996,d.gop_1996,d.dem_1996));
        years.set(2000, new year(d.total_2000,d.gop_2000,d.dem_2000));
        years.set(2004, new year(d.total_2004,d.gop_2004,d.dem_2004));
        years.set(2008, new year(d.total_2008,d.gop_2008,d.dem_2008));
        years.set(2012, new year(d.total_2012,d.gop_2012,d.dem_2012));
        years.set(2016, new year(d.total_2016,d.gop_2016,d.dem_2016));

        counties.set(parseInt(d.id), years);
      });

      resolve(elections);
    });


  });
}

foo().then(function (value) {
  if (value == 'foo')
    console.log('Promise was resolved');
});
