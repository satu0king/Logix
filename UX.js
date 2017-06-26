$(document).ready(function() {
    $("#menu").accordion({collapsible: true, active: false});
    $( "#sideBar" ).resizable({
    handles: 'e',
        minWidth:200,
    });

    $('.logixModules').click(function(){
        console.log(this.id);
    });

    // $( "#sideBar" ).resizable({
    //     autoHide: true
    // });
    // $( "#sideBar" ).resizable({
    //     minHeight: window.innerHeight
    // });
    // $( "#sideBar" ).resizable({
    //     maxHeight: window.innerHeight
    // });

}); // accordion
