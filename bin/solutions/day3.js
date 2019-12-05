var fs = require("fs");

module.exports = {
  solve: function() {
    var wires = initWires();
    var intersections = findIntersections(wires[0], wires[1]);
    var shortestDist = closestIntersection(intersections);
    var fwstSteps = fewestSteps(intersections);
    var solutionPartOne = "Manhattan Distance between central port and closest intersection: " + shortestDist;
    var solutionPartTwo = "The intersection with the fewest combined steps is " + fwstSteps + " total steps from the central port.";
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function fewestSteps(intersections) {
  var fewestSteps = Number.MAX_VALUE;
  intersections.forEach( (point) => {
    if(point.steps < fewestSteps) {
      fewestSteps = point.steps;
    }
  });
  return fewestSteps;
}

function closestIntersection(intersections) {
  var shortestDist = Number.MAX_VALUE;
  intersections.forEach( (point) => {
    var manDist = manhattanDist(point);
    if(manDist < shortestDist) {
      shortestDist = manDist;
    }
  });
  return shortestDist;
}

function findIntersections(wire1, wire2) {
  var intersections = [];
  var totalDist1 = 0;
  wire1.forEach( (line1) => {
    var totalDist2 = 0;
    wire2.forEach( (line2) => {
      if(isHorizontal(line1) && !isHorizontal(line2)) {
        var maxY = Math.max.apply(Math, [line2.start.y, line2.end.y]);
        var minY = Math.min.apply(Math, [line2.start.y, line2.end.y]);
        var maxX = Math.max.apply(Math, [line1.start.x, line1.end.x]);
        var minX = Math.min.apply(Math, [line1.start.x, line1.end.x]);
        var xConst = line2.start.x;
        var yConst = line1.start.y;
        if(yConst > minY && yConst < maxY && xConst > minX && xConst < maxX) {
          var wireOneSteps = totalDist1 + Math.abs(xConst - line1.start.x);
          var wireTwoSteps = totalDist2 + Math.abs(yConst - line2.start.y);
          intersections.push({ x: xConst, y: yConst, steps: wireOneSteps + wireTwoSteps });
        }
      } else if(!isHorizontal(line1) && isHorizontal(line2)) {
        var maxY = Math.max.apply(Math, [line1.start.y, line1.end.y]);
        var minY = Math.min.apply(Math, [line1.start.y, line1.end.y]);
        var maxX = Math.max.apply(Math, [line2.start.x, line2.end.x]);
        var minX = Math.min.apply(Math, [line2.start.x, line2.end.x]);
        var xConst = line1.start.x;
        var yConst = line2.start.y;
        if(yConst > minY && yConst < maxY && xConst > minX && xConst < maxX) {
          var wireOneSteps = totalDist1 + Math.abs(yConst - line1.start.y);
          var wireTwoSteps = totalDist2 + Math.abs(xConst - line2.start.x);
          intersections.push({ x: xConst, y: yConst, steps: wireOneSteps + wireTwoSteps });
        }
      }
      totalDist2 += Math.abs(line2.distance);
    });
    totalDist1 += Math.abs(line1.distance);
  });
  return intersections;
}

function manhattanDist(point) {
  return Math.abs(point.x) + Math.abs(point.y);
}

function isHorizontal(line) {
  return (line.direction == 'L' || line.direction == 'R');
}

function initWires() {
  var wires = fs.readFileSync("./input/day3input.txt").toString().split("\n");
  return [ convertWire(wires[0].split(",")), convertWire(wires[1].split(",")) ];
}

function convertWire(wire) {
  var convertedWire = [];
  var lastPoint = { x: 0, y: 0 };
  wire.forEach( (line, index) => {
    var direction = line.slice(0,1);
    var distance = parseInt(line.slice(1), 10);
    var startPoint = lastPoint;
    var endPoint;

    switch(direction) {
      case 'U':
        endPoint = { x: lastPoint.x, y: lastPoint.y + distance };
        break;
      case 'D':
        endPoint = { x: lastPoint.x, y: lastPoint.y - distance };
        break;
      case 'R':
        endPoint = { x: lastPoint.x + distance, y: lastPoint.y };
        break;
      case 'L':
        endPoint = { x: lastPoint.x - distance, y: lastPoint.y };
        break;
      default:
        console.log("Invalid direction: " + direction);
    }

    convertedWire.push({
      start: startPoint,
      end: endPoint,
      direction: direction,
      distance: distance
    });

    lastPoint = endPoint;
  });
  return convertedWire;
}
