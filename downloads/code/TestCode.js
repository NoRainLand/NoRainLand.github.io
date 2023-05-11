<html><head></head><body>/*
 * @Author: NoRain
 * @Date: 2022-11-13 11:40:29
 * @Last Modified by: NoRain
 * @Last Modified time: 2022-11-13 11:53:41
 */
class TestCode {
	index = 0;
	init() {
		console.log("hello world");
	}
	open() {
		this.index++;
		console.log(`open第${this.index}次`);
	}
	close() {}
}
</body></html>