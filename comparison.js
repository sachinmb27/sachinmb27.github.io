$(document).ready(function(){
    $('.combine').on('change', function(){
        var combinedStates = $('#filter').val() + $('#state1').val() + $('#state2').val();
        var radioValue = $("input[name='gender']:checked").val() + '.json';
        $('#combinedStates').val(combinedStates+radioValue);
        console.log(combinedStates+radioValue);
    });
})