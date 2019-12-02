var fs = require("fs");

var masses = fs.readFileSync("./input/day1input.txt").toString().split("\n");

module.exports = {
  solve: function() {
    var solutionPartOne = "Total Fuel Requirements for given input: " + findTotalFuel();
    var solutionPartTwo = "Total Fuel Requirements when fuel requires fuel: " + findRecursiveFuel();
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function findRecursiveFuel() {
  var totalFuel = 0;
  masses.forEach( (mass) => {
    mass = parseInt(mass, 10);
    if(!isNaN(mass)) {
      totalFuel += recursiveCalcFuel(mass);
    }
  });
  return totalFuel;
}

function findTotalFuel() {
  var totalFuel = 0;
  masses.forEach( (mass) => {
    mass = parseInt(mass, 10);
    if(!isNaN(mass)) {
      totalFuel += calcFuel(mass);
    }
  });
  return totalFuel;
}

function calcFuel(mass) {
  return Math.floor(mass/3) - 2;
}

function recursiveCalcFuel(mass) {
  var fuel = Math.floor(mass/3) - 2;
  if(fuel <= 0) {
    return 0;
  }
  else {
    fuel += recursiveCalcFuel(fuel);
    return fuel;
  }
}
