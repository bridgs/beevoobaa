define([
	'client/Clock'
], function(
	Clock
) {
	function PredictiveEntity(SimClass, params) {
		this.id = params.id;
		this._actual = new SimClass(params);
		this._client = new SimClass(params);
		this._predicted = new SimClass(params);
		this._predictFutureState();
	}
	PredictiveEntity.prototype._predictFutureState = function() {
		this._predicted.setState(this._actual.getState());
		var serverReceiveTime = Clock.getServerReceiveTime();
		var clientTime = Clock.getClientTime();
		if(serverReceiveTime !== null && clientTime !== null) {
			//fast forward the predicted state at an effective 60 FPS
			var time = Math.abs(serverReceiveTime - clientTime) / 1000;
			for(var t = time; t > 0; t -= 1 / 60) {
				this._predicted.tick(Math.min(t, 1 / 60));
			}
		}
	};
	PredictiveEntity.prototype.setState = function(state) {
		this._actual.setState(state);
		this._predictFutureState();
	};
	PredictiveEntity.prototype.tick = function(t) {
		this._client.tick(t);
		this._actual.tick(t);
		this._predictFutureState();
	};
	PredictiveEntity.prototype.render = function(ctx) {};
	return PredictiveEntity;
});