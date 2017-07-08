function addPlot(){
  plotArea.ox = 0;
  plotArea.oy = 0;
  plotArea.count = 0;
  plotArea.unit = 1000;//parseInt(prompt("Enter unit of time(in milli seconds)"));


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
        globalScope.Output[i].plotValue=[[0,globalScope.Output[i].inp1.value]];
    // play();
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
  checkScroll : 0,
  setup:function(){
      this.stopWatch =new StopWatch()
      this.stopWatch.Start();
      startPlot();
      this.timeOutPlot = setInterval(function(){
        plotArea.plot();
    },100);
  },
  plot : function()
  {

      this.stopWatch.Stop();
      var time=this.stopWatch.ElapsedMilliseconds;
      this.c.width = window.plot.clientWidth;//innerWidth;
      this.c.height = window.plot.clientHeight;

      if(this.checkScroll == 0){
        this.ox = Math.max(0,(time/this.unit)*this.pixel -this.c.width+70);
      }
      context = this.c.getContext("2d");
      this.clear();
      context.fillStyle = 'black';
      context.fillRect(0, 0, this.c.width, this.c.height);
      var unit= (this.pixel/(plotArea.unit*plotArea.scale))
      context.strokeStyle = 'cyan';
      context.lineWidth = 2;
      for(var i=0;i<globalScope.Output.length;i++)
      {
        context.moveTo(80-plotArea.ox,2*(30+i*15)-plotArea.oy);
        var arr=globalScope.Output[i].plotValue;
        // if(plotArea.count==i){
        //   arr.push([time,arr[arr.length-1][1]]);
        //   plotArea.count+=1;
        // }
        // console.log(start,end)


        for(var j=0;j<arr.length;j++)
        {
            var start=arr[j][0];
            if(j+1==arr.length)
              var end=time;
            else
              var end=arr[j+1][0];

            if(start<=time)
            {



              if(globalScope.Output[i].plotValue[j][1]==1 && globalScope.Output[i].bitWidth==1)
              {
                context.lineTo(80+(start*unit)-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(end*unit)-plotArea.ox,2*(25+i*15)-plotArea.oy);
                // context.lineTo(80+(end*unit)-plotArea.ox,2*(30+i*15)-plotArea.oy);

                // context.stroke();
              }
              else if(globalScope.Output[i].bitWidth==1) {
                context.lineTo(80+(start*unit)-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(end*unit)-plotArea.ox,2*(30+i*15)-plotArea.oy);
                // context.stroke();
              }
              else {
                context.moveTo(80+(end*unit)-plotArea.ox,55+30*i-plotArea.oy);
                context.lineTo(80+(end*unit)-10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(start*unit)+10-plotArea.ox,2*(25+i*15)-plotArea.oy);
                context.lineTo(80+(start*unit)-plotArea.ox,55+30*i-plotArea.oy);
                context.lineTo(80+(start*unit)+10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(end*unit)-10-plotArea.ox,2*(30+i*15)-plotArea.oy);
                context.lineTo(80+(end*unit)-plotArea.ox,55+30*i-plotArea.oy);
                mid = 80+((end+start)/Math.round(plotArea.unit*plotArea.scale))*this.pixel/2;
                context.font="12px Georgia";
                context.fillStyle = 'white';
                if((start*unit)+10-plotArea.ox <=0 && (end*unit)+10-plotArea.ox >=0){
                    mid = 80+((end-3000)/Math.round(plotArea.unit*plotArea.scale))*this.pixel;
                  }
                context.fillText(arr[j][1],mid-plotArea.ox,57+30*i-plotArea.oy);
                context.stroke();
              }
            }
            else {
              break;
            }
        }
        context.stroke();
        context.beginPath();
      }
      // 2 rectangles showing the time and labels

      context.fillStyle = '#eee';
      context.fillRect(0, 0, this.c.width, 30);
      context.font="14px Georgia";
      context.fillStyle = 'black';
      for(var i=1; i*Math.round(plotArea.unit*plotArea.scale)<=time + Math.round(plotArea.unit*plotArea.scale) ;i++)
      {
        context.fillText(Math.round(plotArea.unit*plotArea.scale)*i/1000+"s",48+this.pixel*i-plotArea.ox,20);

      }

      context.fillStyle = '#eee';
      context.fillRect(0,0,75,this.c.height);
      context.font="15px Georgia";
      context.fillStyle = 'black';
      for(var i=0;i<globalScope.Output.length;i++){
        context.fillText(globalScope.Output[i].label,5,2*(25+i*15));
        context.fillRect(0,2*(13+i*15)+4 , 75, 3);
      }
      context.font="16px Georgia";
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
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0,0);
      context.lineTo(0,this.c.height);
    //   context.fillRect(0, 0, 3, this.c.height);

    context.moveTo(74,0);
    context.lineTo(74,this.c.height);
    //   context.fillRect(74, 0, 3, this.c.height);

    context.moveTo(0,0);
    context.lineTo(this.c.width,0);
    //   context.fillRect(0, 0, this.c.width, 3);

    // context.moveTo(0,27);
    // context.lineTo(this.c.width,27);
    //   context.fillRect(0, 27, this.c.width, 3);
      context.stroke();
  },
  clear: function(){
    context.clearRect(0,0,plotArea.c.width,plotArea.c.height);
    // clearInterval(timeOutPlot);
  }

}

// listen
  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 37){
      if(plotArea.ox >= this.unit){
        plotArea.ox -= this.unit;
      }
      else{
        plotArea.ox = 0;
      }
    }
    if(e.keyCode == 39){
          plotArea.ox += this.unit;
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
    if (e.keyCode == 49){
      plotArea.checkScroll = 1;
    }
    if (e.keyCode == 50){
      plotArea.checkScroll = 0;
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
  document.getElementById("plotArea").addEventListener('mousedown', function(e) {
    var rect = plotArea.c.getBoundingClientRect();
    plotArea.specificTimeX = e.clientX - rect.left;
  });

// document.getElementById("plotButton").addEventListener("click", addPlot);
// html
// <canvas id="plot" style="position: absolute; left: 5%; top: 20%; z-index: 0; width:90%;height:60%"></canvas>
// <button class="button" id="plotButton">Plot</button>
 // output module.js
