var miniMapArea = {

  canvas: document.getElementById("miniMapArea"),
  setup : function(){

    this.pageHeight = height//Math.round(((parseInt($("#simulationArea").height())))/ratio)*ratio-50; // -50 for tool bar? Check again
    this.pageWidth = width//Math.round(((parseInt($("#simulationArea").width())))/ratio)*ratio;
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

    var h = this.maxY - this.minY;
    var w = this.maxX - this.minX;

    // this.canvas.height = Math.min(h,250);
    // this.canvas.width = Math.min(w,250);
    // this.canvas.height = Math.max(this.canvas.height,80);
    // this.canvas.width = Math.max(this.canvas.width,80);
    //
    // if(len > wid)
    //     this.canvas.width = Math.max((w/h)*this.canvas.height,20);
    // else
    //     this.canvas.height = Math.max((h/w)*this.canvas.width,20);

    var ratio=Math.min(250/h,250/w);
    if(h>w){
        this.canvas.height=250.0;
        this.canvas.width=(250.0*w)/h;

    }
    else{
        this.canvas.width=250.0;
        this.canvas.height=(250.0*h)/w;
    }

    this.canvas.height+=5;
    this.canvas.width+=5;

    // console.log(this.canvas.width,this.canvas.height);


    // console.log(h/this.canvas.height,w/this.canvas.width);

    // console.log("Width"+this.canvas.width);
    // console.log("Height"+this.canvas.height);
    document.getElementById("miniMap").style.height = this.canvas.height  ;
    document.getElementById("miniMap").style.width = this.canvas.width  ;
    this.ctx = this.canvas.getContext("2d");
    $("#miniMap").css("z-index", "1");
    this.play(ratio);
  },

  play : function(ratio){

      this.ctx.fillStyle = "#bbb";
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fill();
      this.resolve(ratio);
  },
  resolve : function(ratio){

    this.ctx.fillStyle="#ddd";
    this.ctx.beginPath();
    this.ctx.rect(2.5+((this.pageX - this.pageWidth)/globalScope.scale - this.minX)*ratio,2.5+ ((this.pageY - this.pageHeight)/globalScope.scale - this.minY)*ratio, this.pageWidth*ratio/globalScope.scale, this.pageHeight*ratio/globalScope.scale);
    this.ctx.fill();

//  to show the area of current canvas
    var lst=globalScope.objects;
    this.ctx.strokeStyle = "green";
    this.ctx.fillStyle = "DarkGreen";
    for(var i=0;i< lst.length;i++){
      if(lst[i]==='wires'){

        for(var j=0;j<globalScope[lst[i]].length;j++)
        {
          this.ctx.beginPath();
          // console.log("wirex"+globalScope[lst[i]][j].node2.absX());
          this.ctx.moveTo(2.5+(globalScope[lst[i]][j].node1.absX()-this.minX)*ratio,2.5+(globalScope[lst[i]][j].node1.absY()-this.minY)*ratio);
          this.ctx.lineTo(2.5+(globalScope[lst[i]][j].node2.absX()-this.minX)*ratio,2.5+(globalScope[lst[i]][j].node2.absY()-this.minY)*ratio);
          this.ctx.stroke();
        }
      }
      else if(lst[i]!='nodes'){

          var ledY = 0;
          if(lst[i]=="DigitalLed" || lst[i] == "VariableLed" || lst[i] == "RGBLed")
              ledY = 20;
          for(var j=0;j<globalScope[lst[i]].length;j++)
          {
            var xx=(globalScope[lst[i]][j].x-simulationArea.minWidth);
            var yy=(globalScope[lst[i]][j].y-simulationArea.minHeight);
            this.ctx.beginPath();
            var obj = globalScope[lst[i]][j];
            this.ctx.rect(2.5+(obj.x-obj.leftDimensionX-this.minX)*ratio,2.5+(obj.y-obj.upDimensionY-this.minY)*ratio,(obj.rightDimensionX+obj.leftDimensionX)*ratio,(obj.downDimensionY+obj.upDimensionY+ledY)*ratio);

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
