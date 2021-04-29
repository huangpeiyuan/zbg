<template>
	<view class="tabs">
		<view class="tabs_title">
			<view class="title_item" v-for="(label,index) in labelList" :key="index"   @click="sendMessageToFather">{{label.value}}</view>
		</view>
		<view class="tabs_content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:1
			};
		},
		props:["labelList"],
		methods:{
			sendMessageToFather(){
				// var index = e.currentTarget.dataset.index
				// console.log(index)
				this.$emit('sent',this.index)
				
			}
		}
	}
</script>

<style>
.tabs_title {
  display: flex;
}
.title_item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 35upx 0;
}
.active {
  color: #f10000;
  border-bottom: 5upx solid #f10000;
}
</style>
