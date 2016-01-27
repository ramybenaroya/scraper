var config = require('./config');
var allAdapters = require('./adapters/all');
var SlackBot = require('slackbots');
var RSVP = require('rsvp');
var hash = RSVP.hash;
var winston = require('winston');

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
		var adapters = config.endpoints.map((e) => {
			return new allAdapters[e.adapter](Object.assign({}, e, {
				slackBot: bots[e.slackBot]
			}));
		});

		function runAdapters(){
			return Promise.all(adapters.map((a) => {
				return a.run();
			}));
		}
		setInterval(runAdapters, config.interval);
		runAdapters();
	})