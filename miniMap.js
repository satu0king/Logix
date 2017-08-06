var miniMapArea = {

  canvas: document.getElementById("miniMapArea"),
  setup : function(){

    this.pageHeight = height//Math.round(((parseInt($("#simulationArea").height())))/unit)*unit-50; // -50 for tool bar? Check again
    this.pageWidth = width//Math.round(((parseInt($("#simulationArea").width())))/unit)*unit;
    this.pageY = (this.pageHeight-globalScope.oy);
    this.pageX =  (this.pageWidth-globalScope.ox);

    if(simulationArea.minHeight!=undefined)
        this.minY = Math.min(simulationArea.minHeight,(-globalScope.oy)/globalScope.scale);
    else
        this.minY =(-globalScope.oy)/globalScope.scale;
    if(simulationArea.maxHeight!=undefined)
        this.maxY = Math.max(simulationArea.maxHeight ,this.pageY/globalScope.scale);
    else
        this.maxY = this.pageY/globalScope.scale
    if(simulationArea.minWidth!=undefined)
        this.minX = Math.min(simulationArea.minWidth,(-globalScope.ox)/globalScope.scale);
    else
        this.minX=(-globalScope.ox)/globalScope.scale;
    if(simulationArea.maxWidth!=undefined)
        this.maxX = Math.max(simulationArea.maxWidth,(this.pageX)/globalScope.scale);
    else
        this.maxX = (this.pageX)/globalScope.scale;

    var len = this.maxY - this.minY;
    var wid = this.maxX - this.minX;

    this.canvas.height = Math.min(len,250);
    this.canvas.width = Math.min(wid,250);
    this.canvas.height = Math.max(this.canvas.height,80);
    this.canvas.width = Math.max(this.canvas.width,80);

    if(len > wid)
        this.canvas.width = Math.max((wid/len)*this.canvas.height,20);
    else
        this.canvas.height = Math.max((len/wid)*this.canvas.width,20);

    // console.log("Width"+this.canvas.width);
    // console.log("Height"+this.canvas.height);
    document.getElementById("miniMap").style.height = this.canvas.height  ;
    document.getElementById("miniMap").style.width = this.canvas.width  ;
    this.ctx = this.canvas.getContext("2d");
    $("#miniMap").css("z-index", "1");
    this.play(len, wid);
  },

  play : function(len, wid){

      this.ctx.fillStyle = "#bbb";
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fill();
      this.resolve(len, wid);
  },
  resolve : function(length, width){


    var unitHeight = (this.canvas.height-5)/(length);
    var unitWidth = (this.canvas.width-5)/(width);
    var unit=Math.max(unitHeight,unitWidth);
    console.log(unitHeight,unitWidth,unit);

    this.ctx.fillStyle="#ddd";
    this.ctx.beginPath();
    this.ctx.rect(2.5+((this.pageX - this.pageWidth)/globalScope.scale - this.minX)*unitWidth, 2.5+((this.pageY - this.pageHeight)/globalScope.scale - this.minY)*unitHeight, this.pageWidth*unitWidth/globalScope.scale, this.pageHeight*unitHeight/globalScope.scale);
    this.ctx.fill();

//  to show the area of current canvas
    var lst=globalScope.objects;
    this.ctx.strokeStyle = "green";
    this.ctx.fillStyle = "black";
    for(var i=0;i< lst.length;i++){
        // var unit = unitHeight;
        // if(unitWidth>unitHeight)
        //     unit = unitWidth;
      if(lst[i]==='wires'){

        for(var j=0;j<globalScope[lst[i]].length;j++)
        {
          this.ctx.beginPath();
          // console.log("wirex"+globalScope[lst[i]][j].node2.absX());
          this.ctx.moveTo(2.5+(globalScope[lst[i]][j].node1.absX()-this.minX)*unitWidth,2.5+(globalScope[lst[i]][j].node1.absY()-this.minY)*unitHeight);
          this.ctx.lineTo(2.5+(globalScope[lst[i]][j].node2.absX()-this.minX)*unitWidth,2.5+(globalScope[lst[i]][j].node2.absY()-this.minY)*unitHeight);
          this.ctx.stroke();
        }
      }
      else if(lst[i]!='nodes'){


          for(var j=0;j<globalScope[lst[i]].length;j++)
          {
            var xx=(globalScope[lst[i]][j].x-simulationArea.minWidth);
            var yy=(globalScope[lst[i]][j].y-simulationArea.minHeight);
            this.ctx.beginPath();
            var obj = globalScope[lst[i]][j];
            this.ctx.rect(2.5+(obj.x-obj.leftDimensionX-this.minX)*unitWidth,2.5+(obj.y-obj.upDimensionY-this.minY)*unitHeight,(obj.rightDimensionX+obj.leftDimensionX)*unit,(obj.downDimensionY+obj.upDimensionY)*unit);

            this.ctx.fill();
            this.ctx.stroke();
          }
        }
    }



  },
  clear: function() {
      $("#miniMapArea").css("z-index", "-1");
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  }
};

<div id="miniMap">
  <canvas id="miniMapArea" style="position: absolute; left:0; top: 0; z-index: 2;"></canvas>
</div>
