//setTimeout() 与 setInterval() 的区别
//setTimeout() 方法只执行一次代码
//setInterval() 方法会不停地执行代码，直到 clearInterval() 被调用或窗口被关闭
//timeout 超时，interval 间隔
//setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。
//setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
setTimeout(() => {
	console.log("setTimeout");
}, 1000);
//约等于
let id = setInterval(() => {
	console.log("setInterval");
	clearInterval(id);
}, 1000);
