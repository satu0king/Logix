window.addEventListener('keyup', function(e) {
    // update();
    scheduleUpdate(1);
    if (e.keyCode == 16) {
        // simulationArea.lastSelected.delete(); // delete key
        simulationArea.shiftDown = false;
    }
    if (e.key == "Meta"||e.key=="Control") {
        simulationArea.controlDown = false;
    }
});
window.addEventListener('keydown', function(e) {
    errorDetected=false;
    toBeUpdated=true;


    // zoom in (+)
    if (e.key == "Meta"||e.key=="Control") {
        simulationArea.controlDown = true;
    }


    if (simulationArea.controlDown&&e.keyCode == 187 && simulationArea.scale < 4) {
        e.preventDefault();
        changeScale(.1);
    }
    // zoom out (-)
    if (simulationArea.controlDown&&e.keyCode == 189 && simulationArea.scale > 0.5) {
        e.preventDefault();
        changeScale(-.1);
    }


    if(simulationArea.mouseRawX<0||simulationArea.mouseRawY<0||simulationArea.mouseRawX>width||simulationArea.mouseRawY>height)return;


    if (e.keyCode == 16) {
        simulationArea.shiftDown = true;
        if (simulationArea.lastSelected&&simulationArea.lastSelected.objectType!="Wire") {
            simulationArea.multipleObjectSelections.push(simulationArea.lastSelected);
            // simulationArea.lastSelected = undefined;
        }
    }


    scheduleUpdate(1);
    updateCanvas = true;
    wireToBeChecked = 1;
    // e.preventDefault();
       console.log("KEY:"+e.key);

   if(simulationArea.controlDown&&(e.key=="C"||e.key=="c")){
       simulationArea.copyList=simulationArea.multipleObjectSelections.slice();
       if(simulationArea.lastSelected&&simulationArea.lastSelected!==simulationArea.root&&!simulationArea.copyList.contains(simulationArea.lastSelected)){
           simulationArea.copyList.push(simulationArea.lastSelected);
       }
   }
   if(simulationArea.controlDown&&(e.key=="V"||e.key=="v")){
       copyPaste(simulationArea.copyList);
   }
    if (simulationArea.lastSelected && simulationArea.lastSelected.keyDown) {
        if (e.key.toString().length == 1) {
            simulationArea.lastSelected.keyDown(e.key);
            return;
        }
        if (e.key == "Shift") return;
    }
    if (e.keyCode == 8) {
        if (simulationArea.lastSelected) simulationArea.lastSelected.delete();
        for (var i = 0; i < simulationArea.multipleObjectSelections.length; i++) {
            simulationArea.multipleObjectSelections[i].delete();
        }
    }


    if (simulationArea.controlDown&&e.key.charCodeAt(0) == 122) { // detect the special CTRL-Z code
        undo();
    }
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
    if (!simulationArea.controlDown&&(e.keyCode == 67 || e.keyCode == 99)) {
        simulationArea.changeClockTime(prompt("Enter Time:"));
    }
    if ((e.keyCode == 108 || e.keyCode == 76) && simulationArea.lastSelected != undefined) {
        if (simulationArea.lastSelected.setLabel !== undefined)
            simulationArea.lastSelected.setLabel();
    }

    // console.log()
    // update();
})
document.getElementById("simulationArea").addEventListener('dblclick', function(e) {
    scheduleUpdate(2);
    if (simulationArea.lastSelected&&simulationArea.lastSelected.dblclick !== undefined) {
        simulationArea.lastSelected.dblclick();
    }
    if (!simulationArea.shiftDown) {
        simulationArea.multipleObjectSelections = [];
    }
    // console.log(simulationArea.mouseDown, "mouseDOn");
});
document.getElementById("simulationArea").addEventListener('mousedown', function(e) {
    // return;
    errorDetected=false;
    toBeUpdated=true;
    e.preventDefault();
    scheduleBackup();
    update();
    scheduleUpdate(1);

    simulationArea.lastSelected = undefined;
    simulationArea.selected = false;
    var rect = simulationArea.canvas.getBoundingClientRect();
    simulationArea.mouseDownRawX = (e.clientX - rect.left);
    simulationArea.mouseDownRawY = (e.clientY - rect.top);
    simulationArea.mouseDownX = Math.round(((simulationArea.mouseDownRawX - simulationArea.ox) / simulationArea.scale) / unit) * unit;
    simulationArea.mouseDownY = Math.round(((simulationArea.mouseDownRawY - simulationArea.oy) / simulationArea.scale) / unit) * unit;
    simulationArea.mouseDown = true;
    simulationArea.oldx = simulationArea.ox;
    simulationArea.oldy = simulationArea.oy;


    if (simulationArea.clickCount === 0) {
        simulationArea.clickCount++;
        simulationArea.timer();
    } else if (simulationArea.clickCount === 1) {
        simulationArea.clickCount = 0;
        if (simulationArea.lock === "locked")
            simulationArea.lock = "unlocked";
        else
            simulationArea.lock = "locked";
        // console.log("Double", simulationArea.lock);
    }
    // console.log(simulationArea.mouseDown);
    // console.log(simulationArea.mouseDown, "mouseDOn");
});

window.addEventListener('mouseup', function(e) {

    // return;
    // update();
    errorDetected=false;
    toBeUpdated=true;
    scheduleUpdate(1);
    var rect = simulationArea.canvas.getBoundingClientRect();
    // simulationArea.mouseDownX = (e.clientX - rect.left) / simulationArea.scale;
    // simulationArea.mouseDownY = (e.clientY - rect.top) / simulationArea.scale;
    // simulationArea.mouseDownX = Math.round((simulationArea.mouseDownX - simulationArea.ox / simulationArea.scale) / unit) * unit;
    // simulationArea.mouseDownY = Math.round((simulationArea.mouseDownY - simulationArea.oy / simulationArea.scale) / unit) * unit;

    simulationArea.mouseDown = false;
    if(!(simulationArea.mouseRawX<0||simulationArea.mouseRawY<0||simulationArea.mouseRawX>width||simulationArea.mouseRawY>height))
    {
        smartDropXX=simulationArea.mouseX+100;//Math.round(((simulationArea.mouseRawX - simulationArea.ox+100) / simulationArea.scale) / unit) * unit;
        smartDropYY=simulationArea.mouseY-50;//Math.round(((simulationArea.mouseRawY - simulationArea.oy+100) / simulationArea.scale) / unit) * unit;
        // console.log(smartDropXX,smartDropYY);
    }

    // console.log(simulationArea.mouseDown);
});
window.addEventListener('touchmove', function(e) {
    scheduleUpdate();
    var rect = simulationArea.canvas.getBoundingClientRect();
    simulationArea.mouseRawX = (e.touches[0].clientX - rect.left);
    simulationArea.mouseRawY = (e.touches[0].clientY - rect.top);
    simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - simulationArea.ox) / simulationArea.scale) / unit) * unit;
    simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - simulationArea.oy) / simulationArea.scale) / unit) * unit;

})
window.addEventListener('touchstart', function(e) {
    scheduleUpdate();
    var rect = simulationArea.canvas.getBoundingClientRect();

    simulationArea.mouseDownRawX = (e.touches[0].clientX - rect.left);
    simulationArea.mouseDownRawY = (e.touches[0].clientY - rect.top);
    simulationArea.mouseRawX = (e.touches[0].clientX - rect.left);
    simulationArea.mouseRawY = (e.touches[0].clientY - rect.top);
    simulationArea.mouseDownX = Math.round(((simulationArea.mouseDownRawX - simulationArea.ox) / simulationArea.scale) / unit) * unit;
    simulationArea.mouseDownY = Math.round(((simulationArea.mouseDownRawY - simulationArea.oy) / simulationArea.scale) / unit) * unit;
    simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - simulationArea.ox) / simulationArea.scale) / unit) * unit;
    simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - simulationArea.oy) / simulationArea.scale) / unit) * unit;

    simulationArea.mouseDown = true;
    simulationArea.oldx = simulationArea.ox;
    simulationArea.oldy = simulationArea.oy;


    simulationArea.mouseDown = true;
    console.log(simulationArea.mouseDown);
});
window.addEventListener('touchend', function(e) {
    scheduleUpdate();
    // update();
    var rect = simulationArea.canvas.getBoundingClientRect();
    simulationArea.mouseDownY = simulationArea.mouseY;
    simulationArea.mouseDownX = simulationArea.mouseX;

    simulationArea.mouseDown = false;
    console.log(simulationArea.mouseDown);
});
window.addEventListener('touchleave', function(e) {
    scheduleUpdate();
    // update();
    var rect = simulationArea.canvas.getBoundingClientRect();
    simulationArea.mouseDown = false;
});
