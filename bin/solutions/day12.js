var fs = require("fs");

module.exports = {
  solve: function() {
    var moons = initMoons();
    simulateSteps(moons, 1000);
    var systemEnergy = calcSystemEnergy(moons);

    var stepsToRepeat = findFirstRepeat();

    var solutionPartOne = "Total system energy after 1000 steps: " + systemEnergy;
    var solutionPartTwo = "Number of steps to system repeat: " + stepsToRepeat;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function findFirstRepeat() {
  var periods = [];
  ['X', 'Y', 'Z'].forEach( (axis) => {
    var moons = initMoons();
    periods.push(findPeriod(moons, axis));
  });
  return lcm3(periods[0], periods[1], periods[2]);
}

function findPeriod(moons, axis){
  var steps = 0;
  var periodFound = false;
  var initialStates = [];
  moons.forEach( (moon) => {
    initialStates.push(Object.assign({}, moon));
  });
  while(!periodFound) {
    moons.forEach( (moon, i1) => {
      moons.forEach( (moon2, i2) => {
        if(i2 > i1) {
          applyGravity(moon, moon2);
        }
      });
      moveBody(moon);
    });
    var matches = [];
    moons.forEach( (moon, i) => {
      switch(axis) {
        case 'X':
          matches.push(moon.x == initialStates[i].x && moon.vx == initialStates[i].vx);
          break;
        case 'Y':
          matches.push(moon.y == initialStates[i].y && moon.vy == initialStates[i].vy);
          break;
        case 'Z':
          matches.push(moon.z == initialStates[i].z && moon.vz == initialStates[i].vz);
          break;
        default:
          console.log("Invalid axis: " + axis);
      }
    });
    periodFound = true;
    matches.forEach( (m) => {
      periodFound = periodFound && m;
    });
    steps++;
  }
  return steps;
}

function simulateSteps(moons, steps) {
  for(var i = 0; i < steps; i++) {
    moons.forEach( (moon, i1) => {
      moons.forEach( (moon2, i2) => {
        if(i2 > i1) {
          applyGravity(moon, moon2);
        }
      });
      moveBody(moon);
    });
  }
}

function moveBody(body) {
  body.x += body.vx;
  body.y += body.vy;
  body.z += body.vz;
}

function applyGravity(body1, body2) {
  if(body1.x > body2.x) {
    body1.vx -= 1;
    body2.vx += 1;
  } else if(body1.x < body2.x) {
    body1.vx += 1;
    body2.vx -= 1;
  }
  if(body1.y > body2.y) {
    body1.vy -= 1;
    body2.vy += 1;
  } else if(body1.y < body2.y) {
    body1.vy += 1;
    body2.vy -= 1;
  }
  if(body1.z > body2.z) {
    body1.vz -= 1;
    body2.vz += 1;
  } else if(body1.z < body2.z) {
    body1.vz += 1;
    body2.vz -= 1;
  }
}

function calcSystemEnergy(system) {
  var totalEnergy = 0;
  system.forEach((moon) => {
    totalEnergy += calcEnergy(moon);
  });
  return totalEnergy;
}

function calcEnergy(body) {
  var potentialEnergy = Math.abs(body.x) + Math.abs(body.y) + Math.abs(body.z);
  var kineticEnergy = Math.abs(body.vx) + Math.abs(body.vy) + Math.abs(body.vz);
  return potentialEnergy * kineticEnergy;
}

function lcm3(a, b, c) {
  return lcm(lcm(a, b), c);
}

function lcm(a, b) {
  return Math.abs(a*b)/gcd(a, b);
}
//
// function gcd3(a, b, c) {
//   return gcd(gcd(a,b), c);
// }

function gcd(a, b) {
  if(a == 0) {
    return b;
  } else if(b == 0) {
    return a;
  } else {
    return gcd(b, a%b);
  }

}

function initMoons() {
  var positions = fs.readFileSync("./input/day12input2.txt").toString().replace(/[<>xyz= ]/g, "").split("\n");
  var moons = [];
  positions.forEach( (position) => {
    if(position.length > 0) {
      position = position.split(",").map((coordinate) => { return parseInt(coordinate, 10) });
      moons.push({
        x: position[0],
        y: position[1],
        z: position[2],
        vx: 0,
        vy: 0,
        vz: 0
      });
    }
  });
  return moons;
}
