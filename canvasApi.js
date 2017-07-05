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

    var oldScale = simulationArea.scale;
    simulationArea.scale += delta;
    simulationArea.scale = Math.round(simulationArea.scale * 10) / 10;
    simulationArea.ox -= Math.round(xx * (simulationArea.scale - oldScale));
    simulationArea.oy -= Math.round(yy * (simulationArea.scale - oldScale));
    dots(true,false);
}

//fn to draw Dots on screen
function dots(dots, transparentBackground) {
    backgroundArea.clear();
    var canvasWidth = backgroundArea.canvas.width; //max X distance
    var canvasHeight = backgroundArea.canvas.height; //max Y distance

    var ctx = backgroundArea.context;
    if (!transparentBackground) {
        ctx.fillStyle = "white";
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
    }

    function drawPixel(x, y, r, g, b, a) {
        var index = (x + y * canvasWidth) * 4;
        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    }
    if (dots) {
        var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

        var scale = unit * simulationArea.scale;
        var ox = simulationArea.ox % scale; //offset
        var oy = simulationArea.oy % scale; //offset

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
    var ox = simulationArea.ox;
    var oy = simulationArea.oy;
    x1 *= simulationArea.scale;
    y1 *= simulationArea.scale;
    x2 *= simulationArea.scale;
    y2 *= simulationArea.scale;
    x3 *= simulationArea.scale;
    y3 *= simulationArea.scale;
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;
    ctx.bezierCurveTo(xx + ox + x1, yy + oy + y1, xx + ox + x2, yy + oy + y2, xx + ox + x3, yy + oy + y3);
}

function moveTo(ctx, x1, y1, xx, yy, dir) {
    [newX, newY] = rotate(x1, y1, dir);
    newX = newX * simulationArea.scale;
    newY = newY * simulationArea.scale;
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;
    ctx.moveTo(xx + simulationArea.ox + newX, yy + simulationArea.oy + newY);
}

function lineTo(ctx, x1, y1, xx, yy, dir) {
    // var lineWidthBackup=ctx.lineWidth;
    // ctx.lineWidth *=widrsimulationArea.scale;
    [newX, newY] = rotate(x1, y1, dir);
    newX = newX * simulationArea.scale;
    newY = newY * simulationArea.scale;
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;
    ctx.lineTo(xx + simulationArea.ox + newX, yy + simulationArea.oy + newY);
}

function arc(ctx, sx, sy, radius, start, stop, xx, yy, dir) { //ox-x of origin, xx- x of element , sx - shift in x from element

    [Sx, Sy] = rotate(sx, sy, dir);
    Sx = Sx * simulationArea.scale;
    Sy = Sy * simulationArea.scale;
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;
    radius *= simulationArea.scale;
    [newStart, newStop, counterClock] = rotateAngle(start, stop, dir);
    // //console.log(Sx,Sy);
    ctx.arc(xx + simulationArea.ox + Sx, yy + simulationArea.oy + Sy, radius, newStart, newStop, counterClock);
}

function drawCircle2(ctx, sx, sy, radius, xx, yy, dir) { //ox-x of origin, xx- x of element , sx - shift in x from element

    [Sx, Sy] = rotate(sx, sy, dir);
    Sx = Sx * simulationArea.scale;
    Sy = Sy * simulationArea.scale;
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;
    radius *= simulationArea.scale;
    ctx.arc(xx + simulationArea.ox + Sx, yy + simulationArea.oy + Sy, radius, 0, 2*Math.PI);
}

function rect(ctx, x1, y1, x2, y2) {
    // var lineWidthBackup=ctx.lineWidth;
    // ctx.lineWidth *=simulationArea.scale;
    x1 = x1 * simulationArea.scale;
    y1 = y1 * simulationArea.scale;
    x2 = x2 * simulationArea.scale;
    y2 = y2 * simulationArea.scale;
    ctx.rect(simulationArea.ox + x1, simulationArea.oy + y1, x2, y2);
    // ctx.lineWidth=lineWidthBackup
}

function rect2(ctx, x1, y1, x2, y2, xx, yy, dir) {
    // var lineWidthBackup=ctx.lineWidth;
    // ctx.lineWidth *=simulationArea.scale;
    [x1, y1] = rotate(x1, y1, dir);
    [x2, y2] = rotate(x2, y2, dir);
    // [xx,yy]=rotate(xx,yy,dir);
    x1 = x1 * simulationArea.scale;
    y1 = y1 * simulationArea.scale;
    x2 = x2 * simulationArea.scale;
    y2 = y2 * simulationArea.scale;
    xx *= simulationArea.scale;
    yy *= simulationArea.scale;
    ctx.rect(simulationArea.ox + xx + x1, simulationArea.oy + yy + y1, x2, y2);
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
    x1 *= simulationArea.scale;
    y1 *= simulationArea.scale;
    x2 *= simulationArea.scale;
    y2 *= simulationArea.scale;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineWidth = width*simulationArea.scale;
    // console.log(ctx.lineWidth);
    ctx.moveTo(x1 + simulationArea.ox, y1 + simulationArea.oy);
    ctx.lineTo(x2 + simulationArea.ox, y2 + simulationArea.oy);
    ctx.stroke();
}


function drawCircle(ctx, x1, y1, r, color) {
    // r = r*simulationArea.scale;

    x1 = x1 * simulationArea.scale;
    y1 = y1 * simulationArea.scale;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x1 + simulationArea.ox, y1 + simulationArea.oy, r*simulationArea.scale, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function fillText(ctx, str, x1, y1, fontSize = 20) {
    // //console.log(x1,y1,"coordinates");
    x1 = x1 * simulationArea.scale;
    y1 = y1 * simulationArea.scale;
    ctx.font = fontSize * simulationArea.scale + "px Georgia";
    // ctx.font = 20+"px Georgia";
    ctx.fillText(str, x1 + simulationArea.ox, y1 + simulationArea.oy);
    // ctx.fill();
}

function fillText2(ctx, str, x1, y1, xx, yy, dir) {
    angle = {
        "RIGHT": 0,
        "LEFT": 0,
        "DOWN": Math.PI / 2,
        "UP": -Math.PI / 2,
    }
    x1 = x1 * simulationArea.scale;
    y1 = y1 * simulationArea.scale;
    [x1, y1] = rotate(x1, y1, dir);
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;

    ctx.font = 14 * simulationArea.scale + "px Georgia";
    // ctx.font = 20+"px Georgia";
    //console.log(str);
    ctx.save();
    ctx.translate(xx + x1 + simulationArea.ox, yy + y1 + simulationArea.oy);
    ctx.rotate(angle[dir]);
    ctx.textAlign = "center";
    ctx.fillText(str, 0, 0);
    ctx.restore();

    // ctx.fillText(str, xx+x1+simulationArea.ox,yy+ y1+simulationArea.oy);

}

function fillText3(ctx, str, x1, y1, xx = 0, yy = 0, fontSize = 14, font = "Georgia", textAlign = "center") {

    x1 = x1 * simulationArea.scale;
    y1 = y1 * simulationArea.scale;
    xx = xx * simulationArea.scale;
    yy = yy * simulationArea.scale;

    ctx.font = fontSize * simulationArea.scale + "px " + font;
    // console.log(ctx.font);
    ctx.textAlign = textAlign;
    ctx.fillText(str, xx + x1 + simulationArea.ox, yy + y1 + simulationArea.oy);

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
