var yad2YafoSample = require('./samples/yad2-yafo');

module.exports = {
	"endpoints": [
		{
			"adapter": "yad2",
			"url": "http://www.yad2.co.il/Nadlan/rent.php?AreaID=1&City=&HomeTypeID=&fromRooms=3&untilRooms=4&fromPrice=&untilPrice=6500&PriceType=1&FromFloor=&ToFloor=&EnterDate=&Info=%E9%F4%E5&ImgOnly=1",
			"slackChannel": "test",
			"slackBot": "yad2",
			"response": yad2YafoSample
		}
	],
	"bots": [
		{
			"name": "yad2",
			"token": "xoxb-19514354836-cFCobeZyfApEnWxfDrCQXCh6"
		}
	],
	"interval": 3000
}