window.addEventListener('keyup', function(e) {
    // update();
    scheduleUpdate(1);
    if (e.keyCode == 16) {
        // simulationArea.lastSelected.delete(); // delete key
        simulationArea.shiftDown = false;
    }
    if (e.key == "Meta" || e.key == "Control") {
        simulationArea.controlDown = false;
    }
});
document.getElementById("simulationArea").addEventListener('mousedown', function(e) {
    // return;


    // if(simulationArea.mouseDown)return;
    errorDetected = false;
    updateSimulation = true;
    updatePosition = true;
    updateCanvas = true;



    simulationArea.lastSelected = undefined;
    simulationArea.selected = false;
    simulationArea.hover = undefined;
    var rect = simulationArea.canvas.getBoundingClientRect();
    simulationArea.mouseDownRawX = (e.clientX - rect.left) * DPR;
    simulationArea.mouseDownRawY = (e.clientY - rect.top) * DPR;
    simulationArea.mouseDownX = Math.round(((simulationArea.mouseDownRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
    simulationArea.mouseDownY = Math.round(((simulationArea.mouseDownRawY - globalScope.oy) / globalScope.scale) / unit) * unit;
    simulationArea.mouseDown = true;
    simulationArea.oldx = globalScope.ox;
    simulationArea.oldy = globalScope.oy;



    e.preventDefault();

    // simulationArea.selected=false;
    // simulationArea.hover=false;
    scheduleBackup();
    // update();
    //console.log("DEBUG:",simulationArea.lastSelected)
    scheduleUpdate(1);
    // update();
    //console.log("DEBUG:",simulationArea.lastSelected)
    // //console.log(simulationArea.mouseDown);
    // //console.log(simulationArea.mouseDown, "mouseDOn");
    $('.dropdown.open').removeClass('open');
});
document.getElementById("simulationArea").addEventListener('mouseup', function(e) {
    if(simulationArea.lastSelected)simulationArea.lastSelected.newElement=false;
});
window.addEventListener('mousemove', function(e) {
    // return;
    // if(simulationArea.mouseRawX<0||simulationArea.mouseRawY<0||simulationArea.mouseRawX>width||simulationArea.mouseRawY>height)simulationArea.mouseDown=false;
    // return;

    // updateSimulation=true;


    var rect = simulationArea.canvas.getBoundingClientRect();
    simulationArea.mouseRawX = (e.clientX - rect.left) * DPR;
    simulationArea.mouseRawY = (e.clientY - rect.top) * DPR;
    simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
    simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - globalScope.oy) / globalScope.scale) / unit) * unit;

    // return;
    // updateSimulation=true;

    updateCanvas = true;
    //if(simulationArea.lastSelected&&simulationArea.lastSelected.objectType=="Node"){
    // updatePosition=true;
    // updateCanvas=true;
    //}
    // //console.log(simulationArea.lastSelected)
    // scheduleUpdate(0,100);
    // if(simulationArea.lastSelected)simulationArea.lastSelected.update();
    // }

    if (simulationArea.lastSelected && (simulationArea.mouseDown || simulationArea.lastSelected.newElement)) {
        updateCanvas = true;
        var fn;


        if (simulationArea.lastSelected == globalScope.root) {
            fn = function() {
                updateSelectionsAndPane();
            }
        } else {
            fn = function() {
                simulationArea.lastSelected.update();
            };
            // simulationArea.hover.update();
        }
        scheduleUpdate(0, 20, fn);
    } else {
        scheduleUpdate(0, 200);
    }

    // if(simulationArea.hover){
    //     simulationArea.hover.update();
    // }


    // updateSimulation=true;
    // updatePosition=true;
    // updateCanvas=true;
    // scheduleUpdate(0,20);

});
window.addEventListener('keydown', function(e) {

    errorDetected = false;
    updateSimulation = true;
    updatePosition = true;



    // zoom in (+)
    if (e.key == "Meta" || e.key == "Control") {
        simulationArea.controlDown = true;
    }


    if (simulationArea.controlDown && e.keyCode == 187) {
        e.preventDefault();
        if (globalScope.scale < 4 * DPR) {
            changeScale(.1 * DPR);
        }
    }
    // zoom out (-)
    if (simulationArea.controlDown && e.keyCode == 189) {
        e.preventDefault();
        if (globalScope.scale > 0.5 * DPR) {
            changeScale(-.1 * DPR);
        }
    }


    if (simulationArea.mouseRawX < 0 || simulationArea.mouseRawY < 0 || simulationArea.mouseRawX > width || simulationArea.mouseRawY > height) return;





    scheduleUpdate(1);
    updateCanvas = true;
    wireToBeChecked = 1;
    // e.preventDefault();
    console.log("KEY:" + e.key);

    if (simulationArea.controlDown && (e.key == "C" || e.key == "c")) {
        //    simulationArea.copyList=simulationArea.multipleObjectSelections.slice();
        //    if(simulationArea.lastSelected&&simulationArea.lastSelected!==simulationArea.root&&!simulationArea.copyList.contains(simulationArea.lastSelected)){
        //        simulationArea.copyList.push(simulationArea.lastSelected);
        //    }
        //    copy(simulationArea.copyList);
    }
    if (simulationArea.controlDown && (e.key == "V" || e.key == "v")) {
        //    paste(simulationArea.copyData);
    }
    if (simulationArea.lastSelected && simulationArea.lastSelected.keyDown) {
        if (e.key.toString().length == 1 || e.key.toString() == "Backspace") {
            simulationArea.lastSelected.keyDown(e.key.toString());
            return;
        }
        // if(e.key.toString()=="Shift")return;

    }
    if (e.keyCode == 16) {
        simulationArea.shiftDown = true;
        if (simulationArea.lastSelected && !simulationArea.lastSelected.keyDown && simulationArea.lastSelected.objectType != "Wire" && simulationArea.lastSelected.objectType != "CircuitElement" && !simulationArea.multipleObjectSelections.contains(simulationArea.lastSelected)) {
            simulationArea.multipleObjectSelections.push(simulationArea.lastSelected);
            // simulationArea.lastSelected = undefined;
        }
    }
    if (e.keyCode == 8 || e.key == "Delete") {
        if (simulationArea.lastSelected) simulationArea.lastSelected.delete();
        for (var i = 0; i < simulationArea.multipleObjectSelections.length; i++) {
            simulationArea.multipleObjectSelections[i].cleanDelete();
        }
    }


    if (simulationArea.controlDown && e.key.charCodeAt(0) == 122) { // detect the special CTRL-Z code
        undo();
    }
    // else{
    //     //
    // }
    //change direction fns
    if (e.keyCode == 37 && simulationArea.lastSelected != undefined) {
        simulationArea.lastSelected.newDirection("LEFT");
    }
    if (e.keyCode == 38 && simulationArea.lastSelected != undefined) {
        simulationArea.lastSelected.newDirection("UP");
    }
    if (e.keyCode == 39 && simulationArea.lastSelected != undefined) {
        simulationArea.lastSelected.newDirection("RIGHT");
    }
    if (e.keyCode == 40 && simulationArea.lastSelected != undefined) {
        simulationArea.lastSelected.newDirection("DOWN");
    }
    if ((e.keyCode == 113 || e.keyCode == 81) && simulationArea.lastSelected != undefined) {
        if (simulationArea.lastSelected.bitWidth !== undefined)
            simulationArea.lastSelected.newBitWidth(parseInt(prompt("Enter new bitWidth"), 10));
    }
    if (simulationArea.controlDown&&(e.key == "T" || e.key == "t") ){
        simulationArea.changeClockTime(prompt("Enter Time:"));
    }
    if ((e.keyCode == 108 || e.keyCode == 76) && simulationArea.lastSelected != undefined) {
        if (simulationArea.lastSelected.setLabel !== undefined)
            simulationArea.lastSelected.setLabel();
    }
    if (e.key == "0") {
        miniMapArea.setup();
    }
    // //console.log()
    // update();
})
document.getElementById("simulationArea").addEventListener('dblclick', function(e) {
    scheduleUpdate(2);
    if (simulationArea.lastSelected && simulationArea.lastSelected.dblclick !== undefined) {
        simulationArea.lastSelected.dblclick();
    }
    if (!simulationArea.shiftDown) {
        simulationArea.multipleObjectSelections = [];
    }
    // //console.log(simulationArea.mouseDown, "mouseDOn");
});

function removeMiniMap(){

        if (simulationArea.lastSelected == globalScope.root && simulationArea.mouseDown) return;
        if (lastMiniMapShown+2000>= new Date().getTime()){
            setTimeout(removeMiniMap,lastMiniMapShown+2000-new Date().getTime());
            return;
        }
        $('#miniMap').fadeOut('fast');

}
window.addEventListener('mouseup', function(e) {

    // return;
    // update();
    //console.log(simulationArea.hover)
    lastMiniMapShown = new Date().getTime();
    setTimeout(removeMiniMap, 2000);
    simulationArea.mouseDown = false;
    for (var i = 0; i < 4; i++) {
        updatePosition = true;
        wireToBeChecked = true;
        update();
    }
    errorDetected = false;
    updateSimulation = true;
    updatePosition = true;
    updateCanvas = true;
    gridUpdate = true;
    wireToBeChecked = true;

    scheduleUpdate(1);
    var rect = simulationArea.canvas.getBoundingClientRect();
    // simulationArea.mouseDownX = (e.clientX - rect.left) / globalScope.scale;
    // simulationArea.mouseDownY = (e.clientY - rect.top) / globalScope.scale;
    // simulationArea.mouseDownX = Math.round((simulationArea.mouseDownX - globalScope.ox / globalScope.scale) / unit) * unit;
    // simulationArea.mouseDownY = Math.round((simulationArea.mouseDownY - globalScope.oy / globalScope.scale) / unit) * unit;


    if (!(simulationArea.mouseRawX < 0 || simulationArea.mouseRawY < 0 || simulationArea.mouseRawX > width || simulationArea.mouseRawY > height)) {
        smartDropXX = simulationArea.mouseX + 100; //Math.round(((simulationArea.mouseRawX - globalScope.ox+100) / globalScope.scale) / unit) * unit;
        smartDropYY = simulationArea.mouseY - 50; //Math.round(((simulationArea.mouseRawY - globalScope.oy+100) / globalScope.scale) / unit) * unit;
        // //console.log(smartDropXX,smartDropYY);
    }

    //console.log(simulationArea.mouseDown);
});
// window.addEventListener('touchmove', function(e) {
//     scheduleUpdate();
//     var rect = simulationArea.canvas.getBoundingClientRect();
//     simulationArea.mouseRawX = (e.touches[0].clientX - rect.left);
//     simulationArea.mouseRawY = (e.touches[0].clientY - rect.top);
//     simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
//     simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - globalScope.oy) / globalScope.scale) / unit) * unit;
//
// })
// window.addEventListener('touchstart', function(e) {
//     scheduleUpdate();
//     var rect = simulationArea.canvas.getBoundingClientRect();
//
//     simulationArea.mouseDownRawX = (e.touches[0].clientX - rect.left);
//     simulationArea.mouseDownRawY = (e.touches[0].clientY - rect.top);
//     simulationArea.mouseRawX = (e.touches[0].clientX - rect.left);
//     simulationArea.mouseRawY = (e.touches[0].clientY - rect.top);
//     simulationArea.mouseDownX = Math.round(((simulationArea.mouseDownRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
//     simulationArea.mouseDownY = Math.round(((simulationArea.mouseDownRawY - globalScope.oy) / globalScope.scale) / unit) * unit;
//     simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
//     simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - globalScope.oy) / globalScope.scale) / unit) * unit;
//
//     simulationArea.mouseDown = true;
//     simulationArea.oldx = globalScope.ox;
//     simulationArea.oldy = globalScope.oy;
//
//
//     simulationArea.mouseDown = true;
//     //console.log(simulationArea.mouseDown);
// });
// window.addEventListener('touchend', function(e) {
//     scheduleUpdate();
//     // update();
//     var rect = simulationArea.canvas.getBoundingClientRect();
//     simulationArea.mouseDownY = simulationArea.mouseY;
//     simulationArea.mouseDownX = simulationArea.mouseX;
//
//     simulationArea.mouseDown = false;
//     //console.log(simulationArea.mouseDown);
// });
// window.addEventListener('touchleave', function(e) {
//     scheduleUpdate();
//     // update();
//     var rect = simulationArea.canvas.getBoundingClientRect();
//     simulationArea.mouseDown = false;
// });

var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 ||
    navigator.userAgent.toLowerCase().indexOf("trident") != -1);

document.addEventListener('cut', function(e) {
    simulationArea.copyList = simulationArea.multipleObjectSelections.slice();
    if (simulationArea.lastSelected && simulationArea.lastSelected !== simulationArea.root && !simulationArea.copyList.contains(simulationArea.lastSelected)) {
        simulationArea.copyList.push(simulationArea.lastSelected);
    }


    var textToPutOnClipboard = copy(simulationArea.copyList,true);
    if (isIe) {
        window.clipboardData.setData('Text', textToPutOnClipboard);
    } else {
        e.clipboardData.setData('text/plain', textToPutOnClipboard);
    }
    e.preventDefault();
});
document.addEventListener('copy', function(e) {
    simulationArea.copyList = simulationArea.multipleObjectSelections.slice();
    if (simulationArea.lastSelected && simulationArea.lastSelected !== simulationArea.root && !simulationArea.copyList.contains(simulationArea.lastSelected)) {
        simulationArea.copyList.push(simulationArea.lastSelected);
    }


    var textToPutOnClipboard = copy(simulationArea.copyList);
    if (isIe) {
        window.clipboardData.setData('Text', textToPutOnClipboard);
    } else {
        e.clipboardData.setData('text/plain', textToPutOnClipboard);
    }
    e.preventDefault();
});

document.addEventListener('paste', function(e) {
    var data;
    if (isIe) {
        data = window.clipboardData.getData('Text');
    } else {
        data = e.clipboardData.getData('text/plain');
    }
    //console.log(data)

    paste(data);
    e.preventDefault();
});
