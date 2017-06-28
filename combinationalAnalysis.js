
var inputSample = 5;
var dataSample=[['01---','11110','01---','00000'],['01110','1-1-1','----0'],['01---','11110','01110','1-1-1','0---0'],['----1']];



function combinationalAnalysis(combinationalData=dataSample,inputCount=inputSample,scope=globalScope){
    var maxTerms=0;
    for(var i=0;i<combinationalData.length;i++)
    maxTerms=Math.max(maxTerms,combinationalData[i].length);

    var startPosX=200;
    var startPosY=200;

    var currentPosY=300;
    var andPosX=startPosX+inputCount*40+40;
    var orPosX=andPosX+Math.floor(maxTerms/2)*10+80;
    var outputPosX=orPosX+60;
    var inputObjects=[];

    var logixNodes=[];

    for(var i=0;i<inputCount;i++){
        inputObjects.push(new Input(startPosX+i*40,startPosY,scope,"DOWN",1));
        var v1=new Node(startPosX+i*40,startPosY+20,2,scope.root);
        inputObjects[i].output1.connect(v1);
        var v2=new Node(startPosX+i*40+20,startPosY+20,2,scope.root);
        v1.connect(v2);
        var notG=new NotGate(startPosX+i*40+20, startPosY+40, scope, "DOWN",  1);
        notG.inp1.connect(v2);
        logixNodes.push(v1);
        logixNodes.push(notG.output1);
    }
    function countTerm(s){
        var c=0;
        for(var i=0;i<s.length;i++)
            if(s[i]!=='-')c++;
        return c;
    }
    for(var i=0;i<combinationalData.length;i++){
        // console.log(combinationalData[i]);
        var andGateNodes=[];
        for(var j=0;j<combinationalData[i].length;j++){

            var c=countTerm(combinationalData[i][j]);
            if(c>1){
                var andGate=new AndGate(andPosX, currentPosY, scope, "RIGHT", c, 1);
                andGateNodes.push(andGate.output1);
                var misses=0;
                for(var k=0;k<combinationalData[i][j].length;k++){
                    if(combinationalData[i][j][k]=='-'){misses++;continue;}
                    var index=2*k+(combinationalData[i][j][k]==0);
                    console.log(index);
                    console.log(andGate);
                    var v=new Node(logixNodes[index].absX(),andGate.inp[k-misses].absY(),2,scope.root);
                    logixNodes[index].connect(v);
                    logixNodes[index]=v;
                    v.connect(andGate.inp[k-misses]);
                }
            }
            else{
                for(var k=0;k<combinationalData[i][j].length;k++){
                    if(combinationalData[i][j][k]=='-')continue;
                    var index=2*k+parseInt(combinationalData[i][j][k],10);
                    var andGateSubstituteNode= new Node(andPosX, currentPosY, 2,scope.root);
                    var v=new Node(logixNodes[index].absX(),andGateSubstituteNode.absY(),2,scope.root);
                    logixNodes[index].connect(v);
                    logixNodes[index]=v;
                    v.connect(andGateSubstituteNode);
                    andGateNodes.push(andGateSubstituteNode);
                }
            }
            currentPosY+=c*10+30;
        }

        var andGateCount=andGateNodes.length;
        var midWay=Math.floor(andGateCount/2);
        var orGatePosY=(andGateNodes[midWay].absY()+andGateNodes[Math.floor((andGateCount-1)/2)].absY())/2;
        if(andGateCount>1){

            var o=new OrGate(orPosX,orGatePosY,scope,"RIGHT",andGateCount,1);
            if(andGateCount%2==1)andGateNodes[midWay].connect(o.inp[midWay]);
            for(var j=0;j<midWay;j++){
                var v=new Node(andPosX+30+(midWay-j)*10,andGateNodes[j].absY(),2,scope.root);
                v.connect(andGateNodes[j]);
                var v2=new Node(andPosX+30+(midWay-j)*10,o.inp[j].absY(),2,scope.root);
                v2.connect(v)
                o.inp[j].connect(v2);

                var v=new Node(andPosX+30+(midWay-j)*10,andGateNodes[andGateCount-j-1].absY(),2,scope.root);
                v.connect(andGateNodes[andGateCount-j-1]);
                var v2=new Node(andPosX+30+(midWay-j)*10,o.inp[andGateCount-j-1].absY(),2,scope.root);
                v2.connect(v)
                o.inp[andGateCount-j-1].connect(v2);
            }
            var out=new Output(outputPosX,o.y,scope,"LEFT",1);
            out.inp1.connect(o.output1);
        }
        else{

            var out=new Output(outputPosX,andGateNodes[0].absY(),scope,"LEFT",1);
            out.inp1.connect(andGateNodes[0]);
        }


    }
    for(var i=0;i<logixNodes.length;i++){
        if(logixNodes[i].absY()!=currentPosY){
            var v=new Node(logixNodes[i].absX(),currentPosY,2,scope.root);
            logixNodes[i].connect(v)
        }
    }

}
