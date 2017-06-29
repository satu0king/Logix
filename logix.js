

var width;

var height;
uniqueIdCounter = 0;
unit = 10;
toBeUpdated = true;
updateCanvas = true;
wireToBeChecked = 0; // when node disconnects from another node
willBeUpdated = false;
objectSelection = false;
errorDetected=false;
// var backups = []
loading = false
//Exact same name as object constructor
moduleList = ["Input", "Output", "NotGate", "OrGate", "AndGate", "NorGate", "NandGate", "XorGate", "XnorGate", "SevenSegDisplay", "HexDisplay", "Multiplexer", "BitSelector", "Splitter", "Power", "Ground", "ConstantVal", "ControlledInverter","TriState", "Adder", "Ram", "FlipFlop", "TTY", "Keyboard", "Clock", "DigitalLed","Stepper", "VariableLed", "RGBLed","Button", "SubCircuit"];

//Exact same name as object constructor
//All the combinational modules which give rise to an value(independently)
inputList = ["Stepper","Ground", "Power", "ConstantVal", "Input", "Clock","Button"];

scopeList={};
globalScope=undefined;

function showError(error) {
    // console.log("ERROR: " + error);
    errorDetected=true;
    var id=Math.floor(Math.random()*10000);
    $('#errorMessageDiv').append("<div class='errorMessage' id='"+id+"'> "+error+"</div>");
    setTimeout(function(){$('#'+id).fadeOut()},1500);
    // console.log("<div class='errorMessage'>"+error+"</div>");
}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function scheduleUpdate(count = 0) {
    // return;
    if (count) {
        for (var i = 0; i < count; i++)
            setTimeout(update, 10 + 50 * i);
    }
    if (willBeUpdated) return;

    // if (simulationArea.mouseDown)
    setTimeout(update, 100);
    // else
    //     setTimeout(update, 100);
    willBeUpdated = true;

}


//fn to remove elem in array
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
Array.prototype.extend = function(other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {
        this.push(v)
    }, this);
}

//fn to check if an elem is in an array
Array.prototype.contains = function(value) {
    return this.indexOf(value) > -1
};




//Scope object for each circuit level, globalScope for outer level

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function Scope(name = "localScope") {
    //root object for referring to main canvas - intermediate node uses this
    this.id=Math.floor((Math.random() * 100000000000) + 1);
    this.CircuitElement = [];
    this.root = new CircuitElement(0, 0, this, "RIGHT", 1);
    this.backups=[];
    this.timeStamp=new Date().getTime();

    this.clockTick = function() {
        for (var i = 0; i < this.Clock.length; i++)
            this.Clock[i].toggleState(); //tick clock!
        for (var i = 0; i < this.SubCircuit.length; i++)
            this.SubCircuit[i].localScope.clockTick(); //tick clock!
    }

    this.checkDependency=function(id){
        if(id==this.id)return true;
        for (var i = 0; i < this.SubCircuit.length; i++)
            if(this.SubCircuit[i].id==id)return true;

        for (var i = 0; i < this.SubCircuit.length; i++)
            if(this.SubCircuit[i].localScope.checkDependency(id))return true;
    }

    this.getDependencies=function(){
        var list=[]
        for (var i = 0; i < this.SubCircuit.length; i++){
            list.push(this.SubCircuit[i].id);
            list.extend(this.SubCircuit[i].localScope.getDependencies());
        }
        return uniq(list);
    }

    this.name = name;
    this.stack = [];

    this.nodes = []; //intermediate nodes only
    this.allNodes = [];
    this.wires = [];
    for (var i = 0; i < moduleList.length; i++) {
        this[moduleList[i]] = []
    }
    this.objects = ["wires", ...moduleList, "nodes"];
}

//fn to setup environment
function setup() {
    // globalScope = new Scope("globalScope"); //enabling scope
    // scopeList.push(globalScope);
    newCircuit("Main");
    data={}
    // data = JSON.parse(SAP_DATA);
    // load(data);
    // retrieving data
    if (parent.location.hash.length > 1) {

        var http = new XMLHttpRequest();
        hash = parent.location.hash.substr(1);
        // alert(hash);
        http.open("POST", "./index.php", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var params = "retrieve=" + hash; // probably use document.getElementById(...).value
        http.send(params);
        http.onload = function() {
            // console.log(http.responseText);
            if (http.responseText == "ERROR") alert("Error: could not load ");
            else {
                console.log(http.responseText);
                data = JSON.parse(http.responseText);
                console.log("From Server:"+data);
                load(data);
                simulationArea.changeClockTime(data["timePeriod"] || 500);
                // globalScope.backups.push(backUp(globalScope));
            }
        }

    }
    // return;

    toBeUpdated = true;
    width = document.getElementById("canvasArea").clientWidth;
    height = document.getElementById("canvasArea").clientHeight;
    // console.log(width);
    //setup simulationArea
    simulationArea.setup();
    scheduleUpdate();

    combinationalAnalysis();


}

//to resize window
function resetup() {
    width = document.getElementById("canvasArea").clientWidth;
    height = document.getElementById("canvasArea").clientHeight;
    simulationArea.canvas.width = width;
    simulationArea.canvas.height = height;
    // simulationArea.setup();
    scheduleUpdate();
}

window.onresize = resetup;

//for mobiles
window.addEventListener('orientationchange', resetup);

//Main fn that resolves circuit
function play(scope = globalScope, resetNodes = true) {
    if(errorDetected)return;

    // console.log("simulation");
    if (loading == true) return;

    if (resetNodes) {
        for (var i = 0; i < scope.allNodes.length; i++)
            scope.allNodes[i].reset();
        for (var i = 0; i < scope.SubCircuit.length; i++) {
            scope.SubCircuit[i].reset();
        }
    }
    for (var i = 0; i < scope.SubCircuit.length; i++) {
        if (scope.SubCircuit[i].isResolvable())
            scope.stack.push(scope.SubCircuit[i]);
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
        if(errorDetected)return;
        var elem = scope.stack.pop();
        elem.resolve();
        stepCount++;
        if (stepCount > 1000) {
            showError("Simulation Stack limit exceeded: maybe due to cyclic paths or contention");
            return;
        }
    }

}

//simulation environment object
var simulationArea = {
    canvas: document.getElementById("simulationArea"),
    selected: false,
    hover: false,
    clockState: 0,
    lastSelected: undefined,
    stack: [],
    ox: 0,
    oy: 0,
    oldx: 0,
    oldy: 0,
    scale: 1,
    multipleObjectSelections: [],
    copyList: [],
    shiftDown: false,
    controlDown: false,
    timePeriod: 500,
    clickCount: 0, //double click
    lock: "unlocked",
    timer: function() {
        ckickTimer = setTimeout(function() {
            simulationArea.clickCount = 0;
        }, 600);
    },

    setup: function() {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        // this.interval = setInterval(update, 100);
        this.ClockInterval = setInterval(clockTick, 500);
        this.mouseDown = false;
        // this.shiftDown=false;

        window.addEventListener('mousemove', function(e) {
            // if(simulationArea.mouseRawX<0||simulationArea.mouseRawY<0||simulationArea.mouseRawX>width||simulationArea.mouseRawY>height)simulationArea.mouseDown=false;
            // return;
            scheduleUpdate();
            // toBeUpdated=true;
            updateCanvas = true;
            var rect = simulationArea.canvas.getBoundingClientRect();
            simulationArea.mouseRawX = (e.clientX - rect.left);
            simulationArea.mouseRawY = (e.clientY - rect.top);
            simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - simulationArea.ox) / simulationArea.scale) / unit) * unit;
            simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - simulationArea.oy) / simulationArea.scale) / unit) * unit;

        });
    },
    changeClockTime(t) {
        clearInterval(this.ClockInterval);
        t = t || prompt("Enter Time Period:");
        this.timePeriod = t;
        this.ClockInterval = setInterval(clockTick, t);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function copyPaste(copyList){
    tempScope=new Scope("globalScope");
    d=backUp();
    loadScope(tempScope,d);
    for (var i = 0; i < globalScope.objects.length; i++)
        for (var j = 0; j < globalScope[globalScope.objects[i]].length; j++){
            var obj=globalScope[globalScope.objects[i]][j];
            if(obj.objectType!='Wire'){//}&&obj.objectType!='CircuitElement'){//}&&(obj.objectType!='Node'||obj.type==2)){
                if(!copyList.contains(globalScope[globalScope.objects[i]][j])){
                    console.log("DELETE:",globalScope[globalScope.objects[i]][j]);
                    globalScope[globalScope.objects[i]][j].delete()
                }
            }
        }
    toBeUpdated=true;
    console.log(globalScope.wires.length)
    // update(globalScope);
    // console.log(globalScope.wires.length)
    for(var i=0;i<copyList.length;i++){
        // console.log(copyList[i]);
        copyList[i].x+=10;
        copyList[i].y+=10;
        copyList[i].updateScope(tempScope);
    }
    for(var i=0;i<globalScope.wires.length;i++){
        // console.log(copyList[i]);

        globalScope.wires[i].updateScope(tempScope);
    }


    toBeUpdated=true;
    update(tempScope);

    for(l in globalScope){
        if(globalScope[l] instanceof Array&&l!="objects"){
            tempScope[l].extend(globalScope[l]);
        }
    }
    simulationArea.multipleObjectSelections=copyList.slice();

    globalScope=tempScope;

}

// fn that calls update on everything else. If any change is there, it resolves the circuit and draws it again
// fn to change scale (zoom) - It also shifts origin so that the position
//of the object in focus doent changeB
function update(scope=globalScope) {

    if (loading == true) return;
    // console.log("UPDATE");
    willBeUpdated = false;
    var updated = false;
    simulationArea.hover = false;
    // wireToBeChecked=true;
    if (wireToBeChecked) {
        if (wireToBeChecked == 2) wireToBeChecked = 0; // this required due to timing issues
        else wireToBeChecked++;
        // WHY IS THIS REQUIRED ???? we are checking inside wire ALSO
        for (var i = 0; i < scope.wires.length; i++)
            scope.wires[i].checkConnections();
    }

    for (var i = 0; i < scope.objects.length; i++)
        for (var j = 0; j < scope[scope.objects[i]].length; j++)
            updated |= scope[scope.objects[i]][j].update();
    toBeUpdated |= updated;

    if (toBeUpdated) {
        // toBeUpdated = false;
        play();
    }
    if(simulationArea.lastSelected!==undefined&&simulationArea.lastSelected.objectType!=="Wire"&&simulationArea.lastSelected.objectType!=="CircuitElement"){
        showProperties(simulationArea.lastSelected);
    }
    else{
        hideProperties();
    }

    if (!simulationArea.selected && simulationArea.mouseDown) {
        //mouse click NOT on object
        simulationArea.selected = true;
        simulationArea.lastSelected = scope.root;
        simulationArea.hover = true;

        if (simulationArea.shiftDown) {
            objectSelection = true;
        }
    } else if (simulationArea.lastSelected == scope.root && simulationArea.mouseDown) {
        //pane canvas
        if (!objectSelection) {
            simulationArea.ox = (simulationArea.mouseRawX - simulationArea.mouseDownRawX) + simulationArea.oldx;
            simulationArea.oy = (simulationArea.mouseRawY - simulationArea.mouseDownRawY) + simulationArea.oldy;
            simulationArea.ox = Math.round(simulationArea.ox);
            simulationArea.oy = Math.round(simulationArea.oy);
            // smartDropX=Math.round(((200 - simulationArea.ox) / simulationArea.scale) / unit) * unit;
            // smartDropY=Math.round(((30 - simulationArea.oy) / simulationArea.scale) / unit) * unit;
        }

    } else if (simulationArea.lastSelected == scope.root) {
        simulationArea.lastSelected = undefined;
        simulationArea.selected = false;
        simulationArea.hover = false;
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

    //Draw
    if (toBeUpdated || updateCanvas) {
        simulationArea.clear();
        dots(); // draw dots
        for (var i = 0; i < scope.objects.length; i++)
            for (var j = 0; j < scope[scope.objects[i]].length; j++)
                updated |= scope[scope.objects[i]][j].draw();
        if (objectSelection) {
            ctx = simulationArea.context;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black"
            rect2(ctx, simulationArea.mouseDownX, simulationArea.mouseDownY, simulationArea.mouseX - simulationArea.mouseDownX, simulationArea.mouseY - simulationArea.mouseDownY, 0, 0, "RIGHT");
            ctx.stroke();
        }
    }
    if (toBeUpdated) scheduleUpdate();
    toBeUpdated = updateCanvas = false;
}

// function sort2(a1,a2){
//     if(a1<=a2)
//     return [a1,a2];
//     return [a2,a1];
// }

//fn to draw Dots on screen
function dots() {
    var canvasWidth = simulationArea.canvas.width; //max X distance
    var canvasHeight = simulationArea.canvas.height; //max Y distance

    var ctx = simulationArea.context;
    var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    var scale = unit * simulationArea.scale;
    var ox = simulationArea.ox % scale; //offset
    var oy = simulationArea.oy % scale; //offset

    function drawPixel(x, y, r, g, b, a) {
        var index = (x + y * canvasWidth) * 4;
        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    }

    for (var i = 0 + ox; i < canvasWidth; i += scale)
        for (var j = 0 + oy; j < canvasHeight; j += scale)
            drawPixel(i, j, 0, 0, 0, 255);

    ctx.putImageData(canvasData, 0, 0);

}

// The Circuit element class serves as the abstract class for all circuit elements.
// Data Members: /* Insert Description */
// Prototype Methods:
//          - update: Used to update the state of object on mouse applicationCache
//          - isHover: Used to check if mouse is hovering over object


function CircuitElement(x, y, scope, dir, bitWidth) {
    // Data member initializations
    this.objectType = this.constructor.name; // CHECK IF THIS IS VALID
    this.x = x;
    this.y = y;

    this.hover = false;
    if(this.x==undefined||this.y==undefined){
        this.x=simulationArea.mouseX;
        this.y=simulationArea.mouseY;
        this.newElement=true;
        this.hover=true;
    }
    this.deleteNodesWhenDeleted=false;

    this.parent = parent;
    this.nodeList = []
    this.clicked = false;

    this.oldx = x;
    this.oldy = y;
    this.leftDimensionX = 10;
    this.rightDimensionX = 10;
    this.upDimensionY = 10;
    this.downDimensionY = 10;
    this.rectangleObject = true;
    this.label = "";
    this.scope = scope;
    this.scope[this.objectType].push(this); // CHECK IF THIS IS VALID
    this.bitWidth = bitWidth || parseInt(prompt("Enter bitWidth"), 10);
    this.direction = dir;
    this.directionFixed = false;
    this.labelDirection = dir;
    this.orientationFixed = true; // should it be false?
    this.fixedBitWidth = false;
    this.copyFrom=function(obj){
        var properties=["label","labelDirection"];
        for(var i=0;i<properties.length;i++){
            if(obj[properties[i]]!==undefined)
                this[properties[i]]=obj[properties[i]];
        }
    }

    scheduleUpdate();

    /* Methods to be Implemented for derivedClass
        saveObject(); //To generate JSON-safe data that can be loaded
        customDraw(); //This is to draw the custom design of the circuit(Optional)
        resolve(); // To execute digital logic(Optional)
        override isResolvable(); // custom logic for checking if module is ready
        override newDirection(dir) //To implement custom direction logic(Optional)
        newOrientation(dir) //To implement custom orientation logic(Optional)
    */

    // Method definitions

    this.updateScope=function(scope){
        this.scope=scope;
        for(var i=0;i<this.nodeList.length;i++)
            this.nodeList[i].scope=scope;
    }

    this.saveObject = function() {
        var data = {
            x: this.x,
            y: this.y,
            objectType: this.objectType,
            label: this.label,
            direction: this.direction,
            labelDirection: this.labelDirection,
            customData: this.customSave()
        }
        return data;

    }
    this.customSave = function() {
        return {
            values: {},
            nodes: {},
            constructorParamaters: [],
        }
    }

    //This sets the width and height of the element if its rectangluar
    // and the reference point is at the center of the object.
    //width and height define the X and Y distance from the center.
    //Effectively HALF the actual width and height.
    // NOT OVERIDABLE
    this.setDimensions = function(width, height) {
        this.leftDimensionX = this.rightDimensionX = width;
        this.downDimensionY = this.upDimensionY = height;
    }
    this.setWidth = function(width) {
        this.leftDimensionX = this.rightDimensionX = width;
    }
    this.setHeight = function(height) {
        this.downDimensionY = this.upDimensionY = height;
    }

    // The update method is used to change the parameters of the object on mouse click and hover.
    // Return Value: true if state has changed else false
    // NOT OVERIDABLE


    this.startDragging=function(){
        this.oldx = this.x;
        this.oldy = this.y;
    }
    this.drag=function(){
        this.x = this.oldx + simulationArea.mouseX - simulationArea.mouseDownX;
        this.y = this.oldy + simulationArea.mouseY - simulationArea.mouseDownY;
    }
    this.update = function() {

        var update = false;

        update|=this.newElement;
        if(this.newElement){
            this.x=simulationArea.mouseX;
            this.y=simulationArea.mouseY;
            if(simulationArea.mouseDown){
                this.newElement=false;
                simulationArea.lastSelected=this;
            }
            else return;
        }
        // console.log(this.nodeList)
        for (var i = 0; i < this.nodeList.length; i++) {
            update |= this.nodeList[i].update();
        }

        if (!simulationArea.mouseDown) this.hover = false;


        if ((this.clicked || !simulationArea.hover) && this.isHover()) {
            this.hover = true;
            simulationArea.hover = true;
        } else if (!simulationArea.mouseDown && this.hover && this.isHover() == false) {
            if (this.hover) simulationArea.hover = false;
            this.hover = false;
        }

        if (simulationArea.mouseDown && (this.clicked)) {
            if (this.x == simulationArea.mouseX && this.y == simulationArea.mouseY) return false;
            // this.x = this.oldx + simulationArea.mouseX - simulationArea.mouseDownX;
            // this.y = this.oldy + simulationArea.mouseY - simulationArea.mouseDownY;
            this.drag();
            if(!simulationArea.shiftDown&&simulationArea.multipleObjectSelections.contains(this)){
                for(var i=0;i<simulationArea.multipleObjectSelections.length;i++){
                    simulationArea.multipleObjectSelections[i].drag();
                }
            }

            update |= true;
        } else if (simulationArea.mouseDown && !simulationArea.selected) {
            // this.oldx = this.x;
            // this.oldy = this.y;
            this.startDragging();
            if(!simulationArea.shiftDown&&simulationArea.multipleObjectSelections.contains(this)){
                for(var i=0;i<simulationArea.multipleObjectSelections.length;i++){
                    simulationArea.multipleObjectSelections[i].startDragging();
                }
            }
            simulationArea.selected = this.clicked = this.hover = this.hover;

            update |= this.clicked;
        } else {
            if (this.clicked) simulationArea.selected = false;
            this.clicked = false;
            this.wasClicked = false;
        }

        if (simulationArea.mouseDown && !this.wasClicked) {
            if (this.clicked) {
                this.wasClicked = true;
                if (this.click) this.click();
                if (simulationArea.shiftDown) {
                    simulationArea.lastSelected = undefined;
                    if (simulationArea.multipleObjectSelections.contains(this)) {
                        simulationArea.multipleObjectSelections.clean(this);
                    } else {
                        simulationArea.multipleObjectSelections.push(this);
                    }
                } else {
                    simulationArea.lastSelected = this;
                }
            }
        }

        // if (this.hover)
        //     console.log(this);

        return update;
    }

    this.fixDirection=function(){
        this.direction=fixDirection[this.direction]||this.direction;
        this.labelDirection=fixDirection[this.labelDirection]||this.labelDirection;
    }

    // The isHover method is used to check if the mouse is hovering over the object.
    // Return Value: true if mouse is hovering over object else false
    // NOT OVERIDABLE
    this.isHover = function() {
        // var width, height;
        //
        // [width, height] = rotate(this.width, this.height, "RIGHT");
        // width = Math.abs(width);
        // height = Math.abs(height);
        var rX = this.rightDimensionX;
        var lX = this.leftDimensionX;
        var uY = this.upDimensionY;
        var dY = this.downDimensionY;
        if (!this.directionFixed) {
            if (this.direction == "LEFT") {
                lX = this.rightDimensionX;
                rX = this.leftDimensionX
            } else if (this.direction == "DOWN") {
                lX = this.downDimensionY;
                rX = this.upDimensionY;
                uY = this.leftDimensionX;
                dY = this.rightDimensionX;
            } else if (this.direction == "UP") {
                lX = this.downDimensionY;
                rX = this.upDimensionY;
                dY = this.leftDimensionX;
                uY = this.rightDimensionX;
            }
        }
        var mouseX = simulationArea.mouseX;
        var mouseY = simulationArea.mouseY;
        if (mouseX - this.x <= rX && this.x - mouseX <= lX && mouseY - this.y <= dY && this.y - mouseY <= uY) return true;

        return false;
    };

    this.setLabel = function(label) {
        this.label = label;
        // console.log(this.label);
    }

    //Method that draws the outline of the module and calls draw function on module Nodes.
    //NOT OVERIDABLE
    this.draw = function() {

        // Draws rectangle and highlighs
        if (this.rectangleObject) {
            ctx = simulationArea.context;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.lineWidth = 3;
            ctx.beginPath();
            rect2(ctx, -this.leftDimensionX, -this.upDimensionY, this.leftDimensionX + this.rightDimensionX, this.upDimensionY + this.downDimensionY, this.x, this.y, [this.direction, "RIGHT"][+this.directionFixed]);
            if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
            ctx.fill();
            ctx.stroke();
            // if (this.hover)
            //     console.log(this);
        }
        if (this.label != "") {
            var rX = this.rightDimensionX;
            var lX = this.leftDimensionX;
            var uY = this.upDimensionY;
            var dY = this.downDimensionY;
            if (!this.directionFixed) {
                if (this.direction == "LEFT") {
                    lX = this.rightDimensionX;
                    rX = this.leftDimensionX
                } else if (this.direction == "DOWN") {
                    lX = this.downDimensionY;
                    rX = this.upDimensionY;
                    uY = this.leftDimensionX;
                    dY = this.rightDimensionX;
                } else if (this.direction == "UP") {
                    lX = this.downDimensionY;
                    rX = this.upDimensionY;
                    dY = this.leftDimensionX;
                    uY = this.rightDimensionX;
                }
            }

            if (this.labelDirection == "LEFT") {
                ctx.beginPath();
                ctx.textAlign = "right";
                ctx.fillStyle = "black";
                fillText(ctx, this.label, this.x - lX - 10, this.y + 5, 14);
                ctx.fill();
            } else if (this.labelDirection == "RIGHT") {
                ctx.beginPath();
                ctx.textAlign = "left";
                ctx.fillStyle = "black";
                fillText(ctx, this.label, this.x + rX + 10, this.y + 5, 14);
                ctx.fill();
            } else if (this.labelDirection == "UP") {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                fillText(ctx, this.label, this.x, this.y + 5 - uY - 10, 14);
                ctx.fill();
            } else if (this.labelDirection == "DOWN") {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                fillText(ctx, this.label, this.x, this.y + 5 + dY + 10, 14);
                ctx.fill();
            }
        }


        // calls the custom circuit design
        if (this.customDraw) this.customDraw();

        //draws nodes
        for (var i = 0; i < this.nodeList.length; i++)
            this.nodeList[i].draw();
    }

    //method to delete object
    //OVERRIDE WITH CAUTION
    this.delete = function() {
        simulationArea.lastSelected = undefined;
        this.scope[this.objectType].clean(this); // CHECK IF THIS IS VALID
        if(this.deleteNodesWhenDeleted)
            for (var i = 0; i < this.nodeList.length; i++)
                this.nodeList[i].delete();
        else
            for (var i = 0; i < this.nodeList.length; i++)
                this.nodeList[i].converToIntermediate();
    }

    this.cleanDelete=function(){
        this.deleteNodesWhenDeleted=true;
        this.delete();
    }
    //method to change direction
    //OVERRIDE WITH CAUTION
    this.newDirection = function(dir) {
        if(this.direction==dir)return;
        // Leave this for now
        if (this.directionFixed && this.orientationFixed) return;
        else if (this.directionFixed) {
            this.newOrientation(dir);
            return; // Should it return ?
        }

        // if (obj.direction == undefined) return;
        this.direction = dir;
        for (var i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].refresh();
        }

    }
    this.newLabelDirection = function(dir) {
        this.labelDirection=dir;
    }

    //Method to check if object can be resolved
    //OVERRIDE if necessary
    this.isResolvable = function() {
        for (var i = 0; i < this.nodeList.length; i++)
            if (this.nodeList[i].type == 0 && this.nodeList[i].value == undefined) return false;
        return true;
    }

    //Method to change object Bitwidth
    //OVERRIDE if necessary
    this.newBitWidth = function(bitWidth) {
        if (this.fixedBitWidth) return;
        if (this.bitWidth == undefined) return;
        this.bitWidth = bitWidth;
        for (var i = 0; i < this.nodeList.length; i++)
            this.nodeList[i].bitWidth = bitWidth;
    }

    //Dummy resolve function
    //OVERRIDE if necessary
    this.resolve = function() {

    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
