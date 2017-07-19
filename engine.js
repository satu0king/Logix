// fn that calls update on everything else. If any change is there, it resolves the circuit and draws it again
// fn to change scale (zoom) - It also shifts origin so that the position
//of the object in focus doent changeB


function update(scope = globalScope) {
    willBeUpdated = false;
    if (loading == true) return;
    // console.log("UPDATE");

    var updated = false;
    simulationArea.hover = undefined;
    // wireToBeChecked=true;
    if (wireToBeChecked) {
        if (wireToBeChecked == 2) wireToBeChecked = 0; // this required due to timing issues
        else wireToBeChecked++;
        // WHY IS THIS REQUIRED ???? we are checking inside wire ALSO
        var prevLength=scope.wires.length;
        for (var i = 0; i < scope.wires.length; i++){
            scope.wires[i].checkConnections();
            if(scope.wires.length!=prevLength){
                prevLength--;
                i--;
            }
        }
    }
    if(updatePosition){
        console.log("updatePosition");
        for (var i = 0; i < scope.objects.length; i++)
            for (var j = 0; j < scope[scope.objects[i]].length; j++)
                updated |= scope[scope.objects[i]][j].update();
    }
    // updateSimulation |= updated;

    if(updatePosition)updateSelectionsAndPane(scope);

    if (updateSimulation) {
        play();
    }

    if(prevPropertyObj!=simulationArea.lastSelected){
        if (simulationArea.lastSelected !== undefined && simulationArea.lastSelected.objectType !== "Wire" && simulationArea.lastSelected.objectType !== "CircuitElement") {
            showProperties(simulationArea.lastSelected);
            console.log("yo");
        } else {
            hideProperties();
        }
    }



    //Draw
    if (updateCanvas) {
        renderCanvas(scope);
    }
    // if (updateSimulation||update) scheduleUpdate();
    updateSimulation = updateCanvas = updatePosition= false;
    // if(updated){
    //     updatePosition=true;
    //     updateCanvas=true;
    //     scheduleUpdate();
    // }
}

function updateSelectionsAndPane(scope){
    console.log("updateSelectionsAndPane");
    if (!simulationArea.selected && simulationArea.mouseDown) {
        //mouse click NOT on object
        simulationArea.selected = true;
        simulationArea.lastSelected = scope.root;
        simulationArea.hover = scope.root;

        if (simulationArea.shiftDown) {
            objectSelection = true;
        }
    } else if (simulationArea.lastSelected == scope.root && simulationArea.mouseDown) {
        //pane canvas
        if (!objectSelection) {
            globalScope.ox = (simulationArea.mouseRawX - simulationArea.mouseDownRawX) + simulationArea.oldx;
            globalScope.oy = (simulationArea.mouseRawY - simulationArea.mouseDownRawY) + simulationArea.oldy;
            globalScope.ox = Math.round(globalScope.ox);
            globalScope.oy = Math.round(globalScope.oy);
        }
        dots(true, false);

    } else if (simulationArea.lastSelected == scope.root) {
        simulationArea.lastSelected = undefined;
        simulationArea.selected = false;
        simulationArea.hover = undefined;
        if (objectSelection) {
            objectSelection = false;
            var x1 = simulationArea.mouseDownX;
            var x2 = simulationArea.mouseX;
            var y1 = simulationArea.mouseDownY;
            var y2 = simulationArea.mouseY;
            // simulationArea.multipleObjectSelections=[];
            // console.log(x1,x2,y1,y2);
            // [x1,x2]=[x1,x2].sort();
            // [y1,y2]=[y1,y2].sort();
            if (x1 > x2) {
                var temp = x1;
                x1 = x2;
                x2 = temp;
            }
            if (y1 > y2) {
                var temp = y1;
                y1 = y2;
                y2 = temp;
            }
            // console.log(x1,x2,y1,y2);
            for (var i = 0; i < scope.objects.length; i++) {
                for (var j = 0; j < scope[scope.objects[i]].length; j++) {
                    var obj = scope[scope.objects[i]][j];
                    // console.log(obj);
                    if(simulationArea.multipleObjectSelections.contains(obj))continue;
                    var x, y;
                    if (obj.objectType == "Node") {
                        x = obj.absX();
                        y = obj.absY();
                    } else if (obj.objectType != "Wire") {
                        x = obj.x;
                        y = obj.y;
                    } else {
                        // console.log(obj);
                        continue;
                    }
                    if (x > x1 && x < x2 && y > y1 && y < y2) {
                        simulationArea.multipleObjectSelections.push(obj);
                    }
                }
            }
        }
    }
}


function renderCanvas(scope){
    console.log("renderCanvas");
    simulationArea.clear();
    // dots(); // draw dots
    for (var i = 0; i < scope.objects.length; i++)
        for (var j = 0; j < scope[scope.objects[i]].length; j++)
            scope[scope.objects[i]][j].draw();
    if (objectSelection) {
        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black"
        rect2(ctx, simulationArea.mouseDownX, simulationArea.mouseDownY, simulationArea.mouseX - simulationArea.mouseDownX, simulationArea.mouseY - simulationArea.mouseDownY, 0, 0, "RIGHT");
        ctx.stroke();
    }
}

//Main fn that resolves circuit
function play(scope = globalScope, resetNodes = true) {
    // throw("ERROR");
    console.log("play");
    if (errorDetected) return;

    // console.log("simulation");
    if (loading == true) return;

    plotArea.stopWatch.Stop();

    if (resetNodes) {
        for (var i = 0; i < scope.allNodes.length; i++)
            scope.allNodes[i].reset();
        for (var i = 0; i < scope.SubCircuit.length; i++) {
            scope.SubCircuit[i].reset();
        }
    }

    for (var i = 0; i < scope.SubCircuit.length; i++) {
        if (scope.SubCircuit[i].isResolvable()) scope.stack.push(scope.SubCircuit[i]);
    }

    for (var i = 0; i < scope.FlipFlop.length; i++) {
        scope.stack.push(scope.FlipFlop[i]);
    }

    for (var i = 0; i < inputList.length; i++) {
        for (var j = 0; j < scope[inputList[i]].length; j++) {
            scope.stack.push(scope[inputList[i]][j]);
        }
    }
    var stepCount = 0;
    while (scope.stack.length) {
        if (errorDetected) return;
        var elem = scope.stack.pop();
        elem.resolve();
        stepCount++;
        if (stepCount > 1000) {
            showError("Simulation Stack limit exceeded: maybe due to cyclic paths or contention");
            return;
        }
    }

    for(var i=0;i<scope.Flag.length;i++)
        scope.Flag[i].setPlotValue();
    // for (var i = 0; i < scope.SubCircuit.length; i++) {
    //     if(!scope.SubCircuit[i].isResolvable())
    //         {
    //             scope.stack.push(scope.SubCircuit[i]);
    //             while (scope.stack.length) {
    //                 if(errorDetected)return;
    //                 var elem = scope.stack.pop();
    //                 elem.resolve();
    //                 stepCount++;
    //                 if (stepCount > 1000) {
    //                     showError("Simulation Stack limit exceeded: maybe due to cyclic paths or contention");
    //                     return;
    //                 }
    //             }
    //         }
    // }

}
