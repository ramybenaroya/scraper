"use strict";
var BaseAdapter = require('./base');

module.exports = class Yad2Adapter extends BaseAdapter {
	getItems($){
		return $('#main_table tr[id^="tr_Ad_"]')
			.toArray()
			.map(tr => {
				var $tr = $(tr);
				var id = $tr.attr('id');
				var _lastIndex = id.lastIndexOf('_');
				id = id.substring(_lastIndex + 1, id.length);
				return {
					id: id,
					text: $tr.text().replace(/\s+/g, "~").split('~').join(' '),
					url: `http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=${id}`
				}
			});
	}
}