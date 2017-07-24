var smartDropXX=50;
var smartDropYY=80;


$(document).ready(function() {
    $("#menu").accordion({collapsible: true, active: false, heightStyle: "content"});
    $( "#sideBar" ).resizable({
    handles: 'e',
        minWidth:200,
    });
    // $( "#plot" ).resizable({
    // handles: 'n',
    //     // minHeight:200,
    // });

    $('.logixModules').click(function(){
        //console.log(smartDropXX,smartDropYY);
        if(simulationArea.lastSelected&&simulationArea.lastSelected.newElement)simulationArea.lastSelected.delete();
        obj = new window[this.id]();//(simulationArea.mouseX,simulationArea.mouseY);
        simulationArea.lastSelected=obj;
        // simulationArea.lastSelected=obj;
        // simulationArea.mouseDown=true;
        smartDropXX+=70;
        if(smartDropXX/globalScope.scale >width){
            smartDropXX=50;
            smartDropYY+=80;
        }
    });
    $('.logixButton').click(function(){
        window[this.id]();

    });
// var dummyCounter=0;
    window.addEventListener('mousewheel', function ( event ) {
        updateCanvas=true;
        // toBeUpdated=true;



        event.preventDefault()
         var deltaY = event.wheelDelta;
        // dummyCounter++;
         var scrolledUp = deltaY < 0;
        var scrolledDown = deltaY > 0;
        // if(dummyCounter!=3)return;
        // dummyCounter=0;
        if(event.ctrlKey){
          if ( scrolledUp && globalScope.scale > 0.5*DPR) { changeScale(-.1*DPR); }
         if ( scrolledDown && globalScope.scale < 4*DPR) { changeScale(.1*DPR); }
        }
        else{
            if ( scrolledUp && globalScope.scale < 4*DPR) { changeScale(.1*DPR); }
           if ( scrolledDown && globalScope.scale >0.5*DPR) { changeScale(-.1*DPR); }
        }

        updateCanvas=true;
        //INEFFICIENT CODE scheduleUpdate not working
        // scheduleUpdate();
        update()
    });


    var iconList=$('.icon');
    // //console.log(iconList)
    for(var i=0;i<iconList.length;i++){
        //console.log(iconList[i].id);
        $(iconList[i]).append('<img src="./img/'+iconList[i].id+'.svg"/>');
        $(iconList[i]).append('<p class="img__description">'+iconList[i].id+
        '</p>');
    }
    // $('#saveAsImg').click(function(){
    //     saveAsImg();
    // });
    // $('#Save').click(function(){
    //     Save();
    // });
    // $('#moduleProperty').draggable();

}); // accordion



var prevPropertyObj=undefined;
function showProperties(obj){
    if(obj==prevPropertyObj)return;
    hideProperties();

    if(simulationArea.lastSelected===undefined||simulationArea.lastSelected.objectType=="Wire"&&simulationArea.lastSelected.objectType=="CircuitElement")
    return;
    prevPropertyObj=obj;
    $('#moduleProperty').show();

    $('#moduleProperty').append("<h3>"+obj.objectType+"</h3>");
    // $('#moduleProperty').append("<input type='range' name='points' min='1' max='32' value="+obj.bitWidth+">");
    if(!obj.fixedBitWidth)
    $('#moduleProperty').append("<p>BitWidth: <input class='objectPropertyAttribute' type='number'  name='newBitWidth' min='1' max='32' value="+obj.bitWidth+"></p>");

    if(obj.changeInputSize)
    $('#moduleProperty').append("<p>Input Size: <input class='objectPropertyAttribute' type='number'  name='changeInputSize' min='2' max='10' value="+obj.inputSize+"></p>");


    $('#moduleProperty').append("<p>Label: <input class='objectPropertyAttribute' type='text'  name='setLabel' min='1' max='32' value="+obj.label+"></p>");


    if(!obj.labelDirectionFixed){
        $('#moduleProperty').append("<p></p>");
        $('#moduleProperty').append("Label Direction: ");
        var s=$("<select class='objectPropertyAttribute' name='newLabelDirection' ><option value='RIGHT'>RIGHT</option><option value='DOWN'>DOWN</option><option value='LEFT'>LEFT</option><option value='UP'>UP</ option></select>");
        s.val(obj.labelDirection);
        $('#moduleProperty').append(s);
    }


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

    if(obj.mutableProperties){
        for( attr in obj.mutableProperties){
            var prop=obj.mutableProperties[attr];
            if(obj.mutableProperties[attr].type=="number"){
                var s="<p>" +prop.name+ "<input class='objectPropertyAttribute' type='number'  name='"+prop.func+"' min='"+(prop.min||0)+"' max='"+(prop.max||200)+"' value="+obj[attr]+"></p>";
                $('#moduleProperty').append(s);
            }
            else if(obj.mutableProperties[attr].type=="text"){
                var s="<p>" +prop.name+ "<input class='objectPropertyAttribute' type='text'  name='"+prop.func+"' maxlength='"+(prop.maxlength||200)+"' value="+obj[attr]+"></p>";
                $('#moduleProperty').append(s);
            }

        }
    }



    $(".objectPropertyAttribute").on("change keyup paste click", function(){
        // return;
        //console.log(this.name+":"+this.value);
        scheduleUpdate();
        updateCanvas = true;
        wireToBeChecked = 1;
        prevPropertyObj=simulationArea.lastSelected[this.name](this.value)||prevPropertyObj;
    })
}


function hideProperties(){
    $('#moduleProperty').empty();
    $('#moduleProperty').hide();
    prevPropertyObj=undefined;
    $(".objectPropertyAttribute").unbind("change keyup paste click");
}
