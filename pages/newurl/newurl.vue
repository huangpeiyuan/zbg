<template>
	<view>
		<web-view :src="url" :progress="false">
		 </web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		methods: {
			
		},onLoad(val) {
			
			this.url = decodeURIComponent(val.url)
		}
		
	}
</script>

<style>

</style>
