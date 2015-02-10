define([
	'client/entity/BufferedInputEntityX',
	'create!client/display/Sprite > Athlete',
	'create!client/display/Sprite > AthleteOutline',
	'create!client/display/Sprite > Cursor',
	'shared/sim/AthleteX',
	'client/Constants'
], function(
	SUPERCLASS,
	SPRITE,
	SERVER_SPRITE_OUTLINE,
	CURSOR_SPRITE,
	AthleteSim,
	Constants
) {
	var INPUT_BUFFER_TIME = 5.5 / 60;
	function Athlete(params) {
		SUPERCLASS.call(this, AthleteSim, params);
		this._cancelBufferedAction = null;
		this._bufferTimeRemaining = null;
		this._moveDir = null;
		this._chargedDir = 0.0;
		this._walkDuration = 0.0;
		this._walkDir = 0;
	}
	Athlete.prototype = Object.create(SUPERCLASS.prototype);
	Athlete.prototype.onKeyboardEvent = function(evt, keyboard) {
		if(evt.gameKey === 'JUMP') {
			if(evt.isDown) { this._bufferCommand('charge-jump', null); }
			else { this._bufferCommand('jump', INPUT_BUFFER_TIME); }
		}
		else if(evt.gameKey === 'MOVE_LEFT') {
			if(evt.isDown) {
				this._moveDir = -1;
				if(this._sim.currentTask !== 'charge-jump') {
					this._bufferCommand('move-left', null);
				}
			}
			else {
				this._moveDir = (keyboard.MOVE_RIGHT ? 1 : 0);
				if(this._sim.currentTask !== 'charge-jump') {
					this._bufferCommand(keyboard.MOVE_RIGHT ? 'move-right' : 'stop', null);
				}
			}
		}
		else if(evt.gameKey === 'MOVE_RIGHT') {
			if(evt.isDown) {
				this._moveDir = 1;
				if(this._sim.currentTask !== 'charge-jump') {
					this._bufferCommand('move-right', null);
				}
			}
			else {
				this._moveDir = (keyboard.MOVE_LEFT ? -1 : 0, null);
				if(this._sim.currentTask !== 'charge-jump') {
					this._bufferCommand(keyboard.MOVE_LEFT ? 'move-left' : 'stop', null);
				}
			}
		}
	};
	Athlete.prototype._generateActionFromCommand = function(command) {
		if(command === 'move-left') {
			return { actionType: 'follow-waypoint', x: this._sim.x, dir: -1 };
		}
		else if(command === 'move-right') {
			return { actionType: 'follow-waypoint', x: this._sim.x, dir: 1 };
		}
		else if(command === 'stop') {
			return { actionType: 'follow-waypoint', x: this._sim.x, dir: 0 };
		}
		else if(command === 'charge-jump') {
			return { actionType: 'charge-jump', x: this._sim.x };
		}
		else if(command === 'jump') {
			var dir = 0.0;
			var charge = 0.0;
			if(this._sim.currentTask === 'charge-jump') {
				charge = Math.min(1.0, this._sim.currentTaskDuration);
				dir = this._chargedDir;
			}
			return { actionType: 'jump', x: this._sim.x, charge: charge, dir: dir };
		}
		return null;
	};
	Athlete.prototype.tick = function(t) {
		this._walkDuration += t;
		if(this._sim.currentTask === 'follow-waypoint' || this._sim.currentTask === 'reposition') {
			if(this._sim.vel.x > 0) {
				if(this._walkDir <= 0) {
					this._walkDir = 1;
					this._walkDuration = 0.0;
				}
			}
			else if(this._sim.vel.x < 0) {
				if(this._walkDir >= 0) {
					this._walkDir = -1;
					this._walkDuration = 0.0;
				}
			}
			else {
				this._walkDir = 0;
				this._walkDuration = 0.0;
			}
		}
		if(this._sim.currentTask === 'charge-jump') {
			this._chargedDir += 2.0 * t * this._moveDir;
			if(this._chargedDir > 1.0) { this._chargedDir = 1.0; }
			else if(this._chargedDir < -1.0) { this._chargedDir = -1.0; }
		}
		else {
			this._chargedDir = 0.0;
		}
		if(this._isPlayerControlled) {
			if(this._sim.currentTask === 'charge-jump' && this._sim.currentTaskDuration >= 1.0) {
				this._bufferCommand('jump', { charge: 1.0, dir : this._chargedDir });
			}
		}
		SUPERCLASS.prototype.tick.call(this, t);
	};
	Athlete.prototype.render = function(ctx) {
		SUPERCLASS.prototype.render.call(this, ctx);

		//draw red shadow to represent server-side values
		if(Constants.DEBUG_RENDER_SERVER_STATE) {
			this._renderSim(ctx, this._serverSim, SERVER_SPRITE_OUTLINE);
		}

		//draw blue/green rectangle to represent the client's displayed position
		this._renderSim(ctx, this._sim, SPRITE);

		//draw little trajectory dots
		if(this._isPlayerControlled && this._sim.currentTask === 'charge-jump') {
			var charge = Math.min(this._sim.currentTaskDuration, 1.00);
			CURSOR_SPRITE.render(ctx, null,
				this._sim.center.x - CURSOR_SPRITE.width / 2 + this._chargedDir * 20,
				this._sim.top - 15 * (1 + charge), 0, false);
			CURSOR_SPRITE.render(ctx, null,
				this._sim.center.x - CURSOR_SPRITE.width / 2 + this._chargedDir * 35,
				this._sim.top - 30 * (1 + charge), 0, false);
			CURSOR_SPRITE.render(ctx, null,
				this._sim.center.x - CURSOR_SPRITE.width / 2 + this._chargedDir * 50,
				this._sim.top - 42 * (1 + charge), 0, false);
			CURSOR_SPRITE.render(ctx, null,
				this._sim.center.x - CURSOR_SPRITE.width / 2 + this._chargedDir * 65,
				this._sim.top - 51 * (1 + charge), 0, false);
		}
	};
	Athlete.prototype._renderSim = function(ctx, sim, sprite) {
		var frame;
		if(sim.isAirborne()) {
			if(sim.vel.y < 100) {
				frame = 1 + 3 * 6;
			}
			else {
				frame = 2 + 3 * 6;
			}
		}
		else if(sim.currentTask === 'land-from-jump') {
			frame = 3 + 3 * 6;
		}
		else if(sim.currentTask === 'follow-waypoint' || sim.currentTask === 'reposition') {
			if(sim.vel.x > 0) {
				frame = Math.floor(this._walkDuration / 0.25) % 4 + 1 * 6;
			}
			else if(sim.vel.x < 0) {
				frame = Math.floor(this._walkDuration / 0.25) % 4 + 2 * 6;
			}
			else {
				frame = 0 + 0 * 6;
			}
		}
		else if(sim.currentTask === 'charge-jump') {
			frame = 0 + 3 * 6;
		}
		else {
			frame = 0 + 0 * 6;
		}
		sprite.render(ctx, null,
			sim.right - Math.floor(SPRITE.width / 2 + sim.width / 2),
			sim.bottom - SPRITE.height, frame, false);
	};
	return Athlete;
});