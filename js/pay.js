var $ = require('jquery');
var Vue = require('vue');
Vue.use(require('vue/vue-resource.js'));

module.exports = function(opt){
	var json = {hotelId:opt.hotelId,pcCode:opt.pcCode};
	Vue.http.options.emulateJSON = true;
	new Vue({
		el:opt.el,
		http: {
           headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
		data : {
			yd : opt.data,
			dprice:opt.dprice
		},
		ready:function(){
			//购物车
	        this.$http.get('/pos/getPosCart.htm?t='+(new Date().getTime()),json,function(data){
	        	if(data.data != '暂无购物车'){
	        		this.$set('dishs',data.data)
	        	}
	        	
	        })
		},
		methods:{
			reduce:function(dish){
				var json = {"hotelId":opt.hotelId,"pcCode":opt.pcCode,"data":JSON.stringify(dish)};
				this.$http.post('/pos/subtractPosCart.htm',json,function (data){
					if (data.stauts=="0") {
						dish.number = dish.number-1;
					}else{
						alert('同步失败 请重试')
					}
				})
			},
			add:function(dish){
				var json = {"hotelId":opt.hotelId,"pcCode":opt.pcCode,"data":JSON.stringify(dish)};
				this.$http.post('/pos/addPosCart.htm',json,function (data){
					if (data.stauts=="0") {
						dish.number = dish.number+1;
					}else{
						alert('同步失败 请重试')
					}
				})
			},
			clean:function(){
				this.$http.post('/pos/clearPosCart.htm',json,function (data){
					if (data.stauts=="0") {
						this.dishs = [];
					}else{
						alert('同步失败 请重试')
					}
				})
			},
			postAll:function(){

				
				var arr = ["早上","中午","晚上"];

				var postLocalStorage = JSON.parse(localStorage.getItem('ydInfo'));
				postLocalStorage.dates.replace(/\//g,'-')
				postLocalStorage.times=(arr.indexOf(postLocalStorage.times)+1)
				postLocalStorage['hotelid']=opt.hotelId;

				var json = JSON.stringify(postLocalStorage)
				
				$("[name=data]").val(json);

				$("[name=payMethod]").val($("[name=payWay]").val());

				$("#postShow").submit();
			}
		},
		computed:{
			sum:function(){
				var sum = 0;
					
				for (var i = 0; i < this.dishs.length; i++) {
					sum+=this.dishs[i].number*this.dishs[i].pluPrice;
				};

				return sum;
			},
			trueDprice:function(){
				if(opt.isZhekou=='T'){
					return Math.round(this.sum*opt.cPrice);
				}else{
					return cPrice;
				}
			}
		}
	})

}