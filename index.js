function showtimeline(){
    $("#timeline_container").css("display","inherit");
    $("#timeline_container").addClass("animated slideInLeft");
    setTimeout(function(){
        $("#timeline_container").removeClass("animated slideInLeft");
    },800);
}
function closetimeline(){
    $("#timeline_container").addClass("animated slideOutLeft");
    setTimeout(function(){
        $("#timeline_container").removeClass("animated slideOutLeft");
        $("#timeline_container").css("display","none");
    },800);
}
function showcomparison(){
    $("#comparison_container").css("display","inherit");
    $("#comparison_container").addClass("animated slideInRight");
    setTimeout(function(){
        $("#comparison_container").removeClass("animated slideInRight");
    },800);
}
function closecomparison(){
    $("#comparison_container").addClass("animated slideOutRight");
    setTimeout(function(){
        $("#comparison_container").removeClass("animated slideOutRight");
        $("#comparison_container").css("display","none");
    },800);
}
function showInterestingfacts(){
    $("#Interestingfacts_container").css("display","inherit");
    $("#Interestingfacts_container").addClass("animated slideInUp");
    setTimeout(function(){
        $("#Interestingfacts_container").removeClass("animated slideInUp");
    },800);
}
function closeInterestingfacts(){
    $("#Interestingfacts_container").addClass("animated slideOutDown");
    setTimeout(function(){
        $("#Interestingfacts_container").removeClass("animated slideOutDown");
        $("#Interestingfacts_container").css("display","none");
    },800);
}
setTimeout(function(){
    $("#loading").addClass("animated fadeOut");
    setTimeout(function(){
      $("#loading").removeClass("animated fadeOut");
      $("#loading").css("display","none");
      $("#box").css("display","none");
      $("#timeline").removeClass("animated fadeIn");
      $("#Interestingfacts").removeClass("animated fadeIn");
      $("#comparison").removeClass("animated fadeIn");
    },1000);
},1500);
