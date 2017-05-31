function addAnd() {
    var a = new AndGate(200, 150, globalScope, 2, 'left');
}

function addPower() {
    var p = new Power(200, 150);
}

function addGround() {
    var g = new Ground(200, 150);
}

function addOr() {
    var or = new OrGate(200, 150);
}

function addNot() {
    var npt = new NotGate(200, 150, globalScope, 'left');
}

function addInput() {
    var a = new Input(200, 150, globalScope, 'left');
}

function addOutput() {
    var a = new Output(200, 150, globalScope, 'right');
}

function addFlipflop() {
    var a = new FlipFlop(200, 150, globalScope, 'left');
}
function addMultiplexer() {
    var a = new Multiplexer(200, 150, globalScope, 'left');
}

function addClock() {
    var a = new Clock(200, 150, 2, globalScope, 'left');
}

function addSevenSeg() {
    var a = new SevenSegDisplay(400, 150);
}
function addHexDis() {
    var a = new HexDisplay(400, 150);
}
function addAdder() {
    var a = new Adder(400, 150,globalScope,"left",);
}

function addSubCircuit() {
    var a = new SubCircuit(400, 150);
}
function addSplitter() {
    var a = new Splitter(400, 400, globalScope, "left",);
}


document.getElementById("powerButton").addEventListener("click", addPower);
document.getElementById("groundButton").addEventListener("click", addGround);
document.getElementById("andButton").addEventListener("click", addAnd);
document.getElementById("multiplexerButton").addEventListener("click", addMultiplexer);
document.getElementById("orButton").addEventListener("click", addOr);
document.getElementById("notButton").addEventListener("click", addNot);
document.getElementById("inputButton").addEventListener("click", addInput);
document.getElementById("outputButton").addEventListener("click", addOutput);
document.getElementById("adderButton").addEventListener("click", addAdder);
document.getElementById("clockButton").addEventListener("click", addClock);
document.getElementById("flipflopButton").addEventListener("click", addFlipflop);
document.getElementById("sevenSegButton").addEventListener("click", addSevenSeg);
document.getElementById("hexButton").addEventListener("click", addHexDis);
document.getElementById("subCircuitButton").addEventListener("click", addSubCircuit);
document.getElementById("saveButton").addEventListener("click", Save);
document.getElementById("splitterButton").addEventListener("click", addSplitter);
