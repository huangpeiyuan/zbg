<template>
	<view class="registercontent">
		<view class="has-mglr-10 ">
			<form @submit="formSubmit">
				<view class=" has-mgtb-10 ">
					<input type="number" placeholder="请输入手机号" class="is-input1 " name="input1" />
				</view>
				<view class=" has-mgtb-10 ">
					<input type="number" maxlength="4" placeholder="请输入验证码" class="is-input1 " />
					<view class="codeimg">获取验证码</view>
				</view>
				<view class=" registerbtn has-radius has-mgtb-20">
					<button form-type="submit">提交</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
</script>

<style>
	@import "../../static/css/simplepro.css";
	
	page {
		min-height: 100%;
		background-color: #FFFFFF;	
		overflow-y:hidden;
	}
	 
	.registercontent {
		
		width: 85%;
		margin: 0 auto;
	}
	 
	 
	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}
	.iconfont {
		position: absolute;
		font-size: 40rpx;
		right: 12%;
		z-index: 999;
		width: 105rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
	 
	.codeimg {
		position: absolute;
		font-size: 28rpx;
		right: 12%;
		z-index: 999;
		width: 200rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
	 
	.registerbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: rgba(231,50,40);
		opacity: 0.8;
	}
</style>
