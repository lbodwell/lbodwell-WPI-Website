/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)
*/

"use strict";

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

let G = (function() {
	const GRID_X = 32;
	const GRID_Y = 32;

	const PLAYER_COLOR = 0x69b6fe;
	const ENEMY_COLOR = 0xb60f0f;
	const VACCINE_COLOR = 0x6afa78;
	const HEALTH_COLOR = 0xe393fd;
	const TOTAL_VACCINE_PIECES = 6;
	const MAX_PLAYER_HEALTH = 100;

	let isGameOver = false;
	let isWinner = false;
	let canMakeCure = false;
	let playerX = 25;
	let playerY = 30;
	let playerHealth = 100;
	let numVaccinePieces = 0;
	let level = 1;

	let enemies = [
		[[2, 30, null, -1], [15, 11, null, -1], [27, 15, null, -1]],
		[[2, 25, null, -1], [27, 26, null, -1]],
		[[2, 8, null, -1], [28, 16, null, -1]]
	];
	let vaccinePieces = [
		[[19, 11], [30, 15]],
		[[28, 4], [29, 27]],
		[[29, 4], [28, 22]]
	];
	let healthPickups = [
		[],
		[],
		[[19, 2], [28, 29]]
	];

	let bitmap = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
	];

	let map = {
		width : GRID_X,
		height : GRID_Y,
		pixelSize : 1,
		data : [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		]
	};

	function isWall(x, y) {
		return map.data[32 * y + x] === 0;
	}

	function isGoal(x, y) {
		return (level === 1 && (x >= 9 && x <= 14) && (y >= 1 && y <= 3));
	}

	function isEnemy(x, y) {
		for (let i = 0; i < enemies[level - 1].length; i++) {
			let currentEnemy = enemies[level - 1][i];
			if (x === currentEnemy[0] && y === currentEnemy[1] && !isWinner) {
				return true;
			}
		}
		return false;
	}

	function isVaccinePiece(x, y) {
		for (let i = 0; i < vaccinePieces[level - 1].length; i++) {
			let currentVaccine = vaccinePieces[level - 1][i];
			if (x === currentVaccine[0] && y === currentVaccine[1]) {
				vaccinePieces[level - 1].splice(i, 1);
				PS.audioPlay("fx_powerup3", {volume: 0.5});
				return true;
			}
		}
		return false;
	}

	function isHealthPickup(x, y) {
		for (let i = 0; i < healthPickups[level - 1].length; i++) {
			let currentHealthPickup = healthPickups[level - 1][i];
			if (x === currentHealthPickup[0] && y === currentHealthPickup[1]) {
				healthPickups[level - 1].splice(i, 1);
				PS.audioPlay("fx_powerup2", {volume: 0.5});
				return true;
			}
		}
		return false;
	}

	function playerPlace(x, y) {
		PS.color(x, y, PLAYER_COLOR);
		if (isEnemy(playerX, playerY)) {
			PS.audioPlay("fx_squink", {volume: 0.3});
			PS.color(playerX, playerY, ENEMY_COLOR);
		} else {
			PS.color(playerX, playerY, bitmap[playerX][playerY]);
		}
		PS.audioPlay("fx_click", {volume: 0.1});
		playerX = x;
		playerY = y;
		if (isWinner) {
			canMakeCure = true; 
			PS.statusText("Make your way to the Yellow Area!");
			if (isGoal(playerX, playerY)) {
				PS.statusText("Press Enter or Space to Create the Cure!");
			} else {
				canMakeCure = false;
			}
		} else {
			canMakeCure = false;
		}
	}

	function enemyPlace(i, x, y) {
		if (!isWinner) {
			PS.color(x, y, ENEMY_COLOR);
			PS.color(enemies[level - 1][i][0], enemies[level - 1][i][1], bitmap[enemies[level - 1][i][0]][enemies[level - 1][i][1]]);
			PS.audioPlay("fx_rip", {volume: 0.1});
			if (isWall(x, y) || isWall(enemies[level - 1][i][0], enemies[level - 1][i][1])) {
				return;
			}
			if (x === playerX && y === playerY) {
				playerHealth = Math.max(0, playerHealth - 25);
				PS.audioPlay("fx_squink", {volume: 0.3});
				updateStatus();
			}
			enemies[level - 1][i][0] = x;
			enemies[level - 1][i][1] = y;
		}
	}

	function playerStep(h, v) {
		let nx = playerX + h;
		let ny = playerY + v;
		switch (level) {
			default:
			case 1: {
				if ((ny === 4 || ny === 5) && nx > 31) {
					level = 2;
					loadMap();
					playerPlace(0, ny);
				}
			}
			break;
			case 2: {
				if ((ny === 17 || ny === 18) && nx > 31) {
					level = 3;
					loadMap();
					playerPlace(0, ny);
				} else if ((ny === 4 || ny === 5) && nx < 0) {
					level = 1;
					loadMap();
					playerPlace(31, ny);
				}
			}
			break;
			case 3: {
				if ((ny === 30 || ny === 31) && nx < 0) {
					level = 1;
					loadMap();
					playerPlace(25, 30);
				} else if ((ny === 17 || ny === 18) && nx < 0) {
					level = 2;
					loadMap();
					playerPlace(31, ny);
				}
			}
		}
		if ((nx < 0) || (nx >= GRID_X) || (ny < 0) || (ny >= GRID_Y) || isWall(nx, ny)) {
			return;
		}
		if (isGameOver) {
			return;
		}
		if (isEnemy(nx, ny)) {
			playerHealth = Math.max(0, playerHealth - 25);
		}
		if (isVaccinePiece(nx, ny)) {
			numVaccinePieces++;
		}
		if (isHealthPickup(nx, ny)) {
			playerHealth = Math.min(100, playerHealth + 50);
		}
		updateStatus();
		if (numVaccinePieces === 6) {
			isWinner = true;
		}
		playerPlace(nx, ny);
	}

	function updateStatus() {
		if (playerHealth > 0) {
			PS.statusText("Health: " + playerHealth + "/" + MAX_PLAYER_HEALTH + " | Vaccine Pieces: " + numVaccinePieces + "/" + TOTAL_VACCINE_PIECES);
		} else {
			isGameOver = true;
			PS.audioPlay("fx_wilhelm");
			DB.send();
			PS.statusText("Game Over. Press Enter or Space to Play Again.");
		}
	}

	function animateEnemies() {
		for (let i = 0; i < enemies[level - 1].length; i++) {
			let currentEnemy = enemies[level - 1][i];
			let distFromPlayer = Math.sqrt(Math.pow((currentEnemy[0] - playerX), 2) + Math.pow((currentEnemy[1] - playerY), 2));
			if (distFromPlayer < 8) {
				if (currentEnemy[2] === null) {
					currentEnemy[2] = PS.line(currentEnemy[0], currentEnemy[1], playerX, playerY);
					currentEnemy[3] = 0;
				} else {
					if (currentEnemy[3] < currentEnemy[2].length) {
						currentEnemy[3]++;
						let currentEnemyPos = currentEnemy[2][currentEnemy[3]];
						if (currentEnemyPos != null) {
							let nx = currentEnemyPos[0];
							let ny = currentEnemyPos[1];
							if ((nx < 0) || (nx >= GRID_X) || (ny < 0) || (ny >= GRID_Y) || isWall(nx, ny) || isWall()) {
								currentEnemy[2] = null;
								currentEnemy[3] = -1;
							} else {
								enemyPlace(i, nx, ny);
							}
						}
					} else {
						currentEnemy[2] = null;
						currentEnemy[3] = -1;
					}
				}
			}
		}
	}

	function loadMap() {
		let onMaskLoad = function(image) {
			if (image === PS.ERROR) {
				PS.debug("Error loading map");
				return;
			}
			for (let i = 0; i < 32; i++) {
				for (let j = 0; j < 32; j++) {
					let binaryMaskValue;
					switch (image.data[32 * i + j]) {
						case PS.COLOR_BLACK: {
							binaryMaskValue = 0;
						}
						break;
						case PS.COLOR_WHITE: {
							binaryMaskValue = 1;
						}
					}
					map.data[32 * i + j] = binaryMaskValue;
				}
			}
		};
		PS.imageLoad("images/lvl" + level + "_mask.bmp", onMaskLoad, 1);

		let onMapLoad = function(image) {
			if (image === PS.ERROR) {
				PS.debug("Error loading map");
				return;
			}
			for (let i = 0; i < 32; i++) {
				for (let j = 0; j < 32; j++) {
					let color = image.data[32 * i + j];
					bitmap[j][i] = color;
					PS.color(j, i, color);
				}
			}
			for (let i = 0; i < enemies[level - 1].length; i++) {
				let currentEnemy = enemies[level - 1][i];
				PS.color(currentEnemy[0], currentEnemy[1], ENEMY_COLOR);
			}
			for (let i = 0; i < vaccinePieces[level - 1].length; i++) {
				let currentVaccine = vaccinePieces[level - 1][i];
				PS.color(currentVaccine[0], currentVaccine[1], VACCINE_COLOR);
			}
			for (let i = 0; i < healthPickups[level - 1].length; i++) {
				let currentHealth = healthPickups[level - 1][i];
				PS.color(currentHealth[0], currentHealth[1], HEALTH_COLOR);
			}
		};
		PS.imageLoad("images/lvl" + level + ".bmp", onMapLoad, 1);
	}

	function restartGame() {
		 isGameOver = false;
		 isWinner = false;
		 canMakeCure = false;
		 playerX = 25;
		 playerY = 30;
		 playerHealth = 100;
		 numVaccinePieces = 0;
		 level = 1;

		 enemies = [
			[[2, 30, null, -1], [15, 11, null, -1], [27, 15, null, -1]],
			[[2, 25, null, -1], [27, 26, null, -1]],
			[[2, 8, null, -1], [28, 16, null, -1]]
		];
		 vaccinePieces = [
			[[19, 11], [30, 15]],
			[[28, 4], [29, 27]],
			[[29, 4], [28, 22]]
		];
		 healthPickups = [
			[],
			[],
			[[19, 2], [28, 29]]
		];
		loadMap();
	}

	return {
		init: function() {
			let complete = function(user) {
				PS.statusText("Hi, " + user + "!");
			};
			PS.gridSize(GRID_X, GRID_Y);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.audioLoad("fx_click", {lock: true});
			PS.audioLoad("fx_powerup2", {lock: true});
			PS.audioLoad("fx_powerup3", {lock: true});
			PS.audioLoad("fx_squink", {lock: true});
			PS.audioLoad("fx_rip", {lock: true});
			PS.audioLoad("fx_tada", {lock: true});
			PS.audioLoad("fx_wilhelm", {lock: true});
			PS.audioLoad("main-theme", {lock: true, loop: true, autoplay: true, path: "audio/"});
			loadMap(1);
			playerPlace(playerX, playerY);
			PS.statusText("Health: " + playerHealth + "/" + MAX_PLAYER_HEALTH + " | Vaccine Pieces: " + numVaccinePieces + "/" + TOTAL_VACCINE_PIECES);
			DB.active(true);
			DB.init("findcure", complete);
			PS.timerStart(12, animateEnemies);
		},
		keyDown: function(key) {
			switch (key) {
				case PS.KEY_ARROW_UP:
				case 119:
				case 87: {
					playerStep(0, -1);
				}
				break;
				case PS.KEY_ARROW_DOWN:
				case 115:
				case 83: {
					playerStep(0, 1);
				}
				break;
				case PS.KEY_ARROW_LEFT:
				case 97:
				case 65: {
					playerStep(-1, 0);
				}
				break;
				case PS.KEY_ARROW_RIGHT:
				case 100:
				case 68: {
					playerStep(1, 0);
				}
				break;
				case 13:
				case 32: {
					if (isGameOver) {
						restartGame();
					}
					if (canMakeCure) {
						isGameOver = true;
						PS.audioPlay("fx_tada", {volume: 0.75});
						DB.send();
						PS.statusText("Press Enter or Space to Play Again.");
					}
				}
			}
		}
	};
}());

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;
PS.shutdown = function() {
	DB.send();
};