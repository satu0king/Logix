var width;
var height;


uniqueIdCounter = 0;
unit = 10;
// updateSimulation = true;

wireToBeChecked = 0; // when node disconnects from another node
willBeUpdated = false;
objectSelection = false;
errorDetected = false;
// var backups = []

updatePosition=true;
updateSimulation=true;
updateCanvas = true;
gridUpdate=true;


loading = false;
DPR=1;
projectSaved = true;
//Exact same name as object constructor
moduleList = ["Input", "Output", "NotGate", "OrGate", "AndGate", "NorGate", "NandGate", "XorGate", "XnorGate", "SevenSegDisplay", "HexDisplay", "Multiplexer", "BitSelector", "Splitter", "Power", "Ground", "ConstantVal", "ControlledInverter", "TriState", "Adder", "Ram", "FlipFlop", "TTY", "Keyboard", "Clock", "DigitalLed", "Stepper", "VariableLed", "RGBLed", "Button", "Demultiplexer", "Buffer", "SubCircuit","Flag","MSB","LSB","PriorityEncoder"];

//Exact same name as object constructor
//All the combinational modules which give rise to an value(independently)
inputList = ["Buffer", "Stepper", "Ground", "Power", "ConstantVal", "Input", "Clock", "Button"];

//Scope object for each circuit level, globalScope for outer level
scopeList = {};
globalScope = undefined;


function showError(error) {
    // //console.log("ERROR: " + error);
    errorDetected = true;
    var id = Math.floor(Math.random() * 10000);
    $('#MessageDiv').append("<div class='errorMessage' id='" + id + "'> " + error + "</div>");
    setTimeout(function() {
        $('#' + id).fadeOut()
    }, 1500);
    // //console.log("<div class='errorMessage'>"+error+"</div>");
}
function showMessage(mes) {
    // //console.log("ERROR: " + error);
    errorDetected = true;
    var id = Math.floor(Math.random() * 10000);
    $('#MessageDiv').append("<div class='normalMessage' id='" + id + "'> " + mes + "</div>");
    setTimeout(function() {
        $('#' + id).fadeOut()
    }, 2500);
    // //console.log("<div class='errorMessage'>"+error+"</div>");
}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
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

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function Scope(name = "localScope",id=undefined) {
    //root object for referring to main canvas - intermediate node uses this
    this.id = id||Math.floor((Math.random() * 100000000000) + 1);
    this.CircuitElement = [];
    this.root = new CircuitElement(0, 0, this, "RIGHT", 1);
    this.backups = [];
    this.timeStamp = new Date().getTime();

    this.ox = 0;
    this.oy = 0;
    this.scale = DPR;

    this.clockTick = function() {
        for (var i = 0; i < this.Clock.length; i++)
            this.Clock[i].toggleState(); //tick clock!
        for (var i = 0; i < this.SubCircuit.length; i++)
            this.SubCircuit[i].localScope.clockTick(); //tick clock!
    }

    this.checkDependency = function(id) {
        if (id == this.id) return true;
        for (var i = 0; i < this.SubCircuit.length; i++)
            if (this.SubCircuit[i].id == id) return true;

        for (var i = 0; i < this.SubCircuit.length; i++)
            if (this.SubCircuit[i].localScope.checkDependency(id)) return true;
    }

    this.getDependencies = function() {
        var list = []
        for (var i = 0; i < this.SubCircuit.length; i++) {
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
    projectName = undefined;
    projectId = generateId();
    // globalScope = new Scope("globalScope"); //enabling scope
    // scopeList.push(globalScope);
    updateSimulation = true;
    DPR=window.devicePixelRatio||1;
    newCircuit("Main");

    // return;


    width = document.getElementById("simulation").clientWidth*DPR;
    height = (document.getElementById("simulation").clientHeight - document.getElementById("plot").clientHeight)*DPR;
    document.getElementById("canvasArea").style.height=height/DPR;
    plotArea.c.width = document.getElementById("plot").clientWidth;
    plotArea.c.height = document.getElementById("plot").clientHeight;

    // //console.log(width);
    //setup simulationArea
    backgroundArea.setup();
    plotArea.setup();
    simulationArea.setup();
    // update();
    dots();
    // scheduleUpdate();

    data = {}
    // data = JSON.parse(SAP_DATA);
    // load(data);
    // retrieving data
    // if(localStorage.getItem(window.location.hash)){
    //     var data=JSON.parse(localStorage.getItem("local"));
    //     load(data);
    //     simulationArea.changeClockTime(data["timePeriod"] || 500);
    //     // //console.log(localStorage.getItem("localHash"));
    //
    // }
    setTimeout(function(){
        resetup();
        if (window.location.hash.length > 1) {

            var http = new XMLHttpRequest();
            hash = window.location.hash.substr(1);
            // alert(hash);
            http.open("POST", "./index.php", true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var params = "retrieve=" + hash; // probably use document.getElementById(...).value
            http.send(params);
            http.onload = function() {
                // //console.log(http.responseText);
                if (http.responseText == "ERROR") alert("Error: could not load ");
                else {
                    //console.log(http.responseText);
                    data = JSON.parse(http.responseText);
                    //console.log("From Server:" + data);
                    load(data);
                    simulationArea.changeClockTime(data["timePeriod"] || 500);
                    // globalScope.backups.push(backUp(globalScope));
                }

            }

        } else if (localStorage.getItem("recover")) {


            var data = JSON.parse(localStorage.getItem("recover"));
            if (confirm("Would you like to recover: " + data.name)) {
                load(data);
            }
            localStorage.removeItem("recover");

        }
    },10);





}

//to resize window
function resetup() {

    DPR=window.devicePixelRatio||1;
    width = document.getElementById("simulation").clientWidth*DPR;
    height = (document.getElementById("simulation").clientHeight - document.getElementById("plot").clientHeight)*DPR;
    document.getElementById("backgroundArea").style.height=(document.getElementById("simulation").clientHeight - document.getElementById("plot").clientHeight)+100;
    document.getElementById("backgroundArea").style.width=document.getElementById("simulation").clientWidth+100;

    document.getElementById("canvasArea").style.height = height/DPR;
    simulationArea.canvas.width = width;
    simulationArea.canvas.height = height;
    backgroundArea.canvas.width = width+100*DPR;
    backgroundArea.canvas.height = height+100*DPR;

    plotArea.c.width = document.getElementById("plot").clientWidth;
    plotArea.c.height = document.getElementById("plot").clientHeight
    // simulationArea.setup();
    updateCanvas=true;
    update(); // INEFFICENT
    simulationArea.prevScale=0;
    dots(true, false);
}

window.onresize = resetup;
window.onorientationchange = resetup;

//for mobiles
window.addEventListener('orientationchange', resetup);


var backgroundArea = {
    canvas: document.getElementById("backgroundArea"),
    setup: function() {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        dots(true, false);
    },
    clear: function() {
        if (!this.context) return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    prevScale:0,
    oldx: 0,
    oldy: 0,

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
        // this.ClockInterval = setInterval(clockTick, 500);
        this.mouseDown = false;
        // this.shiftDown=false;


    },
    changeClockTime(t) {
        clearInterval(this.ClockInterval);
        t = t || prompt("Enter Time Period:");
        this.timePeriod = t;
        this.ClockInterval = setInterval(clockTick, t);
    },
    clear: function() {
        if (!this.context) return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function copyPaste(copyList) {
    if(copyList.length==0)return;
    tempScope = new Scope(globalScope.name,globalScope.id);
    var oldOx=globalScope.ox;
    var oldOy=globalScope.oy;
    var oldScale=globalScope.scale;
    d = backUp(globalScope);
    loadScope(tempScope, d);
    scopeList[tempScope.id]=tempScope;
    tempScope.backups=globalScope.backups;
    for (var i = 0; i < globalScope.objects.length; i++){
        var prevLength=globalScope[globalScope.objects[i]].length; // LOL length of list will reduce automatically when deletion starts
        // if(globalScope[globalScope.objects[i]].length)//console.log("deleting, ",globalScope[globalScope.objects[i]]);
        for (var j = 0; j < globalScope[globalScope.objects[i]].length; j++) {
            var obj = globalScope[globalScope.objects[i]][j];
            if (obj.objectType != 'Wire') { //}&&obj.objectType!='CircuitElement'){//}&&(obj.objectType!='Node'||obj.type==2)){
                if (!copyList.contains(globalScope[globalScope.objects[i]][j])) {
                    //console.log("DELETE:", globalScope[globalScope.objects[i]][j]);
                    globalScope[globalScope.objects[i]][j].cleanDelete();
                }
            }

            if(globalScope[globalScope.objects[i]].length!=prevLength){
                prevLength--;
                j--;
            }
        }
    }

    // updateSimulation = true;
    // update(globalScope);
    //console.log("DEBUG1",globalScope.wires.length)
    var prevLength=globalScope.wires.length;
    for (var i = 0; i < globalScope.wires.length; i++) {
        globalScope.wires[i].checkConnections();
        if(globalScope.wires.length!=prevLength){
            prevLength--;
            i--;
        }
    }
    //console.log(globalScope.wires,globalScope.allNodes)
    //console.log("DEBUG2",globalScope.wires.length)
    // update(globalScope);
    // //console.log(globalScope.wires.length)

    var approxX=0;
    var approxY=0;
    for (var i = 0; i < copyList.length; i++) {
        approxX+=copyList[i].x;
        approxY+=copyList[i].y;
    }
    approxX/=copyList.length;
    approxY/=copyList.length;

    approxX=Math.round(approxX/10)*10
    approxY=Math.round(approxY/10)*10
    for (var i = 0; i < globalScope.objects.length; i++)
        for (var j = 0; j < globalScope[globalScope.objects[i]].length; j++) {
            var obj = globalScope[globalScope.objects[i]][j];
            obj.updateScope(tempScope);
        }


    for (var i = 0; i < copyList.length; i++) {
        // //console.log(copyList[i]);
        copyList[i].x += simulationArea.mouseX-approxX;
        copyList[i].y += simulationArea.mouseY-approxY;

    }


    // for (var i = 0; i < globalScope.wires.length; i++) {
    //     globalScope.wires[i].updateScope(tempScope);
    // }

    for (l in globalScope) {
        if (globalScope[l] instanceof Array && l != "objects") {
            tempScope[l].extend(globalScope[l]);
            // //console.log("Copying , ",l);
        }
    }

    // update(tempScope);


    simulationArea.multipleObjectSelections = [];//copyList.slice();
    simulationArea.copyList = [];//copyList.slice();
    canvasUpdate=true;
    updateSimulation = true;
    globalScope = tempScope;
    scheduleUpdate();
    globalScope.ox=oldOx;
    globalScope.oy=oldOy;
    globalScope.scale=oldScale;

}
function paste(copyData) {
    if(copyData==undefined)return;
    var data=JSON.parse(copyData);
    if(!data["logixClipBoardData"])return;
    tempScope = new Scope(globalScope.name,globalScope.id);
    var oldOx=globalScope.ox;
    var oldOy=globalScope.oy;
    var oldScale=globalScope.scale;
    loadScope(tempScope,data);

    var prevLength=tempScope.allNodes.length
    for (var i = 0; i < tempScope.allNodes.length; i++) {
        tempScope.allNodes[i].checkDeleted();
        if(tempScope.allNodes.length!=prevLength){
            prevLength--;
            i--;
        }
    }

    // tempScope=simulationArea.copyScope;
    // update(globalScope);
    // //console.log(globalScope.wires.length)

    var approxX=0;
    var approxY=0;
    var count=0




    for (var i = 0; i < tempScope.objects.length; i++){
        for (var j = 0; j < tempScope[tempScope.objects[i]].length; j++) {
            var obj = tempScope[tempScope.objects[i]][j];
            obj.updateScope(globalScope);
            if(obj.objectType!="Wire"){
                approxX+=obj.x;
                approxY+=obj.y;
                count++;
            }
        }
    }





    approxX/=count
    approxY/=count

    approxX=Math.round(approxX/10)*10
    approxY=Math.round(approxY/10)*10


        for (var i = 0; i < tempScope.objects.length; i++){
            for (var j = 0; j < tempScope[tempScope.objects[i]].length; j++) {
                var obj=tempScope[tempScope.objects[i]][j];
                if(obj.objectType!="Wire"){
                    obj.x+=simulationArea.mouseX-approxX;
                    obj.y+=simulationArea.mouseY-approxY;
                }
            }
        }

        // //console.log(tempScope,approxX,approxY,count);
        // updateSimulation=true;
        // canvasUpdate=true;
        // update(tempScope);
        // return;



    // for (var i = 0; i < globalScope.wires.length; i++) {
    //     globalScope.wires[i].updateScope(tempScope);
    // }




    for (l in tempScope) {
        if (tempScope[l] instanceof Array && l != "objects" && l!="CircuitElement" ) {
            globalScope[l].extend(tempScope[l]);
            //console.log("Copying , ",l);
        }
    }




    // update(tempScope);


    // simulationArea.multipleObjectSelections = [];//copyList.slice();
    // simulationArea.copyList = [];//copyList.slice();
    canvasUpdate=true;
    updateSimulation = true;
    // globalScope = tempScope;
    scheduleUpdate();
    globalScope.ox=oldOx;
    globalScope.oy=oldOy;
    globalScope.scale=oldScale;

}
function cut(copyList) {
    if(copyList.length==0)return;
    tempScope = new Scope(globalScope.name,globalScope.id);
    var oldOx=globalScope.ox;
    var oldOy=globalScope.oy;
    var oldScale=globalScope.scale;
    d = backUp(globalScope);
    loadScope(tempScope, d);
    scopeList[tempScope.id]=tempScope;

    for(var i=0;i<copyList.length;i++){
        var obj=copyList[i];
        if(obj.objectType=="Node")obj.objectType="allNodes"
        for(var j=0;j<tempScope[obj.objectType].length;j++){
            if(tempScope[obj.objectType][j].x==obj.x&&tempScope[obj.objectType][j].y==obj.y&&(obj.objectType!="Node"||obj.type==2)){
                tempScope[obj.objectType][j].delete();
                break;
            }

        }
    }
    tempScope.backups=globalScope.backups;
    for (var i = 0; i < globalScope.objects.length; i++){
        var prevLength=globalScope[globalScope.objects[i]].length; // LOL length of list will reduce automatically when deletion starts
        // if(globalScope[globalScope.objects[i]].length)//console.log("deleting, ",globalScope[globalScope.objects[i]]);
        for (var j = 0; j < globalScope[globalScope.objects[i]].length; j++) {
            var obj = globalScope[globalScope.objects[i]][j];
            if (obj.objectType != 'Wire') { //}&&obj.objectType!='CircuitElement'){//}&&(obj.objectType!='Node'||obj.type==2)){
                if (!copyList.contains(globalScope[globalScope.objects[i]][j])) {
                    //console.log("DELETE:", globalScope[globalScope.objects[i]][j]);
                    globalScope[globalScope.objects[i]][j].cleanDelete();
                }
            }

            if(globalScope[globalScope.objects[i]].length!=prevLength){
                prevLength--;
                j--;
            }
        }
    }

    // updateSimulation = true;
    // update(globalScope);
    //console.log("DEBUG1",globalScope.wires.length)
    var prevLength=globalScope.wires.length;
    for (var i = 0; i < globalScope.wires.length; i++) {
        globalScope.wires[i].checkConnections();
        if(globalScope.wires.length!=prevLength){
            prevLength--;
            i--;
        }
    }
    // //console.log(globalScope.wires,globalScope.allNodes)
    // //console.log("DEBUG2",globalScope.wires.length)
    updateSimulation=true;
    // update(globalScope);

    // update(tempScope);
    var data=backUp(globalScope);
    data['logixClipBoardData']=true;
    data=JSON.stringify(data);


    simulationArea.multipleObjectSelections = [];//copyList.slice();
    simulationArea.copyList = [];//copyList.slice();
    canvasUpdate=true;
    updateSimulation = true;
    globalScope = tempScope;
    scheduleUpdate();
    globalScope.ox=oldOx;
    globalScope.oy=oldOy;
    globalScope.scale=oldScale;
    return data;
}
function copy(copyList) {
    if(copyList.length==0)return;
    tempScope = new Scope(globalScope.name,globalScope.id);
    var oldOx=globalScope.ox;
    var oldOy=globalScope.oy;
    var oldScale=globalScope.scale;
    d = backUp(globalScope);
    loadScope(tempScope, d);
    scopeList[tempScope.id]=tempScope;
    tempScope.backups=globalScope.backups;
    for (var i = 0; i < globalScope.objects.length; i++){
        var prevLength=globalScope[globalScope.objects[i]].length; // LOL length of list will reduce automatically when deletion starts
        // if(globalScope[globalScope.objects[i]].length)//console.log("deleting, ",globalScope[globalScope.objects[i]]);
        for (var j = 0; j < globalScope[globalScope.objects[i]].length; j++) {
            var obj = globalScope[globalScope.objects[i]][j];
            if (obj.objectType != 'Wire') { //}&&obj.objectType!='CircuitElement'){//}&&(obj.objectType!='Node'||obj.type==2)){
                if (!copyList.contains(globalScope[globalScope.objects[i]][j])) {
                    //console.log("DELETE:", globalScope[globalScope.objects[i]][j]);
                    globalScope[globalScope.objects[i]][j].cleanDelete();
                }
            }

            if(globalScope[globalScope.objects[i]].length!=prevLength){
                prevLength--;
                j--;
            }
        }
    }

    // updateSimulation = true;
    // update(globalScope);
    //console.log("DEBUG1",globalScope.wires.length)
    var prevLength=globalScope.wires.length;
    for (var i = 0; i < globalScope.wires.length; i++) {
        globalScope.wires[i].checkConnections();
        if(globalScope.wires.length!=prevLength){
            prevLength--;
            i--;
        }
    }
    // //console.log(globalScope.wires,globalScope.allNodes)
    // //console.log("DEBUG2",globalScope.wires.length)
    updateSimulation=true;
    // update(globalScope);

    // update(tempScope);
    var data=backUp(globalScope);
    data['logixClipBoardData']=true;
    data=JSON.stringify(data);


    simulationArea.multipleObjectSelections = [];//copyList.slice();
    simulationArea.copyList = [];//copyList.slice();
    canvasUpdate=true;
    updateSimulation = true;
    globalScope = tempScope;
    scheduleUpdate();
    globalScope.ox=oldOx;
    globalScope.oy=oldOy;
    globalScope.scale=oldScale;
    return data;
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
    if (this.x == undefined || this.y == undefined) {
        this.x = simulationArea.mouseX;
        this.y = simulationArea.mouseY;
        this.newElement = true;
        this.hover = true;
    }
    this.deleteNodesWhenDeleted = true; // FOR NOW - TO CHECK LATER

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
    //console.log()
    this.scope[this.objectType].push(this); // CHECK IF THIS IS VALID
    this.bitWidth = bitWidth || parseInt(prompt("Enter bitWidth"), 10);
    this.direction = dir;
    this.directionFixed = false;
    this.labelDirection = dir;
    this.orientationFixed = true; // should it be false?
    this.fixedBitWidth = false;
    this.flipBits=function(val){
        return ((~val >>> 0) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
    }
    this.absX = function() {
        return this.x;
    }
    this.absY = function() {
        return this.y;
    }
    this.copyFrom = function(obj) {
        var properties = ["label", "labelDirection"];
        for (var i = 0; i < properties.length; i++) {
            if (obj[properties[i]] !== undefined)
                this[properties[i]] = obj[properties[i]];
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

    this.updateScope = function(scope) {
        this.scope = scope;
        for (var i = 0; i < this.nodeList.length; i++)
            this.nodeList[i].scope = scope;
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

    this.checkHover=function(){

        for(var i=0;i<this.nodeList.length;i++){
            this.nodeList[i].checkHover();
        }
        if(!simulationArea.mouseDown){
            if(simulationArea.hover==this){
                this.hover=this.isHover();
                if(!this.hover)simulationAreas.hover=undefined;
            }
            else if(!simulationArea.hover){
                this.hover=this.isHover();
                if(this.hover)simulationArea.hover=this;
            }
            else{
                this.hover=false
            }
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


    this.startDragging = function() {
        this.oldx = this.x;
        this.oldy = this.y;
    }
    this.drag = function() {
        this.x = this.oldx + simulationArea.mouseX - simulationArea.mouseDownX;
        this.y = this.oldy + simulationArea.mouseY - simulationArea.mouseDownY;
    }
    this.update = function() {

        var update = false;


        update |= this.newElement;
        if (this.newElement) {
            this.x = simulationArea.mouseX;
            this.y = simulationArea.mouseY;
            if (simulationArea.mouseDown) {
                this.newElement = false;
                simulationArea.lastSelected = this;
            } else return;
        }
        // //console.log(this.nodeList)
        for (var i = 0; i < this.nodeList.length; i++) {
            update |= this.nodeList[i].update();
        }

        if(!simulationArea.hover||simulationArea.hover==this)
        this.hover=this.isHover();

        if (!simulationArea.mouseDown) this.hover = false;


        if ((this.clicked || !simulationArea.hover) && this.isHover()) {
            this.hover = true;
            simulationArea.hover = this;
        } else if (!simulationArea.mouseDown && this.hover && this.isHover() == false) {
            if (this.hover) simulationArea.hover = undefined;
            this.hover = false;
        }

        if (simulationArea.mouseDown && (this.clicked)) {
            // if (this.x == simulationArea.mouseX && this.y == simulationArea.mouseY) return false;
            // this.x = this.oldx + simulationArea.mouseX - simulationArea.mouseDownX;
            // this.y = this.oldy + simulationArea.mouseY - simulationArea.mouseDownY;
            this.drag();
            if (!simulationArea.shiftDown && simulationArea.multipleObjectSelections.contains(this)) {
                for (var i = 0; i < simulationArea.multipleObjectSelections.length; i++) {
                    simulationArea.multipleObjectSelections[i].drag();
                }
            }

            update |= true;
        } else if (simulationArea.mouseDown && !simulationArea.selected) {
            // this.oldx = this.x;
            // this.oldy = this.y;
            this.startDragging();
            if (!simulationArea.shiftDown && simulationArea.multipleObjectSelections.contains(this)) {
                for (var i = 0; i < simulationArea.multipleObjectSelections.length; i++) {
                    simulationArea.multipleObjectSelections[i].startDragging();
                }
            }
            simulationArea.selected = this.clicked = this.hover ;

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
        //     //console.log(this);

        return update;
    }

    this.fixDirection = function() {
        this.direction = fixDirection[this.direction] || this.direction;
        this.labelDirection = fixDirection[this.labelDirection] || this.labelDirection;
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
        var mouseX = simulationArea.mouseX;
        var mouseY = simulationArea.mouseY;
        if(Math.abs(mouseX-this.x>200)||Math.abs(mouseY-this.y>200))return false;
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

        if (mouseX - this.x <= rX && this.x - mouseX <= lX && mouseY - this.y <= dY && this.y - mouseY <= uY) return true;

        return false;
    };

    this.setLabel = function(label) {
        this.label = label || ""
    }

    //Method that draws the outline of the module and calls draw function on module Nodes.
    //NOT OVERIDABLE
    this.draw = function() {

        this.checkHover();
        if(this.x*this.scope.scale+this.scope.ox<-this.rightDimensionX*this.scope.scale-00||this.x*this.scope.scale+this.scope.ox>width+this.leftDimensionX*this.scope.scale+00||this.y*this.scope.scale+this.scope.oy<-this.downDimensionY*this.scope.scale-00||this.y*this.scope.scale+this.scope.oy>height+00+this.upDimensionY*this.scope.scale)return;
        // if(!simulationArea.mouseDown){
        //     this.hover=this.isHover();
        // }
        // Draws rectangle and highlighs
        if (this.rectangleObject) {
            ctx = simulationArea.context;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.lineWidth = correctWidth(3);
            ctx.beginPath();
            rect2(ctx, -this.leftDimensionX, -this.upDimensionY, this.leftDimensionX + this.rightDimensionX, this.upDimensionY + this.downDimensionY, this.x, this.y, [this.direction, "RIGHT"][+this.directionFixed]);
            if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
            ctx.fill();
            ctx.stroke();
            // if (this.hover)
            //     //console.log(this);
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
        if (this.deleteNodesWhenDeleted)
            for (var i = 0; i < this.nodeList.length; i++)
                this.nodeList[i].delete();
        else
            for (var i = 0; i < this.nodeList.length; i++)
                if (this.nodeList[i].connections.length)
                    this.nodeList[i].converToIntermediate();
                else
                    this.nodeList[i].delete();
    }

    this.cleanDelete = function() {
        this.deleteNodesWhenDeleted = true;
        this.delete();
    }
    //method to change direction
    //OVERRIDE WITH CAUTION
    this.newDirection = function(dir) {
        if (this.direction == dir) return;
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
        this.labelDirection = dir;
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
