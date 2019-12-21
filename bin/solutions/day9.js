var fs = require("fs");

var IntcodeComp = require('../intcodeComp.js');

module.exports = {
  solve: function() {
    var computer = new IntcodeComp(initProgram());
    var boostKey = computer.run([1]);
    var computer2 = new IntcodeComp(initProgram());
    var coordinates = computer2.run([2]);

    var solutionPartOne = "BOOST keycode for successful program: " + boostKey;
    var solutionPartTwo = "Distress Signal Coordinates: " + coordinates;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function initProgram() {
  var program = fs.readFileSync("./input/day9input.txt").toString().split(",").map( (i) => {
    return parseInt(i, 10);
  });
  return program;
}
