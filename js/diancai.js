var $ = require('jquery');
var Vue = require('vue');
Vue.use(require('vue/vue-resource'));
module.exports = function(opt){
	$(".nav-tabs li").click(function(event) {
		$(this).addClass('active').siblings().removeClass('active');
		$(".tabpanel").eq($(this).index()).show().siblings().hide();
	});

	function animateShow(number){
		$("#bodyBg").height($(document).height()).show();
		$(".car").animate({"top":"-"+(50+(37*number))}, 500);
		$(".allPrice").animate({"marginLeft":"-30px"}, 500)
	}
	function animateNo(){ 
		$(".car").animate({"top":"0"}, 500);
		$(".allPrice").animate({"marginLeft":"20px"}, 500);
		$("#bodyBg").hide()
	}
	Vue.http.options.emulateJSON = true;
	new Vue({
		el:opt.el,
		http: {
           headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        data:{
        	show: false,
    		transitionState: 'Idle',
        	dishList:[],
        	categorys:[],
        	shopCar:[],
        	cCode:[],
        	current : ''
        },
		ready: function() {
			//购物车
	        this.$http.get('/pos/getPosCart.htm?t='+(new Date().getTime()),{hotelId:opt.hotelId,pcCode:opt.pcCode},function(data){
	        	if(data.data != '暂无购物车'){
	        		this.$set('shopCar',data.data)
	        	}
	        	
	        })
			//this.$set('current',0);
			//左边接口 '/pos/getSortList.htm?hotelId='+opt.hotelId+'&pcCode='+opt.pcCode
			this.$http.get('/pos/getSortList.htm',{hotelId:opt.hotelId,pcCode:opt.pcCode},function(data){
				
				this.$set('categorys',data.data);
				this.$http.get('/pos/getPluList.htm',{hotelId:opt.hotelId,pcCode:opt.pcCode,sortCode:data.data[0].sortCode},function(data){
					
					for (var i = 0; i < data.data.length; i++) {
						data.data[i]['number'] = 0;
		        		for (var j = 0; j < this.shopCar.length; j++) {
		        			if(this.shopCar[j].pluCode ==data.data[i].pluCode){
		        				data.data[i]['number'] = this.shopCar[j].number; 
		        			}
		        		}; 
					};
					this.cCode.push(data.data[0].sortCode);
					this.dishList.push(data);
					this.current = data.data[0].sortCode;
				});
			});
			
	    },
		methods:{
			reduce:function(dish){

				var pluCode = dish.pluCode;
				var number = dish.number-1;
				var sum = this.sum;
				var json = {"hotelId":opt.hotelId,"pcCode":opt.pcCode,"data":JSON.stringify(dish)};

				this.$http.post('/pos/subtractPosCart.htm?t='+(new Date().getTime()),json, function(data) {
					
					if (data.stauts=="0") {
						for (var i = 0; i < this.dishList.length; i++) {
							for (var j = 0; j < this.dishList[i].data.length; j++) {
								if(this.dishList[i].data[j].pluCode==pluCode){
									this.dishList[i].data[j].number = number;
								}
							};
						};
						for (var i = 0; i < this.shopCar.length; i++) {
							if(this.shopCar[i].pluCode==pluCode){
								this.shopCar[i].number = number;
							}
						};
						if (this.show && number==0) {

							if((sum-1)==0){
								this.bgHide()
							}else{
								animateShow(sum-1)
							}
							
						};
					}else{
						alert('服务器同步失败 请重试')
					}

				});
			
			},
			add:function(dish){
				var pluCode = dish.pluCode;
				var number = dish.number + 1;
				var json = {"hotelId":opt.hotelId,"pcCode":opt.pcCode,"data":JSON.stringify(dish)};
				var flag = true;
				
				this.$http.post('/pos/addPosCart.htm?t='+(new Date().getTime()),json, function(data) {
					
					if(data.stauts=="0"){
			           for (var i = 0; i < this.dishList.length; i++) {
							for (var j = 0; j < this.dishList[i].data.length; j++) {
								if(this.dishList[i].data[j].pluCode==pluCode){

									this.dishList[i].data[j].number = number;
								}
							};
						};
						for (var i = 0; i < this.shopCar.length; i++) {
							if(this.shopCar[i].pluCode==pluCode){
								this.shopCar[i].number = number;
								flag = false;
							}
						};
						if(flag){
							this.shopCar.push(dish)
						}
					}else{
						alert('服务器同步失败 请重试')
					}
		        });
				

			},
			getNew:function(categoryId){
				
				if(this.cCode.indexOf(categoryId)==-1){

					this.$http.post('/pos/getPluList.htm?t='+(new Date().getTime()),{hotelId:opt.hotelId,pcCode:opt.pcCode,sortCode:categoryId},function(data){
			           	for (var i = 0; i < data.data.length; i++) {
							data.data[i]['number'] = 0;
			        		for (var j = 0; j < this.shopCar.length; j++) {
			        			if(this.shopCar[j].pluCode ==data.data[i].pluCode){
			        				data.data[i]['number'] = this.shopCar[j].number; 
			        			}
			        		}; 
						};
						this.cCode.push(data.data[0].sortCode);
						this.dishList.push(data);
			        })
				}
				this.current = categoryId;
		        
		      
			},
			bgHide:function(){
				$(event.target).hide();
				animateNo();
				this.show = false;
			},
			showToggle:function(){

				this.show = !this.show;

				if(this.show){
					animateShow(this.sum);
				}else{
					animateNo();
				}
				
			},
			postAll:function(){
				location.href ='/pos/pay.htm?hotelId='+opt.hotelId+'&pcCode='+opt.pcCode
			}
		},
		computed:{

			sum:function(){
				var sum = 0;
				for (var i = 0; i < this.shopCar.length; i++) {
					if(this.shopCar[i].number>0){
						sum+=1
					}
				};
				return sum;
			},
			priceSum:function(){
				var sum = 0 ;
				for (var i = 0; i < this.shopCar.length; i++) {
					sum += Number(this.shopCar[i].number)*Number(this.shopCar[i].pluPrice)
				};
				return sum;
			}
		}
	})

}
