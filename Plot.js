function addPlot(){
  plotArea.ox = 0;
  plotArea.oy = 0;
  plotArea.count = 0;
  plotArea.unit = 1000;//parseInt(prompt("Enter unit of time(in milli seconds)"));
  plotArea.specificTimeX = 0;

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
    plotArea.scroll=1;
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
  scroll : 1,
  setup:function(){
      this.stopWatch =new StopWatch()
      this.stopWatch.Start();
      this.ctx=this.c.getContext("2d");
    //   console.log(this.ctx);
      startPlot();
      this.timeOutPlot = setInterval(function(){
        plotArea.plot();
    },100);
  },
  plot : function()
  {

      this.stopWatch.Stop();
      var time=this.stopWatch.ElapsedMilliseconds;
      this.c.width = window.plot.clientWidth; //innerWidth;

      this.c.height=Math.min(Math.max(90 + (globalScope.Output.length)*30,0),300);

      if(document.getElementById("plot").style.height!=this.c.height+"px"){
          document.getElementById("plot").style.height = this.c.height ;
          resetup();
          console.log(document.getElementById("plot").style.height,this.c.height);
      }

      if(this.scroll){
        this.ox = Math.max(0,(time/this.unit)*this.pixel -this.c.width+70);
      }
      else if(!plotArea.mouseDown){
          this.ox-=plotArea.scrollAcc;
          plotArea.scrollAcc*=0.95;
          if(this.ox<0)plotArea.scrollAcc=-0.2+0.2*this.ox;
          if(Math.abs(this.ox)<0.5)this.ox=0;
      }
      var ctx = this.ctx;
      this.clear(ctx);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, this.c.width, this.c.height);
      var unit= (this.pixel/(plotArea.unit*plotArea.scale))
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 2;
      for(var i=0;i<globalScope.Output.length;i++)
      {

        var arr=globalScope.Output[i].plotValue;
        // ctx.moveTo(80-plotArea.ox,2*(30+i*15-5*arr[0][1])-plotArea.oy);
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



              if(globalScope.Output[i].bitWidth==1)
              {
                ctx.lineTo(80+(start*unit)-plotArea.ox,2*(30+i*15-5*arr[j][1])-plotArea.oy);
                ctx.lineTo(80+(end*unit)-plotArea.ox,2*(30+i*15-5*arr[j][1])-plotArea.oy);
              }
              else {
                ctx.beginPath();
                ctx.moveTo(80+(end*unit)-plotArea.ox,55+30*i-plotArea.oy);
                ctx.lineTo(80+(end*unit)-5-plotArea.ox,2*(25+i*15)-plotArea.oy);
                ctx.lineTo(80+(start*unit)+5-plotArea.ox,2*(25+i*15)-plotArea.oy);
                ctx.lineTo(80+(start*unit)-plotArea.ox,55+30*i-plotArea.oy);
                ctx.lineTo(80+(start*unit)+5-plotArea.ox,2*(30+i*15)-plotArea.oy);
                ctx.lineTo(80+(end*unit)-5-plotArea.ox,2*(30+i*15)-plotArea.oy);
                ctx.lineTo(80+(end*unit)-plotArea.ox,55+30*i-plotArea.oy);
                mid = 80+((end+start)/Math.round(plotArea.unit*plotArea.scale))*this.pixel/2;
                ctx.font="12px Georgia";
                ctx.fillStyle = 'white';
                if((start*unit)+10-plotArea.ox <=0 && (end*unit)+10-plotArea.ox >=0){
                    mid = 80+((end-3000)/Math.round(plotArea.unit*plotArea.scale))*this.pixel;
                  }

                ctx.fillText(arr[j][1],mid-plotArea.ox,57+30*i-plotArea.oy);
                ctx.stroke();
              }
            }
            else {
              break;
            }
        }
        ctx.stroke();
        ctx.beginPath();
      }
      // 2 rectangles showing the time and labels

      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, this.c.width, 30);
      ctx.font="14px Georgia";
      ctx.fillStyle = 'black';
      for(var i=1; i*Math.round(plotArea.unit*plotArea.scale)<=time + Math.round(plotArea.unit*plotArea.scale) ;i++)
      {
        ctx.fillText(Math.round(plotArea.unit*plotArea.scale)*i/1000+"s",48+this.pixel*i-plotArea.ox,20);
      }

      ctx.fillStyle = '#eee';
      ctx.fillRect(0,0,75,this.c.height);
      ctx.font="15px Georgia";
      ctx.fillStyle = 'black';
      for(var i=0;i<globalScope.Output.length;i++){
        ctx.fillText(globalScope.Output[i].label,5,2*(25+i*15) - plotArea.oy);
        ctx.fillRect(0,2*(13+i*15)+4 - plotArea.oy, 75, 3);
      }
      ctx.fillStyle = '#eee';
      ctx.fillRect(0,0,75,30);
      ctx.fillStyle = 'black';
      ctx.font="16px Georgia";
      ctx.fillText("Time",10,20);
      ctx.strokeStyle = 'black';
      ctx.moveTo(0,25);
      ctx.lineTo(75,25);
      // for yellow line to show specific time
      var specificTime = (plotArea.specificTimeX+plotArea.ox-80)*Math.round(plotArea.unit*plotArea.scale)/(this.pixel);;
      ctx.strokeStyle = 'white';
      ctx.moveTo(plotArea.specificTimeX,0);
      ctx.lineTo(plotArea.specificTimeX,plotArea.c.height);
      ctx.stroke();
      if(1.115*plotArea.specificTimeX >= 80){
        ctx.fillStyle = 'black';
        ctx.fillRect(plotArea.specificTimeX - 35, 0, 70, 30);
        ctx.fillStyle = 'red';
        ctx.fillRect(plotArea.specificTimeX - 30, 2, 60, 26);
        ctx.font="12px Georgia";
        ctx.fillStyle = 'black';
        ctx.fillText(Math.round(specificTime)+"ms",plotArea.specificTimeX - 25, 20);
      }
      // borders
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(0,this.c.height);
    //   ctx.fillRect(0, 0, 3, this.c.height);

    ctx.moveTo(74,0);
    ctx.lineTo(74,this.c.height);
    //   ctx.fillRect(74, 0, 3, this.c.height);

    ctx.moveTo(0,0);
    ctx.lineTo(this.c.width,0);
    //   ctx.fillRect(0, 0, this.c.width, 3);

    // ctx.moveTo(0,27);
    // ctx.lineTo(this.c.width,27);
    //   ctx.fillRect(0, 27, this.c.width, 3);
      ctx.stroke();
  },
  clear: function(ctx){
    ctx.clearRect(0,0,plotArea.c.width,plotArea.c.height);
    // clearInterval(timeOutPlot);
  }

}

  document.getElementById("plotArea").addEventListener('mousedown', function(e) {

    var rect = plotArea.c.getBoundingClientRect();
    var x=e.clientX - rect.left;
    plotArea.scrollAcc=0;
    if(e.shiftKey){
        plotArea.specificTimeX = x;
    }
    else{
        plotArea.scroll=0;
        plotArea.mouseDown=true;

        plotArea.prevX=x;
        console.log("HIT");
    }
  });
  document.getElementById("plotArea").addEventListener('mouseup', function(e) {

    plotArea.mouseDown=false;
  });

  document.getElementById("plotArea").addEventListener('mousemove', function(e) {

    var rect = plotArea.c.getBoundingClientRect();
    var x=e.clientX - rect.left;
    if(!e.shiftKey&&plotArea.mouseDown){
        plotArea.ox-=x-plotArea.prevX;
        plotArea.scrollAcc=x-plotArea.prevX;
        plotArea.prevX=x;
        // plotArea.ox=Math.max(0,plotArea.ox)
    }
    else{
        plotArea.mouseDown=false;



    }
  });


// document.getElementById("plotButton").addEventListener("click", addPlot);
// html
// <canvas id="plot" style="position: absolute; left: 5%; top: 20%; z-index: 0; width:90%;height:60%"></canvas>
// <button class="button" id="plotButton">Plot</button>
 // output module.js
