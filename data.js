function newCircuit(name,id){
    name=name||prompt("Enter circuit name:");
    var scope=new Scope(name);
    if(id)scope.id=id;
    scopeList[scope.id]=scope;
    globalScope=scope;
    $('#toolbar').append("<div class='circuits toolbarButton' id='"+scope.id+"'>"+name+"</div>");
    $('.circuits').click(function(){switchCircuit(this.id)});
    return scope;
}

function switchCircuit(id){
    // scheduleBackup();
    console.log(id);
    if(id==globalScope.id)return;
    simulationArea.lastSelected=undefined;
    simulationArea.multipleObjectSelections=[];
    simulationArea.copyList=[];
    globalScope=scopeList[id];
    toBeUpdated=true;
    // scheduleUpdate();

}

function saveAsImg() {
    //window.open(simulationArea.canvas.toDataURL('image/png'));
    var gh = simulationArea.canvas.toDataURL('image/png');
    var name = prompt("Enter imagename");
    if (name != null) {
        var filename = name;
        var anchor = document.createElement('a');
        anchor.href = gh;
        anchor.download = filename + '.png';
    }
    anchor.click()
}

function undo(scope=globalScope){
    if (scope.backups.length == 0) return;
    var backupOx = simulationArea.ox;
    var backupOy = simulationArea.oy;
    simulationArea.ox = 0;
    simulationArea.oy = 0;
    tempScope = new Scope(scope.name);
    loading = true;
    loadScope(tempScope, JSON.parse(scope.backups.pop()));
    tempScope.backups=scope.backups;
    tempScope.id=scope.id;
    scopeList[scope.id]=tempScope;
    globalScope=tempScope;
    simulationArea.ox = backupOx;
    simulationArea.oy = backupOy;
    loading = false;
}
//helper fn
function extract(obj) {
    return obj.saveObject();
}
function scheduleBackup(scope=globalScope) {
    // return;
    // setTimeout(function(){
    var backup = JSON.stringify(backUp(scope));
    // if(backups.length==0||backups[backups.length-1]!=backup){
    if(scope.backups.length==0||scope.backups[scope.backups.length-1]!=backup){
        scope.backups.push(backup);
        scope.timeStamp=new Date().getTime();
    }
    return backup;

    // }
    // }, 1000);
}

//fn to create save data
function backUp(scope=globalScope) {
    var data = {};
    data["allNodes"] = scope.allNodes.map(extract);
    data["id"]=scope.id;
    data["name"]=scope.name;

    for (var i = 0; i < moduleList.length; i++) {
        data[moduleList[i]] = scope[moduleList[i]].map(extract);
    }


    data["nodes"] = []
    for (var i = 0; i < scope.nodes.length; i++)
        data["nodes"].push(scope.allNodes.indexOf(scope.nodes[i]));
    // console.log(data);
    return data

}


function Save() {
    // var data = backUp();
    data={}
    data["name"] = "DATA";//prompt("EnterName:");
    data["timePeriod"] = simulationArea.timePeriod;
    data.scopes=[]
    var dependencyList={};
    var completed={};
    for(id in scopeList)
        dependencyList[id]=scopeList[id].getDependencies();

    function saveScope(id){
        // console.log(id);
        // console.log(dependencyList);
        if(completed[id])return;
        for(var i=0;i<dependencyList[id].length;i++)
            saveScope(dependencyList[id][i]);
        completed[id]=true;
        data.scopes.push(backUp(scopeList[id]));
        console.log("SAVING:",scopeList[id].name,id);

    }
    for(id in scopeList)
        saveScope(id);
    console.log(data);
    // return;

    //covnvert to text
    data = JSON.stringify(data)
    console.log(data);

    var http = new XMLHttpRequest();
    http.open("POST", "./index.php", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "data=" + data; // send the data
    http.send(params);
    http.onload = function() {
        window.location.hash = http.responseText; // assign hash key
    }
}

function load(data){
    $('#'+globalScope.id).remove();
    delete scopeList[globalScope.id];
    for(var i=0;i<data.scopes.length;i++){
        var scope=newCircuit(data.scopes[i].name,data.scopes[i].id);
        loadScope(scope,data.scopes[i]);
    }
}

function loadModule(data, scope) {
    // console.log(data);
    obj = new window[data["objectType"]](data["x"], data["y"], scope, ...data.customData["constructorParamaters"] || []);
    obj.label = data["label"];
    obj.labelDirection = data["labelDirection"] || oppositeDirection[fixDirection[obj.direction]];
    obj.fixDirection();
    if (data.customData["values"])
        for (prop in data.customData["values"]) {
            obj[prop] = data.customData["values"][prop];
        }
    if (data.customData["nodes"])
        for (node in data.customData["nodes"]) {
            var n = data.customData["nodes"][node]
            if (n instanceof Array) {
                for (var i = 0; i < n.length; i++) {
                    // console.log(obj[node],obj[node][i],i);
                    obj[node][i] = replace(obj[node][i], n[i]);
                }
            } else {
                obj[node] = replace(obj[node], n);
            }
        }

}

function loadScope(scope, data) {
    // console.log(data);
    data["allNodes"].map(function(x) {
        return loadNode(x, scope)
    });

    for (var i = 0; i < data["allNodes"].length; i++)
        constructNodeConnections(scope.allNodes[i], data["allNodes"][i]);

    for (var i = 0; i < moduleList.length; i++) {
        if (data[moduleList[i]]) {
            if (moduleList[i] == "SubCircuit") {
                for (var j = 0; j < data[moduleList[i]].length; j++)
                    loadSubCircuit(data[moduleList[i]][j], scope);
            } else {
                for (var j = 0; j < data[moduleList[i]].length; j++)
                    loadModule(data[moduleList[i]][j], scope);
            }
        }
    }

    scope.wires.map(function(x) {
        x.updateData()
    });
}
