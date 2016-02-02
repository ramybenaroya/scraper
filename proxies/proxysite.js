var winston = require('winston');

module.exports = function proxysite(url, clientPromise){
	var promise = clientPromise
		.url('https://www.proxysite.com')
		.setValue('form input[type="text"]', url)
		.click('button[type="submit"]', () => {
			winston.info('hideme proxy: clicked submit')
		})
		.waitForVisible('#menu_strip', 60000);
	return promise;
};