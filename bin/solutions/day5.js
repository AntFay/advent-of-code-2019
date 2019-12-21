var fs = require("fs");

var IntcodeComp = require('../intcodeComp.js');

module.exports = {
  solve: function() {
    var diagnosticCode = new IntcodeComp(initProgram()).run([1]).slice(-1)[0];
    var diagnosticCode2 = new IntcodeComp(initProgram()).run([5]).slice(-1)[0];

    var solutionPartOne = "Diagnostic Code for Input=1: " + diagnosticCode;
    var solutionPartTwo = "Diagnostic Code for Input=5: " + diagnosticCode2;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function initProgram() {
  var program = fs.readFileSync("./input/day5input.txt").toString().split(",").map( (i) => {
    return parseInt(i, 10);
  });
  return program;
}
