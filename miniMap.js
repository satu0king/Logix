var miniMapArea = {

  canvas: document.getElementById("miniMapArea"),
  setup : function(){
    var len = simulationArea.maxHeight-simulationArea.minHeight;
    var wid = simulationArea.maxWidth-simulationArea.minWidth;
    this.canvas.height = Math.min((len + 80)/2,180);
    this.canvas.width = Math.min((wid + 80)/2,180);

    if(this.canvas.height == 180 && this.canvas.width == 180){
      if(len > width)
        this.canvas.width = (wid/len)*180;
      else
        this.canvas.height = (len/wid)*180;
    }
    this.canvas.width = Math.max(this.canvas.width,80);
    this.canvas.height = Math.max(this.canvas.height,80);
    // console.log("Width"+this.canvas.width);
    // console.log("Height"+this.canvas.height);
    document.getElementById("miniMap").style.height = this.canvas.height  ;
    document.getElementById("miniMap").style.width = this.canvas.width  ;
    this.ctx = this.canvas.getContext("2d");
    $("#miniMap").css("z-index", "1");
    this.play(len + 10 , wid + 10);
  },

  play : function(len, wid){
    this.ctx.fillStyle = "MediumVioletRed ";
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fill();
    this.resolve(simulationArea.objectList,len, wid);
  },
  resolve : function(lst, length, width){

    var unitHeight = (this.canvas.height-30)/(length);
    var unitWidth = (this.canvas.width-30)/(width);
    var unit=Math.min((this.canvas.height-30)/(length),(this.canvas.width-30)/(width));

    for(var i=0;i< lst.length;i++){
        // var unit = unitHeight;
        // if(unitWidth>unitHeight)
        //     unit = unitWidth;
      if(lst[i]==='wires'){

        for(var j=0;j<globalScope[lst[i]].length;j++)
        {
          this.ctx.beginPath();
          // console.log("wirex"+globalScope[lst[i]][j].node2.absX());
          this.ctx.moveTo((10+globalScope[lst[i]][j].node1.absX()-simulationArea.minWidth)*unit,(10+globalScope[lst[i]][j].node1.absY()-simulationArea.minHeight+5)*unit);
          this.ctx.lineTo((10+globalScope[lst[i]][j].node2.absX()-simulationArea.minWidth)*unit,(10+globalScope[lst[i]][j].node2.absY()-simulationArea.minHeight+5)*unit);
          this.ctx.strokeStyle = "white";
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
            this.ctx.rect((15+obj.x-obj.leftDimensionX-simulationArea.minWidth)*unit,(15+obj.y-obj.upDimensionY-simulationArea.minHeight)*unit,(obj.rightDimensionX+obj.leftDimensionX)*unit,(obj.downDimensionY+obj.upDimensionY)*unit);
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
