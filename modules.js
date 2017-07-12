//AndGate - (x,y)-position , scope - circuit level, inputLength - no of nodes, dir - direction of gate

function changeInputSize(size) {
    if (size == undefined || size < 2 || size > 10) return;
    if (this.inputSize == size) return;
    var obj = new window[this.objectType](this.x, this.y, this.scope, this.direction, size, this.bitWidth);
    this.delete();
    simulationArea.lastSelected = obj;
    return obj;
    // showProperties(obj);

}

function AndGate(x, y, scope = globalScope, dir = "RIGHT", inputLength = 2, bitWidth = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 20);
    this.inp = [];

    this.inputSize = inputLength;
    this.changeInputSize = changeInputSize;

    //variable inputLength , node creation
    if (inputLength % 2 == 1) {
        for (var i = 0; i < inputLength / 2 - 1; i++) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        var a = new Node(-10, 0, 0, this);
        this.inp.push(a);
        for (var i = inputLength / 2 + 1; i < inputLength; i++) {
            var a = new Node(-10, 10 * (i + 1 - inputLength / 2 - 1), 0, this);
            this.inp.push(a);
        }
    } else {
        for (var i = 0; i < inputLength / 2; i++) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        for (var i = inputLength / 2; i < inputLength; i++) {
            var a = new Node(-10, 10 * (i + 1 - inputLength / 2), 0, this);
            this.inp.push(a);
        }
    }

    this.output1 = new Node(20, 0, 1, this);

    //fn to create save Json Data of object
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.inputSize, this.bitWidth],
            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1)
            },

        }
        return data;
    }

    //resolve output values based on inputData
    this.resolve = function() {
        var result = this.inp[0].value;
        if (this.isResolvable() == false) {
            return;
        }
        for (var i = 1; i < this.inputSize; i++)
            result = result & (this.inp[i].value);
        this.output1.value = result;
        this.scope.stack.push(this.output1);
    }

    //fn to draw
    this.customDraw = function() {

        ctx = simulationArea.context;

        ctx.beginPath();
        ctx.lineWidth = this.scope.scale*  3;
        ctx.strokeStyle = "black"; //("rgba(0,0,0,1)");
        ctx.fillStyle = "white";
        var xx = this.x;
        var yy = this.y;

        moveTo(ctx, -10, -20, xx, yy, this.direction);
        lineTo(ctx, 0, -20, xx, yy, this.direction);
        arc(ctx, 0, 0, 20, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        lineTo(ctx, -10, 20, xx, yy, this.direction);
        lineTo(ctx, -10, -20, xx, yy, this.direction);
        ctx.closePath();

        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();

    }

}

function NandGate(x, y, scope = globalScope, dir = "RIGHT", inputLength = 2, bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 20);
    this.inp = [];


    this.inputSize = inputLength;
    this.changeInputSize = changeInputSize;

    //variable inputLength , node creation
    if (inputLength % 2 == 1) {
        for (var i = 0; i < inputLength / 2 - 1; i++) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        var a = new Node(-10, 0, 0, this);
        this.inp.push(a);
        for (var i = inputLength / 2 + 1; i < inputLength; i++) {
            var a = new Node(-10, 10 * (i + 1 - inputLength / 2 - 1), 0, this);
            this.inp.push(a);
        }
    } else {
        for (var i = 0; i < inputLength / 2; i++) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        for (var i = inputLength / 2; i < inputLength; i++) {
            var a = new Node(-10, 10 * (i + 1 - inputLength / 2), 0, this);
            this.inp.push(a);
        }
    }

    this.output1 = new Node(30, 0, 1, this);

    //fn to create save Json Data of object
    this.customSave = function() {
        var data = {

            constructorParamaters: [this.direction, this.inputSize, this.bitWidth],
            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1)
            },
        }
        return data;
    }

    //resolve output values based on inputData
    this.resolve = function() {
        var result = this.inp[0].value;
        if (this.isResolvable() == false) {
            return;
        }
        for (var i = 1; i < inputLength; i++)
            result = result & (this.inp[i].value);
        result = ((~result >>> 0) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
        this.output1.value = result;
        this.scope.stack.push(this.output1);
    }

    //fn to draw
    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.lineWidth = this.scope.scale*  3;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        var xx = this.x;
        var yy = this.y;

        moveTo(ctx, -10, -20, xx, yy, this.direction);
        lineTo(ctx, 0, -20, xx, yy, this.direction);
        arc(ctx, 0, 0, 20, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        lineTo(ctx, -10, 20, xx, yy, this.direction);
        lineTo(ctx, -10, -20, xx, yy, this.direction);
        ctx.closePath();

        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.5)";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        drawCircle2(ctx, 25, 0, 5,xx,yy, this.direction);
        ctx.stroke();


    }
}

function Multiplexer(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1, controlSignalSize = 1) {
    // console.log("HIT");
    // console.log(x,y,scope,dir,bitWidth,controlSignalSize);
    CircuitElement.call(this, x, y, scope, dir, bitWidth);

    this.controlSignalSize = controlSignalSize || parseInt(prompt("Enter control signal bitWidth"), 10);
    this.inputSize = 1 << this.controlSignalSize;
    var xOff = 0;
    var yOff = 1;
    if (this.controlSignalSize == 1) {
        xOff = 10;
    }
    if (this.controlSignalSize <= 3) {
        yOff = 2;
    }

    this.setDimensions(20, yOff * 5 * (this.inputSize));
    this.rectangleObject = false;

    this.inp = [];
    for (var i = 0; i < this.inputSize; i++) {
        var a = new Node(-20 + xOff, +yOff * 10 * (i - this.inputSize / 2) + 10, 0, this);
        this.inp.push(a);
    }

    this.output1 = new Node(20 - xOff, 0, 1, this);
    this.controlSignalInput = new Node(0, yOff * 10 * (this.inputSize / 2 - 1) + xOff + 10, 0, this, this.controlSignalSize);

    this.changeControlSignalSize = function(size) {
        if (size == undefined || size < 1 || size > 32) return;
        if (this.controlSignalSize == size) return;
        var obj = new window[this.objectType](this.x, this.y, this.scope, this.direction, this.bitWidth, size);
        this.cleanDelete();
        simulationArea.lastSelected = obj;
        return obj;
    }
    this.mutableProperties = {
        "controlSignalSize": {
            name: "Control Signal Size",
            type: "number",
            max: "32",
            min: "1",
            func: "changeControlSignalSize",
        },
    }
    this.newBitWidth = function(bitWidth) {
        this.bitWidth = bitWidth;
        for (var i = 0; i < this.inputSize; i++) {
            this.inp[i].bitWidth = bitWidth
        }
        this.output1.bitWidth = bitWidth;
    }


    //fn to create save Json Data of object
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth, this.controlSignalSize],
            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1),
                controlSignalInput: findNode(this.controlSignalInput)
            },
        }
        return data;
    }

    this.resolve = function() {

        if (this.isResolvable() == false) {
            return;
        }
        this.output1.value = this.inp[this.controlSignalInput.value].value;
        this.scope.stack.push(this.output1);
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.beginPath();
        moveTo(ctx, 0, yOff * 10 * (this.inputSize / 2 - 1) + 10 + 0.5 * xOff, xx, yy, this.direction);
        lineTo(ctx, 0, yOff * 5 * (this.inputSize - 1) + xOff, xx, yy, this.direction);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;
        ctx.fillStyle = "white";
        moveTo(ctx, -20 + xOff, -yOff * 10 * (this.inputSize / 2), xx, yy, this.direction);
        lineTo(ctx, -20 + xOff, 20 + yOff * 10 * (this.inputSize / 2 - 1), xx, yy, this.direction);
        lineTo(ctx, 20 - xOff, +yOff * 10 * (this.inputSize / 2 - 1) + xOff, xx, yy, this.direction);
        lineTo(ctx, 20 - xOff, -yOff * 10 * (this.inputSize / 2) - xOff + 20, xx, yy, this.direction);

        ctx.closePath();
        ctx.stroke();

        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this))
            ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
    }

}

function XorGate(x, y, scope = globalScope, dir = "RIGHT", inputs = 2, bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 20);

    this.inp = [];
    this.inputSize = inputs;
    this.changeInputSize = changeInputSize;
    if (inputs % 2 == 1) {
        for (var i = 0; i < inputs / 2 - 1; i++) {
            var a = new Node(-20, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        var a = new Node(-20, 0, 0, this);
        this.inp.push(a);
        for (var i = inputs / 2 + 1; i < inputs; i++) {
            var a = new Node(-20, 10 * (i + 1 - inputs / 2 - 1), 0, this);
            this.inp.push(a);
        }
    } else {
        for (var i = 0; i < inputs / 2; i++) {
            var a = new Node(-20, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        for (var i = inputs / 2; i < inputs; i++) {
            var a = new Node(-20, 10 * (i + 1 - inputs / 2), 0, this);
            this.inp.push(a);
        }
    }
    this.output1 = new Node(20, 0, 1, this);

    this.customSave = function() {
        // console.log(this.scope.allNodes);
        var data = {
            constructorParamaters: [this.direction, this.inputSize, this.bitWidth],
            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1)
            },
        }
        return data;
    }
    this.resolve = function() {
        var result = this.inp[0].value;
        if (this.isResolvable() == false) {
            return;
        }
        for (var i = 1; i < this.inputSize; i++)
            result = result ^ (this.inp[i].value);

        this.output1.value = result;
        this.scope.stack.push(this.output1);
    }
    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";
        moveTo(ctx, -10, -20, xx, yy, this.direction);
        bezierCurveTo(0, -20, +15, -10, 20, 0, xx, yy, this.direction);
        bezierCurveTo(0 + 15, 0 + 10, 0, 0 + 20, -10, +20, xx, yy, this.direction);
        bezierCurveTo(0, 0, 0, 0, -10, -20, xx, yy, this.direction);
        // arc(ctx, 0, 0, -20, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        arc(ctx, -35, 0, 25, 1.70 * (Math.PI), 0.30 * (Math.PI), xx, yy, this.direction);
        ctx.stroke();


    }
}

function XnorGate(x, y, scope = globalScope, dir = "RIGHT", inputs = 2, bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 20);

    this.inp = [];
    this.inputSize = inputs;
    this.changeInputSize = changeInputSize;
    if (inputs % 2 == 1) {
        for (var i = 0; i < inputs / 2 - 1; i++) {
            var a = new Node(-20, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        var a = new Node(-20, 0, 0, this);
        this.inp.push(a);
        for (var i = inputs / 2 + 1; i < inputs; i++) {
            var a = new Node(-20, 10 * (i + 1 - inputs / 2 - 1), 0, this);
            this.inp.push(a);
        }
    } else {
        for (var i = 0; i < inputs / 2; i++) {
            var a = new Node(-20, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        for (var i = inputs / 2; i < inputs; i++) {
            var a = new Node(-20, 10 * (i + 1 - inputs / 2), 0, this);
            this.inp.push(a);
        }
    }
    this.output1 = new Node(30, 0, 1, this);

    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.inputSize, this.bitWidth],
            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1)
            },
        }
        return data;
    }
    this.resolve = function() {
        var result = this.inp[0].value;
        if (this.isResolvable() == false) {
            return;
        }
        for (var i = 1; i < this.inputSize; i++)
            result = result ^ (this.inp[i].value);
        result = ((~result >>> 0) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
        this.output1.value = result;
        this.scope.stack.push(this.output1);
    }
    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";
        moveTo(ctx, -10, -20, xx, yy, this.direction);
        bezierCurveTo(0, -20, +15, -10, 20, 0, xx, yy, this.direction);
        bezierCurveTo(0 + 15, 0 + 10, 0, 0 + 20, -10, +20, xx, yy, this.direction);
        bezierCurveTo(0, 0, 0, 0, -10, -20, xx, yy, this.direction);
        // arc(ctx, 0, 0, -20, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        arc(ctx, -35, 0, 25, 1.70 * (Math.PI), 0.30 * (Math.PI), xx, yy, this.direction);
        ctx.stroke();
        ctx.beginPath();
        drawCircle2(ctx, 25, 0, 5,xx,yy, this.direction);
        ctx.stroke();

    }
}

function SevenSegDisplay(x, y, scope = globalScope) {
    CircuitElement.call(this, x, y, scope, "RIGHT", 1);
    this.fixedBitWidth = true;
    this.directionFixed = true;
    this.setDimensions(30, 50);

    this.g = new Node(-20, -50, 0, this);
    this.f = new Node(-10, -50, 0, this);
    this.a = new Node(+10, -50, 0, this);
    this.b = new Node(+20, -50, 0, this);
    this.e = new Node(-20, +50, 0, this);
    this.d = new Node(-10, +50, 0, this);
    this.c = new Node(+10, +50, 0, this);
    this.dot = new Node(+20, +50, 0, this);
    this.direction = "RIGHT";

    this.customSave = function() {
        var data = {

            nodes: {
                g: findNode(this.g),
                f: findNode(this.f),
                a: findNode(this.a),
                b: findNode(this.b),
                d: findNode(this.d),
                e: findNode(this.e),
                c: findNode(this.c),
                d: findNode(this.d),
                dot: findNode(this.dot)
            },
        }
        return data;
    }
    this.customDrawSegment = function(x1, y1, x2, y2, color) {
        if (color == undefined) color = "grey";
        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = this.scope.scale*  5;
        xx = this.x;
        yy = this.y;
        moveTo(ctx, x1, y1, xx, yy, this.direction);
        lineTo(ctx, x2, y2, xx, yy, this.direction);
        ctx.closePath();
        ctx.stroke();
    }

    this.customDraw = function() {
        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        this.customDrawSegment(18, -3, 18, -38, ["grey", "red"][this.b.value]);
        this.customDrawSegment(18, 3, 18, 38, ["grey", "red"][this.c.value]);
        this.customDrawSegment(-18, -3, -18, -38, ["grey", "red"][this.f.value]);
        this.customDrawSegment(-18, 3, -18, 38, ["grey", "red"][this.e.value]);
        this.customDrawSegment(-17, -38, 17, -38, ["grey", "red"][this.a.value]);
        this.customDrawSegment(-17, 0, 17, 0, ["grey", "red"][this.g.value]);
        this.customDrawSegment(-15, 38, 17, 38, ["grey", "red"][this.d.value]);

        ctx.beginPath();
        ctx.fillStyle = ["black", "red"][this.dot.value];
        rect(ctx, xx + 20, yy + 40, 2, 2);
        ctx.stroke();
    }
}

function HexDisplay(x, y, scope = globalScope) {
    CircuitElement.call(this, x, y, scope, "RIGHT", 4);
    this.directionFixed = true;
    this.fixedBitWidth = true;
    this.setDimensions(30, 50);

    this.inp = new Node(0, -50, 0, this, 4);
    this.direction = "RIGHT";

    this.customSave = function() {
        var data = {


            nodes: {
                inp: findNode(this.inp)
            },

        }
        return data;
    }
    this.customDrawSegment = function(x1, y1, x2, y2, color) {
        if (color == undefined) color = "grey";
        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = this.scope.scale*  5;
        xx = this.x;
        yy = this.y;

        moveTo(ctx, x1, y1, xx, yy, this.direction);
        lineTo(ctx, x2, y2, xx, yy, this.direction);
        ctx.closePath();
        ctx.stroke();
    }

    this.customDraw = function() {
        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.strokeStyle = "black";
        ctx.lineWidth = this.scope.scale*  3;
        var a = b = c = d = e = f = g = 0;
        switch (this.inp.value) {
            case 0:
                a = b = c = d = e = f = 1;
                break;
            case 1:
                b = c = 1;
                break;
            case 2:
                a = b = g = e = d = 1;
                break;
            case 3:
                a = b = g = c = d = 1;
                break;
            case 4:
                f = g = b = c = 1;
                break;
            case 5:
                a = f = g = c = d = 1;
                break;
            case 6:
                a = f = g = e = c = d = 1;
                break;
            case 7:
                a = b = c = 1;
                break;
            case 8:
                a = b = c = d = e = g = f = 1;
                break;
            case 9:
                a = f = g = b = c = 1;
                break;
            case 0xA:
                a = f = b = c = g = e = 1;
                break;
            case 0xB:
                f = e = g = c = d = 1;
                break;
            case 0xC:
                a = f = e = d = 1;
                break;
            case 0xD:
                b = c = g = e = d = 1;
                break;
            case 0xE:
                a = f = g = e = d = 1;
                break;
            case 0xF:
                a = f = g = e = 1;
                break;
            default:

        }
        this.customDrawSegment(18, -3, 18, -38, ["grey", "red"][b]);
        this.customDrawSegment(18, 3, 18, 38, ["grey", "red"][c]);
        this.customDrawSegment(-18, -3, -18, -38, ["grey", "red"][f]);
        this.customDrawSegment(-18, 3, -18, 38, ["grey", "red"][e]);
        this.customDrawSegment(-17, -38, 17, -38, ["grey", "red"][a]);
        this.customDrawSegment(-17, 0, 17, 0, ["grey", "red"][g]);
        this.customDrawSegment(-15, 38, 17, 38, ["grey", "red"][d]);

    }
}

function OrGate(x, y, scope = globalScope, dir = "RIGHT", inputs = 2, bitWidth = 1) {
    // Calling base class constructor
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 20);
    // Inherit base class prototype

    this.inp = [];
    this.inputSize = inputs;
    this.changeInputSize = changeInputSize;

    if (inputs % 2 == 1) {
        // for (var i = 0; i < inputs / 2 - 1; i++) {
        //     var a = new Node(-10, -10 * (i + 1), 0, this);
        //     this.inp.push(a);
        // }
        // var a = new Node(-10, 0, 0, this);
        // this.inp.push(a);
        // for (var i = inputs / 2 + 1; i < inputs; i++) {
        //     var a = new Node(-10, 10 * (i + 1 - inputs / 2 - 1), 0, this);
        //     this.inp.push(a);
        // }
        for (var i = Math.floor(inputs / 2) - 1; i >= 0; i--) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        var a = new Node(-10, 0, 0, this);
        this.inp.push(a);
        for (var i = 0; i < Math.floor(inputs / 2); i++) {
            var a = new Node(-10, 10 * (i + 1), 0, this);
            this.inp.push(a);
        }
    } else {
        for (var i = inputs / 2 - 1; i >= 0; i--) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        for (var i = 0; i < inputs / 2; i++) {
            var a = new Node(-10, 10 * (i + 1), 0, this);
            this.inp.push(a);
        }
    }
    this.output1 = new Node(20, 0, 1, this);

    this.customSave = function() {
        var data = {

            constructorParamaters: [this.direction, this.inputSize, this.bitWidth],

            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1),
            },
        }
        return data;
    }

    this.resolve = function() {
        var result = this.inp[0].value;
        if (this.isResolvable() == false) {
            return;
        }
        for (var i = 1; i < this.inputSize; i++)
            result = result | (this.inp[i].value);
        this.output1.value = result;
        this.scope.stack.push(this.output1);
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";

        moveTo(ctx, -10, -20, xx, yy, this.direction);
        bezierCurveTo(0, -20, +15, -10, 20, 0, xx, yy, this.direction);
        bezierCurveTo(0 + 15, 0 + 10, 0, 0 + 20, -10, +20, xx, yy, this.direction);
        bezierCurveTo(0, 0, 0, 0, -10, -20, xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();



    }

}

function Stepper(x, y, scope = globalScope, dir = "RIGHT") {

    CircuitElement.call(this, x, y, scope, dir, 8);
    this.setDimensions(20, 20);

    this.output1 = new Node(20, 0, 1, this, 8);
    this.state = 0;
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction],
            nodes: {
                output1: findNode(this.output1),
            },
            values: {
                state: this.state
            }
        }
        return data;
    }
    this.customDraw = function() {
        ctx = simulationArea.context;

        ctx.beginPath();
        ctx.font = "20px Georgia";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        fillText(ctx, this.state.toString(16), this.x, this.y + 5);
        ctx.fill();;
    }

    this.resolve = function() {
        this.output1.value = this.state;
        this.scope.stack.push(this.output1);
    }
    this.keyDown = function(key) {
        console.log(key);
        if (this.state < 255 && (key == "+" || key == "=")) this.state++;
        if (this.state > 0 && (key == "_" || key == "-")) this.state--;
    }
}

function NotGate(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 15);

    this.inp1 = new Node(-10, 0, 0, this);
    this.output1 = new Node(20, 0, 1, this);
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth],
            nodes: {
                output1: findNode(this.output1),
                inp1: findNode(this.inp1)
            },
        }
        return data;
    }

    this.resolve = function() {
        if (this.isResolvable() == false) {
            return;
        }
        this.output1.value = ((~this.inp1.value >>> 0) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
        this.scope.stack.push(this.output1);
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = "black";
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";
        moveTo(ctx, -10, -10, xx, yy, this.direction);
        lineTo(ctx, 10, 0, xx, yy, this.direction);
        lineTo(ctx, -10, 10, xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        drawCircle2(ctx, 15, 0, 5,xx,yy, this.direction);
        ctx.stroke();

    }

}

function TriState(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 15);

    this.inp1 = new Node(-10, 0, 0, this);
    this.output1 = new Node(20, 0, 1, this);
    this.state = new Node(0, 0, 0, this, 1);
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth],
            nodes: {
                output1: findNode(this.output1),
                inp1: findNode(this.inp1),
                state: findNode(this.state),
            },
        }
        return data;
    }
    this.newBitWidth = function(bitWidth) {
        this.inp1.bitWidth = bitWidth;
        this.output1.bitWidth = bitWidth;
        this.bitWidth = bitWidth;
    }

    this.resolve = function() {
        if (this.isResolvable() == false) {
            return;
        }
        if (this.state.value == 1) {
            this.output1.value = this.inp1.value; //>>>0)<<(32-this.bitWidth))>>>(32-this.bitWidth);
            this.scope.stack.push(this.output1);
        } else {
            this.output1.value = undefined;
        }
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";
        moveTo(ctx, -10, -15, xx, yy, this.direction);
        lineTo(ctx, 20, 0, xx, yy, this.direction);
        lineTo(ctx, -10, 15, xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();

    }

}

function Buffer(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 15);

    this.state = 0;
    this.preState = 0;
    this.inp1 = new Node(-10, 0, 0, this);
    this.reset = new Node(0, 0, 0, this, 1);
    this.output1 = new Node(20, 0, 1, this);
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth],
            nodes: {
                output1: findNode(this.output1),
                inp1: findNode(this.inp1),
                reset: findNode(this.reset),
            },
        }
        return data;
    }

    this.newBitWidth = function(bitWidth) {
        this.inp1.bitWidth = bitWidth;
        this.output1.bitWidth = bitWidth;
        this.bitWidth = bitWidth;
    }


    this.isResolvable = function() {
        return true;
    }

    this.resolve = function() {

        if (this.reset.value == 1) {
            this.state = this.preState;
        }
        if (this.inp1.value !== undefined)
            this.state = this.inp1.value;

        this.output1.value = this.state;
        this.scope.stack.push(this.output1);

    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(200,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";
        moveTo(ctx, -10, -15, xx, yy, this.direction);
        lineTo(ctx, 20, 0, xx, yy, this.direction);
        lineTo(ctx, -10, 15, xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();

    }

}

function ControlledInverter(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 15);

    this.inp1 = new Node(-10, 0, 0, this);
    this.output1 = new Node(30, 0, 1, this);
    this.state = new Node(0, 0, 0, this, 1);
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth],
            nodes: {
                output1: findNode(this.output1),
                inp1: findNode(this.inp1),
                state: findNode(this.state)
            },
        }
        return data;
    }
    this.newBitWidth = function(bitWidth) {
        this.inp1.bitWidth = bitWidth;
        this.output1.bitWidth = bitWidth;
        this.bitWidth = bitWidth;
    }

    this.resolve = function() {
        if (this.isResolvable() == false) {
            return;
        }
        if (this.state.value == 1) {
            this.output1.value = ((~this.inp1.value >>> 0) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
            this.scope.stack.push(this.output1);
        }
        if (this.state.value == 0) {
            this.output1.value = undefined;
        }
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";
        moveTo(ctx, -10, -15, xx, yy, this.direction);
        lineTo(ctx, 20, 0, xx, yy, this.direction);
        lineTo(ctx, -10, 15, xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        drawCircle2(ctx, 25, 0, 5,xx,yy, this.direction);
        ctx.stroke();

    }

}

function Adder(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.setDimensions(20, 20);

    this.inpA = new Node(-20, -10, 0, this, this.bitWidth);
    this.inpB = new Node(-20, 0, 0, this, this.bitWidth);
    this.carryIn = new Node(-20, 10, 0, this, 1);
    this.sum = new Node(20, 0, 1, this, this.bitWidth);
    this.carryOut = new Node(20, 10, 1, this, 1);

    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth],
            nodes: {
                inpA: findNode(this.inpA),
                inpB: findNode(this.inpB),
                carryIn: findNode(this.carryIn),
                carryOut: findNode(this.carryOut),
                sum: findNode(this.sum)
            },
        }
        return data;
    }

    this.isResolvable = function() {
        return this.inpA.value != undefined && this.inpB.value != undefined;
    }

    this.newBitWidth = function(bitWidth) {
        this.bitWidth = bitWidth;
        this.inpA.bitWidth = bitWidth;
        this.inpB.bitWidth = bitWidth;
        this.sum.bitWidth = bitWidth;
    }
    this.resolve = function() {
        if (this.isResolvable() == false) {
            return;
        }
        var carryIn = this.carryIn.value;
        if (carryIn == undefined) carryIn = 0;
        var sum = this.inpA.value + this.inpB.value + carryIn;

        this.sum.value = ((sum) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
        this.carryOut.value = +((sum >>> (this.bitWidth)) !== 0);
        this.scope.stack.push(this.carryOut);
        this.scope.stack.push(this.sum);
    }

}

function Ram(x, y, scope = globalScope, dir = "RIGHT", data = undefined) {

    CircuitElement.call(this, x, y, scope, dir, 1);
    this.fixedBitWidth = true;
    this.setDimensions(30, 30);

    this.memAddr = new Node(-30, 0, 0, this, 4);
    this.data = data || prompt("Enter data").split(' ').map(function(x) {
        return parseInt(x, 16);
    });
    console.log(this.data);
    this.dataOut = new Node(30, 0, 1, this, 8);

    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.data],
            nodes: {
                memAddr: findNode(this.memAddr),
                dataOut: findNode(this.dataOut)
            },

        }
        return data;
    }
    this.dblclick = function() {
        this.data = prompt("Enter data").split(' ').map(function(x) {
            return parseInt(x, 16);
        });
    }

    this.resolve = function() {
        if (this.isResolvable() == false) {
            return;
        }
        this.dataOut.value = this.data[this.memAddr.value];
        this.scope.stack.push(this.dataOut);
    }

}

function Splitter(x, y, scope = globalScope, dir = "RIGHT", bitWidth = undefined, bitWidthSplit = undefined) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;

    this.bitWidthSplit = bitWidthSplit || prompt("Enter bitWidth Split").split(' ').map(function(x) {
        return parseInt(x, 10);
    });
    this.splitCount = this.bitWidthSplit.length;

    this.setDimensions(10, (this.splitCount - 1) * 10 + 10);
    this.yOffset = (this.splitCount / 2 - 1) * 20;

    this.inp1 = new Node(-10, 10 + this.yOffset, 0, this, this.bitWidth);

    this.outputs = [];
    for (var i = 0; i < this.splitCount; i++)
        this.outputs.push(new Node(20, i * 20 - this.yOffset - 20, 0, this, this.bitWidthSplit[i]));
    this.customSave = function() {
        var data = {

            constructorParamaters: [this.direction, this.bitWidth, this.bitWidthSplit],
            nodes: {
                outputs: this.outputs.map(findNode),
                inp1: findNode(this.inp1)
            },
        }
        return data;
    }

    this.isResolvable = function() {
        var resolvable = false;
        if (this.inp1.value !== undefined) resolvable = true;
        var i;
        for (i = 0; i < this.splitCount; i++)
            if (this.outputs[i].value === undefined) break;
        if (i == this.splitCount) resolvable = true;
        return resolvable;
    }

    this.resolve = function() {
        if (this.isResolvable() == false) {
            return;
        }
        if (this.inp1.value !== undefined) {
            var bitCount = 1;
            for (var i = 0; i < this.splitCount; i++) {
                var bitSplitValue = extractBits(this.inp1.value, bitCount, bitCount + this.bitWidthSplit[i] - 1);
                if (this.outputs[i].value != bitSplitValue) {
                    this.outputs[i].value = bitSplitValue;
                    this.scope.stack.push(this.outputs[i]);
                }
                bitCount += this.bitWidthSplit[i];
            }
        } else {
            var n = 0;
            for (var i = this.splitCount - 1; i >= 0; i--) {
                n <<= this.bitWidthSplit[i];
                n += this.outputs[i].value;
            }
            if (this.inp1.value === undefined) {
                this.inp1.value = n;
                this.scope.stack.push(this.inp1);
            } else if (this.inp1.value != n) {
                console.log("CONTENTION");
            }
        }
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ["black", "brown"][((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) + 0];
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();

        // drawLine(ctx, -10, -10, xx, y2, color, width)
        moveTo(ctx, -10, 10 + this.yOffset, xx, yy, this.direction);
        lineTo(ctx, 0, 0 + this.yOffset, xx, yy, this.direction);
        lineTo(ctx, 0, -20 * (this.splitCount - 1) + this.yOffset, xx, yy, this.direction);

        var bitCount = 0;
        for (var i = this.splitCount - 1; i >= 0; i--) {
            moveTo(ctx, 0, -20 * i + this.yOffset, xx, yy, this.direction);
            lineTo(ctx, 20, -20 * i + this.yOffset, xx, yy, this.direction);
        }
        ctx.stroke();
        ctx.beginPath();
        for (var i = this.splitCount - 1; i >= 0; i--) {
            fillText2(ctx, bitCount + ":" + (bitCount + this.bitWidthSplit[this.splitCount - i - 1]), 10, -20 * i + 14 + this.yOffset, xx, yy, this.direction);
            bitCount += this.bitWidthSplit[this.splitCount - i - 1];
        }
        ctx.fill();



    }

}

function Input(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {

    // Call base class constructor
    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.state = 0;
    this.orientationFixed = false;
    this.state = bin2dec(this.state); // in integer format
    this.output1 = new Node(this.bitWidth * 10, 0, 1, this);
    this.wasClicked = false;
    this.directionFixed = true;
    this.setWidth(this.bitWidth * 10);
    this.rectangleObject = true; // Trying to make use of base class draw

    this.customSave = function() {
        var data = {
            nodes: {
                output1: findNode(this.output1)
            },
            values: {
                state: this.state
            },
            constructorParamaters: [this.direction, this.bitWidth]
        }
        return data;
    }

    this.resolve = function() {
        this.output1.value = this.state;
        this.scope.stack.push(this.output1);
    }

    // Check if override is necessary!!
    this.newBitWidth = function(bitWidth) {
        this.bitWidth = bitWidth; //||parseInt(prompt("Enter bitWidth"),10);
        this.setWidth(this.bitWidth * 10);
        this.state = 0;
        this.output1.bitWidth = bitWidth;
        if (this.direction == "RIGHT") {
            this.output1.x = 10 * this.bitWidth;
            this.output1.leftx = 10 * this.bitWidth;
        } else if (this.direction == "LEFT") {
            this.output1.x = -10 * this.bitWidth;
            this.output1.leftx = 10 * this.bitWidth;
        }
    }

    this.click = function() { // toggle
        var pos = this.findPos();
        if (pos == 0) pos = 1; // minor correction
        if (pos < 1 || pos > this.bitWidth) return;
        this.state = ((this.state >>> 0) ^ (1 << (this.bitWidth - pos))) >>> 0;
    }

    // Not sure if its okay to remove commented code...VERIFY!
    this.customDraw = function() {

        // ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;
        var xx = this.x;
        var yy = this.y;

        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        var bin = dec2bin(this.state, this.bitWidth);
        for (var k = 0; k < this.bitWidth; k++)
            fillText(ctx, bin[k], xx - 10 * this.bitWidth + 10 + (k) * 20, yy + 5);
        ctx.fill();


    }


    this.newDirection = function(dir) {
        if (dir == this.direction) return;
        this.direction = dir;
        this.output1.refresh();
        if (dir == "RIGHT" || dir == "LEFT") {
            this.output1.leftx = 10 * this.bitWidth;
            this.output1.lefty = 0;
        } else {
            this.output1.leftx = 10; //10*this.bitWidth;
            this.output1.lefty = 0;
        }

        this.output1.refresh();
        this.labelDirection = oppositeDirection[this.direction];
    }

    this.findPos = function() {
        return Math.round((simulationArea.mouseX - this.x + 10 * this.bitWidth) / 20.0);
    }
}

function Ground(x, y, scope = globalScope, bitWidth = 1) {
    CircuitElement.call(this, x, y, scope, "RIGHT", bitWidth);
    this.rectangleObject = false;
    this.setDimensions(20, 20);
    this.directionFixed = true;
    this.output1 = new Node(0, -10, 1, this);

    this.output1.value = this.state;

    this.wasClicked = false;
    this.resolve = function() {
        this.output1.value = 0;
        this.scope.stack.push(this.output1);
    }
    this.customSave = function() {
        var data = {
            nodes: {
                output1: findNode(this.output1)
            },
            constructorParamaters: [this.bitWidth],
        }
        return data;
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        ctx.beginPath();
        ctx.strokeStyle = ["black", "brown"][((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) + 0];
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;

        moveTo(ctx, 0, -10, xx, yy, this.direction);
        lineTo(ctx, 0, 0, xx, yy, this.direction);
        moveTo(ctx, -10, 0, xx, yy, this.direction);
        lineTo(ctx, 10, 0, xx, yy, this.direction);
        moveTo(ctx, -6, 5, xx, yy, this.direction);
        lineTo(ctx, 6, 5, xx, yy, this.direction);
        moveTo(ctx, -2.5, 10, xx, yy, this.direction);
        lineTo(ctx, 2.5, 10, xx, yy, this.direction);
        ctx.stroke();
    }
}

function Power(x, y, scope = globalScope, bitWidth = 1) {

    CircuitElement.call(this, x, y, scope, "RIGHT", bitWidth);
    this.directionFixed = true;
    this.rectangleObject = false;
    this.setDimensions(15, 15);
    this.output1 = new Node(0, 10, 1, this);
    this.output1.value = this.state;
    this.wasClicked = false;
    this.resolve = function() {
        this.output1.value = ~0 >>> (32 - this.bitWidth);
        this.scope.stack.push(this.output1);
    }
    this.customSave = function() {
        var data = {


            nodes: {
                output1: findNode(this.output1)
            },
            constructorParamaters: [this.bitWidth],
        }
        return data;
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.beginPath();
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;
        ctx.fillStyle = "green";
        moveTo(ctx, 0, -10, xx, yy, this.direction);
        lineTo(ctx, -10, 0, xx, yy, this.direction);
        lineTo(ctx, 10, 0, xx, yy, this.direction);
        lineTo(ctx, 0, -10, xx, yy, this.direction);
        ctx.closePath();
        ctx.stroke();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        moveTo(ctx, 0, 0, xx, yy, this.direction);
        lineTo(ctx, 0, 10, xx, yy, this.direction);
        ctx.stroke();

    }
}

function Output(x, y, scope = globalScope, dir = "LEFT", bitWidth = 1) {
    // Calling base class constructor

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.directionFixed = true;
    this.orientationFixed = false;
    this.setDimensions(this.bitWidth * 10, 10);
    this.inp1 = new Node(this.bitWidth * 10, 0, 0, this);
    // this.plotValues = [];

    // this.resolve = function() {
    //
    //     var time=plotArea.stopWatch.ElapsedMilliseconds;
    //     // console.log("DEB:",time);
    //     if(this.plotValues.length&&this.plotValues[this.plotValues.length-1][0]==time)
    //         this.plotValues.pop();
    //
    //     if(this.plotValues.length==0){
    //         this.plotValues.push([time,this.inp1.value]);
    //         return;
    //     }
    //
    //     if(this.plotValues[this.plotValues.length-1][1]==this.inp1.value)
    //        return;
    //     else
    //        this.plotValues.push([time,this.inp1.value]);
    // }

    this.customSave = function() {
        var data = {
            nodes: {
                inp1: findNode(this.inp1)
            },
            constructorParamaters: [this.direction, this.bitWidth],
        }
        return data;
    }

    this.newBitWidth = function(bitWidth) {

        this.state = undefined;
        this.inp1.bitWidth = bitWidth;
        this.bitWidth = bitWidth;
        this.setWidth(10 * this.bitWidth);

        if (this.direction == "RIGHT") {
            this.inp1.x = 10 * this.bitWidth;
            this.inp1.leftx = 10 * this.bitWidth;
        } else if (this.direction == "LEFT") {
            this.inp1.x = -10 * this.bitWidth;
            this.inp1.leftx = 10 * this.bitWidth;
        }
    }

    this.customDraw = function() {
        this.state = this.inp1.value;
        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = ["blue", "red"][+(this.inp1.value == undefined)];
        ctx.fillStyle = "white";
        ctx.lineWidth = this.scope.scale*  3;
        var xx = this.x;
        var yy = this.y;

        rect2(ctx, -10 * this.bitWidth, -10, 20 * this.bitWidth, 20, xx, yy, "RIGHT");
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this))
            ctx.fillStyle = "rgba(255, 255, 32,0.8)";

        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.font = "20px Georgia";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        if (this.state === undefined)
            var bin = 'x'.repeat(this.bitWidth);
        else
            var bin = dec2bin(this.state, this.bitWidth);

        for (var k = 0; k < this.bitWidth; k++)
            fillText(ctx, bin[k], xx - 10 * this.bitWidth + 10 + (k) * 20, yy + 5);
        ctx.fill();

    }


    this.newDirection = function(dir) {
        if (dir == this.direction) return;
        this.direction = dir;
        this.inp1.refresh();
        if (dir == "RIGHT" || dir == "LEFT") {
            this.inp1.leftx = 10 * this.bitWidth;
            this.inp1.lefty = 0;
        } else {
            this.inp1.leftx = 10; //10*this.bitWidth;
            this.inp1.lefty = 0;
        }

        this.inp1.refresh();
        this.labelDirection = oppositeDirection[this.direction];
    }
}

function BitSelector(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 2, selectorBitWidth = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.setDimensions(20, 20);
    this.selectorBitWidth = selectorBitWidth || parseInt(prompt("Enter Selector bitWidth"), 10);
    this.rectangleObject = false;
    this.inp1 = new Node(-20, 0, 0, this, this.bitWidth);
    this.output1 = new Node(20, 0, 1, this, 1);
    this.bitSelectorInp = new Node(0, 20, 0, this, this.selectorBitWidth);


    this.changeSelectorBitWidth = function(size) {
        if (size == undefined || size < 1 || size > 32) return;
        this.selectorBitWidth = size;
        this.bitSelectorInp.bitWidth = size;
    }
    this.mutableProperties = {
        "selectorBitWidth": {
            name: "Selector Bit Width: ",
            type: "number",
            max: "32",
            min: "1",
            func: "changeSelectorBitWidth",
        }
    }
    this.customSave = function() {
        var data = {

            nodes: {
                inp1: findNode(this.inp1),
                output1: findNode(this.output1),
                bitSelectorInp: findNode(this.bitSelectorInp)
            },
            constructorParamaters: [this.direction, this.bitWidth, this.selectorBitWidth],
        }
        return data;
    }

    this.newBitWidth = function(bitWidth) {
        this.inp1.bitWidth = bitWidth;
        this.bitWidth = bitWidth;
    }

    this.resolve = function() {
        this.output1.value = extractBits(this.inp1.value, this.bitSelectorInp.value + 1, this.bitSelectorInp.value + 1); //(this.inp1.value^(1<<this.bitSelectorInp.value))==(1<<this.bitSelectorInp.value);
        this.scope.stack.push(this.output1);
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = ["blue", "red"][(this.state === undefined) + 0];
        ctx.fillStyle = "white";
        ctx.lineWidth = this.scope.scale*  3;
        var xx = this.x;
        var yy = this.y;
        rect(ctx, xx - 20, yy - 20, 40, 40);
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.font = "20px Georgia";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        if (this.bitSelectorInp.value === undefined)
            var bit = 'x';
        else
            var bit = this.bitSelectorInp.value;

        fillText(ctx, bit, xx, yy + 5);
        ctx.fill();
    }
}

function ConstantVal(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1, state = "0") {
    this.state = state || prompt("Enter value");
    CircuitElement.call(this, x, y, scope, dir, this.state.length);
    this.setDimensions(10 * this.state.length, 10);
    this.bitWidth = bitWidth || this.state.length;
    this.directionFixed = true;
    this.orientationFixed = false;
    this.rectangleObject = false;

    this.output1 = new Node(this.bitWidth * 10, 0, 1, this);
    this.wasClicked = false;
    this.label = "";
    this.customSave = function() {
        var data = {
            nodes: {
                output1: findNode(this.output1)
            },
            constructorParamaters: [this.direction, this.bitWidth, this.state],
        }
        return data;
    }
    this.resolve = function() {
        this.output1.value = bin2dec(this.state);
        this.scope.stack.push(this.output1);
    }
    this.dblclick = function() {
        this.state = prompt("Re enter the value");
        console.log(this.state);
        this.newBitWidth(this.state.toString().length);
        console.log(this.state, this.bitWidth);
    }
    this.newBitWidth = function(bitWidth) {
        this.bitWidth = bitWidth; //||parseInt(prompt("Enter bitWidth"),10);
        this.output1.bitWidth = bitWidth;
        this.setDimensions(10 * this.bitWidth, 10);
        if (this.direction == "RIGHT") {
            this.output1.x = 10 * this.bitWidth;
            this.output1.leftx = 10 * this.bitWidth;
        } else if (this.direction == "LEFT") {
            this.output1.x = -10 * this.bitWidth;
            this.output1.leftx = 10 * this.bitWidth;
        }
    }
    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.fillStyle = "white";
        ctx.lineWidth = this.scope.scale*  0.5;
        var xx = this.x;
        var yy = this.y;

        rect2(ctx, -10 * this.bitWidth, -10, 20 * this.bitWidth, 20, xx, yy, "RIGHT");
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        var bin = this.state; //dec2bin(this.state,this.bitWidth);
        for (var k = 0; k < this.bitWidth; k++)
            fillText(ctx, bin[k], xx - 10 * this.bitWidth + 10 + (k) * 20, yy + 5);
        ctx.fill();

    }
    this.newDirection = function(dir) {
        if (dir == this.direction) return;
        this.direction = dir;
        this.output1.refresh();
        if (dir == "RIGHT" || dir == "LEFT") {
            this.output1.leftx = 10 * this.bitWidth;
            this.output1.lefty = 0;
        } else {
            this.output1.leftx = 10; //10*this.bitWidth;
            this.output1.lefty = 0;
        }

        this.output1.refresh();
        this.labelDirection = oppositeDirection[this.direction];
    }
}

function NorGate(x, y, scope = globalScope, dir = "RIGHT", inputs = 2, bitWidth = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.rectangleObject = false;
    this.setDimensions(15, 20);

    this.inp = [];
    this.inputSize = inputs;
    this.changeInputSize = changeInputSize;
    if (inputs % 2 == 1) {
        for (var i = 0; i < inputs / 2 - 1; i++) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        var a = new Node(-10, 0, 0, this);
        this.inp.push(a);
        for (var i = inputs / 2 + 1; i < inputs; i++) {
            var a = new Node(-10, 10 * (i + 1 - inputs / 2 - 1), 0, this);
            this.inp.push(a);
        }
    } else {
        for (var i = 0; i < inputs / 2; i++) {
            var a = new Node(-10, -10 * (i + 1), 0, this);
            this.inp.push(a);
        }
        for (var i = inputs / 2; i < inputs; i++) {
            var a = new Node(-10, 10 * (i + 1 - inputs / 2), 0, this);
            this.inp.push(a);
        }
    }
    this.output1 = new Node(30, 0, 1, this);

    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.inputSize, this.bitWidth],
            nodes: {
                inp: this.inp.map(findNode),
                output1: findNode(this.output1)
            },
        }
        return data;
    }
    this.resolve = function() {
        var result = this.inp[0].value;
        if (this.isResolvable() == false) {
            return;
        }
        for (var i = 1; i < this.inputSize; i++)
            result = result | (this.inp[i].value);
        result = ((~result >>> 0) << (32 - this.bitWidth)) >>> (32 - this.bitWidth);
        this.output1.value = result
        this.scope.stack.push(this.output1);
    }
    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  3;

        var xx = this.x;
        var yy = this.y;
        ctx.beginPath();
        ctx.fillStyle = "white";

        moveTo(ctx, -10, -20, xx, yy, this.direction);
        bezierCurveTo(0, -20, +15, -10, 20, 0, xx, yy, this.direction);
        bezierCurveTo(0 + 15, 0 + 10, 0, 0 + 20, -10, +20, xx, yy, this.direction);
        bezierCurveTo(0, 0, 0, 0, -10, -20, xx, yy, this.direction);
        ctx.closePath();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.5)";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        drawCircle2(ctx, 25, 0, 5,xx,yy, this.direction);
        ctx.stroke();
        //for debugging
    }
}

function DigitalLed(x, y, scope = globalScope) {
    // Calling base class constructor

    CircuitElement.call(this, x, y, scope, "UP", 1);
    this.rectangleObject = false;
    this.setDimensions(10, 20);
    this.inp1 = new Node(-40, 0, 0, this, 1);
    this.directionFixed = true;
    this.fixedBitWidth = true;

    this.customSave = function() {
        var data = {
            nodes: {
                inp1: findNode(this.inp1)
            },
        }
        return data;
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.strokeStyle = "#e3e4e5";
        ctx.lineWidth = this.scope.scale*  3;
        ctx.beginPath();
        moveTo(ctx, -20, 0, xx, yy, this.direction);
        lineTo(ctx, -40, 0, xx, yy, this.direction);
        ctx.stroke();

        ctx.strokeStyle = "#d3d4d5";
        ctx.fillStyle = ["rgba(227,228,229,0.8)", "rgba(249,24,43,0.8)"][this.inp1.value || 0];
        ctx.lineWidth = this.scope.scale*  1;

        ctx.beginPath();

        moveTo(ctx, -15, -9, xx, yy, this.direction);
        lineTo(ctx, 0, -9, xx, yy, this.direction);
        arc(ctx, 0, 0, 9, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        lineTo(ctx, -15, 9, xx, yy, this.direction);
        lineTo(ctx, -18, 12, xx, yy, this.direction);
        arc(ctx, 0, 0, Math.sqrt(468), ((Math.PI / 2) + Math.acos(12 / Math.sqrt(468))), ((-Math.PI / 2) - Math.asin(18 / Math.sqrt(468))), xx, yy, this.direction);
        lineTo(ctx, -15, -9, xx, yy, this.direction);
        ctx.stroke();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();

    }
}

function VariableLed(x, y, scope = globalScope) {
    // Calling base class constructor

    CircuitElement.call(this, x, y, scope, "UP", 8);
    this.rectangleObject = false;
    this.setDimensions(10, 20);
    this.inp1 = new Node(-40, 0, 0, this, 8);
    this.directionFixed = true;
    this.fixedBitWidth = true;

    this.customSave = function() {
        var data = {
            nodes: {
                inp1: findNode(this.inp1)
            },
        }
        return data;
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.strokeStyle = "#353535";
        ctx.lineWidth = this.scope.scale*  3;
        ctx.beginPath();
        moveTo(ctx, -20, 0, xx, yy, this.direction);
        lineTo(ctx, -40, 0, xx, yy, this.direction);
        ctx.stroke();
        var c = this.inp1.value;
        var alpha = c / 255;
        ctx.strokeStyle = "#090a0a";
        ctx.fillStyle = ["rgba(255,29,43," + alpha + ")", "rgba(227, 228, 229, 0.8)"][(c === undefined || c == 0) + 0];
        ctx.lineWidth = this.scope.scale*  1;

        ctx.beginPath();

        moveTo(ctx, -20, -9, xx, yy, this.direction);
        lineTo(ctx, 0, -9, xx, yy, this.direction);
        arc(ctx, 0, 0, 9, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        lineTo(ctx, -20, 9, xx, yy, this.direction);
        /*lineTo(ctx,-18,12,xx,yy,this.direction);
        arc(ctx,0,0,Math.sqrt(468),((Math.PI/2) + Math.acos(12/Math.sqrt(468))),((-Math.PI/2) - Math.asin(18/Math.sqrt(468))),xx,yy,this.direction);

        */
        lineTo(ctx, -20, -9, xx, yy, this.direction);
        ctx.stroke();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();

    }
}

function Button(x, y, scope = globalScope, dir = "RIGHT") {
    CircuitElement.call(this, x, y, scope, dir, 1);
    this.state = 0;
    this.output1 = new Node(30, 0, 1, this);
    this.wasClicked = false;
    this.rectangleObject = false;
    this.setDimensions(10, 10);

    this.customSave = function() {
        var data = {
            nodes: {
                output1: findNode(this.output1)
            },
            values: {
                state: this.state
            },
            constructorParamaters: [this.direction, this.bitWidth]
        }
        return data;
    }
    this.resolve = function() {
        if (this.wasClicked) {
            this.state = 1;
            this.output1.value = this.state;
        } else {
            this.state = 0;
            this.output1.value = this.state;
        }
        this.scope.stack.push(this.output1);
    }
    this.customDraw = function() {
        ctx = simulationArea.context;
        var xx = this.x;
        var yy = this.y;
        ctx.fillStyle = "#ddd";

        ctx.strokeStyle = "#353535";
        ctx.lineWidth = this.scope.scale*  5;

        ctx.beginPath();

        moveTo(ctx, 10, 0, xx, yy, this.direction);
        lineTo(ctx, 30, 0, xx, yy, this.direction);
        ctx.stroke();

        ctx.beginPath();

        drawCircle2(ctx, 0, 0, 12, xx, yy, this.direction);
        ctx.stroke();

        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this))
            ctx.fillStyle = "rgba(232, 13, 13,0.6)"

        if (this.wasClicked)
            ctx.fillStyle = "rgba(232, 13, 13,0.8)";
        ctx.fill();
    }
}

function RGBLed(x, y, scope = globalScope) {
    // Calling base class constructor

    CircuitElement.call(this, x, y, scope, "UP", 8);
    this.rectangleObject = false;
    this.inp = [];
    this.setDimensions(10, 10);
    this.inp1 = new Node(-40, -10, 0, this, 8);
    this.inp2 = new Node(-40, 0, 0, this, 8);
    this.inp3 = new Node(-40, 10, 0, this, 8);
    this.inp.push(this.inp1);
    this.inp.push(this.inp2);
    this.inp.push(this.inp3);
    this.directionFixed = true;
    this.fixedBitWidth = true;

    this.customSave = function() {
        var data = {
            nodes: {
                inp1: findNode(this.inp1),
                inp2: findNode(this.inp2),
                inp3: findNode(this.inp3),
            },
        }
        return data;
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.strokeStyle = "green";
        ctx.lineWidth = this.scope.scale*  3;
        ctx.beginPath();
        moveTo(ctx, -20, 0, xx, yy, this.direction);
        lineTo(ctx, -40, 0, xx, yy, this.direction);
        ctx.stroke();

        ctx.strokeStyle = "red";
        ctx.lineWidth = this.scope.scale*  2;
        ctx.beginPath();
        moveTo(ctx, -20, -10, xx, yy, this.direction);
        lineTo(ctx, -40, -10, xx, yy, this.direction);
        ctx.stroke();

        ctx.strokeStyle = "blue";
        ctx.lineWidth = this.scope.scale*  2;
        ctx.beginPath();
        moveTo(ctx, -20, 10, xx, yy, this.direction);
        lineTo(ctx, -40, 10, xx, yy, this.direction);
        ctx.stroke();

        var a = this.inp1.value;
        var b = this.inp2.value;
        var c = this.inp3.value;
        var ch1 = "start";
        var ch2 = "end";
        console.log(ch1);
        console.log(a);
        console.log(b);
        console.log(c);
        console.log(ch2);
        ctx.strokeStyle = "#d3d4d5";
        ctx.fillStyle = ["rgba(" + a + ", " + b + ", " + c + ", 0.8)", "rgba(227, 228, 229, 0.8)"][((a === undefined || b === undefined || c === undefined)) + 0]
        //ctx.fillStyle = ["rgba(200, 200, 200, 0.3)","rgba(227, 228, 229, 0.8)"][((a === undefined || b === undefined || c === undefined) || (a == 0 && b == 0 && c == 0)) + 0];
        ctx.lineWidth = this.scope.scale*  1;

        ctx.beginPath();

        moveTo(ctx, -18, -11, xx, yy, this.direction);
        lineTo(ctx, 0, -11, xx, yy, this.direction);
        arc(ctx, 0, 0, 11, (-Math.PI / 2), (Math.PI / 2), xx, yy, this.direction);
        lineTo(ctx, -18, 11, xx, yy, this.direction);
        lineTo(ctx, -21, 15, xx, yy, this.direction);
        arc(ctx, 0, 0, Math.sqrt(666), ((Math.PI / 2) + Math.acos(15 / Math.sqrt(666))), ((-Math.PI / 2) - Math.asin(21 / Math.sqrt(666))), xx, yy, this.direction);
        lineTo(ctx, -18, -11, xx, yy, this.direction);
        ctx.stroke();
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
    }
}

function Demultiplexer(x, y, scope = globalScope, dir = "LEFT", bitWidth = 1, controlSignalSize = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.controlSignalSize = controlSignalSize || parseInt(prompt("Enter control signal bitWidth"), 10);
    this.outputsize = 1 << this.controlSignalSize;
    var xOff = 0;
    var yOff = 1;
    if (this.controlSignalSize == 1) {
        xOff = 10;
    }
    if (this.controlSignalSize <= 3) {
        yOff = 2;
    }

    this.changeControlSignalSize = function(size) {
        if (size == undefined || size < 1 || size > 32) return;
        if (this.controlSignalSize == size) return;
        var obj = new window[this.objectType](this.x, this.y, this.scope, this.direction, this.bitWidth, size);
        this.cleanDelete();
        simulationArea.lastSelected = obj;
        return obj;
    }
    this.mutableProperties = {
        "controlSignalSize": {
            name: "Control Signal Size",
            type: "number",
            max: "32",
            min: "1",
            func: "changeControlSignalSize",
        },
    }
    this.newBitWidth = function(bitWidth) {
        this.bitWidth = bitWidth;
        for (var i = 0; i < this.inputSize; i++) {
            this.outputs1[i].bitWidth = bitWidth
        }
        this.input.bitWidth = bitWidth;
    }

    this.setDimensions(20, yOff * 5 * (this.outputsize));
    this.rectangleObject = false;
    this.input = new Node(20 - xOff, 0, 0, this);

    this.output1 = [];
    for (var i = 0; i < this.outputsize; i++) {
        var a = new Node(-20 + xOff, +yOff * 10 * (i - this.outputsize / 2) + 10, 1, this);
        this.output1.push(a);
    }

    this.controlSignalInput = new Node(0, yOff * 10 * (this.outputsize / 2 - 1) + xOff + 10, 0, this, this.controlSignalSize);

    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction, this.bitWidth, this.controlSignalSize],
            nodes: {
                output1: this.output1.map(findNode),
                input: findNode(this.input),
                controlSignalInput: findNode(this.controlSignalInput)
            },
        }
        return data;
    }

    this.resolve = function() {
        this.output1[this.controlSignalInput.value].value = this.input.value;
        this.scope.stack.push(this.output1[this.controlSignalInput.value]);
    }

    this.customDraw = function() {

        ctx = simulationArea.context;

        var xx = this.x;
        var yy = this.y;

        ctx.beginPath();
        moveTo(ctx, 0, yOff * 10 * (this.outputsize / 2 - 1) + 10 + 0.5 * xOff, xx, yy, this.direction);
        lineTo(ctx, 0, yOff * 5 * (this.outputsize - 1) + xOff, xx, yy, this.direction);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = ("rgba(0,0,0,1)");
        ctx.lineWidth = this.scope.scale*  4;
        ctx.fillStyle = "white";
        moveTo(ctx, -20 + xOff, -yOff * 10 * (this.outputsize / 2), xx, yy, this.direction);
        lineTo(ctx, -20 + xOff, 20 + yOff * 10 * (this.outputsize / 2 - 1), xx, yy, this.direction);
        lineTo(ctx, 20 - xOff, +yOff * 10 * (this.outputsize / 2 - 1) + xOff, xx, yy, this.direction);
        lineTo(ctx, 20 - xOff, -yOff * 10 * (this.outputsize / 2) - xOff + 20, xx, yy, this.direction);

        ctx.closePath();
        ctx.stroke();

        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this))
            ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
    }
}

function Flag(x, y, scope = globalScope, dir = "RIGHT",bitWidth=1,identifier) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.setDimensions(40, 10);
    this.rectangleObject=false;
    this.directionFixed = true;
    this.orientationFixed = false;
    this.identifier=identifier||("F"+this.scope.Flag.length);
    this.plotValues=[];
    this.inp1 = new Node(40, 0, 0, this);
    this.setPlotValue=function(){
        var time=plotArea.stopWatch.ElapsedMilliseconds;
        // console.log("DEB:",time);
        if(this.plotValues.length&&this.plotValues[this.plotValues.length-1][0]==time)
            this.plotValues.pop();

        if(this.plotValues.length==0){
            this.plotValues.push([time,this.inp1.value]);
            return;
        }

        if(this.plotValues[this.plotValues.length-1][1]==this.inp1.value)
           return;
        else
           this.plotValues.push([time,this.inp1.value]);
    }
    this.customSave = function() {
        var data = {
            constructorParamaters: [this.direction,this.bitWidth],
            nodes: {
                inp1: findNode(this.inp1),
            },
            values: {
                identifier: this.identifier
            }
        }
        return data;
    }
    this.setIdentifier=function(id=""){
        if(id.length==0)return;
        this.identifier=id;
    }
    this.mutableProperties = {
        "identifier": {
            name: "Debug Flag identifier",
            type: "text",
            maxlength: "5",
            func: "setIdentifier",
        },
    }

    this.customDraw = function() {
        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = "grey";
        ctx.fillStyle = "#fcfcfc";
        ctx.lineWidth = this.scope.scale*1;
        var xx = this.x;
        var yy = this.y;

        rect2(ctx, -80, -20, 120, 40, xx, yy, "RIGHT");
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();



        ctx.font= "14px Georgia";
        var xOff = ctx.measureText(this.identifier).width;
        ctx.beginPath();
        rect2(ctx, -65, -12, xOff+10, 25, xx, yy, "RIGHT");
        ctx.fillStyle="#eee"
        ctx.strokeStyle = "#ccc";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();

        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        fillText(ctx, this.identifier, xx-60+xOff/2, yy + 5,14);
        ctx.fill();

        ctx.beginPath();
        ctx.font= "30px Georgia";
        ctx.textAlign = "center";
        ctx.fillStyle = ["blue", "red"][+(this.inp1.value == undefined)];
        if(this.inp1.value!==undefined)
            fillText(ctx, this.inp1.value.toString(16), xx+17, yy + 8,25);
        else
            fillText(ctx, "x", xx+17, yy + 8,25);
        // fillText(ctx,":", xx-12+(xOff/4), yy+5 ,14);
        // ctx.stroke();
        ctx.fill();
    }

    this.newDirection = function(dir) {
        if (dir == this.direction) return;
        this.direction = dir;
        this.inp1.refresh();
        if (dir == "RIGHT") {
            this.inp1.leftx = 40;
            this.inp1.lefty = 0;
        }
        else if (dir == "LEFT") {
            this.inp1.leftx = 80;
            this.inp1.lefty = 0;
        }
        else if (dir == "UP") {
            this.inp1.leftx = 20;
            this.inp1.lefty = -20;
        }
        else {
            this.inp1.leftx = 20;
            this.inp1.lefty = -20;
        }
        this.inp1.refresh();
    }
}

function MSB(x, y, scope = globalScope, dir = "RIGHT", bitWidth = 1) {

    CircuitElement.call(this, x, y, scope, dir, bitWidth);
    this.setDimensions(20, 20);
    this.directionFixed=true;
    this.bitWidth = bitWidth || parseInt(prompt("Enter bitWidth"), 10);
    this.rectangleObject = false;
    this.inputSize = 1 << this.bitWidth;

    this.inp1 = new Node(-10, 0, 0, this, this.inputSize);
    this.output1 = new Node(20, 0, 1, this, this.bitWidth);
    console.log(this.output1)

    this.customSave = function() {
        var data = {

            nodes: {
                inp1: findNode(this.inp1),
                output1: findNode(this.output1)
            },
            constructorParamaters: [this.direction, this.bitWidth],
        }
        return data;
    }

    this.newBitWidth = function(bitWidth) {
        this.inputSize = 1 << bitWidth
        this.inp1.bitWidth = this.inputSize;
        this.bitWidth = bitWidth;
        this.output1.bitWidth=bitWidth;
    }

    this.resolve = function() {

        var inp=this.inp1.value;
        this.output1.value=(dec2bin(inp).length)-1
        this.scope.stack.push(this.output1);
    }

    this.customDraw = function() {

        ctx = simulationArea.context;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.lineWidth = this.scope.scale*  3;
        var xx = this.x;
        var yy = this.y;
        rect(ctx, xx - 10, yy - 30, 30, 60);
        if ((this.hover && !simulationArea.shiftDown) || simulationArea.lastSelected == this || simulationArea.multipleObjectSelections.contains(this)) ctx.fillStyle = "rgba(255, 255, 32,0.8)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.textAlign="center";
        fillText(ctx, "M", xx+5, yy-7, 15);
        fillText(ctx, "S", xx+5, yy+8, 15);
        fillText(ctx, "B", xx+5, yy+22, 15);
        ctx.stroke();
        ctx.fill();
    }

}

