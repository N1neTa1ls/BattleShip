var view = {
  displayMessage: function(msg) {
    let messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  hidenInput: function() {
    let hiden = document.getElementById("input");
    hiden.setAttribute("class", "hiden"); 
  },

  displayHit: function(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

// view.displayMiss("00");
// view.displayHit("34");
// view.displayMessage("haha omgmegalul");

var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [
    {locations: ["06", "16", "26"], hits: ["","",""]},
    {locations: ["24", "34", "44"], hits: ["","",""]},
    {locations: ["10", "11", "12"], hits: ["","",""]}
  ],
  fire: function(guess) {
    for (var i = 0; i<this.numShips; i++) {
      var ship = this.ships[i];
      index = ship.locations.indexOf(guess);
        if(index>=0) {
          ship.hits[index] = "hit";
          view.displayHit(guess);
          view.displayMessage("Попал")
          if(this.isSunk(ship)) {
            view.displayMessage("Корабль потоплен");
            this.shipsSunk++;
          }
          return true;
        }
    }
    view.displayMiss(guess);
    view.displayMessage("Промах");
    controller.missFunc("Попавси");
    return false;
  },
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  }
};

// model.fire("53");
// model.fire("06");
// model.fire("16");
// model.fire("26");

var controller = {
  miss: 0,
  guesses: 0,
  missFunc: function(miss) {
    if(miss == "Попавси") {
      this.miss++
      }
  },
  processGuesses: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("Поздравляю вы потопили все коробли, количество попыток: " + this.guesses + " количество промахов:" + this.miss);
        view.hidenInput();
      }
    }
  },

}

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !==2 ) {
    alert("Введите существую на доске комбинацию, например:A0");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Введите существую на доске комбинацию, например:A0");
    } else if (row >= model.boardSize || column >= model.boardSize || row < 0 || column < 0) {
      alert("Такого поля нет на доске");
    } else {
      return row + column;
    }
  }
  return null;
}

controller.processGuesses("A0");
controller.processGuesses("A6");
controller.processGuesses("B6");
controller.processGuesses("C6");
controller.processGuesses("C4");
controller.processGuesses("D4");
controller.processGuesses("E4");
controller.processGuesses("B0");
controller.processGuesses("B1");
controller.processGuesses("B2");