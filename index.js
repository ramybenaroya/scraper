require('./utils/number');
var config = require('./config');
var allAdapters = require('./adapters/all');
var SlackBot = require('slackbots');
var RSVP = require('rsvp');
var hash = RSVP.hash;
var winston = require('winston');
var client = require('./utils/client');
var http = require('http');
if (process.env.PORT) {
	http.createServer(() => {}).listen(process.env.PORT);	
}
require('./utils/selenium').then(() => {
	function createBots(){
		var bots = {};
		config.bots.forEach(b => {
			var bot = new SlackBot(b);
			bots[b.name] = new Promise((resolve) => {
				bot.on('start', () => {
					winston.info(`Bot ${b.name}started`)
					resolve(bot)
				});
			});
		});

		return hash(bots);
	}

	createBots()
		.then((bots) => {
			var adapters = [];
			config.adapters.forEach((metadata) => {
				metadata.pages.forEach((i) => {
					var adapter = new allAdapters[metadata.adapter](Object.assign({}, (config.adaptersCommon || {}), metadata, {
						slackBot: bots[metadata.slackBot],
						page: i + 1,
						client: client,
						proxy: config.proxies[metadata.proxy || 0]
					}));
					adapters.push(adapter);
				});
			});

			if (adapters.length) {
				runAdapter(0);	
			}
			
			function runAdapter(adapterIndex){
				adapters[adapterIndex]
					.run()
					.then(() => {
						var nextAdapterIndex = (adapterIndex + 1) % adapters.length
						setTimeout(runAdapter.bind(null, nextAdapterIndex), config.interval);
					});
			}
		});
});
