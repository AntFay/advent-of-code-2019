var fs = require("fs");

var totalOrbits = 0;
var orbits = [];
var depthMap = [];

module.exports = {
  solve: function() {
    orbits = initOrbits();
    rAddOrbits("COM", 0);
    var transfers = findSantaFrom("YOU", initOrbits());

    var solutionPartOne = "Total direct and indirect orbits: " + totalOrbits;
    var solutionPartTwo = "Minimum orbital transfers between you and Santa: " + transfers;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function findSantaFrom(start, orbits) {
  var currentBodies = [start];
  var orbits = orbits;
  var currentDistance = -1;
  var foundSanta = false;
  while(!foundSanta) {
    var nextBodies = [];
    currentBodies.forEach( (body) => { //loop through all bodies x distance from the start
      var matches = orbits.filter( (orbit) => { return orbit.includes(body) }); //find all matches to that body
      matches.forEach( (orbit) => {
        orbits.splice(orbits.indexOf(orbit), 1);
      });
      matches = matches.map( (orbit) => {
        var bodies = orbit.split(")");
        return bodies[0] === body ? bodies[1] : bodies[0];
      });
      nextBodies = nextBodies.concat(matches);
    });
    currentBodies = nextBodies.slice();
    foundSanta = currentBodies.includes("SAN");
    if (!foundSanta) currentDistance++;
  }
  return currentDistance;
}

function rAddOrbits(body, depth) {
  var matches = orbits.filter( (orbit) => { return orbit.startsWith(body) });
  matches.forEach( (orbit) => {
    orbits.splice(orbits.indexOf(orbit), 1);
  });
  if(matches.length === 0) {
    return
  }
  matches = matches.map( (orbit) => {
    var bodies = orbit.split(")");
    return bodies[1];
  });
  depth++;
  matches.forEach( (orbit) => {
    depthMap.push({
      name: orbit,
      depth: depth
    })
    totalOrbits += depth;
    rAddOrbits(orbit, depth);
  });
}

function initOrbits() {
  return fs.readFileSync("./input/day6input.txt").toString().split("\n");
}
