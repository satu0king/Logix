var miniMapArea = {

  canvas: document.getElementById("miniMapArea"),
  setup : function(){

    this.pageHeight = Math.round(((parseInt($("#simulationArea").height()))/globalScope.scale)/unit)*unit;
    this.pageWidth = Math.round(((parseInt($("#simulationArea").width()))/globalScope.scale)/unit)*unit;
    this.pageY = (this.pageHeight-50-globalScope.oy);  // -50 for tool bar? Check again
    this.pageX =  (this.pageWidth-globalScope.ox);

    this.minY = Math.min(simulationArea.minHeight,this.pageY - this.pageHeight);
    this.maxY = Math.max(simulationArea.maxHeight ,this.pageY);
    this.minX = Math.min(simulationArea.minWidth,this.pageX - this.pageWidth);
    this.maxX = Math.max(simulationArea.maxWidth,this.pageX);

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

    this.ctx.fillStyle = "MediumVioletRed ";
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fill();
    this.resolve(simulationArea.objectList,len, wid);
  },
  resolve : function(lst, length, width){

    var unitHeight = (this.canvas.height-5)/(length);
    var unitWidth = (this.canvas.width-5)/(width);
    var unit=Math.max(unitHeight,unitWidth);

//  to show the area of current canvas
    this.ctx.beginPath();
    this.ctx.rect(2.5+(this.pageX - this.pageWidth - this.minX)*unitWidth, 2.5+(this.pageY - this.pageHeight - this.minY)*unitHeight, this.pageWidth*unitWidth, this.pageHeight*unitHeight);
    this.ctx.fillStyle = "pink";
    this.ctx.fill();
    this.ctx.stroke();
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
          this.ctx.strokeStyle = "green";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
      else if(lst[i]!='nodes'){


          for(var j=0;j<globalScope[lst[i]].length;j++)
          {
            // console.log("minY"+simulationArea.minHeight);
            // console.log("minX"+simulationArea.minWidth);
            // console.log("maxY"+simulationArea.maxHeight);
            // console.log("maxX"+simulationArea.maxWidth);
            var xx=(globalScope[lst[i]][j].x-simulationArea.minWidth);
            var yy=(globalScope[lst[i]][j].y-simulationArea.minHeight);
            // console.log("thisx"+globalScope[lst[i]][j].x);
            // console.log("thisy"+globalScope[lst[i]][j].y);
            // console.log("XX"+xx);
            // console.log("YY"+yy);
            this.ctx.beginPath();
            var obj = globalScope[lst[i]][j];
            // var unit = unitHeight;
            // if(unitWidth<unitHeight)
            //     unit = unitWidth;
            this.ctx.rect(2.5+(obj.x-obj.leftDimensionX-this.minX)*unitWidth,2.5+(obj.y-obj.upDimensionY-this.minY)*unitHeight,(obj.rightDimensionX+obj.leftDimensionX)*unit,(obj.downDimensionY+obj.upDimensionY)*unit);
            // console.log("lx"+obj.leftDimensionX);
            // console.log("rx"+obj.rightDimensionX);
            // console.log("uy"+obj.upDimensionY);
            // console.log("dy"+obj.downDimensionY);
            this.ctx.fillStyle = "black";
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
