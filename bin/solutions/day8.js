var fs = require("fs");

module.exports = {
  solve: function() {
    var image = initImage(25,6);
    var layer = findLeastZerosLayer(image);
    var ones = countLayer(layer, 1);
    var twos = countLayer(layer, 2);

    var finalImage = printImage(decodeImage(image));

    var solutionPartOne = "Number of 1s (" + ones + ") times number of 2s (" + twos + "): " + (ones*twos);
    var solutionPartTwo = finalImage;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function decodeImage(image) {
  var finalImage = [];
  image.forEach( (layer) => {
    layer.forEach( (row, x) => {
      if(!finalImage[x]) finalImage[x] = [];
      row.forEach( (pixel, y) => {
        if(!finalImage[x][y] || finalImage[x][y] == 2) {
          finalImage[x][y] = pixel;
        }
      });
    });
  });
  return finalImage;
}

function printImage(finalImage) {
  var imageString = "";
  finalImage.forEach( (row) => {
    row.forEach( (pixel) => {
      if(pixel == 1) {
        imageString += pixel;
      } else {
        imageString += " ";
      }
    });
    imageString += "\n"
  });
  return imageString;
}

function findLeastZerosLayer(image) {
  var minLayer = [];
  var minZeroCount = Number.MAX_SAFE_INTEGER;
  image.forEach( (layer) => {
    var zeroCount = countLayer(layer, 0);
    if(zeroCount < minZeroCount) {
      minZeroCount = zeroCount;
      minLayer = layer;
    }
  });
  return minLayer;
}

function countLayer(layer, digit) {
  var total = 0;
  layer.forEach( (row) => {
    row.forEach( (entry) => {
      if (entry == digit) { total++; }
    });
  });
  return total;
}

function initImage(width, height) {
  var rawImage = fs.readFileSync("./input/day8input.txt").toString().replace(/(\r\n|\n|\r)/gm,"").split("");
  var image = [];
  var layer = 0;
  while(rawImage.length > 0) {
    image[layer] = [];
    for(var i = 0; i < height; i++) {
      image[layer][i] = [];
      for(var j = 0; j < width; j++) {
        image[layer][i][j] = rawImage.shift();
      }
    }
    layer++;
  }

  return image;
}
