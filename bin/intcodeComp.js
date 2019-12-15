// const POSITION_MODE = 0;
// const IMMEDIATE_MODE = 1;

var intcode;

var instructionParams = new Map([
  [ 1, 3 ],
  [ 2, 3 ],
  [ 3, 1 ],
  [ 4, 1 ],
  [ 5, 2 ],
  [ 6, 2 ],
  [ 7, 3 ],
  [ 8, 3 ],
  [ 99, 0 ]
]);

module.exports = function (icode, input) {
  var pointer = 0;
  var output;
  var codeComplete = false;

  intcode = icode;

  while(!codeComplete) {
    var instructionStart = interpretOpcode(intcode[pointer]);
    var opcode = instructionStart.opcode;
    var modes = instructionStart.modes;
    var paramCount = instructionParams.get(opcode);
    var pointerAltered = false;

    switch(opcode) {
      case 1:
        var setPointer = intcode[pointer+3];
        var value1 = getValue(intcode[pointer+1], modes[0]);
        var value2 = getValue(intcode[pointer+2], modes[1]);
        intcode[setPointer] = value1 + value2;
        break;
      case 2:
        setPointer = intcode[pointer+3];
        value1 = getValue(intcode[pointer+1], modes[0]);
        value2 = getValue(intcode[pointer+2], modes[1]);
        intcode[setPointer] = value1 * value2;
        break;
      case 3:
        if (input) {
          intcode[intcode[pointer+1]] = input;
        }
        else {
          console.log("No input provided.");
        }
        break;
      case 4:
        output = intcode[intcode[pointer+1]];
        break;
      case 5:
        if(getValue(intcode[pointer+1], modes[0]) !== 0) {
          pointer = getValue(intcode[pointer+2], modes[1]);
          pointerAltered = true;
        }
        break;
      case 6:
        if(getValue(intcode[pointer+1], modes[0]) === 0) {
          pointer = getValue(intcode[pointer+2], modes[1]);
          pointerAltered = true;
        }
        break;
      case 7:
        intcode[intcode[pointer+3]] = (getValue(intcode[pointer+1], modes[0]) < getValue(intcode[pointer+2], modes[1])) ? 1 : 0;
        break;
      case 8:
        intcode[intcode[pointer+3]] = (getValue(intcode[pointer+1], modes[0]) === getValue(intcode[pointer+2], modes[1])) ? 1 : 0;
        break;
      case 99:
        codeComplete = true;
        break;
      default:
        console.log("Invalid opcode: " + opcode + " at pointer: " + pointer);
    }
    if(!pointerAltered) { pointer += (paramCount + 1); }
  }
  return output;
};

function getValue(parameter, mode) {
  var value;
  switch(mode) {
    case 0:
      value = intcode[parameter];
      break;
    case 1:
      value = parameter;
      break;
    default:
      console.log(mode + " is not a valid mode.");
  }
  return value;
}

function interpretOpcode(value) {
  var value = value.toString();
  var opcode = parseInt(value.slice(value.length-2), 10);
  var modes = value.slice(0, value.length-2).split("").reverse().map( m => parseInt(m));
  while (modes.length < instructionParams.get(opcode)) {
    modes.push(0);
  }
  return {
    opcode: opcode,
    modes: modes
  }
}
