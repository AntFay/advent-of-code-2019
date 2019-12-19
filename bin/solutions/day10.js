var fs = require("fs");

module.exports = {
  solve: function() {
    asteroids = initAsteroids();
    var bestLocation = findBestLocation(asteroids);

    var nthDestruction = findNthDestruction(bestLocation, asteroids, 200);

    var solutionPartOne = "Number of other asteroids visible from best location: " + bestLocation.visible.length;
    var solutionPartTwo = "Coordinates of the 200th asteroid destroyed: (" + nthDestruction.x + ", " + nthDestruction.y + ")";
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function findNthDestruction(station, asteroids, N) {
  var asteroidsDestroyed = 0;
  var nthAsteroid;
  if(asteroidsDestroyed + station.visible.length < N) {
    asteroidsDestroyed += station.visible.length;
    destroyVisibleAsteroids(station, asteroids);
    station = findVisibleAsteroids(station.location, asteroids);
  } else {
    station.visible.forEach((asteroid) => {
      var verticalVector = { x: 0, y: -1 };
      var asteroidVector = { x: (asteroid.x - station.location.x), y: (asteroid.y - station.location.y) };
      asteroid.angle = findAngle(verticalVector, asteroidVector);
      if(asteroidVector.x < 0) asteroid.angle = (2*Math.PI) - asteroid.angle;
    });
    var asteroidsClockwise = station.visible.sort( (a1, a2) => {
      return a1.angle - a2.angle;
    });
    nthAsteroid = station.visible[N-asteroidsDestroyed-1];
  }
  return nthAsteroid;
}

function destroyVisibleAsteroids(station, asteroids) {
  station.visible.forEach((asteroid) => {
    asteroids.splice(asteroids.indexOf(asteroid), 1);
  });
}

function findBestLocation(asteroids) {
  var maxVisible = 0;
  var bestAsteroid;
  asteroids.forEach( (asteroid) => {
    var visibleAsteroids = findVisibleAsteroids(asteroid, asteroids);
    if(visibleAsteroids.length > maxVisible) {
      maxVisible = visibleAsteroids.length;
      bestAsteroid = {
        location: asteroid,
        visible: visibleAsteroids
      };
    }
  });
  return bestAsteroid;
}

function findVisibleAsteroids(primeAsteroid, asteroids) {
  var startingIndex = asteroids.indexOf(primeAsteroid);
  var visibleAsteroidsAfter = [];
  var visibleAsteroidsBefore = [];
  if(startingIndex < asteroids.length-1) {
    visibleAsteroidsAfter.push(asteroids[startingIndex+1]);
    for(var i = startingIndex+2; i < asteroids.length; i++) {
      var secondAsteroid = asteroids[i];
      var slope = calcSlope(primeAsteroid, secondAsteroid);

      var isVisible = true;
      var j = 0;
      while(isVisible && j < visibleAsteroidsAfter.length) {
        if(slope == calcSlope(primeAsteroid, visibleAsteroidsAfter[j])) {
          isVisible = false;
        }
        j++;
      }
      if(isVisible) {
        visibleAsteroidsAfter.push(secondAsteroid);
      }
    }
  }
  if(startingIndex > 0) {
    visibleAsteroidsBefore.push(asteroids[startingIndex-1]);
    for(var i = startingIndex-2; i >= 0; i--) {
      var secondAsteroid = asteroids[i];
      var slope = calcSlope(primeAsteroid, secondAsteroid);

      var isVisible = true;
      var j = 0;
      while(isVisible && j < visibleAsteroidsBefore.length) {
        if(slope == calcSlope(primeAsteroid, visibleAsteroidsBefore[j])) {
          isVisible = false;
        }
        j++;
      }
      if(isVisible) {
        visibleAsteroidsBefore.push(secondAsteroid);
      }
    }
  }
  return visibleAsteroidsAfter.concat(visibleAsteroidsBefore);
}

function calcSlope(pointA, pointB) {
  return (pointB.y - pointA.y)/(pointB.x - pointA.x);
}

function findAngle(vector1, vector2) {
  var dotProduct = (vector1.x * vector2.x) + (vector1.y * vector2.y);
  var magnitudeProduct = Math.sqrt((vector1.x*vector1.x) + (vector1.y*vector1.y))
    * Math.sqrt((vector2.x*vector2.x) + (vector2.y*vector2.y));
  return Math.acos(dotProduct/magnitudeProduct);
}

function initAsteroids() {
  var asteroids = [];
  fs.readFileSync("./input/day10input.txt").toString().split("\n").map( (line, Y) => {
    var newLine = [];
    line = line.split("");
    line.forEach( (character, X) => {
      if(character == "#") {
        asteroids.push({
          x: X,
          y: Y
        });
      }
      newLine.push(character);
    });
    return newLine;
  });
  return asteroids;
}
