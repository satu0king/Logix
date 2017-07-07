function addPlot(){
  plotArea.ox = 0;
  plotArea.oy = 0;
  plotArea.count = 0;
  plotArea.endTime = new Date();
  var time = plotArea.endTime - plotArea.startTime;
  console.log(time);
  plotArea.unit = parseInt(prompt("Enter unit of time(in milli seconds)"));
  timeOutPlot = setInterval(function(){
    plotArea.plot(time);
  },20);

}
var plotArea = {
  ox : 0,
  oy : 0,
  unit : 0,
  c : document.getElementById("plot"),
  count:0,
  specificTimeX:0,
  scale : 1,
  startTime : new Date(),
  endTime : new Date(),
  plot : function(time)
  {
      this.c.width = window.innerWidth;
      this.c.height = window.innerHeight;
      context = this.c.getContext("2d");
      context.fillStyle = 'black';
      context.fillRect(0, 0, this.c.width, this.c.height);
      for(var i=0;i<globalScope.outputs.length;i++)
      {
        context.moveTo(80-plotArea.ox,2*(30+i*15)-plotArea.oy);
        var arr=globalScope.outputs[i].plotValue;
        if(plotArea.count==i){
          arr.push([time,arr[arr.length-1][1]]);
          plotArea.count+=1;
        }
        for(var j=0;j<arr.length-1;j++)
        {
            if(arr[j][0]<=time)
            {
              context.strokeStyle = 'white';
              if(globalScope.outputs[i].plotValue[j][1]==1 && globalScope.outputs[i].bitWidth==1)
              {
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,2*(30+i*15)-plotArea.oy);

                context.stroke();
              }
              else if(globalScope.outputs[i].bitWidth==1) {
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.stroke();
              }
              else {
                context.moveTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,55+30*i-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10+10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,55+30*i-plotArea.oy);
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10+10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/10-plotArea.ox,55+30*i-plotArea.oy);
                mid = 80+((arr[j+1][0]+arr[j][0])/Math.round(plotArea.unit*plotArea.scale))*(this.c.width-80)/20;
                context.font="12px Georgia";
                context.fillStyle = 'yellow';
                context.fillText(arr[j][1],mid-plotArea.ox,57+30*i-plotArea.oy);
                context.stroke();
              }
            }
            else {
              break;
            }
        }
      }
      // 2 rectangles showing the time and labels
      context.fillStyle = 'white';
      context.fillRect(0,0,75,this.c.height)
      context.font="15px Georgia";
      context.fillStyle = 'black';
      for(var i=0;i<globalScope.outputs.length;i++){
        context.fillText(globalScope.outputs[i].label,5,2*(30+i*15));
      }

      context.fillStyle = 'white';
      context.fillRect(0, 0, this.c.width, 30);
      context.font="20px Georgia";
      context.fillStyle = 'black';
      context.fillText("Time",2,20);
      for(var i=1; i*Math.round(plotArea.unit*plotArea.scale)<=time + Math.round(plotArea.unit*plotArea.scale) ;i++)
      {
        if((this.c.width-80)/10*i-plotArea.ox >= (this.c.width-80)/10-2){
        context.fillText(Math.round(plotArea.unit*plotArea.scale)*i+"ms",48+((this.c.width-80)/10)*i-plotArea.ox,20);
      }
      }
      // for yellow line to show specific time
      var specificTime = (1.115*plotArea.specificTimeX+plotArea.ox-80)*10*Math.round(plotArea.unit*plotArea.scale)/(this.c.width-80);
      context.strokeStyle = 'yellow';
      context.moveTo(1.115*plotArea.specificTimeX,0);
      context.lineTo(1.115*plotArea.specificTimeX,plotArea.c.height);
      context.stroke();
      if(1.115*plotArea.specificTimeX >= 80){
        context.fillStyle = 'black';
        context.fillRect(1.115*plotArea.specificTimeX - 30, 0, 60, 30);
        context.fillStyle = 'red';
        context.fillRect(1.115*plotArea.specificTimeX - 25, 2, 50, 26);
        context.font="20px Georgia";
        context.fillStyle = 'black';
        context.fillText(Math.round(specificTime),1.115*plotArea.specificTimeX - 20, 20);
      }
  },
  clear: function(){
    context.clearRect(0,0,plotArea.c.width,plotArea.c.height);
    clearInterval(timeOutPlot);
  }

}

// listen
  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 37){
      if(plotArea.ox >= (plotArea.c.width-80)/10){
        plotArea.ox -= (plotArea.c.width-80)/10;
      }
      else{
        plotArea.ox = 0;
      }
    }
    if(e.keyCode == 39){
          plotArea.ox += (plotArea.c.width-80)/10;
      }
      if (e.keyCode == 38){
        if(plotArea.oy >= 15){
        plotArea.oy -= 15;
      }
      else{
        plotArea.oy = 0;
      }
    }
    if (e.keyCode == 40){
      plotArea.oy += 15;
    }
    if (e.keyCode == 48){
      plotArea.clear();
    }
    if (e.keyCode == 189){
        plotArea.scale *=2;
    }
    if (e.keyCode == 187){
      if (Math.round(plotArea.unit*plotArea.scale)>=2){
        plotArea.scale /=2;
      }
    }
    if (e.keyCode == 80){
      plotArea.startTime = new Date();
      for(var i=0;i<globalScope.outputs.length;i++){
              globalScope.outputs[i].plotValue=[[0,globalScope.outputs[i].state]];
        }
      }
  });
  window.addEventListener('mousedown', function(e) {
    var rect = plotArea.c.getBoundingClientRect();
    plotArea.specificTimeX = e.clientX - rect.left;
  });

document.getElementById("plotButton").addEventListener("click", addPlot);
// html
<canvas id="plot" style="position: absolute; left: 5%; top: 20%; z-index: 0; width:90%;height:60%"></canvas>
 <button class="button" id="plotButton">Plot</button>
 // output module.js
 this.plotValue = [];
 this.resolve = function() {
      if(this.state!==this.inp1.value){
        this.state = this.inp1.value;
        this.plotValue.push([simulationArea.timePlot,this.state]);
      }

    }
