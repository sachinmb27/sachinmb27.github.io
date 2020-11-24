function changeGender(str){
  d3.select( '#vis_1' ).selectAll('*').remove();
if (str == 'Men'){
  function parseRow ( d ) {
    stateDataMap[d._id] = +d.Employment_increase_men;
    maxData = Math.max(Math.abs(+d.Employment_increase_men), maxData);
    return { 'state': d._id,
           'code': d._id,
           'employment_increase': +d.Employment_increase_men,
 };
}}
else if (str == 'Women'){
  function parseRow ( d ) {
    stateDataMap[d._id] = +d.Employment_increase_women;
    maxData = Math.max(Math.abs(+d.Employment_increase_women), maxData);
    return { 'state': d._id,
           'code': d._id,
           'employment_increase': +d.Employment_increase_women,
 };
}
}
else {
  function parseRow ( d ) {
    stateDataMap[d._id] = +d.Employment_increase;
    maxData = Math.max(Math.abs(+d.Employment_increase), maxData);
    return { 'state': d._id,
           'code': d._id,
           'employment_increase': +d.Employment_increase,
 };
}
}


var gridmap = {};
var stateDataMap = {};
var maxData = 0.000001;

d3.csv( 'map.csv',
    d => ({ code: d.code, x: +d.x, y: +d.y }),
    m => {
      gridmap = d3.map( m, d => d.code );
      d3.csv( 'employment.csv', parseRow, ready );
    });

function parseRow ( d ) {
    stateDataMap[d._id] = +d.Employment_increase;
    maxData = Math.max(Math.abs(+d.Employment_increase), maxData);
    return { 'state': d._id,
           'code': d._id,
           'employment_increase': +d.Employment_increase,
 };
}

function ready ( data ) {

  data = data.filter(d => gridmap.has( d.code ));

  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      html = document.documentElement,
      width = html.clientWidth*0.7 - margin.left - margin.right,
      height = html.clientHeight*0.7 - margin.top - margin.bottom,

      ry = d3.scale.ordinal()
          .domain( gridmap.values().map( d => d.y ).sort( d3.ascending ) )
          .rangeBands([ 0, height ], 0.07),
      rx = d3.scale.ordinal()
          .domain( gridmap.values().map( d => d.x ).sort( d3.ascending ) )
          .rangeBands([ 0, width ], 0.05),

      y = d3.scale.linear()
          .domain([ 0, d3.max( data, d => d.employment_increase ) ])
          .range([ ry.rangeBand(), 0 ])
      x = d3.scale.linear()
          .domain( [0, d3.max( data, d => d.employment_increase )] )
          .range([ 0, rx.rangeBand() ]);

  var countries = d3.nest()
      .key( d => d.code )
      .entries( data )
      .map( d => {
        var pos = gridmap.get( d.key );
        d.title = d.values[0].state;
        d.x = pos.x;
        d.y = pos.y;
        return d;
      })
      .filter( Boolean );

  var svg = d3.select( '#vis_1' ).append( 'svg' )
      .attr( 'width', width + margin.left + margin.right )
      .attr( 'height', height + margin.top + margin.bottom )
    .append( 'g' )
      .attr( 'transform', `translate(${[ margin.left, margin.top ]})` );

  var country = svg.selectAll( 'g' ).data( countries ).enter()
    .append( 'g' )
      .attr( 'transform', d => `translate(${[ rx( d.x ), ry( d.y ) ]})` )

    country.append( 'rect' )
      .attr( 'width', rx.rangeBand() )
      .attr( 'height', ry.rangeBand() )
      .style( 'stroke', 'none' )
      .style( 'fill', function(d) {
          if (stateDataMap[d.key] > 0){
              return '#91cf60'
          }
          return '#fc8d59'
      } );

  country.append( 'rect' )
      .attr( 'width', rx.rangeBand() )
      .attr( 'height', function(d) {
          var val = Math.abs(stateDataMap[d.key])
          return ry.rangeBand() * (1 - val/maxData);
        }
        )
      .style( 'stroke', 'none' )
      .style( 'fill', '#d8d8d8' );

  country.append( 'text' )
      .attr( 'class', 'country' )
      .attr( 'x', 4 )
      .attr( 'y', 0 )
      .attr( 'dx', 0 )
      .attr( 'dy', '1em' )
      .style( 'fill', 'rgba(0,0,0,.75)' )
      .text( d => (d.title || d.key) + ' (' + stateDataMap[d.key] + ' % )');
      svg.append("circle").attr("cx",800).attr("cy",430).attr("r", 8).style("fill", "#91cf60")
      svg.append("circle").attr("cx",800).attr("cy",460).attr("r", 8).style("fill", "#fc8d59")
      svg.append("text").attr("x", 820).attr("y", 435).text("Increase").style("font-size", "12px").style("fill", "#d8d8d8")
      svg.append("text").attr("x", 820).attr("y", 465).text("Decrease").style("font-size", "12px").style("fill", "#d8d8d8")
}}
