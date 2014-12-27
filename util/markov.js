var MarkovChainEvaluator = {};

MarkovChainEvaluator.evaluate = function(options) {
	var keys = Object.keys(options);

	var sum = 0,
		i, choice;
	for (i = 0; i < keys.length; i++) {
		sum += options[keys[i]];
	}
	choice = Math.floor(Math.random() * sum);
	sum = 0;
	for (i = 0; i < keys.length; i++) {
		sum += options[keys[i]];
		if (choice <= sum) return keys[i];
	}
};

exports.ChainEvaluator = MarkovChainEvaluator;
	

var MarkovProcess = function(rewardFn) {
	this._states = {};
	this._rewardFns = [rewardFn];
};

MarkovProcess.prototype.extend = function(rewardFn) {
	var newChain = new MarkovProcess(rewardFn);
	newChain._rewardFns = newChain._rewardFns.concat(this._rewardFns);
	for (var key in this._states) {
		newChain._states[key] = [].concat[this._states[key]];
	}
	return newChain;
};

MarkovProcess.prototype.add = function(state, destinations) {
	this._states[state] = destinations;
	return this;
};

MarkovProcess.prototype.evaluate = function(currentState, data) {
	var destinationStates = this._states[currentState];
	var i, j, sum = 0,
		rewards = new Array(destinationStates.length);
	var reward, choice, newStateIdx = 0;

	for (i = 0; i < destinationStates.length; i++) {
		for (j = 0; j < this._rewardFns.length; j++) {
			reward = this._rewardFns[j](currentState, destinationStates[i], data);
			if (typeof reward !== 'undefined') {
				rewards[i] = reward;
				sum += reward;
				break;
			}
		}
	}

	choice = Math.floor(Math.random() * sum);
	for (i = 0; i < rewards.length; i++) {
		reward = rewards[i];
		if (choice < reward) {
			newStateIdx = i;
			break;
		} else {
			choice -= reward;
		}
	}

	return destinationStates[newStateIdx];
};

exports.Process = MarkovProcess;
