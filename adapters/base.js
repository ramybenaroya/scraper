"use strict";
var winston = require('winston');
var cheerio = require('cheerio');
module.exports = class BaseAdapter {
	constructor(options){
		this.url = options.url;
		this.slackChannel = options.slackChannel;
		this.slackBot = options.slackBot;
		this.response = options.response;
	}

	getDocumnet(){
		winston.info('getting document');
		return new Promise((resolve) => {
			resolve(cheerio.load(this.response));
		});
	}

	getItems($){
		return []
	}

	formatItems(items) {
		return items.map(this.formatItem, this);
	}

	formatItem(item, i) {
		return	`
${item.text}
${item.url}
`.trim();
	}

	run(){
		return this.getDocumnet()
			.then(this.getItems.bind(this))
			.then(this.formatItems.bind(this))
			.then(this.post.bind(this));
	}

	post(messages){
		messages.forEach(m => {
			if (this.slackBot && this.slackBot.postMessageToChannel) {
				this.slackBot.postMessageToChannel(this.slackChannel, m, {});
				winston.info(`Bot ${this.slackBot.name} posted: ${m}`);
			}
		});
	}
}