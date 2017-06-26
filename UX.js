
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

var prevPropertyObj=undefined;
function showProperties(obj){
    if(obj==prevPropertyObj)return;
    hideProperties();
    if(simulationArea.lastSelected===undefined||simulationArea.lastSelected.objectType=="Wire"&&simulationArea.lastSelected.objectType=="CircuitElement")
    return;
    prevPropertyObj=obj;
    $('#moduleProperty').append("<h3>"+obj.objectType+"</h3>");
    // $('#moduleProperty').append("<input type='range' name='points' min='1' max='32' value="+obj.bitWidth+">");
    if(!obj.fixedBitWidth)
    $('#moduleProperty').append("<p>BitWidth: <input class='objectPropertyAttribute' type='number'  name='newBitWidth' min='1' max='32' value="+obj.bitWidth+"></p>");

    if(obj.changeInputSize)
    $('#moduleProperty').append("<p>Input Size: <input class='objectPropertyAttribute' type='number'  name='changeInputSize' min='2' max='10' value="+obj.inputSize+"></p>");


    $('#moduleProperty').append("<p>Label: <input class='objectPropertyAttribute' type='text'  name='setLabel' min='1' max='32' value="+obj.label+"></p>");

    $('#moduleProperty').append("<p></p>");
    $('#moduleProperty').append("Label Direction: ");
    var s=$("<select class='objectPropertyAttribute' name='newLabelDirection' ><option value='RIGHT'>RIGHT</option><option value='DOWN'>DOWN</option><option value='LEFT'>LEFT</option><option value='UP'>UP</ option></select>");
    s.val(obj.labelDirection);
    $('#moduleProperty').append(s);


    if(!obj.directionFixed){
        $('#moduleProperty').append("<p></p>");
        $('#moduleProperty').append("Direction: ");
        var s=$("<select class='objectPropertyAttribute' name='newDirection' ><option value='RIGHT'>RIGHT</option><option value='DOWN'>DOWN</option><option value='LEFT'>LEFT</option><option value='UP'>UP</ option></select>");
        s.val(obj.direction);
        $('#moduleProperty').append(s);

    }
    else if(!obj.orientationFixed){
        $('#moduleProperty').append("<p></p>");
        $('#moduleProperty').append("Orientation: ");
        var s=$("<select class='objectPropertyAttribute' name='newDirection' ><option value='RIGHT'>RIGHT</option><option value='DOWN'>DOWN</option><option value='LEFT'>LEFT</option><option value='UP'>UP</ option></select>");
        s.val(obj.direction);
        $('#moduleProperty').append(s);
    }




    $(".objectPropertyAttribute").on("change keyup paste click", function(){
        console.log(this.name,this.value);
        scheduleUpdate(1);
        updateCanvas = true;
        wireToBeChecked = 1;
        simulationArea.lastSelected[this.name](this.value);
    })
}


function hideProperties(){
    $('#moduleProperty').empty();
    prevPropertyObj=undefined;
    $(".objectPropertyAttribute").unbind("change keyup paste click");
}
