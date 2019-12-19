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
  [ 9, 1 ],
  [ 99, 0 ]
]);

var relativeBase = 0;

module.exports = function (icode, inputs) {
  var pointer = 0;
  var outputs = [];
  var codeComplete = false;

  relativeBase = 0;
  intcode = icode;

  while(!codeComplete) {
    var instructionStart = interpretOpcode(intcode[pointer]);
    var opcode = instructionStart.opcode;
    var modes = instructionStart.modes;
    var paramCount = instructionParams.get(opcode);
    var pointerAltered = false;
    // console.log("OPCODE: " + opcode + " at POINTER: " + pointer + " with MODES: " + modes);
    switch(opcode) {
      case 1:
        var writeAddress = getWriteAddress(intcode[pointer+3], modes[2]);
        var value1 = getValue(intcode[pointer+1], modes[0]);
        var value2 = getValue(intcode[pointer+2], modes[1]);
        intcode[writeAddress] = value1 + value2;
        break;
      case 2:
        writeAddress = getWriteAddress(intcode[pointer+3], modes[2]);
        value1 = getValue(intcode[pointer+1], modes[0]);
        value2 = getValue(intcode[pointer+2], modes[1]);
        intcode[writeAddress] = value1 * value2;
        break;
      case 3:
        if (inputs) {
          intcode[getWriteAddress(intcode[pointer+1], modes[0])] = inputs[0];
          inputs.shift();
        }
        else {
          console.log("No inputs available.");
        }
        break;
      case 4:
        outputs.push(getValue(intcode[pointer+1], modes[0]));
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
        intcode[getWriteAddress(intcode[pointer+3], modes[2])] = (getValue(intcode[pointer+1], modes[0]) < getValue(intcode[pointer+2], modes[1])) ? 1 : 0;
        break;
      case 8:
        intcode[getWriteAddress(intcode[pointer+3], modes[2])] = (getValue(intcode[pointer+1], modes[0]) == getValue(intcode[pointer+2], modes[1])) ? 1 : 0;
        break;
      case 9:
        relativeBase += getValue(intcode[pointer+1], modes[0]);
        break;
      case 99:
        codeComplete = true;
        break;
      default:
        console.log("Invalid opcode: " + opcode + " at pointer: " + pointer);
    }
    if(!pointerAltered) { pointer += (paramCount + 1); }
  }
  return outputs;
};

function getValue(parameter, mode) {
  var value;
  switch(mode) {
    case 0:
      var address = parameter;
      while(address > intcode.length-1) {
        intcode.push(0);
      }
      value = intcode[address];
      break;
    case 1:
      value = parameter;
      break;
    case 2:
      var address = parameter + relativeBase;
      while(address > intcode.length-1) {
        intcode.push(0);
      }
      value = intcode[address];
      break;
    default:
      console.log(mode + " is not a valid mode.");
  }
  return value;
}

function getWriteAddress(address, mode) {
  var writeAddress;
  switch(mode) {
    case 0:
      while(address > intcode.length-1) {
        intcode.push(0);
      }
      writeAddress = address;
      break;
    case 1:
      console.log("Write Address cannot be found in Immediate Mode");
      break;
    case 2:
      address += relativeBase;
      while(address > intcode.length-1) {
        intcode.push(0);
      }
      writeAddress = address;
      break;
    default:
      console.log(mode + " is not a valid mode.");
  }
  return writeAddress;
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
