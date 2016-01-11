var $ = require('jquery');
var moment = require('moment');
var Vue = require('vue');
Vue.use(require('vue/vue-resource.js'));
var datepicker = require('bootstrap-datepicker');
module.exports = function(opt){
   $("#dateShowAll").datepicker({
        autoclose:true,
        language:'zh-CN',
        format:'yyyy/mm/dd',
        startDate:moment().add(3,'days').format('YYYY/MM/DD')
    })
	new Vue({
		el:opt.el,
        http: {
           headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        data:{
        	dates:[],
        	times:['早上','中午','晚上'],
            yingye:opt.yingye,
        	hoteTypes:opt.canzuo,
        	sexs:['先生','女士'],
        	active:{
        		dates:moment().format('YYYY/MM/DD'),
        		times:'早上',
        		hoteType:opt.canzuo.data[0],
        		number:2,
                name:"",
                mobile:"",
                remark:"",
        		sex:'先生',
                yy:opt.yingye.data[0]
        	}
        },
        computed: {
            isMore: function () {
               for (var i = 0; i < this.dates.length; i++) {

                   if( this.dates[i].time == this.active.dates){
                       return true;
                   }
               };
            }
        },
        methods:{
        	select:function(cname,obj){
        		this.active[cname] = obj
        	},
        	reduce:function(){
				if (this.active.number==1) {return};
				this.active.number = this.active.number-1;
			},
			add:function(dish){
				this.active.number = this.active.number+1;
			},
            postAll:function(){
                localStorage.ydInfo =  JSON.stringify(this.active);
                location.href = '/pos/diancai.htm?hotelId='+opt.hotelId+'&pcCode='+this.active.yy.code
            },
            dateShowAll:function(){
                var self = this; 
                $("#dateShowAll").datepicker('show')
                $("#dateShowAll").datepicker().on('changeDate', function(ev){
                    if (ev.date.valueOf()){  
                        self.active.dates = ev.format();
                        $(".morebox p").eq(0).html(ev.format('mm/dd'))
                    }
                })
            }
        },
        filters:{
        	sortDate:function(value){
        		return value.substring(value.indexOf('/')+1)
        		
        	}
        },
        ready: function() {
        
			var dateDt=['今天','明天','后天']
			for (var i = 0; i < 3; i++) {
				var date = moment().add(i, 'days').format('YYYY/MM/DD');
				date = {time:date,dateDt:dateDt[i]}
				this.dates.push(date)
			};

	    }
    });

	
}