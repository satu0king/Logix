function loadSubCircuit(savedData, scope) {
    var v = new SubCircuit(savedData["x"], savedData["y"], scope,savedData["id"], savedData);
}

//subCircuit
function SubCircuit(x, y, scope = globalScope,id=undefined, savedData = undefined) {




    this.id = id||prompt("Enter Id: ");
    if(scopeList[this.id]==undefined){
        showError("SubCircuit : "+((savedData&&savedData.title)||this.id)+" Not found");

    }
    else if(scopeList[this.id].checkDependency(scope.id)){
        showError("Cyclic Circuit Error");
    }

    if(scopeList[this.id]==undefined||scopeList[this.id].checkDependency(scope.id)){
        if(savedData){

            for (var i = 0; i < savedData["inputNodes"].length; i++) {
                scope.allNodes[savedData["inputNodes"][i]].deleted=true;

            }
            for (var i = 0; i < savedData["outputNodes"].length; i++) {
                scope.allNodes[savedData["outputNodes"][i]].deleted=true;
            }
        }
        return;

    }

    CircuitElement.call(this, x, y, scope, "RIGHT", 1);
    this.directionFixed = true;
    this.fixedBitWidth = true;

    this.savedData = savedData;
    this.localScope = new Scope();
    this.inputNodes = [];
    this.outputNodes = [];
    this.width = 0;
    this.height = 0;
    this.title = "";



    if (this.savedData != undefined) {
        this.height = savedData["height"];
        this.width = savedData["width"];
        this.setDimensions(this.width / 2, this.height / 2);
        this.id = savedData["id"];
        for (var i = 0; i < this.savedData["inputNodes"].length; i++) {
            this.inputNodes.push(this.scope.allNodes[this.savedData["inputNodes"][i]]);
            this.inputNodes[i].parent = this;
        }
        for (var i = 0; i < this.savedData["outputNodes"].length; i++) {
            this.outputNodes.push(this.scope.allNodes[this.savedData["outputNodes"][i]]);
            this.outputNodes[i].parent = this;
        }
        this.nodeList.extend(this.inputNodes);
        this.nodeList.extend(this.outputNodes);
    }

    this.buildCircuit = function() {
        
        loadScope(this.localScope, this.data);
        this.lastUpdated=scopeList[this.id].timeStamp;
        updateSimulation = true;
        updateCanvas = true;
        this.width = 100;
        // this.title = document.getElementById(this.id).innerHTML;
        this.localScope.name = this.title;
        this.height = Math.max(this.localScope.Input.length, this.localScope.Output.length) * 20 + 30;
        this.setDimensions(this.width / 2, this.height / 2);

        if (this.savedData == undefined) {
            for (var i = 0; i < this.localScope.Input.length; i++) {
                var a = new Node(-this.width / 2, -this.localScope.Input.length * 10 + 20 * i + 10, 0, this, this.localScope.Input[i].bitWidth);
                this.inputNodes.push(a);
            }
            for (var i = 0; i < this.localScope.Output.length; i++) {
                var a = new Node(this.width / 2, -this.localScope.Output.length * 10 + 20 * i + 10, 1, this, this.localScope.Output[i].bitWidth);
                this.outputNodes.push(a);
            }
        }

    }



    // for(var i=0;i<scopeList.length;i++){
    //     if(scopeList[i].id==this.id){

            // this.data=JSON.parse(scopeList[this.id].backups[scopeList[this.id].backups.length-1]);
            this.data=JSON.parse(scheduleBackup(scopeList[this.id]));
            this.title=scopeList[this.id].name;
            this.buildCircuit();
        //     break;
        // }
    // }



    // var http = new XMLHttpRequest();
    // http.open("POST", "./index.php", true);
    // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // var params = "retrieve=" + this.id; // probably use document.getElementById(...).value
    // http.send(params);
    // http.parent = this;
    //
    //
    // http.onload = function() {
    //     // console.log(this.parent);
    //     if (http.responseText == "ERROR") {
    //         alert("Error: could not load ");
    //         this.parent.delete();
    //         return;
    //     } else {
    //         this.parent.data = JSON.parse(http.responseText);
    //         this.parent.buildCircuit();
    //     }
    // }
    this.reBuild=function(){
        new SubCircuit(x=this.x, y=this.y, scope = this.scope, this.direction,this.id)
        this.delete();
    }
    this.reBuildCircuit=function(){
        this.data=JSON.parse(scheduleBackup(scopeList[this.id]));
        this.localScope=new Scope();
        loadScope(this.localScope, this.data);
        this.lastUpdated=scopeList[this.id].timeStamp;
    }
    this.reset = function() {
        if(scopeList[this.id].Input.length==this.inputNodes.length){
            l=scopeList[this.id].Input;
            for(var i=0;i<l.length;i++){
                this.inputNodes[i].bitWidth=l[i].bitWidth;
            }
        }
        else{
            this.reBuild();
            return;
        }

        if(scopeList[this.id].Output.length==this.outputNodes.length){
            l=scopeList[this.id].Output;
            for(var i=0;i<l.length;i++){
                this.outputNodes[i].bitWidth=l[i].bitWidth;
            }
        }
        else{
            this.reBuild();
            return;
        }

        if(scopeList[this.id].timeStamp>this.lastUpdated)this.reBuildCircuit();


        for (var i = 0; i < this.localScope.allNodes.length; i++)
            this.localScope.allNodes[i].reset();
        for (var i = 0; i < this.localScope.SubCircuit.length; i++) {
            this.localScope.SubCircuit[i].reset();
        }

    }
    this.click = function() {
        // this.id=prompt();
    }
    // this.isResolvable = function() {
    //     return true;
    // }
    this.dblclick = function() {
        // var prevHash = window.location.hash;
        // window.location.hash = simulationArea.lastSelected.id;
        // openInNewTab(window.location.href);
        // window.location.hash = prevHash;
        switchCircuit(this.id)
    }
    this.saveObject = function() {
        var data = {
            x: this.x,
            y: this.y,
            id: this.id,
            title:this.title,
            height: this.height,
            width: this.width,
            dir: this.direction,
            inputNodes: this.inputNodes.map(findNode),
            outputNodes: this.outputNodes.map(findNode),
        }
        return data;
    }

    this.resolve = function() {
        // return;

        for (i = 0; i < this.localScope.Input.length; i++) {
            this.localScope.Input[i].state = this.inputNodes[i].value;
        }

        for (i = 0; i < this.localScope.Input.length; i++) {
            this.localScope.stack.push(this.localScope.Input[i]);
        }
        play(this.localScope);

        for (i = 0; i < this.localScope.Output.length; i++) {
            this.outputNodes[i].value = this.localScope.Output[i].inp1.value;
        }
        for (i = 0; i < this.localScope.Output.length; i++) {
            this.scope.stack.push(this.outputNodes[i]);
        }



    }
    this.customDraw = function() {

        ctx = simulationArea.context;

        ctx.lineWidth = globalScope.scale*  3;
        ctx.strokeStyle = "black"; //("rgba(0,0,0,1)");
        ctx.fillStyle = "white";
        var xx = this.x;
        var yy = this.y;

        ctx.beginPath();

        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        fillText(ctx, this.title, xx, yy - this.height / 2 + 13, 14);

        ctx.textAlign = "left";

        for (var i = 0; i < this.localScope.Input.length; i++) {
            fillText(ctx, this.localScope.Input[i].label, -this.width / 2 + 5 + xx, yy - this.localScope.Input.length * 10 + 20 * i + 10 + 5, 14);
        }
        ctx.textAlign = "right";
        for (var i = 0; i < this.localScope.Output.length; i++) {
            fillText(ctx, this.localScope.Output[i].label, this.width / 2 - 5 + xx, yy - this.localScope.Output.length * 10 + 20 * i + 10 + 5, 14);
        }
        ctx.fill();

        for (var i = 0; i < this.inputNodes.length; i++)
            this.inputNodes[i].draw();
        for (var i = 0; i < this.outputNodes.length; i++)
            this.outputNodes[i].draw();

    }

}
