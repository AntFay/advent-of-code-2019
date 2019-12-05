var RANGE_MIN = 146810;
var RANGE_MAX = 612564;
var PASS_DIGITS = 6;

module.exports = {
  solve: function() {
    var validPasswords = findValidPasswords(RANGE_MIN, RANGE_MAX);
    var validPasswordsTwo = findValidPasswordsPartTwo(RANGE_MIN, RANGE_MAX);
    var solutionPartOne = "Total number of valid passwords in range: " + validPasswords.length;
    var solutionPartTwo = "Total number of valid passwords in range with new rule: " + validPasswordsTwo.length;
    return solutionPartOne + "\n" + solutionPartTwo;
  }
}

function findValidPasswordsPartTwo(min, max) {
  var validPasswords = [];
  for(i = min; i <= max; i++) {
    var pass = i.toString();
    if(pass.length == PASS_DIGITS) {
      var hasDouble = false;
      var isIncreasing = true;
      for(j = 0; j < pass.length - 1; j++) {
        var previous = "";
        var current = pass[j];
        var next = pass[j+1];
        var third = "";
        if ( j - 1 >= 0 ) previous = pass[j-1];
        if ( j + 2 < pass.length ) third = pass[j+2];
        if (current > next) {
          isIncreasing = false;
          break;
        }
        if (current == next && current != third && current != previous) {
          hasDouble = true;
        }
      }
      if (hasDouble && isIncreasing) validPasswords.push(pass);
    }
  }
  return validPasswords;
}

function findValidPasswords(min, max) {
  var validPasswords = [];
  for(i = min; i <= max; i++) {
    var pass = i.toString();
    if(pass.length == PASS_DIGITS) {
      var hasDouble = false;
      var isIncreasing = true;
      for(j = 0; j < pass.length - 1; j++) {
        if (pass[j] > pass[j+1]) isIncreasing = false;
        if (pass[j] == pass[j+1]) hasDouble = true;
      }
      if (hasDouble && isIncreasing) validPasswords.push(pass);
    }
  }
  return validPasswords;
}
