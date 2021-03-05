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
    {locations: ["0", "0", "0"], hits: ["","",""]},
    {locations: ["0", "0", "0"], hits: ["","",""]},
    {locations: ["0", "0", "0"], hits: ["","",""]}
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
  },
  generateShipLocations: function() {
    var locations;
    for (var i=0; i<this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction===1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize-this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize-this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i<this.shipLength; i++) {
      if (direction===1) {
        newShipLocations.push(row+""+(col+i));
      }else {
        newShipLocations.push((row+i)+""+col);
      }
    }
    return newShipLocations;
  },
  collision: function(locations) {
    for (var i=0; i<this.numShips; i++) {
      var ship = model.ships[i];
      for (var j=0; j<this.shipLength; j++) {
        if (ship.locations.indexOf(locations[j])>=0) {
          return true;
        }
      }
    }
    return false;
  }
};

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

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode ==13) {
    fireButton.click();
    return false;
  }
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuesses (guess);
  guessInput.value = "";
}

window.onload = init;