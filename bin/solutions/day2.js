var fs = require("fs");

module.exports = {
  solve: function() {
    var memory = initMemory();
    var partOneMemory = memory.slice();
    var partTwoMemory = memory.slice();

    partOneMemory[1] = 12;
    partOneMemory[2] = 2;
    var solutionPartOne = "Final value at pointer 0: " + interpret(partOneMemory)[0];

    var solutionPartTwo = "Program code: " + quadraticSearch(partTwoMemory, 19690720);
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

//Quick and dirty brutforce solution
function quadraticSearch(intcode, expectedOutput) {
  var noun = 0;
  var verb = 0;
  var intcodePrime = intcode.slice();
  var output = intcode[0];
  for(noun = 0; output != expectedOutput && noun <= 99; noun++) {
    for(verb = 0; output != expectedOutput && verb <= 99; verb++) {
      intcode = intcodePrime.slice();
      intcode[1] = noun;
      intcode[2] = verb;
      output = interpret(intcode)[0];
    }
  }
  return 100*(noun-1)+(verb-1);
}

function interpret(intcode) {
  var pointer;
  for(pointer = 0; pointer < intcode.length; pointer += 4) {
    var opcode = intcode[pointer];
    if(opcode == 1){
      intcode[intcode[pointer+3]] = intcode[intcode[pointer+1]] + intcode[intcode[pointer+2]];
    } else if(opcode == 2) {
      intcode[intcode[pointer+3]] = intcode[intcode[pointer+1]] * intcode[intcode[pointer+2]];
    } else if(opcode == 99) {
      pointer = intcode.length;
    } else {
      console.log("Invalid opcode: " + opcode + " at pointer: " + pointer);
    }
  };
  return intcode;
}

function initMemory() {
  var memory = fs.readFileSync("./input/day2input.txt").toString().split(",");
  memory.forEach( (integer, pointer) => {
    memory[pointer] = parseInt(integer, 10);
  });
  return memory;
}
