
var TouchSlide = require('./TouchSlide.1.1.source');

module.exports.init = function(opt){
	
	TouchSlide({ 
		slideCell:opt.slider,
		titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
		mainCell:".bd ul", 
		effect:"leftLoop", 
		autoPage:true,//自动分页
		autoPlay:false //自动播放
	});

}