function newCircuit(name, id) {
    name = name || prompt("Enter circuit name:");
    var scope = new Scope(name);
    if (id) scope.id = id;
    scopeList[scope.id] = scope;
    globalScope = scope;
    $('#toolbar').append("<div class='circuits toolbarButton' id='" + scope.id + "'>" + name + "</div>");
    $('.circuits').click(function() {
        switchCircuit(this.id)
    });
    dots(true, false);
    return scope;
}

function clearProject(){
    globalScope=undefined;
    scopeList={};
    $('.circuits').remove();
    newCircuit("main");

}
function generateSvg(){
    resolution=1;
    view = "full"

    var backUpOx = globalScope.ox;
    var backUpOy = globalScope.oy;
    var backUpWidth = width
    var backUpHeight = height;
    var backUpScale = globalScope.scale;
    backUpContextBackground = backgroundArea.context;
    backUpContextSimulation = simulationArea.context;
    backgroundArea.context = simulationArea.context;
    globalScope.ox*=resolution/backUpScale;
    globalScope.oy*=resolution/backUpScale;

    globalScope.scale=resolution;

    var scope = globalScope;

    console.log("DIM:",width,height)
    if (view == "full") {
        var minX = 10000000;
        var minY = 10000000;
        var maxX = -10000000;
        var maxY = -10000000;
        var maxDimension=0;
        for (var i = 0; i < scope.objects.length; i++)
            for (var j = 0; j < scope[scope.objects[i]].length; j++) {
                if (scope[scope.objects[i]][j].objectType !== "Wire") {
                    console.log("obj:",scope[scope.objects[i]][j])
                    minX = Math.min(minX, scope[scope.objects[i]][j].absX());
                    maxX = Math.max(maxX, scope[scope.objects[i]][j].absX());
                    minY = Math.min(minY, scope[scope.objects[i]][j].absY());
                    maxY = Math.max(maxY, scope[scope.objects[i]][j].absY());
                    maxDimension=Math.max(maxDimension,scope[scope.objects[i]][j].leftDimensionX)
                    maxDimension=Math.max(maxDimension,scope[scope.objects[i]][j].rightDimensionX)
                    maxDimension=Math.max(maxDimension,scope[scope.objects[i]][j].upDimensionY)
                    maxDimension=Math.max(maxDimension,scope[scope.objects[i]][j].downDimensionY)
                }
            }

        // width = (maxX - minX + 60) * resolution;
        // height = (maxY - minY + 60) * resolution;
        //
        // globalScope.ox = (-minX + maxDimension+11)*resolution;
        // globalScope.oy = (-minY + maxDimension-6)*resolution;
        width = (maxX - minX + 2*maxDimension+10) * resolution;
        height = (maxY - minY + 2*maxDimension+10) * resolution;

        globalScope.ox = (-minX + maxDimension+5)*resolution;
        globalScope.oy = (-minY + maxDimension+5)*resolution;
    }
    else{
        width=(width*resolution)/backUpScale;
        height=(height*resolution)/backUpScale;
    }
    console.log("DIM:",width,height)
    globalScope.ox=Math.round(globalScope.ox);
    globalScope.oy=Math.round(globalScope.oy);

    simulationArea.canvas.width = width;
    simulationArea.canvas.height = height;
    backgroundArea.canvas.width = width;
    backgroundArea.canvas.height = height;
    simulationArea.context = new C2S(width,height);
    backgroundArea.context = simulationArea.context;

    simulationArea.clear();


    for (var i = 0; i < scope.objects.length; i++)
        for (var j = 0; j < scope[scope.objects[i]].length; j++)
            scope[scope.objects[i]][j].draw();

    var mySerializedSVG = simulationArea.context.getSerializedSvg(); //true here, if you need to convert named to numbered entities.
    download("test.svg",mySerializedSVG);
    width = backUpWidth
    height = backUpHeight
    console.log("DIM:",width,height)
    simulationArea.canvas.width = width;
    simulationArea.canvas.height = height;
    backgroundArea.canvas.width = width;
    backgroundArea.canvas.height = height;
    globalScope.scale=backUpScale;
    backgroundArea.context = backUpContextBackground;
    simulationArea.context = backUpContextSimulation;
    globalScope.ox = backUpOx
    globalScope.oy = backUpOy;

      toBeUpdated=true;
      updateCanvas=true;
      scheduleUpdate();
      dots(true,false);

  }

function switchCircuit(id) {
    scheduleBackup();
    console.log(id);
    if (id == globalScope.id) return;
    simulationArea.lastSelected = undefined;
    simulationArea.multipleObjectSelections = [];
    simulationArea.copyList = [];
    globalScope = scopeList[id];
    toBeUpdated = true;
    scheduleBackup();
    undo();
    dots(true, false);

}

function saveAsImg(name,imgType) {

      var gh = simulationArea.canvas.toDataURL('image/' +imgType);
          var anchor = document.createElement('a');
          anchor.href = gh;
          anchor.download = name+'.'+imgType;
      anchor.click()

}

function undo(scope = globalScope) {
    if (scope.backups.length == 0) return;
    var backupOx = globalScope.ox;
    var backupOy = globalScope.oy;
    var backupScale = globalScope.scale;
    globalScope.ox = 0;
    globalScope.oy = 0;
    tempScope = new Scope(scope.name);
    loading = true;
    loadScope(tempScope, JSON.parse(scope.backups.pop()));
    tempScope.backups = scope.backups;
    tempScope.id = scope.id;
    scopeList[scope.id] = tempScope;
    globalScope = tempScope;
    globalScope.ox = backupOx;
    globalScope.oy = backupOy;
    globalScope.scale = backupScale;
    loading = false;
}
//helper fn
function extract(obj) {
    return obj.saveObject();
}

function scheduleBackup(scope = globalScope) {
    // return;
    // setTimeout(function(){
    var backup = JSON.stringify(backUp(scope));
    // if(backups.length==0||backups[backups.length-1]!=backup){
    if (scope.backups.length == 0 || scope.backups[scope.backups.length - 1] != backup) {
        scope.backups.push(backup);
        scope.timeStamp = new Date().getTime();
    }

    return backup;

    // }
    // }, 1000);
}

//fn to create save data
function backUp(scope = globalScope) {
    var data = {};
    data["allNodes"] = scope.allNodes.map(extract);
    data["id"] = scope.id;
    data["name"] = scope.name;

    for (var i = 0; i < moduleList.length; i++) {
        data[moduleList[i]] = scope[moduleList[i]].map(extract);
    }


    data["nodes"] = []
    for (var i = 0; i < scope.nodes.length; i++)
        data["nodes"].push(scope.allNodes.indexOf(scope.nodes[i]));
    // console.log(data);
    return data

}

function generateDependencyOrder() {
    var dependencyList = {};
    var completed = {};
    for (id in scopeList)
        dependencyList[id] = scopeList[id].getDependencies();

    function saveScope(id) {
        if (completed[id]) return;
        for (var i = 0; i < dependencyList[id].length; i++)
            saveScope(dependencyList[id][i]);
        completed[id] = true;
        data.scopes.push(id);
    }
}

function generateSaveData(){
    data = {}
    data["name"] = "DATA"; //prompt("EnterName:");
    data["timePeriod"] = simulationArea.timePeriod;
    data.scopes = []
    var dependencyList = {};
    var completed = {};
    for (id in scopeList)
        dependencyList[id] = scopeList[id].getDependencies();

    function saveScope(id) {
        // console.log(id);
        // console.log(dependencyList);
        if (completed[id]) return;
        for (var i = 0; i < dependencyList[id].length; i++)
            saveScope(dependencyList[id][i]);
        completed[id] = true;
        data.scopes.push(backUp(scopeList[id]));
        console.log("SAVING:", scopeList[id].name, id);

    }
    for (id in scopeList)
        saveScope(id);
    console.log(data);
    // return;

    //covnvert to text
    data = JSON.stringify(data);
    return data;
}
function Save() {
    // var data = backUp();

    var data=generateSaveData();

    var http = new XMLHttpRequest();
    http.open("POST", "./index.php", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "data=" + data; // send the data
    http.send(params);
    http.onload = function() {
        window.location.hash = http.responseText; // assign hash key
    }
}

function load(data) {
    // $('#' + globalScope.id).remove();
    // delete scopeList[globalScope.id];
    globalScope=undefined;
    scopeList={};
    $('.circuits').remove();

    for (var i = 0; i < data.scopes.length; i++) {
        var scope = newCircuit(data.scopes[i].name, data.scopes[i].id);
        loadScope(scope, data.scopes[i]);
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
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
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


createSaveAsImgPrompt = function(scope = globalScope) {
$('#saveImageDialog').dialog({
        width: "auto",
        buttons: [{
            text: "Render Circuit Image",
            click: function(){generateImage(); $(this).dialog("close");},
        }]

    });
    $("input[name=imgType]").change(function(){
        $('input[name=resolution]').prop("disabled",false);
        $('input[name=transparent]').prop("disabled",false);
        var imgType=$('input[name=imgType]:checked').val();
        if(imgType=='svg'){
            $('input[name=resolution][value=1]').click();
            $('input[name=resolution]').prop("disabled",true);
        }
        else if(imgType!='png'){
            $('input[name=transparent]').attr('checked', false);
            $('input[name=transparent]').prop("disabled",true);
        }
    });
}

createSubCircuitPrompt = function(scope = globalScope) {
    $('#insertSubcircuitDialog').empty();
    for(id in scopeList){
        if(!scopeList[id].checkDependency(scope.id))
            $('#insertSubcircuitDialog').append('<p>'+scopeList[id].name+'<input type="radio" name="subCircuitId" value="'+id+'" />'+'</p>');
    }
$('#insertSubcircuitDialog').dialog({
        width: "auto",
        buttons: [{
            text: "Insert SubCircuit",
            click: function(){
                if(!$("input[name=subCircuitId]:checked").val())return;
                new SubCircuit(undefined,undefined,globalScope,$("input[name=subCircuitId]:checked").val());
                $(this).dialog("close");
            },
        }]

    });

}

window.onbeforeunload = function(){
   localStorage.setItem("local",generateSaveData());
   localStorage.setItem("localHash",window.location.hash);

}


function generateImage() {
    var imgType = $('input[name=imgType]:checked').val();
    var view = $('input[name=view]:checked').val();
    var transparent = $('input[name=transparent]:checked').val();
    var resolution = $('input[name=resolution]:checked').val();
    console.log($('input[name=imgType]:checked').val());
    console.log($('input[name=view]:checked').val());
    console.log($('input[name=transparent]:checked').val());
    console.log($('input[name=resolution]:checked').val());

      var backUpOx = globalScope.ox;
      var backUpOy = globalScope.oy;
      var backUpWidth = width
      var backUpHeight = height;
      var backUpScale = globalScope.scale;
      backUpContextBackground = backgroundArea.context;
      backUpContextSimulation = simulationArea.context;
      backgroundArea.context = simulationArea.context;
      globalScope.ox*=1/backUpScale;
      globalScope.oy*=1/backUpScale;

      if(imgType=='svg'){
              simulationArea.context = new C2S(width,height);
              resolution=1;
      }
      else if (imgType!='png') {
          transparent=false;
      }

      globalScope.scale=resolution;


      var scope = globalScope;

      console.log("DIM:",width,height);


      if (view == "full") {
          var minX = 10000000;
          var minY = 10000000;
          var maxX = -10000000;
          var maxY = -10000000;
          for (var i = 0; i < scope.objects.length; i++)
              for (var j = 0; j < scope[scope.objects[i]].length; j++) {
                  if (scope[scope.objects[i]][j].objectType !== "Wire") {
                      console.log("obj:",scope[scope.objects[i]][j])
                      minX = Math.min(minX, scope[scope.objects[i]][j].absX());
                      maxX = Math.max(maxX, scope[scope.objects[i]][j].absX());
                      minY = Math.min(minY, scope[scope.objects[i]][j].absY());
                      maxY = Math.max(maxY, scope[scope.objects[i]][j].absY());
                  }
              }
          width = (maxX - minX + 400) * resolution;
          height = (maxY - minY + 400) * resolution;

          globalScope.ox = (-minX + 200)*resolution;
          globalScope.oy = (-minY + 200)*resolution;
      }
      else{
          width=(width*resolution)/backUpScale;
          height=(height*resolution)/backUpScale;
      }
      console.log("DIM:",width,height)
      globalScope.ox=Math.round(globalScope.ox);
      globalScope.oy=Math.round(globalScope.oy);

      simulationArea.canvas.width = width;
      simulationArea.canvas.height = height;
      backgroundArea.canvas.width = width;
      backgroundArea.canvas.height = height;


      backgroundArea.context = simulationArea.context;

      simulationArea.clear();

      if (!transparent) {
          simulationArea.context.fillStyle = "white";
          simulationArea.context.rect(0, 0, width, height);
          simulationArea.context.fill();
      }

      for (var i = 0; i < scope.objects.length; i++)
          for (var j = 0; j < scope[scope.objects[i]].length; j++)
              scope[scope.objects[i]][j].draw();
      if(imgType=='svg'){
          var mySerializedSVG = simulationArea.context.getSerializedSvg(); //true here, if you need to convert named to numbered entities.
          download(globalScope.name+".svg",mySerializedSVG);
      }
      else{
          saveAsImg(globalScope.name,imgType)
      }
      width = backUpWidth
      height = backUpHeight
      console.log("DIM:",width,height)
      simulationArea.canvas.width = width;
      simulationArea.canvas.height = height;
      backgroundArea.canvas.width = width;
      backgroundArea.canvas.height = height;
      globalScope.scale=backUpScale;
      backgroundArea.context = backUpContextBackground;
      simulationArea.context = backUpContextSimulation;
      globalScope.ox = backUpOx
      globalScope.oy = backUpOy;


        toBeUpdated=true;
        updateCanvas=true;
        scheduleUpdate();
        dots(true,false);


}
