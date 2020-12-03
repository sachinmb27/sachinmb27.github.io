mapEle=[]
$("select").change(function(){
	$("#loading").css("display","flex");
	$("#loading").css("background-color","rgb(0,0,0,0.6)");
	load(150);
	createMap($("#category").val(),$("#gender").val());
	stateVars=[];
	createTimeline("","",$("#category").val(),$("#gender").val(),1);
	drawChart("all");
})

var facts={};
function sentenceFact(key){
	ret="";
	if(key.includes("employment")){
		ret+="Employment "
	}else if(key.includes("prod")){
		ret+="Productivity "
	}else if(key.includes("job")){
		ret+="Job Change "
	}
	
	if(key.includes("_women")){
		ret+="for females "
	}else if(key.includes("_men")){
		ret+="for males "
	} else if(key.includes("_other")){
		ret+="for other genders "
	}
	ret+="was affected the most in this state.";
	return ret;
}
function createMap(category, gender){
	 resetCategoryVars();
	d3.select( '#vis_1' ).selectAll('*').remove();
	for(var i=0;i<categoryVariableName.length;i++){
		if(gender=='male'){
			categoryVariableName[i]+="_men"
		}else if(gender=='female'){
			categoryVariableName[i]+="_women"
		}else if(gender=='other'){
			categoryVariableName[i]+="_other"
		}	
	}
	function parseRow(d){
		var focusVar="";
		if(category=="all"){
			focusVar=categoryVariableName[categoryVariableName.length-1];
		}
		else{
			var x=0
			for(x=0;x<categories.length;x++){
				if(categories[x].toLowerCase()==category){
					break;
				}
			}
			focusVar=categoryVariableName[x];
		} 
			
		stateDataMap[d['_id.state']] = +d[focusVar];
		maxData = Math.max(Math.abs(+d[focusVar]), maxData);
		return { 'state': d['_id.state'],
			   'value': +d[focusVar],
		};
	}

	var gridmap = {};
	var stateDataMap = {};
	var maxData = 0.000001;

	d3.csv( 'map.csv',
		d => ({ code: d.code, x: +d.x, y: +d.y }),
		m => {
		  gridmap = d3.map( m, d => d.code );
		  d3.csv( 'overall_state.csv', parseRow, ready );
		}
	);


	function ready ( data ) {
		data = data.filter(d => gridmap.has( d.state ));

		var margin = { top: 10, right: 10, bottom: 10, left: 10 },
			html = document.documentElement,
			width = $("#Interestingfacts_container").width() - margin.left - margin.right,
			height = $("#Interestingfacts_container").height() - margin.top - margin.bottom,

		ry = d3.scale.ordinal()
			.domain( gridmap.values().map( d => d.y ).sort( d3.ascending ) )
			.rangeBands([ 0, height ], 0.07),
		rx = d3.scale.ordinal()
			.domain( gridmap.values().map( d => d.x ).sort( d3.ascending ) )
			.rangeBands([ 0, width ], 0.05),
		y = d3.scale.linear()
			.domain([ 0, d3.max( data, d => d["value"] ) ])
			.range([ ry.rangeBand(), 0 ])
		x = d3.scale.linear()
			.domain( [0, d3.max( data, d => d["value"] )] )
			.range([ 0, rx.rangeBand() ]);

		var countries = d3.nest()
			.key( d => d.state )
			.entries( data )
			.map( d => {
				var pos = gridmap.get( d.key );
				d.title = d.values[0].state;
				d.x = pos.x;
				d.y = pos.y;
				return d;
			})
			.filter( Boolean );
		var div = d3.select("#Interestingfacts_container").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0);
		var svg = d3.select( '#vis_1' ).append( 'svg' )
			.attr( 'width', width + margin.left + margin.right )
			.attr( 'height', height + margin.top + margin.bottom )
			.append( 'g' )
			.attr( 'transform', `translate(${[ margin.left, margin.top ]})` );

		var country = svg.selectAll( 'g' ).data( countries ).enter()
			.append( 'g' )
			.attr( 'transform', d => `translate(${[ rx( d.x ), ry( d.y ) ]})` )
			.on("mouseover", function(d) {
				txt=`<div class='row'>
				<div class='col-12 tooltiptxt'>`+(facts[d.key]?sentenceFact(facts[d.key]):"No valuable information here.")+`</div>
				</div>`
				div.transition()		
					.duration(100)		
					.style("opacity", 0.9);		
				div.html(txt)	
					.style("left", (d3.event.pageX*.8) + "px")		
					.style("top", (d3.event.pageY-20) + "px");	
            })					
			.on("mouseout", function(d) {
				div.transition()		
					.duration(500)		
					.style("opacity", 0);	
			})
			.on('click', function(d, i) {
				$(this).find("rect").first().attr("stroke",colorList[4])
				$(this).find("rect").first().attr("stroke-width","4")
				$(this).find("rect").first().attr("class","perimeter")
				
				if(stateVars[0]==""){
					stateVars[0]=d['key']
					mapEle[0]=this;
				}
				else if(stateVars[1]==""){
					stateVars[1]=stateVars[0]
					stateVars[0]=d['key']

					mapEle[1]=mapEle[0];
					mapEle[0]=this;
				}
				else{
					if(d['key']!=stateVars[1] && stateVars[0]!=stateVars[1]){
						$(mapEle[1]).find("rect").first().attr("stroke","none")
						$(mapEle[1]).find("rect").first().attr("stroke-width","0")
						$(mapEle[1]).find("rect").first().attr("class","")
					}
					stateVars[1]=stateVars[0];
					stateVars[0]=d['key']
					
					mapEle[1]=mapEle[0];
					mapEle[0]=this;
				}				
				$("#loading").css("display","flex");
				$("#loading").css("background-color","rgb(0,0,0,0.6)");
				load(150);
				createTimeline(stateVars[0],stateVars[1],$("#category").val(),$("#gender").val(),0);
				drawChart(stateVars[0], stateVars[1]);
			});

		country.append( 'rect' )
			.attr( 'width', rx.rangeBand() )
			.attr( 'height', ry.rangeBand() )
			.style( 'fill', function(d) {
			  if (stateDataMap[d.key] > 0){
				  return colorList[0]
			  }
			  return colorList[1]
			});

		country.append( 'rect' )
			.attr( 'width', rx.rangeBand() )
			.attr( 'height', function(d) {
				  var val = Math.abs(stateDataMap[d.key])
				  return ry.rangeBand() * (1 - val/maxData);
				}
			)
			.style( 'stroke', 'none' )
			.style( 'fill', '#d8d8d8' )
			

		country.append( 'text' )
			.attr( 'class', 'country' )
			.attr( 'x', 4 )
			.attr( 'y', 0 )
			.attr( 'dx', 0 )
			.attr( 'dy', '1em' )
			.style( 'fill', 'rgba(0,0,0,.75)' )
			.text( d => (d.title || d.key) + ' (' + stateDataMap[d.key] + ($("#category").val()=='all'?'':' %')+' )');
			svg.append("circle").attr("cx",$("#Interestingfacts_container").width()*0.26).attr("cy",$("#Interestingfacts_container").height()*0.1).attr("r", 8).style("fill", colorList[0])
			svg.append("circle").attr("cx",$("#Interestingfacts_container").width()*0.26).attr("cy",$("#Interestingfacts_container").height()*0.14).attr("r", 8).style("fill", colorList[1])
			svg.append("text").attr("x", $("#Interestingfacts_container").width()*0.27).attr("y", $("#Interestingfacts_container").height()*0.11).text("Increase").style("font-size", "12px").style("fill", "#fff")
			svg.append("text").attr("x", $("#Interestingfacts_container").width()*0.27).attr("y", $("#Interestingfacts_container").height()*0.15).text("Decrease").style("font-size", "12px").style("fill", "#fff")
	}
}
createMap($("#category").val(),$("#gender").val());
d3.csv("overall_state.csv", function(csv) {
	facts={};
	for(var i=0;i<csv.length;i++){
		intresting=0;
		for(var j=1;j<Object.keys(csv[i]).length-4;j++){
			if(Math.abs(csv[i][Object.keys(csv[i])[j]]) > intresting){
				facts[csv[i][Object.keys(csv[i])[0]]]=Object.keys(csv[i])[j];
				intresting=Math.abs(csv[i][Object.keys(csv[i])[j]])
			}
		}
	}
});