var fs = require("fs");

var compute = require('.././intcodeComp.js');

module.exports = {
  solve: function() {
    var boostKey = compute(initProgram(), [1]);
    var coordinates = compute(initProgram(), [2]);

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
