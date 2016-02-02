var yad2GivSample = require('./samples/yad2-giv');
var yad2GivImgSample = require('./samples/yad2-giv-imgs');

module.exports = {
	"adapters": [
		{
			"adapter": "yad2",
			"url": "http://www.yad2.co.il/Nadlan/rent.php?AreaID=49&City=&HomeTypeID=&fromRooms=3&untilRooms=4&fromPrice=4000&untilPrice=7000&PriceType=1&FromFloor=&ToFloor=&EnterDate=&Info=%E9%F4%E5&ImgOnly=1",
			"additionalUrl": "http://www.yad2.co.il/Nadlan/rentGallery.php?AreaID=49&City=&HomeTypeID=&fromRooms=3&untilRooms=4&fromPrice=4000&untilPrice=7000&PriceType=1&FromFloor=&ToFloor=&EnterDate=&Info=%E9%F4%E5&ImgOnly=1&GalleryView=1",
			"slackChannel": "testgiv",
			"slackBot": "yad2",
			"itemsUrl": "https://shiramy-scraper.firebaseio.com/channels/giv",
			"dontPostForReal": false,
			"response": yad2GivSample,
			"responseImages": yad2GivImgSample,
			"pages": 3
		},
		// {
		// 	"adapter": "yad2",
		// 	"url": "http://www.yad2.co.il/Nadlan/rent.php?AreaID=1&City=&HomeTypeID=&fromRooms=3&untilRooms=4&fromPrice=&untilPrice=6500&PriceType=1&FromFloor=&ToFloor=&EnterDate=&Info=%E9%F4%E5&ImgOnly=1",
		// 	"slackChannel": "testyafo",
		// 	"slackBot": "yad2",
		// 	"itemsUrl": "https://shiramy-scraper.firebaseio.com/channels/yafo",
		// 	"dontPostForReal": true,
		// 	"response": yad2YafoSample,
		// 	"responseImages": yad2GivImgSample,
		// 	"pages": 3
		// }
	],
	"bots": [
		{
			"name": "yad2",
			"token": "xoxb-19514354836-cFCobeZyfApEnWxfDrCQXCh6"
		}
	],
	"adaptersCommon": {
		"errorsUrl": "https://shiramy-scraper.firebaseio.com/errors",
	},
	"interval": 600000 //10 mins
}
