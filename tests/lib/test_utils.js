var utils = require('../../lib/utils')

exports.testSortByPosition = function(test) {

	var stubData = [
		{location: [0, 1, 0]},
		{location: [1, 0, 0]},
		{location: [0, 0, 0]},
		{location: [0, 0, 1]}
	]

	var expected = [
		{location: [0, 0, 1]},
		{location: [0, 0, 0]},
		{location: [1, 0, 0]},
		{location: [0, 1, 0]}
	]

    test.expect(1)
    var results = utils.sortByPosition(stubData)
    test.deepEqual(results, expected, "results matches expected outcome");
    test.done();
};
