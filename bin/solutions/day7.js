var fs = require("fs");

var compute = require('.././intcodeComp.js');
var instructionParams = new Map([
  [ 1, 3 ],
  [ 2, 3 ],
  [ 3, 1 ],
  [ 4, 1 ],
  [ 5, 2 ],
  [ 6, 2 ],
  [ 7, 3 ],
  [ 8, 3 ],
  [ 99, 0 ]
]);

class FeedbackAmp {
  constructor(intcode, phaseSetting) {
    this.intcode = intcode;
    this.pointer = 0;
    this.codeComplete = false;
    this.phaseSetting = phaseSetting;

    this.getValue = function(parameter, mode) {
      var value;
      switch(mode) {
        case 0:
          value = intcode[parameter];
          break;
        case 1:
          value = parameter;
          break;
        default:
          console.log(mode + " is not a valid mode.");
      }
      return value;
    }

    this.interpretOpcode = function(value) {
      var value = value.toString();
      var opcode = parseInt(value.slice(value.length-2), 10);
      var modes = value.slice(0, value.length-2).split("").reverse().map( m => parseInt(m));
      while (modes.length < instructionParams.get(opcode)) {
        modes.push(0);
      }
      return {
        opcode: opcode,
        modes: modes
      }
    }
  }
  run(inputs) {
    var interpretOpcode = this.interpretOpcode;
    var getValue = this.getValue;
    var intcode = this.intcode;
    var pointer = this.pointer;
    var output;
    var waitingForInput = inputs.length < 1;

    while(!this.codeComplete && !waitingForInput) {
      var instructionStart = interpretOpcode(intcode[pointer]);
      var opcode = instructionStart.opcode;
      var modes = instructionStart.modes;
      var paramCount = instructionParams.get(opcode);
      var pointerAltered = false;

      switch(opcode) {
        case 1:
          var setPointer = intcode[pointer+3];
          var value1 = getValue(intcode[pointer+1], modes[0]);
          var value2 = getValue(intcode[pointer+2], modes[1]);
          intcode[setPointer] = value1 + value2;
          break;
        case 2:
          setPointer = intcode[pointer+3];
          value1 = getValue(intcode[pointer+1], modes[0]);
          value2 = getValue(intcode[pointer+2], modes[1]);
          intcode[setPointer] = value1 * value2;
          break;
        case 3:
          if (inputs.length < 1){
            waitingForInput = true;
            this.pointer = pointer;
          } else {
            if(this.phaseSetting){
              intcode[intcode[pointer+1]] = this.phaseSetting;
              this.phaseSetting = false;
            } else {
              intcode[intcode[pointer+1]] = inputs[0];
              inputs.shift();
            }
          }
          break;
        case 4:
          output = intcode[intcode[pointer+1]];
          break;
        case 5:
          if(getValue(intcode[pointer+1], modes[0]) !== 0) {
            pointer = getValue(intcode[pointer+2], modes[1]);
            pointerAltered = true;
          }
          break;
        case 6:
          if(getValue(intcode[pointer+1], modes[0]) === 0) {
            pointer = getValue(intcode[pointer+2], modes[1]);
            pointerAltered = true;
          }
          break;
        case 7:
          intcode[intcode[pointer+3]] = (getValue(intcode[pointer+1], modes[0]) < getValue(intcode[pointer+2], modes[1])) ? 1 : 0;
          break;
        case 8:
          intcode[intcode[pointer+3]] = (getValue(intcode[pointer+1], modes[0]) === getValue(intcode[pointer+2], modes[1])) ? 1 : 0;
          break;
        case 99:
          this.codeComplete = true;
          this.pointer = 0;
          break;
        default:
          console.log("Invalid opcode: " + opcode + " at pointer: " + pointer);
      }
      if(!pointerAltered) { pointer += (paramCount + 1); }
    }
    return output;
  };

}

module.exports = {
  solve: function() {

    var phaseSettingPermutations = recursivePermutations([0,1,2,3,4], [], []);
    var maximumSignal = findMaximumSignal(phaseSettingPermutations, initProgram());

    var phaseSettingPermutations2 = recursivePermutations([5,6,7,8,9], [], []);
    var maximumSignal2 = findMaxSignalFeedback(phaseSettingPermutations2, initProgram());

    var solutionPartOne = "Maximum thruster signal: " + maximumSignal;
    var solutionPartTwo = "Maximum thruster signal with feedback loop: " + maximumSignal2;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function findMaximumSignal(permutations, program) {
  var maximumSignal = 0;
  var input = 0;
  permutations.forEach((permutation) => {
    var outputA = compute(program.slice(), [permutation[0], input]);
    var outputB = compute(program.slice(), [permutation[1], outputA]);
    var outputC = compute(program.slice(), [permutation[2], outputB]);
    var outputD = compute(program.slice(), [permutation[3], outputC]);
    var outputE = compute(program.slice(), [permutation[4], outputD]);
    // console.log(permutation);
    // console.log(outputA + " " + outputB + " " + outputC + " " + outputD + " " + outputE)
    if ( outputE > maximumSignal ) maximumSignal = outputE;
  });
  return maximumSignal;
}

function findMaxSignalFeedback(permutations, program) {
  var maximumSignal = 0;
  permutations.forEach( (permutation) => {
    var ampA = new FeedbackAmp(program.slice(), permutation[0]);
    var ampB = new FeedbackAmp(program.slice(), permutation[1]);
    var ampC = new FeedbackAmp(program.slice(), permutation[2]);
    var ampD = new FeedbackAmp(program.slice(), permutation[3]);
    var ampE = new FeedbackAmp(program.slice(), permutation[4]);
    var inputA = 0;
    var fbLoopComplete = false;
    while(!fbLoopComplete) {
      var inputB = ampA.run([inputA]);
      var inputC = ampB.run([inputB]);
      var inputD = ampC.run([inputC]);
      var inputE = ampD.run([inputD]);
      inputA = ampE.run([inputE]);
      fbLoopComplete = ampE.codeComplete;
    }
    if ( inputA > maximumSignal ) maximumSignal = inputA;
  });
  return maximumSignal;
}

function recursivePermutations(source, destination, permutations) {
  if (source.length === 0) {
    permutations.push(destination);
    return permutations;
  }
  source.forEach( (element) => {
    // remove the element from source
    var newSource = source.slice();
    newSource.splice(source.indexOf(element), 1);
    // add the element to destination
    var newDestination = destination.slice();
    newDestination.push(element);

    recursivePermutations(newSource, newDestination, permutations);
  });
  return permutations;
}

function initProgram() {
  var program = fs.readFileSync("./input/day7input.txt").toString().split(",").map( (i) => {
    return parseInt(i, 10);
  });
  return program;
}
