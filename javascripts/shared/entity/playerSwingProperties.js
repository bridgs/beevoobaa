define([
	'shared/hit/HitBox',
	'shared/math/Vector'
], function(
	HitBox,
	Vector
) {
	function overcomePower(power, player, ball) {
		if(ball.team === null || ball.team === player.team) {
			return 0;
		}
		else {
			return Math.max(0, ball.power - power);
		}
	}

	function calcDizzyTime(power) {
		return 45 / 60 + Math.floor(power / 10) * 10 / 60;
	}

	function onBump(player, ball) {
		var hitPower = 15 + 55 * player.charge + (this.isSweet ? 10 : 0);
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;
		//controlled hit
		if(team === player.team || team === null) {
			angle = (new Vector(1, -0.5 * player.aim)).angle();
			vel.rotate(angle);
			if(vel.y > 0) {
				vel.y *= -1;
			}
			else if(angle !== 0) {
				vel.x *= -1;
			}
			controlledVel = -75 - 100 * player.charge;
			vel.y = Math.min(vel.y, controlledVel) * 0.75 + Math.max(vel.y, controlledVel) * 0.25;
			vel.unrotate(angle);
			spin = ball.spin + 25 * player.aim;
		}
		//deflected hit
		else {
			angle = (new Vector(1, -0.15 * player.aim)).angle();
			vel.rotate(angle);
			if(vel.y > 0) {
				vel.y *= -1;
			}
			else if(angle !== 0) {
				vel.x *= -1;
			}
			controlledVel = -100 - 75 * player.charge;
			vel.y = vel.y * 0.85 + controlledVel * 0.15;
			vel.unrotate(angle);
			spin = 1.2 * ball.spin + 80 * player.aim;
		}
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourBumpForward(player, ball) {
		var hitPower = (15 + 55 * player.charge) * 0.5;
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;
		angle = (new Vector(1, (player.isFlipped ? 0.7 : -0.7) - 0.5 * player.aim)).angle();
		vel.rotate(angle);
		if(vel.y > 0) {
			vel.y *= -1;
		}
		else if(angle !== 0) {
			vel.x *= -1;
		}
		vel.unrotate(angle);
		spin = ball.spin + (player.isFlipped ? -80 : 80);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourBumpBackward(player, ball) {
		var hitPower = (15 + 55 * player.charge) * 0.5;
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;
		angle = (new Vector(1, (player.isFlipped ? -0.7 : 0.7) - 0.5 * player.aim)).angle();
		vel.rotate(angle);
		if(vel.y > 0) {
			vel.y *= -1;
		}
		else if(angle !== 0) {
			vel.x *= -1;
		}
		vel.unrotate(angle);
		spin = ball.spin + (player.isFlipped ? 80 : -80);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}

	function onSet(player, ball) {
		var hitPower = 5 + 20 * player.charge + (this.isSweet ? 10 : 0);
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var spin, controlledVel;
		//controlled hit
		if(team === player.team || team === null) {
			if(vel.y > 0) {
				vel.y *= -1;
			}
			vel.x *= 0.5;
			vel.x += player.aim * player.charge * 35;
			controlledVel = -60 - 90 * player.charge;
			vel.y = controlledVel * 0.75 + vel.y * 0.25;
			spin = ball.spin * 0.5;
		}
		//deflected hit
		else {
			if(vel.y > 0) {
				vel.y *= -0.5;
			}
			vel.x += player.aim * player.charge * 10;
			controlledVel = -30 - 45 * player.charge;
			vel.y = vel.y * 0.85 + controlledVel * 0.15;
			spin = 1.2 * ball.spin + 20 * player.charge + 80 * player.aim;
		}
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourSetForward(player, ball) {
		var hitPower = (5 + 20 * player.charge) * 0.5;
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;
		angle = (new Vector(1, (player.isFlipped ? 0.2 : -0.2) - 0.05 * player.aim)).angle();
		vel.rotate(angle);
		if(vel.y > 0) {
			vel.y *= -1;
		}
		else if(angle !== 0) {
			vel.x *= -1;
		}
		vel.unrotate(angle);
		spin = ball.spin + (player.isFlipped ? -80 : 80);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourSetBackward(player, ball) {
		var hitPower = (5 + 20 * player.charge) * 0.5;
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;
		angle = (new Vector(1, (player.isFlipped ? -0.2 : 0.2) - 0.05 * player.aim)).angle();
		vel.rotate(angle);
		if(vel.y > 0) {
			vel.y *= -1;
		}
		else if(angle !== 0) {
			vel.x *= -1;
		}
		vel.unrotate(angle);
		spin = ball.spin + (player.isFlipped ? 80 : -80);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}

	function onSpike(player, ball) {
		var hitPower = 25 + 55 * player.charge + (this.isSweet ? 10 : 0);
		var stoppingPower = 0.85 * hitPower;
		var power, team;
		if(ball.team === player.team || ball.team === null) {
			power = Math.max(ball.power, hitPower);
			team = player.team;
		}
		else if(stoppingPower >= ball.power) {
			power = hitPower;
			team = player.team;
		}
		else {
			power = ball.power - stoppingPower;
			team = ball.team;
		}
		var vel = new Vector(ball.velX, ball.velY);
		var angle = (new Vector(-0.7 - 0.3 * player.aim, (player.isFlipped ? 1 : -1))).angle();
		var spin;
		vel.rotate(angle);
		//controlled hit
		if(team === player.team || team === null) {
			vel.x = 0;
			vel.y = -75 - 150 * player.charge;
			spin = ball.spin + 20 * player.aim + 20 * player.aim * player.charge;
		}
		//deflected hit
		else {
			vel.x *= 0.8;
			vel.y -= 30 + 40 * player.charge;
			spin = ball.spin * 1.4 + 30 + 60 * player.aim;
		}
		vel.unrotate(angle);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourSpikeAbove(player, ball) {
		var hitPower = (25 + 55 * player.charge) * 0.5;
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;

		angle = (new Vector(1, (player.isFlipped ? 0.8 : -0.8))).angle();
		vel.rotate(angle);
		vel.x *= 0.7;
		if(vel.y > 0) {
			vel.y *= -1;
		}
		vel.y -= 10 + 20 * player.charge;
		vel.unrotate(angle);
		spin = ball.power + (player.isFlipped ? 60 : -60);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourSpikeBelow(player, ball) {
		var hitPower = (25 + 55 * player.charge) * 0.5;
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var angle, controlledVel, spin;

		angle = (new Vector(-1, (player.isFlipped ? 0.8 : -0.8))).angle();
		vel.rotate(angle);
		vel.x *= 0.7;
		if(vel.y > 0) {
			vel.y *= -1;
		}
		vel.y -= 10 + 20 * player.charge;
		vel.unrotate(angle);
		spin = ball.power + (player.isFlipped ? -60 : 60);
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};}

	function onBlock(player, ball) {
		var hitPower = 25 + 50 * player.charge + (this.isSweet ? 10 : 0);
		var power = overcomePower(hitPower, player, ball);
		var team = (power === 0 ? null : ball.team);
		var vel = new Vector(ball.velX, ball.velY);
		var spin;
		//controlled hit
		if(team === player.team || team === null) {
			if(player.isFlipped) {
				vel.x = Math.min(vel.x, -25 - 40 * player.charge);
			}
			else {
				vel.x = Math.max(vel.x, 25 + 40 * player.charge);
			}
			vel.y = 0.5 * vel.y - 10 + (10 + 20 * player.charge) * player.aim;
			spin = 0.75 * ball.spin + 10 * player.aim;
		}
		//deflected hit
		else {
			vel.y += 10 + (10 + 20 * player.charge) * player.aim;
			spin = 1.2 * ball.spin + 70 * player.aim;
		}
		return {
			velX: vel.x,
			velY: vel.y,
			spin: spin,
			power: power,
			team: team,
			dizzyTime: (team === player.team || team === null ? null : calcDizzyTime(power)),
			isSweet: this.isSweet,
			freezeTime: 40 / 60
		};
	}
	function onSourBlockAbove(player, ball) {}
	function onSourBlockBelow(player, ball) {}

	return {
		bump: {
			isGrounded: true,
			swingTime: 45 / 60,
			swingSuccessTime: 45 / 60,
			timeToMaxCharge: 90 / 60,
			activeStartTime: 3 / 60,
			activeEndTime: 56 / 60,
			hitBoxes: [
				new HitBox({
					isSweet: true,
					offsetX: 20, offsetY: -30, width: 20, height: 20,
					orientationX: -1, orientationY: 1,
					onHitFunc: onBump
				}),
				new HitBox({
					offsetX: 5, offsetY: -40, width: 50, height: 50,
					orientationX: -1, orientationY: 1,
					onHitFunc: onBump
				}),
				new HitBox({
					isSour: true,
					offsetX: -15, offsetY: -40, width: 20, height: 50,
					orientationX: -1, orientationY: 1,
					onHitFunc: onSourBumpBackward
				}),
				new HitBox({
					isSour: true,
					offsetX: 55, offsetY: -40, width: 20, height: 50,
					orientationX: -1, orientationY: 1,
					onHitFunc: onSourBumpForward
				})
			]
		}, set: {
			isGrounded: true,
			swingTime: 45 / 60,
			swingSuccessTime: 45 / 60,
			timeToMaxCharge: 90 / 60,
			activeStartTime: 3 / 60,
			activeEndTime: 56 / 60,
			hitBoxes: [
				new HitBox({
					isSweet: true,
					offsetX: -10, offsetY: -60, width: 20, height: 20,
					orientationX: 0, orientationY: 1,
					onHitFunc: onSet
				}),
				new HitBox({
					offsetX: -30, offsetY: -70, width: 60, height: 40,
					orientationX: 0, orientationY: 1,
					onHitFunc: onSet
				}),
				new HitBox({
					isSour: true,
					offsetX: -50, offsetY: -70, width: 30, height: 40,
					orientationX: 0, orientationY: 1,
					onHitFunc: onSourSetBackward
				}),
				new HitBox({
					isSour: true,
					offsetX: 20, offsetY: -70, width: 30, height: 40,
					orientationX: 0, orientationY: 1,
					onHitFunc: onSourSetForward
				})
			]
		}, spike: {
			isGrounded: false,
			swingTime: 45 / 60,
			swingSuccessTime: 45 / 60,
			timeToMaxCharge: 90 / 60,
			activeStartTime: 3 / 60,
			activeEndTime: 56 / 60,
			hitBoxes: [
				new HitBox({
					isSweet: true,
					offsetX: 35, offsetY: -30, width: 20, height: 20,
					orientationX: -1, orientationY: 0,
					onHitFunc: onSpike
				}),
				new HitBox({
					offsetX: 15, offsetY: -50, width: 45, height: 55,
					orientationX: -1, orientationY: 0,
					onHitFunc: onSpike
				}),
				new HitBox({
					isSour: true,
					offsetX: 0, offsetY: -60, width: 60, height: 30,
					orientationX: -1, orientationY: 0,
					onHitFunc: onSourSpikeAbove
				}),
				new HitBox({
					isSour: true,
					offsetX: 25, offsetY: 0, width: 60, height: 30,
					orientationX: -1, orientationY: 0,
					onHitFunc: onSourSpikeBelow
				})
			]
		}, block: {
			isGrounded: false,
			swingTime: 45 / 60,
			swingSuccessTime: 45 / 60,
			timeToMaxCharge: 90 / 60,
			activeStartTime: 3 / 60,
			activeEndTime: 56 / 60,
			hitBoxes: [
				new HitBox({
					isSweet: true,
					offsetX: 25, offsetY: -30, width: 20, height: 35,
					orientationX: -1, orientationY: 0,
					onHitFunc: onBlock
				}),
				new HitBox({
					offsetX: 15, offsetY: -40, width: 45, height: 65,
					orientationX: -1, orientationY: 0,
					onHitFunc: onBlock
				})/*,
				new HitBox({
					isSour: true,
					offsetX: 0, offsetY: -50, width: 30, height: 30,
					orientationX: -1, orientationY: 0,
					onHitFunc: onSourBlockBelow
				}),
				new HitBox({
					isSour: true,
					offsetX: 0, offsetY: 0, width: 30, height: 30,
					orientationX: -1, orientationY: 0,
					onHitFunc: onSourBlockAbove
				})*/
			]
		}
	};
});