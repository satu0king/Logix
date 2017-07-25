function changeScale(delta,xx,yy) {
    // var xx, yy;

    if(xx===undefined||yy===undefined){
        if (simulationArea.lastSelected) { // selected object
            xx = simulationArea.lastSelected.x;
            yy = simulationArea.lastSelected.y;
        } else { //mouse location
            xx = simulationArea.mouseX;
            yy = simulationArea.mouseY;
        }
    }

    var oldScale = globalScope.scale;
    globalScope.scale += delta;
    globalScope.scale = Math.round(globalScope.scale * 10) / 10;
    globalScope.ox -= Math.round(xx * (globalScope.scale - oldScale));
    globalScope.oy -= Math.round(yy * (globalScope.scale - oldScale));
    dots(backgroundArea,true,false);
}

//fn to draw Dots on screen
function dots(canvasArea, dots=true, transparentBackground=false) {

    if(!canvasArea.context)return;
    canvasArea.clear();
    var canvasWidth = canvasArea.canvas.width; //max X distance
    var canvasHeight = canvasArea.canvas.height; //max Y distance

    var ctx = canvasArea.context;
    if (!transparentBackground) {
        ctx.fillStyle = "white";
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
    }
    var scale = unit * globalScope.scale;
    var ox = globalScope.ox % scale; //offset
    var oy = globalScope.oy % scale; //offset

    ctx.beginPath();
    ctx.strokeStyle="#eee";
    ctx.lineWidth=1;
    for (var i = 0 + ox; i < canvasWidth; i += scale){
        ctx.moveTo(i,0);
        ctx.lineTo(i,canvasHeight);
    }
    for (var j = 0 + oy; j < canvasHeight; j += scale){
        ctx.moveTo(0,j);
        ctx.lineTo(canvasWidth,j);
    }
    ctx.stroke();


    return ;
    function drawPixel(x, y, r, g, b, a) {
        var index = (x + y * canvasWidth) * 4;
        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    }
    if (dots(backgroundArea)) {
        var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);



        for (var i = 0 + ox; i < canvasWidth; i += scale)
            for (var j = 0 + oy; j < canvasHeight; j += scale)
                drawPixel(i, j, 0, 0, 0, 255);
        ctx.putImageData(canvasData, 0, 0);
    }
}

function bezierCurveTo(x1, y1, x2, y2, x3, y3, xx, yy, dir) {
    [x1, y1] = rotate(x1, y1, dir);
    [x2, y2] = rotate(x2, y2, dir);
    [x3, y3] = rotate(x3, y3, dir);
    var ox = globalScope.ox;
    var oy = globalScope.oy;
    x1 *= globalScope.scale;
    y1 *= globalScope.scale;
    x2 *= globalScope.scale;
    y2 *= globalScope.scale;
    x3 *= globalScope.scale;
    y3 *= globalScope.scale;
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;
    ctx.bezierCurveTo(xx + ox + x1, yy + oy + y1, xx + ox + x2, yy + oy + y2, xx + ox + x3, yy + oy + y3);
}

function moveTo(ctx, x1, y1, xx, yy, dir) {
    [newX, newY] = rotate(x1, y1, dir);
    newX = newX * globalScope.scale;
    newY = newY * globalScope.scale;
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;
    ctx.moveTo(xx + globalScope.ox + newX, yy + globalScope.oy + newY);
}

function lineTo(ctx, x1, y1, xx, yy, dir) {
    // var lineWidthBackup=ctx.lineWidth;
    // ctx.lineWidth *=widrglobalScope.scale;
    [newX, newY] = rotate(x1, y1, dir);
    newX = newX * globalScope.scale;
    newY = newY * globalScope.scale;
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;
    ctx.lineTo(xx + globalScope.ox + newX, yy + globalScope.oy + newY);
}

function arc(ctx, sx, sy, radius, start, stop, xx, yy, dir) { //ox-x of origin, xx- x of element , sx - shift in x from element

    [Sx, Sy] = rotate(sx, sy, dir);
    Sx = Sx * globalScope.scale;
    Sy = Sy * globalScope.scale;
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;
    radius *= globalScope.scale;
    [newStart, newStop, counterClock] = rotateAngle(start, stop, dir);
    // //console.log(Sx,Sy);
    ctx.arc(xx + globalScope.ox + Sx, yy + globalScope.oy + Sy, radius, newStart, newStop, counterClock);
}

function drawCircle2(ctx, sx, sy, radius, xx, yy, dir) { //ox-x of origin, xx- x of element , sx - shift in x from element

    [Sx, Sy] = rotate(sx, sy, dir);
    Sx = Sx * globalScope.scale;
    Sy = Sy * globalScope.scale;
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;
    radius *= globalScope.scale;
    ctx.arc(xx + globalScope.ox + Sx, yy + globalScope.oy + Sy, radius, 0, 2*Math.PI);
}

function rect(ctx, x1, y1, x2, y2) {
    // var lineWidthBackup=ctx.lineWidth;
    // ctx.lineWidth *=globalScope.scale;
    x1 = x1 * globalScope.scale;
    y1 = y1 * globalScope.scale;
    x2 = x2 * globalScope.scale;
    y2 = y2 * globalScope.scale;
    ctx.rect(globalScope.ox + x1, globalScope.oy + y1, x2, y2);
    // ctx.lineWidth=lineWidthBackup
}

function rect2(ctx, x1, y1, x2, y2, xx, yy, dir) {
    // var lineWidthBackup=ctx.lineWidth;
    // ctx.lineWidth *=globalScope.scale;
    [x1, y1] = rotate(x1, y1, dir);
    [x2, y2] = rotate(x2, y2, dir);
    // [xx,yy]=rotate(xx,yy,dir);
    x1 = x1 * globalScope.scale;
    y1 = y1 * globalScope.scale;
    x2 = x2 * globalScope.scale;
    y2 = y2 * globalScope.scale;
    xx *= globalScope.scale;
    yy *= globalScope.scale;
    ctx.rect(globalScope.ox + xx + x1, globalScope.oy + yy + y1, x2, y2);
    // ctx.lineWidth=lineWidthBackup
}


function rotate(x1, y1, dir) {
    if (dir == "LEFT")
        return [-x1, y1];
    else if (dir == "DOWN")
        return [y1, x1];
    else if (dir == "UP")
        return [y1, -x1];
    else
        return [x1, y1];
}

function rotateAngle(start, stop, dir) {
    if (dir == "LEFT")
        return [start, stop, true];
    else if (dir == "DOWN")
        return [start - Math.PI / 2, stop - Math.PI / 2, true];
    else if (dir == "UP")
        return [start - Math.PI / 2, stop - Math.PI / 2, false];
    else
        return [start, stop, false];
}

function drawLine(ctx, x1, y1, x2, y2, color, width) {
    x1 *= globalScope.scale;
    y1 *= globalScope.scale;
    x2 *= globalScope.scale;
    y2 *= globalScope.scale;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineWidth = width*globalScope.scale;
    // console.log(ctx.lineWidth);
    ctx.moveTo(x1 + globalScope.ox, y1 + globalScope.oy);
    ctx.lineTo(x2 + globalScope.ox, y2 + globalScope.oy);
    ctx.stroke();
}


function drawCircle(ctx, x1, y1, r, color) {
    // r = r*globalScope.scale;

    x1 = x1 * globalScope.scale;
    y1 = y1 * globalScope.scale;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x1 + globalScope.ox, y1 + globalScope.oy, r*globalScope.scale, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function fillText(ctx, str, x1, y1, fontSize = 20) {
    // //console.log(x1,y1,"coordinates");
    x1 = x1 * globalScope.scale;
    y1 = y1 * globalScope.scale;
    ctx.font = fontSize * globalScope.scale + "px Georgia";
    // ctx.font = 20+"px Georgia";
    ctx.fillText(str, x1 + globalScope.ox, y1 + globalScope.oy);
    // ctx.fill();
}

function fillText2(ctx, str, x1, y1, xx, yy, dir) {
    angle = {
        "RIGHT": 0,
        "LEFT": 0,
        "DOWN": Math.PI / 2,
        "UP": -Math.PI / 2,
    }
    x1 = x1 * globalScope.scale;
    y1 = y1 * globalScope.scale;
    [x1, y1] = rotate(x1, y1, dir);
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;

    ctx.font = 14 * globalScope.scale + "px Georgia";
    // ctx.font = 20+"px Georgia";
    //console.log(str);
    ctx.save();
    ctx.translate(xx + x1 + globalScope.ox, yy + y1 + globalScope.oy);
    ctx.rotate(angle[dir]);
    ctx.textAlign = "center";
    ctx.fillText(str, 0, 0);
    ctx.restore();

    // ctx.fillText(str, xx+x1+globalScope.ox,yy+ y1+globalScope.oy);

}

function fillText3(ctx, str, x1, y1, xx = 0, yy = 0, fontSize = 14, font = "Georgia", textAlign = "center") {

    x1 = x1 * globalScope.scale;
    y1 = y1 * globalScope.scale;
    xx = xx * globalScope.scale;
    yy = yy * globalScope.scale;

    ctx.font = fontSize * globalScope.scale + "px " + font;
    // console.log(ctx.font);
    ctx.textAlign = textAlign;
    ctx.fillText(str, xx + x1 + globalScope.ox, yy + y1 + globalScope.oy);

}
oppositeDirection = {
    "RIGHT": "LEFT",
    "LEFT": "RIGHT",
    "DOWN": "UP",
    "UP": "DOWN",
}
fixDirection = {
    "right": "LEFT",
    "left": "RIGHT",
    "down": "UP",
    "up": "DOWN",
    "LEFT": "LEFT",
    "RIGHT": "RIGHT",
    "UP": "UP",
    "DOWN": "DOWN",
}
