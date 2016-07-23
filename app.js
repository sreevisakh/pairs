/**
 * Pairs Module
 *
 * Description
 */
angular.module('Pairs', []).controller('GameController', function($timeout) {
  var self = this;
  this.color = ["#1abc9c", "#3498db", "#8e44ad"];
  this.colors = [];
  this.rows = 10;
  this.columns = 10;
  this.entries = this.rows * this.columns;
  this.first = null;
  var score;
  var unfinished = this.entries;

  self.table = [];
  self.freezeStatus = false;

  this.init = function() {

    score = 0;
    self.table = fillCells();
    self.boxes = true;
    self.status = false;

  }
  this.init();
  this.getNumber = function(number) {
    return _.range(number);
  };

  this.getColor = function(x, y) {
    return self.table[x][y];
  };

  this.select = function(x, y) {
    //if game is in freeze state do not allow click
    if (self.freezeStatus) {
      return false;
    }
    if (self.table[x][y] === 0) {
      return false;
    }
    //if nothing selected previously make the current selection first
    if (!self.first) {
      self.first = new Cell(x, y);
    } else {
      //if there is already one selected check the match
      self.second = new Cell(x, y);

      if (self.first.value === self.second.value) {
        score++;
        $timeout(function() {
          clearTableCell(self.first, self.second);
          clearSelection();
          unfreeze();
        }, 500);
        unfinished -= 2;
        if (!unfinished) {
          this.gameOver();
        }
      } else {
        freeze();
        $timeout(function() {
          clearSelection();
          unfreeze();
        }, 500);
      }
    }
  };
  this.selected = function(x, y) {
    if ((self.first && self.first.x == x && self.first.y == y) ||
      (self.second && self.second.x === x && self.second.y === y)) {
      return true;
    } else {
      return false;
    }
  };
  this.gameOver = function() {
    self.boxes = false;
    self.status = true;
  }
  this.isActive = function(x, y) {
    if (self.table[x][y] !== 0) {
      return '1px solid #cecece';
    }
  };
  this.getScore = function() {
    return score;
  };

  function clearSelection() {
    self.first = null;
    self.second = null;
  }

  function freeze() {
    self.freezeStatus = true;
  }

  function unfreeze() {
    self.freezeStatus = false;
  }

  function Cell(x, y) {
    return {
      x: x,
      y: y,
      value: self.table[x][y]
    };
  }

  function clearTableCell(first, second) {
    self.table[first.x][first.y] = 0;
    self.table[second.x][second.y] = 0;
  }

  this.getWidth = function() {
    return (100 / this.columns) - 1 + '%';
  };



  function fillCells() {
    var colors = [];
    var color = self.color;
    while (self.entries > colors.length) {
      var times = parseInt((self.entries - colors.length) / (color.length * 2), 10);
      _.times(times * 2, function() { colors = colors.concat(color).concat(color); });
      color = color.slice(0, color.length - 1);
    }
    return _.chunk(_.shuffle(_.shuffle(colors)), self.columns);
  }

});
