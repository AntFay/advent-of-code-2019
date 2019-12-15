var fs = require("fs");

var compute = require('.././intcodeComp.js');

module.exports = {
  solve: function() {
    var program = initProgram();
    var program2 = initProgram();
    var input = 1;
    var input2 = 5;

    var diagnosticCode = compute(program, input);
    var diagnosticCode2 = compute(program2, input2);

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
