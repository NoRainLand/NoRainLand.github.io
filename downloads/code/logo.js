<html><head></head><body>var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d"); //2d用单引用括起来

//获取图像的数据URL
var imgURL = canvas.toDataURL("image/png"); //默认图片格式为png，也可以自定义设置格式。

//显示图片
var image = document.createElement("img"); //添加一个img元素

image.src = imgURL; //将获取的图像的URL赋值给src属性
document.body.appendChild(image); //将元素添加到页面中

context.lineWidth = 12;

context.strokeRect(128, 128, 256, 256); //用指定的颜色填充矩

let mix = 100;
let topp = 240;

let start = 5.3;
let end = 1.4;

context.beginPath();
context.arc(256 - mix, topp, 120, start, 2 * Math.PI + end, false);
context.strokeStyle = "black";
context.stroke();

context.beginPath();
context.arc(256 + mix, topp, 120, Math.PI - end, 3 * Math.PI - start, false);
context.strokeStyle = "black";
context.stroke();

context.beginPath();
context.moveTo(256, 308); //画线的起点
context.lineTo(256, 374); //终点
context.closePath();
context.strokeStyle = "black";
context.stroke();

context.beginPath();
context.moveTo(210, 230); //画线的起点
context.lineTo(302, 230); //终点
context.closePath();
context.strokeStyle = "black";
context.stroke();

let foot1 = 4.4;
context.beginPath();
context.arc(256, 90, 120, Math.PI + foot1, 2 * Math.PI - foot1, false);
context.strokeStyle = "black";
context.stroke();

let foot3 = 0.8;
context.beginPath();
context.arc(256, 330, 80, Math.PI + foot3, 2 * Math.PI - foot3, false);
context.strokeStyle = "black";
context.stroke();

</body></html>