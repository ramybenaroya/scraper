var webdriverio = require('webdriverio');
var client = webdriverio.remote({
	desiredCapabilities: {
		browserName: 'firefox'
	}
});

module.exports = client;