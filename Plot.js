function addPlot(){
  plotArea.ox = 0;
  plotArea.oy = 0;
  plotArea.count = 0;
  plotArea.unit = 1000;//parseInt(prompt("Enter unit of time(in milli seconds)"));
  timeOutPlot = setInterval(function(){
    plotArea.plot();
  },20);
}

StopWatch = function()
{
    this.StartMilliseconds = 0;
    this.ElapsedMilliseconds = 0;
}

StopWatch.prototype.Start = function()
{
    this.StartMilliseconds = new Date().getTime();
}

StopWatch.prototype.Stop = function()
{
    this.ElapsedMilliseconds = new Date().getTime() - this.StartMilliseconds;
}

function startPlot(){
    plotArea.stopWatch.Start();
    for(var i=0;i<globalScope.Output.length;i++)
        globalScope.Output[i].plotValue=[[0,globalScope.Output[i].state]];
    play();
    addPlot();
}
var plotArea = {
  ox : 0,
  oy : 0,
  unit : 0,
  c : document.getElementById("plotArea"),
  count:0,
  specificTimeX:0,
  scale : 1,
  pixel : 100,
  startTime : new Date(),
  endTime : new Date(),
  setup:function(){
      this.stopWatch =new StopWatch()
      this.stopWatch.Start();
  },
  plot : function()
  {

      this.stopWatch.Stop();
      var time=this.stopWatch.ElapsedMilliseconds;
      this.c.width = window.plot.clientWidth;//innerWidth;
      this.c.height = window.plot.clientHeight;
      this.ox = (time/this.unit - 8)*this.pixel;
      context = this.c.getContext("2d");
      context.fillStyle = 'black';
      context.fillRect(0, 0, this.c.width, this.c.height);
      for(var i=0;i<globalScope.Output.length;i++)
      {
        context.moveTo(80-plotArea.ox,2*(30+i*15)-plotArea.oy);
        var arr=globalScope.Output[i].plotValue;
        if(plotArea.count==i){
          arr.push([time,arr[arr.length-1][1]]);
          plotArea.count+=1;
        }
        for(var j=0;j<arr.length-1;j++)
        {
            if(arr[j][0]<=time)
            {
              context.strokeStyle = 'white';
              if(globalScope.Output[i].plotValue[j][1]==0 && globalScope.Output[i].bitWidth==1)
              {
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,2*(30+i*15)-plotArea.oy);

                context.stroke();
              }
              else if(globalScope.Output[i].bitWidth==1) {
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.stroke();
              }
              else {
                context.moveTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,55+30*i-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel+10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,55+30*i-plotArea.oy);
                context.lineTo(80+(arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel+10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel-plotArea.ox,55+30*i-plotArea.oy);
                mid = 80+((arr[j+1][0]+arr[j][0])/Math.round(plotArea.unit*plotArea.scale))*this.pixel/2;
                context.font="12px Georgia";
                context.fillStyle = 'white';
                if((arr[j][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel+10-plotArea.ox <=0 && (arr[j+1][0]/Math.round(plotArea.unit*plotArea.scale))*this.pixel+10-plotArea.ox >=0){
                    mid = 80+((arr[j+1][0]-3000)/Math.round(plotArea.unit*plotArea.scale))*this.pixel;
                  }
                context.fillText(arr[j+1][1],mid-plotArea.ox,57+30*i-plotArea.oy);
                context.stroke();
              }
            }
            else {
              break;
            }
        }
      }
      // 2 rectangles showing the time and labels

      context.fillStyle = 'yellow';
      context.fillRect(0, 0, this.c.width, 30);
      context.font="20px Georgia";
      context.fillStyle = 'black';
      for(var i=1; i*Math.round(plotArea.unit*plotArea.scale)<=time + Math.round(plotArea.unit*plotArea.scale) ;i++)
      {
        context.fillText(Math.round(plotArea.unit*plotArea.scale)*i+"ms",48+this.pixel*i-plotArea.ox,20);

      }

      context.fillStyle = 'yellow';
      context.fillRect(0,0,75,this.c.height);
      context.font="15px Georgia";
      context.fillStyle = 'black';
      for(var i=0;i<globalScope.Output.length;i++){
        context.fillText(globalScope.Output[i].label,5,2*(30+i*15));
        context.fillRect(0,2*(30+i*15)+4 , 75, 3);
      }
      context.font="20px Georgia";
      context.fillText("Time",10,20);

      // for yellow line to show specific time
      var specificTime = (plotArea.specificTimeX+plotArea.ox-80)*Math.round(plotArea.unit*plotArea.scale)/(this.pixel);;
      context.strokeStyle = 'white';
      context.moveTo(plotArea.specificTimeX,0);
      context.lineTo(plotArea.specificTimeX,plotArea.c.height);
      context.stroke();
      if(1.115*plotArea.specificTimeX >= 80){
        context.fillStyle = 'black';
        context.fillRect(plotArea.specificTimeX - 35, 0, 70, 30);
        context.fillStyle = 'red';
        context.fillRect(plotArea.specificTimeX - 30, 2, 60, 26);
        context.font="20px Georgia";
        context.fillStyle = 'black';
        context.fillText(Math.round(specificTime),plotArea.specificTimeX - 28, 20);
      }
      // borders
      context.fillStyle = 'black';
      context.fillRect(0, 0, 3, this.c.height);
      context.fillRect(74, 0, 3, this.c.height);
      context.fillRect(0, 0, this.c.width, 3);
      context.fillRect(0, 27, this.c.width, 3);
  },
  clear: function(){
    context.clearRect(0,0,plotArea.c.width,plotArea.c.height);
    clearInterval(timeOutPlot);
  }

}

// listen
  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 37){
      if(plotArea.ox >= this.pixel){
        plotArea.ox -= this.pixel;
      }
      else{
        plotArea.ox = 0;
      }
    }
    if(e.keyCode == 39){
          plotArea.ox += this.pixel;
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
      for(var i=0;i<globalScope.Output.length;i++){
              globalScope.Output[i].plotValue=[[0,globalScope.Output[i].state]];
        }
      }
  });
  window.addEventListener('mousedown', function(e) {
    var rect = plotArea.c.getBoundingClientRect();
    plotArea.specificTimeX = e.clientX - rect.left;
  });

// document.getElementById("plotButton").addEventListener("click", addPlot);
// html
// <canvas id="plot" style="position: absolute; left: 5%; top: 20%; z-index: 0; width:90%;height:60%"></canvas>
// <button class="button" id="plotButton">Plot</button>
 // output module.js
