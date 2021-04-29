
<template>
	<view class="vf">
		<view class="header">
		    <span class="tc">{{announcementName}}</span>
		    <p class="pubTime">
		        <span>{{address}} &nbsp; &nbsp;{{time}}</span>
				<span class="displayArti" @click="gy()">【详情点击】</span>
			</p>
		</view>
		<view class="content">
					    <p class="ti">一、项目基本情况</p>
					<p>（1）项目名称：{{projectName}}</p>
					<p>（3）采购单位：{{purchasingUnit}}</p>
					<p>（4）行政区域：{{administrative}}</p>
					<p>（6）招标文件售价：{{documentPrice}}</p>
					<p>（7）开标时间：{{announcementTime}}</p>
					<p>（8）开标地点：{{placeTender}}</p>
					<p>（9）预算金额：{{budgetAmount}}</p>
					
					    <p class="ti">二、联系人及联系方式：</p>
					<p>（1）项目联系人：{{contactPerson}}</p>
					<p>（2）项目联系电话：{{contactNumber}}</p>
					<p>（3）采购单位：{{purchasingUnit}}</p>
					<p>（4）采购单位地址：{{unitAddress}}</p>
					<p>（5）采购单位联系方式：{{unitContact}}</p>
					<p>（6）代理机构名称：{{nameOfAgent}}</p>
					<p>（7）代理机构地址：{{agencyAddress}}</p>
					<p>（8）代理机构联系方式：{{agentContact}}</p>
		</view>
		<view class="share_box">
			<view class="zi">
				<span>如此有用的信息<br/>快<span class="share">分享</span>给有需要的朋友吧！</span>
			</view>
			<button class="share_friends" open-type='share'>分享好友</button>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {	
				announcementName:"",
				address:"",
				time:"",
				projectName:"",
				purchasingUnit:"",
				administrative:"",
				documentPrice:"",
				announcementTime:"",
				placeTender:"",
				budgetAmount:"",
				contactPerson:"",
				contactNumber:"",
				purchasingUnit:"",
				unitAddress:"",
				unitContact:"",
				nameOfAgent:"",
				agencyAddress:"",
				agentContact:"",
				gxxText:""			
			}
		},
		onShareAppMessage(res) {
		    return {
		      title: '招标信息',
		    }
		  },
		onLoad(options) {
			this.announcementName = options.a;
			this.address = options.b;
			this.time = options.c;
			this.projectName = options.d;
			this.purchasingUnit = options.e;
			this.administrative = options.f;
			this.documentPrice = options.g;
			this.announcementTime = options.h;
			this.placeTender = options.i;
			this.budgetAmount = options.j;
			this.contactPerson = options.k,
			this.contactNumber = options.l,
			this.purchasingUnit = options.m,
			this.unitAddress = options.n,
			this.unitContact = options.o,
			this.nameOfAgent = options.p,
			this.agencyAddress = options.q,
			this.agentContact = options.r,
			this.gxxText = options.s
					
		},
		methods: {
			gy(){
				uni.navigateTo({
					url:"../notice/total?text="+this.gxxText+"&announcementName="+this.announcementName+"&address="+this.address+"&announcementTime="+this.announcementTime
				})
			}
						
		}
		
	}
</script>
<style>
		.vf{
			margin:7rpx 7rpx auto;
		}
		.header{
			text-align: center;
		}
	    .tc{
			font-size:40rpx;
	        line-height: 50rpx;
	        font-weight: bolder;
	        color: #383940;
	    }
	    .pubTime{
			margin-top: 40rpx;
			color: #707070;
	        font-size: 30rpx;	
	    }
		.content{
				font-size:30rpx;
				margin:45rpx 38rpx;
				line-height: 65rpx;
		}
		.ti{
			margin-left:-18rpx;
			font-size:36rpx;
			font-weight: bolder;
		}
		.displayArti{
			margin-left: 25rpx;
			font-size: 26rpx;
			color: #fff;
			background: #a00000;
		}
		.share_box{
			height: 270rpx;
			width: 100%;
			background-color: rgb(241,248,252);
			text-align: center;
		}
		.zi{
			font-size: 33rpx;
			padding-top: 30rpx;
			letter-spacing:2rpx;
			line-height: 55rpx;
		}
		.share{
			color: #007AFF;
		}
		.share_friends{
			width:42%;
			background-color: #007AFF;
			color:#F7F7F7;
			font-size: 33rpx;
			margin-top: 20rpx;
		}
</style>
