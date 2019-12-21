var fs = require("fs");

const IntcodeComp = require('../intcodeComp.js');

var ehpRobot = {
  start: { x: 0, y: 0 },
  x: 0,
  y: 0,
  direction: 'up'
}

module.exports = {
  solve: function() {
    var paintedPanels = paintPanels(0, new IntcodeComp(initProgram()));
    var paintedPanels2 = paintPanels(1, new IntcodeComp(initProgram()));

    var solutionPartOne = "Number of panels painted once: " + paintedPanels.length;
    var solutionPartTwo = printPanels(paintedPanels2);
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function paintPanels(startingColor, computer) {
  var paintedPanels = [];
  var input = startingColor;
  var panelIndex = 0;
  var panelUnpainted = true;
  while(!computer.codeComplete) {
    // Run the intcode program with the given input
    var output = computer.run([input]);

    // If the panel has not been visited, add it to the list of painted panels, otherwise, just edit its color
    if(panelUnpainted) {
      paintedPanels.push({
        x: ehpRobot.x,
        y: ehpRobot.y,
        color: output[0]
      });
    } else {
      paintedPanels[panelIndex].color = output[0]
    }
    // reset the check for unpainted panels
    panelUnpainted = true;

    // Use the second input to turn and move the robot to the next panel
    turnRobot(output[1]);

    //Determine the color of the new panel (Default: Black) and provide it as input
    var visitedColor = 0;
    paintedPanels.forEach( (panel, index) => {
      if(ehpRobot.x == panel.x && ehpRobot.y == panel.y) {
        visitedColor = panel.color;
        panelIndex = index;
        panelUnpainted = false;
      }
    });
    input = visitedColor;
    // console.log(panelUnpainted)
  }
  return paintedPanels;
}

function printPanels(paintedPanels) {
  var minX = Number.MAX_SAFE_INTEGER;
  var minY = Number.MAX_SAFE_INTEGER;
  var maxX = 0;
  var maxY = 0;
  paintedPanels.forEach( (panel) => {
    if(panel.x < minX) minX = panel.x;
    if(panel.y < minY) minY = panel.y;
    if(panel.x > maxX) maxX = panel.x;
    if(panel.y > maxY) maxY = panel.y;
  });

  var width = maxX - minX;
  var height = maxY - minY;

  var image = [];

  for(var i = 0; i <= height; i++) {
    image.push([]);
    for(var j = 0; j <= width; j++) {
      image[i].push(0);
    }
  }

  paintedPanels.forEach( (panel) => {
    image[panel.y - minY][panel.x - minX] = panel.color;
  });

  var outputString = ""
  image.forEach( (row) => {
    row.forEach( (panel) => {
      outputString += panel == 1 ? panel : " ";
    });
    outputString += "\n";
  });
  return outputString;
}

function turnRobot(turnValue) {
  var currentDirection = ehpRobot.direction;
  switch(currentDirection) {
    case 'up':
      if(turnValue == 0) {
        ehpRobot.direction = 'left';
        ehpRobot.x -= 1;
      } else if(turnValue == 1) {
        ehpRobot.direction = 'right';
        ehpRobot.x += 1;
      }
      break;
    case 'right':
      if(turnValue == 0) {
        ehpRobot.direction = 'up';
        ehpRobot.y += 1;
      } else if(turnValue == 1) {
        ehpRobot.direction = 'down';
        ehpRobot.y -= 1;
      }
      break;
    case 'down':
      if(turnValue == 0) {
        ehpRobot.direction = 'right';
        ehpRobot.x += 1;
      } else if(turnValue == 1) {
        ehpRobot.direction = 'left';
        ehpRobot.x -= 1;
      }
      break;
    case 'left':
      if(turnValue == 0) {
        ehpRobot.direction = 'down';
        ehpRobot.y -= 1;
      } else if(turnValue == 1) {
        ehpRobot.direction = 'up';
        ehpRobot.y += 1;
      }
      break;
    default:
      console.log("Direction " + currentDirection + " not recognized.");
  }
}

function initProgram() {
  var program = fs.readFileSync("./input/day11input.txt").toString().split(",").map( (i) => {
    return parseInt(i, 10);
  });
  return program;
}
