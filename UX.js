
var smartDropX=200;
var smartDropY=200;
$(document).ready(function() {
    $("#menu").accordion({collapsible: true, active: false});
    $( "#sideBar" ).resizable({
    handles: 'e',
        minWidth:200,
    });

    $('.logixModules').click(function(){
        obj = new window[this.id](smartDropX,smartDropY);
    });


}); // accordion
