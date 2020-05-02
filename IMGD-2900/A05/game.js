/*
game.js for Perlenspiel 3.3.x
Last revision: 2020-03-24 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-20 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

"use strict"

var FW = (function() {
	const GRID_ROWS = 24;
	const GRID_COLS = 32;
	const BG_COLOR = PS.COLOR_BLACK;
	const STAR_COLOR = PS.COLOR_WHITE;
	const SHADOW_COLOR = PS.COLOR_BLUE;
	const GRID_COLOR = PS.makeRGB(12, 12, 23);
	const FW_COLORS = [PS.COLOR_RED, PS.COLOR_ORANGE, PS.COLOR_YELLOW, PS.COLOR_GREEN, PS.COLOR_BLUE, PS.COLOR_VIOLET, PS.COLOR_INDIGO, PS.makeRGB(255, 44, 180)];

	var fireworks = [];
	var stars = [];
	var launchTimer = null;
	var launchDelay = 0;
	var glowTimer = null;
	var glowDelay = 0;
	var nextFWX;
	var nextFWY;
	var nextFWColor;
	var currRocketX;
	var currRocketY;

	var generateStars = function() {
		var numStars;
		var xPos;
		var yPos;
		var borderSize;
		numStars = Math.floor(Math.random() * 6) + 8;
		for (let i = 0; i < numStars; i++) {
			xPos = Math.floor(Math.random() * 28) + 2;
			yPos = Math.floor(Math.random() * 16);
			borderSize = Math.floor(Math.random() * 16);
			PS.color(xPos, yPos, STAR_COLOR);
			PS.border(xPos, yPos, borderSize);
			PS.borderColor(xPos, yPos, GRID_COLOR);
			stars.push({x: xPos, y: yPos, border: borderSize});
		}
	}
	
	var determineFireworkColor = function() {
		var rand = Math.floor(Math.random() * 8);
		return FW_COLORS[rand];
	}

	var determineFireworkSize = function() {
		return Math.floor(Math.random() * 4) + 4;
	}
	
	var playExplosionSound = function() {
		var rand = Math.floor(Math.random() * 5);
		switch (rand) {
			case 0: {
				PS.audioPlay("fx_bomb1");
			}
			break;
			case 1: {
				PS.audioPlay("fx_bomb2");
			}
			break;
			case 2: {
				PS.audioPlay("fx_bomb3");
			}
			break;
			case 3: {
				PS.audioPlay("fx_gun");
			}
			break;
			case 4: {
				PS.audioPlay("fx_shotgun");
			}
			break;
			case 5: {
				PS.audioPlay("fx_magnum");
			}
		}
	}

	var launch = function() {
		var x = nextFWX;
		var y = nextFWY;
		var fireworkColor = nextFWColor;
		var fireworkSize = determineFireworkSize();
		launchDelay--;
		currRocketY--;
		for (let i = 0; i < stars.length; i++) {
			if (stars[i].x === currRocketX && stars[i].y + 1 === currRocketY) {
				console.log("collision");
				PS.color(currRocketX, currRocketY + 1, STAR_COLOR);
				PS.border(currRocketX, currRocketY + 1, stars[i].border);
			} else {
				PS.color(currRocketX, currRocketY + 1, GRID_COLOR);
			}
		}
		if (launchDelay <= 0) {
			PS.timerStop(launchTimer);
			launchTimer = null;
			var particles = []
			for (let i = 0; i < 8; i++) {
				particles.push([x, y]);
			}
			PS.color(x, y, fireworkColor);
			PS.statusColor(fireworkColor);
			fireworks.push({initX: x, initY: y, distTravelled: 0, particles: particles, color: fireworkColor, maxSize: fireworkSize});
			PS.audioPlay("fx_bang");
			PS.gridShadow(true, fireworkColor);
			if (!glowTimer) {
				glowDelay = 2;
				glowTimer = PS.timerStart(48, glow);
			}
		} else {
			PS.color(currRocketX, currRocketY, fireworkColor);
		}
	}

	var glow = function() {
		glowDelay--;
		if (glowDelay <= 0) {
			PS.timerStop(glowTimer);
			glowTimer = null;
		}
		PS.gridShadow(false);
	}

	var tick = function() {
		var newX;
		var newY;
		var removeFirework = false;
		for (let i = 0; i < fireworks.length; i++) {
			for (let j = 0; j < fireworks[i].particles.length; j++) {
				switch (j) {
					case 0: {
						// N
						newX = fireworks[i].particles[j][0];
						newY = fireworks[i].particles[j][1] - 1;
					}
					break;
					case 1: {
						// E
						newX = fireworks[i].particles[j][0] + 1;
						newY = fireworks[i].particles[j][1];
					}
					break;
					case 2: {
						// S
						newX = fireworks[i].particles[j][0];
						newY = fireworks[i].particles[j][1] + 1;
					}
					break;
					case 3: {
						// W
						newX = fireworks[i].particles[j][0] - 1;
						newY = fireworks[i].particles[j][1];
					}
					break;
					case 4: {
						// NE
						newX = fireworks[i].particles[j][0] + 1;
						newY = fireworks[i].particles[j][1] - 1;
					}
					break;
					case 5: {
						// SE
						newX = fireworks[i].particles[j][0] + 1;
						newY = fireworks[i].particles[j][1] + 1;
					}
					break;
					case 6: {
						// SW
						newX = fireworks[i].particles[j][0] - 1;
						newY = fireworks[i].particles[j][1] + 1;
					}
					break;
					case 7: {
						// NW
						newX = fireworks[i].particles[j][0] - 1;
						newY = fireworks[i].particles[j][1] - 1;
					}
				}
				var isParticleAtStar = false;
				var starIndex;
				for (let k = 0; k < stars.length; k++) {
					if (stars[k].x === fireworks[i].particles[j][0] && stars[k].y === fireworks[i].particles[j][1]) {
						isParticleAtStar = true;
						starIndex = k;
					}
				}
				if (isParticleAtStar) {
					PS.color(fireworks[i].particles[j][0], fireworks[i].particles[j][1], STAR_COLOR);
					PS.border(fireworks[i].particles[j][0], fireworks[i].particles[j][1], stars[starIndex].border);
				} else {
					PS.color(fireworks[i].particles[j][0], fireworks[i].particles[j][1], GRID_COLOR);
					PS.border(fireworks[i].particles[j][0], fireworks[i].particles[j][1], 0);
				}
				if (!((newX >= 0 && newX < 31) && (newY >= 0 && newY < 23)) || fireworks[i].distTravelled > fireworks[i].maxSize || removeFirework) {
					removeFirework = true;
				} else {
					fireworks[i].particles[j][0] = newX;
					fireworks[i].particles[j][1] = newY;
					PS.border(fireworks[i].particles[j][0], fireworks[i].particles[j][1], 0);
					PS.color(fireworks[i].particles[j][0], fireworks[i].particles[j][1], fireworks[i].color);
					PS.glyph(fireworks[i].particles[j][0], fireworks[i].particles[j][1], "*");
					PS.glyphColor(fireworks[i].particles[j][0], fireworks[i].particles[j][1], fireworks[i].color);
				}
			}
			fireworks[i].distTravelled++;
			if (removeFirework) {
				for (let j = 0; j < fireworks[i].particles.length; j++) {
					PS.fade(fireworks[i].particles[j][0], fireworks[i].particles[j][1], 20, {rgb: PS.COLOR_WHITE});
					PS.color(fireworks[i].particles[j][0], fireworks[i].particles[j][1], GRID_COLOR);
					PS.glyph(PS.ALL, PS.ALL, "");
					for (let k = 0; k < stars.length; k++) {
						if (stars[k].x === fireworks[i].particles[j][0] && stars[k].y === fireworks[i].particles[j][1]) {
							PS.color(fireworks[i].particles[j][0], fireworks[i].particles[j][1], STAR_COLOR);
							PS.border(fireworks[i].particles[j][0], fireworks[i].particles[j][1], stars[k].border);
						}
					}
				}
				fireworks.splice(i, 1);
				playExplosionSound();
			}
		}
		
	}

	return {
		init : function() {
			PS.gridSize(32, 24);
			PS.gridColor(PS.COLOR_BLACK);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.color(PS.ALL, PS.ALL, GRID_COLOR);
			generateStars();
			PS.audioLoad("fx_bang", {lock: true});
			PS.audioLoad("fx_bomb1", {lock: true});
			PS.audioLoad("fx_bomb2", {lock: true});
			PS.audioLoad("fx_bomb3", {lock: true});
			PS.audioLoad("fx_gun", {lock: true});
			PS.audioLoad("fx_shotgun", {lock: true});
			PS.audioLoad("fx_magnum", {lock: true});
			PS.statusColor(STAR_COLOR);
			PS.statusText("Fireworks!");
			PS.timerStart(6, tick);
		},

		touch : function(x, y) {
			if (!launchTimer) {
				nextFWColor = determineFireworkColor();
				PS.color(x, 23, nextFWColor);
				PS.audioPlay("fx_swoosh");
				nextFWX = x;
				nextFWY = y;
				currRocketX = x;
				currRocketY = 23;
				launchDelay = 23 - y;
				launchTimer = PS.timerStart(2, launch);
			}
		}
	}
}());

PS.init = FW.init;
PS.touch = FW.touch;