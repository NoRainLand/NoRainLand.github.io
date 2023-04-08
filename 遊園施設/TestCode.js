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

//事件循环
//事件循环是指浏览器或 Node.js 等 JavaScript 运行环境的一种机制，它能够使得异步的代码像同步的代码一样运行。
//事件循环的工作原理是：首先执行同步代码，然后执行异步代码，然后再执行同步代码，再执行异步代码，如此循环往复。
//JS的运行机制就是事件循环!

//同步代码，调用栈执行后直接出栈
//异步代码，放到Web API中，等待时机，等合适的时候放入回调队列（callbackQueue），等到调用栈空时eventLoop开始工作，轮询

//微任务执行时机比宏任务要早
//微任务在DOM渲染前触发，宏任务在DOM渲染后触发
//微任务：Promise.then()、process.nextTick()、Object.observe()、MutationObserver
//宏任务：setTimeout()、setInterval()、setImmediate()、I/O、UI rendering
//微任务是由ES6语法规定的
//宏任务是由浏览器或Node.js规定的

//1,先清空call stack中的同步代码
//2,执行微任务队列中的微任务
//3,尝试DOM渲染
//4,触发Event Loop反复询问callbackQueue中是否有要执行的语句，有则放入call back继续执行

//进程就是程序的一次执行过程
//线程是进程的一个执行单元
//一个CPU核心只能执行一个线程，多个线程需要多个CPU核心

//PS：CPU性能指标中的线程是利用集成于CPU的程序将每个物理核心虚拟出一个核心，以此来提升单核性能（在Windows系统的设备管理器和任务管理器中会识别为两个核心）。
//可以简单地将一个线程的性能折算为单核性能的0.25。
//这样八核十六线程的CPU性能相当于采用同样单核的十核CPU（8+8×0.25），理论上要强于采用同样核心的八核八线程CPU

//一个进程中的多个线程共享进程的内存空间，但每个线程有自己的一块栈空间。
//但是某些内存只能一个线程使用，这时候就需要给这些内存加锁，保证同一时刻只有一个线程能访问这些内存。这个叫做互斥锁。
//有些内存可以多个线程使用，只是后可以给门口挂N把钥匙，线程带着钥匙进去，出来之后再把钥匙挂回去，其他线程发现钥匙架上没有钥匙了，就知道这个内存正在被使用，必须排队，这种做法叫做信号量。
//互斥锁是信号量N=1的特殊情况。但是互斥锁效率高。

//线程
//线程是进程的一个执行单元，是CPU调度和分派的基本单位，它是比进程更小的能独立运行的基本单位。
//并发就是指同一时间内，执行多个程序（线程算是一个进程的子程序）。
//线程是为了解决进程中的阻塞和并发的并发问题。

//同样地，协程是为了解决线程中的阻塞和并发的并发问题，不过这里执行的是“函数”，而不是程序。
//线程切换是由操作系统的时间片控制的，而协程是程序自己实现的。

function* gen() {
	let index = 0;
	while (true) {
		yield index++;
	}
}
let g = gen();
console.log(g.next().value); //0  //这里是第一次开始执行，然后遇到yield，就停止了，然后返回yield后面的值
console.log(g.next().value); //1	 //这里是第二次开始执行，从上一次暂停的地方继续，而不是从头开始
console.log(g.next().value); //2
//其实JS的协程就是一个生成器来实现的。
//协程本身是个函数，协程之间的切换本质是函数执行权的转移。

function* gen1(index) {
	yield index + 1;
	yield index + 2;
	yield index + 3;
}
function* gen2(index) {
	yield index;
	yield* gen1(index);
	yield index + 100;
}
let g2 = gen2(10);
console.log(g2.next().value); //10
console.log(g2.next().value); //11
console.log(g2.next().value); //12
console.log(g2.next().value); //13
console.log(g2.next().value); //110

//上面这里是协程直接的切换，这里可以看出，yield*的作用就是把一个生成器的执行权交给另一个生成器。这和普通的函数一样。

//Promise 本质是一个状态机，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。

function console2Second(num) {
	//返回一个Promise对象，模拟阻塞N秒
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(`${num}秒后输出`);
		}, num * 1000);
	});
}

function* gen3(num) {
	yield console2Second(num);
}

let g3 = gen3(2);

let value = g3.next().value; //这里的value是一个Promise对象

value.then((data) => {
	console.log(data);
	flag = false;
});

for (let i = 0; i < 10; i++) {
	console.log(i);
}
//简写一下
function console2Second2(num) {
	//返回一个Promise对象，模拟阻塞N秒
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(`${num}秒后输出`);
		}, num * 1000);
	});
}
console2Second2(2)
	.next()
	.value.then((data) => {
		console.log(data);
	});
//这里会引起一个问题，当多个异步的时候，会导致恶心的回调地狱

//async/await是ES7的语法，是对Promise的封装，使得异步代码看起来像同步代码一样。
//async 读： A sing  await 读： E wait
function console2Second3(num) {
	//返回一个Promise对象，模拟阻塞N秒
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(`${num}秒后输出`);
		}, num * 1000);
	});
}
async function test() {
	let value = await console2Second3(2);
	console.log(value); //这时候会等待异步执行完毕，然后再执行下面的代码
}

/**数组洗牌算法 */
function shuffle(arr) {
	let i = arr.length,
		t,
		j;
	while (--i) {
		j = Math.floor(Math.random() * i);
		t = arr[i];
		arr[i] = arr[j];
		arr[j] = t;
	}
}
