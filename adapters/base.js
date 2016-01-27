"use strict";
var winston = require('winston');
var cheerio = require('cheerio');
var Firebase = require("firebase");
var request = require('request');

module.exports = class BaseAdapter {
	constructor(options){
		if (options.page > 1) {
			this.url = this.getPageUrl(options.url);	
		}
		this.slackChannel = options.slackChannel;
		this.slackBot = options.slackBot;
		this.response = options.response;
		this.responseImages = options.responseImages;
		this.dontPostForReal = options.dontPostForReal;
		this.itemsUrl = options.itemsUrl;
		this.firebaseRef = new Firebase(options.itemsUrl);
		this.errorsRef = new Firebase(options.errorsUrl);
	}

	toString(){
		return `${this.constructor.name} - ${this.url} - ${this.slackChannel}`;
	}

	getDocumnet(){
		winston.info('getting document');
		return new Promise((resolve) => {
			resolve(cheerio.load(this.response));
		}).then(($) => {
			if (this.responseImages) {
				return {
					$: $,
					$$: cheerio.load(this.responseImages)
				};
			} else {
				return {
					$: $
				};
			}
		});
	}

	getItems(documents){
		return []
	}

	getPageUrl(i){
		return this.url;
	}

	writeError(message){
		return new Promise((resolve, reject) => {
			winston.error(message);
			var errorsUpdate = {};
			errorsUpdate[new Date().getTime()] = message
			this.errorsRef.update(errorsUpdate, resolve)
		});
	}

	filterNewItems(items){
		return new Promise((resolve, reject) => {
			this.firebaseRef.on('value', (snapshot) => {
				var itemsHash = snapshot.val() || {};
				var newItems = items
					.filter((item) => {
						return !itemsHash[item.id]
					});
				winston.info(`New Items: ${JSON.stringify(newItems, null, '\t')}`);
				resolve(newItems);
			}, reject);
		});
	}

	saveItems(items){
		return new Promise((resolve, reject) => {
			var updateHash = {};
			winston.info(`items length: ${items.length}`);
			this.firebaseRef.update(updateHash, resolve.bind(null, items));
			items.forEach((item) => {
				updateHash[item.id] = item;
			});
			winston.info(`Updating new items: ${JSON.stringify(updateHash, null, '\t')}`);
			this.firebaseRef.update(updateHash, resolve.bind(null, items));
		});
	}

	formatItems(items) {
		return items.map(this.formatItem, this);
	}

	formatItem(item, i) {
		return	`
${item.img}
${item.text}
${item.url}
`.trim();
	}

	run(){
		return this.getDocumnet()
			.then(this.getItems.bind(this))
			.then(this.filterNewItems.bind(this))
			.then(this.saveItems.bind(this))
			.then(this.formatItems.bind(this))
			.then(this.post.bind(this))
			.catch((error) => {
				winston.error(error.message || error.code);
			})
	}

	post(messages){
		if (messages && !Array.isArray(messages)){
			messages = [messages];
		}
		(messages || []).forEach(m => {
			if (this.slackBot && this.slackBot.postMessageToChannel) {
				if (!this.dontPostForReal) {
					this.slackBot.postMessageToChannel(this.slackChannel, `@channel: ${m}`, {});	
				}
				winston.info(`Bot ${this.slackBot.name} posted: ${m}`);
			}
		});
	}
}