function findMax(csv){
	for(var i=0;i<csv.length;i++){
		for(var j=0;j<categoryVariableName.length-1;j++){
			max=Math.max(max,Math.abs(csv[i][categoryVariableName[j]]))
		}
	}
}

function createTimeline(s1,s2,category,gender,overall){
	$("#timeline").html("")
	resetCategoryVars();
	for(var i=0;i<categoryVariableName.length;i++){
		if(gender=='male'){
			categoryVariableName[i]+="_men"
		}else if(gender=='female'){
			categoryVariableName[i]+="_women"
		}else if(gender=='other'){
			categoryVariableName[i]+="_other"
		}	
	}
	$("#s1").html("");
	$("#s2").html("");
	if(overall==1){
		d3.csv("overall_month.csv", function(csv) {
			findMax(csv);
			for(i=1;i<13;i++){
				plotData=[];
				colorData=[];
				monthData=csv.filter(function(row) {
					return row['_id.month'] == i;
				});
				if(monthData.length>0){
					if(category=='all'){
						for(var x=0;x<categories.length;x++){
							plotData.push({"column":categories[x],"data":Math.abs(monthData[0][categoryVariableName[x]])});
							colorData.push({"column":categories[x],"data":monthData[0][categoryVariableName[x]]});
						}
					}else{
						var x=0
						for(x=0;x<categories.length;x++){
							if(categories[x].toLowerCase()==category){
								break;
							}
						}
						plotData.push({"column":categories[x],"data":Math.abs(monthData[0][categoryVariableName[x]])});
						colorData.push({"column":categories[x],"data":monthData[0][categoryVariableName[x]]});
					}
				}
				drawTimeline(plotData,colorData,i,s1,s2,overall);
			}
			max=0;
		});
		$("#s2").html("<div class='row' style='justify-content: center;'><h3>USA</h3><div style='color:"+colorList[0]+";bottom: 4px;position:relative;'>&uarr;</div><div style='color:"+colorList[1]+";bottom: 4px;position:relative;'>&darr;</div>");
	}
	else{
		d3.csv("overall_month_state.csv", function(csv) {
			csv1 = csv.filter(function(row) {
				return row['_id.state'] == s1;
			});
			
			csv2 = csv.filter(function(row) {
				return row['_id.state'] == s2;
			});
			findMax(csv1);
			findMax(csv2);
			for(i=1;i<13;i++){
				plotData=[];
				colorData=[];
				monthData1=csv1.filter(function(row) {
					return row['_id.month'] == i;
				});
				
				monthData2=csv2.filter(function(row) {
					return row['_id.month'] == i;
				});
				if(category=='all'){
					for(var x=0;x<categories.length;x++){
						plotData.push({"column":categories[x],"data":(monthData1.length>0?Math.abs(monthData1[0][categoryVariableName[x]]):0),"data1":(monthData2.length>0?(-(Math.abs(monthData2[0][categoryVariableName[x]]))):0)});
						colorData.push({"column":categories[x],"data":(monthData1.length>0?monthData1[0][categoryVariableName[x]]:0),"data1":(monthData2.length>0?monthData2[0][categoryVariableName[x]]:0)});
					}
				}else{
					var x=0;
					for(x=0;x<categories.length;x++){
						if(categories[x].toLowerCase()==category){
							break;
						}
					}
					plotData.push({"column":categories[x],"data":(monthData1.length>0?Math.abs(monthData1[0][categoryVariableName[x]]):0),"data1":(monthData2.length>0?(-(Math.abs(monthData2[0][categoryVariableName[x]]))):0)});
						colorData.push({"column":categories[x],"data":(monthData1.length>0?monthData1[0][categoryVariableName[x]]:0),"data1":(monthData2.length>0?monthData2[0][categoryVariableName[x]]:0)});
				}
				
				drawTimeline(plotData,colorData,i,s1,s2,overall);
			}
			max=0;
		});
		$("#s1").html("<div class='row' style='justify-content: center;'><h3>"+states[s1]+"</h3><div style='color:"+colorList[0]+";bottom: 4px;position:relative;'>&uarr;</div><div style='color:"+colorList[1]+";bottom: 4px;position:relative;'>&darr;</div>");
		if(s2!="")
			$("#s2").html("<div class='row' style='justify-content: center;'><h3>"+states[s2]+"</h3><div style='color:"+colorList[2]+";bottom: 4px;position:relative;'>&uarr;</div><div style='color:"+colorList[3]+";bottom: 4px;position:relative;'>&darr;</div>");
	}
}

function drawTimeline(plotData,colorData,i,s1,s2,overall){
	if(i%2==0 && i > 3 && i <11){
		$("#timeline").append(`
		<div class="row align-items-center lines">
		  <div class="col-2 text-center bottom">
			<div class="circle"><p>`+month[i-1]+`</p></div>
		  </div>
		  <div class="col-8">
			<svg id="chart`+i+`" class='chartt'></svg>
		  </div>
		</div>
		<div class="row timeline">
		  <div class="col-2">
			<div class="corner top-right"></div>
		  </div>
		  <div class="col-8">
			<hr/>
		  </div>
		  <div class="col-2">
			<div class="corner left-bottom"></div>
		  </div>
		</div>`);
	}
	else if (i > 3 && i < 11){
				
		$("#timeline").append(`
		<div class="row align-items-center justify-content-end lines">
		  <div class="col-8 text-right">
			<svg id="chart`+i+`" class='chartt'></svg>
		  </div>
		  <div class="col-2 text-center full">
			<div class="circle"><p>`+month[i-1]+`</p></div>
		  </div>
		</div>
		<div class="row timeline">
		  <div class="col-2">
			<div class="corner right-bottom"></div>
		  </div>
		  <div class="col-8">
			<hr/>
		  </div>
		  <div class="col-2">
			<div class="corner top-left"></div>
		  </div>
		</div>`);
	}
	if(plotData.length!=0)
			chart(plotData,colorData,i,1,s1,s2,overall);
}

function chart(data,color,ele,speed,s1,s2,overall) {

	var keys = Object.keys(data[0]).slice(1),
		copy = [].concat(keys);

	var svg = d3.select("#chart"+ele),
		width = $(".chartt").width(),
		height = $(".chartt").height();

	var y = d3.scaleBand()
		.rangeRound([0, height])
		.padding(0.1);

	var x = d3.scaleLinear()
		.rangeRound([width, 0]);

	keys.sort((a, b) => copy.indexOf(a) - copy.indexOf(b))
	
	var div = d3.select("#timeline").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
	
	var series = d3.stack()
		.keys(keys)
		.offset(d3.stackOffsetDiverging)(data);

	y.domain(data.map(d => d.column));

	x.domain([
		overall==1?0:-(max), 
		max
	]).nice();

	var barGroups = svg.selectAll("g.layer")
		.data(series, d => d.key);

	barGroups.exit().remove();

	barGroups.enter().insert("g")
		.classed('layer', true);

	var bars = svg.selectAll("g.layer").selectAll(".bars")
		.data(d => d, d => d.data.column);

	bars.exit().remove();

	bars.enter().append("rect")
		.attr("class", "bars")
		.attr("height", y.bandwidth())
		.attr("y", d => y(d.data.column))
		.attr("x", d => x(d[1]))
		.on("mouseover", function(d) {
			dd=0;
			if(d['0']==0){
				dd=color.filter(function(row) {
					return row['column'] == d.data.column;
				})[0]['data']
			}
			else{
				dd=color.filter(function(row) {
					return row['column'] == d.data.column;
				})[0]['data1']
			}
			txt=`<div class='row'>
			<div class='col-12 tooltiptxt'>`+(overall!=1?(d['0']==0?states[s1]:states[s2]):"USA")+`</div></div><div class='row'>
			<div class='col-12 tooltiptxt'>`+(dd>0?("An increase of "+dd+"%"):(dd==0?"No change":"A decrease of "+Math.abs(dd)+"%"))+`</div>
			</div>`
			d3.select(this).style('opacity',1);
			div.transition()		
                .duration(100)		
                .style("opacity", 0.9);		
            div.html(txt)	
                .style("left", (d3.event.pageX*.2) + "px")		
                .style("top", (d3.event.pageY-($('.chartt').height())) + "px");	
            })					
        .on("mouseout", function(d) {
			d3.select(this).style('opacity',0.8);
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
		.merge(bars)
	.transition().duration(speed)
		.attr("width", d => Math.abs(x(d[0])) - x(d[1]))
		

	var yAxis = svg.append("g")
	.attr("class", "y-axis").transition().duration(speed).attr("transform", "translate(" + (($("#chart"+ele).width()/2)+($("#chart"+ele).width()/10)) + ",0)").call(d3.axisLeft(y));
	
	for( var x=0;x<color.length;x++){
		$("#chart"+ele+" g:nth-child(1) rect:nth-child("+(x+1)+")").css('fill',color[x]['data']>0?colorList[0]:colorList[1]);
		$("#chart"+ele+" g:nth-child(2) rect:nth-child("+(x+1)+")").css('fill',color[x]['data1']>0?colorList[2]:colorList[3]);
	}
}

function stackMin(serie) {
	return d3.min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
	return d3.max(serie, function(d) { return d[1]; });
}

createTimeline("","",$("#category").val(),$("#gender").val(),1);

d3.csv("overall_state.csv", function(csv) {
	for(var i=0;i<csv.length;i++){
		intresting=0;
		for(var j=1;j<Object.keys(csv[i]).length-4;j++){
			if(Math.abs(csv[i][Object.keys(csv[i])[j]]) > intresting)
				facts[csv[i][Object.keys(csv[i])[j]]]=Object.keys(csv[i])[j];
		}
	}
});