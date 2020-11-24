var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
$('#btn').click(function(){
	$("#timeline_1").html("")
	category=$("#category").val()
	gender=$("#gender").val()
	empVar="employment"
	prod_d_Var="prod_d";
	prod_i_Var="prod_i";
	if(gender=='male'){
		empVar+="_men"
		prod_d_Var+="_m";
		prod_i_Var+="_m";
	}else if(gender=='female'){
		empVar+="_women"
		prod_d_Var+="_f";
		prod_i_Var+="_f";
	}
	d3.csv("timeline.csv", function(csv) {
		csv = csv.filter(function(row) {
			return row['_id.b'] == $("#state").val();
		});
		for(i=1;i<13;i++){
			monthData=csv.filter(function(row) {
				return row['_id.a'] == i;
			});
			monthHtml="";
			if(monthData.length>0){
				if(category=='all'){
					if(monthData[0][empVar]<0){
						monthHtml="Employment increased "+monthData[0][empVar]+"%.</br> Productivity increased "+monthData[0][prod_i_Var]+"%.</br> Productivity decreased "+monthData[0][prod_d_Var]+"%."
					}
					else{
						monthHtml="Employment decreased "+monthData[0][empVar]+"%.</br> Productivity increased "+monthData[0][prod_i_Var]+"%.</br> Productivity decreased "+monthData[0][prod_d_Var]+"%."
					}
				}else if (category=='productivity'){
					monthHtml="Productivity increased "+monthData[0][prod_i_Var]+"%.</br> Productivity decreased "+monthData[0][prod_d_Var]+"%."
				}else{
					if(monthData[0]['c3']>0){
						monthHtml=("Employment increased "+monthData[0][empVar]+"%.")
					}
					else{
						monthHtml=("Employment decreased "+monthData[0][empVar]+"%.")
					}
				}

				if(i%2==0){
				$("#timeline_1").append(`
					<div class="row align-items-center lines">
					  <div class="col-2 text-center bottom">
						<div class="circle"><p>`+month[i-1]+`</p></div>
					  </div>
					  <div class="col-9">
						<p>`+monthHtml+`</p>
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
				else{
						
				$("#timeline_1").append(`
					<div class="row align-items-center justify-content-end lines">
					  <div class="col-9 text-right">
						<p>`+monthHtml+`</p>
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
			}
		}
	});
});


