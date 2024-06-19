(function () {
	"use strict";

	var Theme = {};

	//回到顶部
	Theme.backToTop = () => {
		let $backToTop = $("#back_to_top");
		$(window).on("scroll", function () {
			if ($(window).scrollTop() > 100) {
				$backToTop.fadeIn(1000);
			} else {
				$backToTop.fadeOut(1000);
			}
		});

		$backToTop.on("click", function () {
			$("body,html").animate({ scrollTop: 0 });
		});
	};

	//修改全局日期
	Theme.getDate = () => {
		$(".post_time").each(function (index, item) {
			let time = $(this).text();
			let chinaDateArray = new Date(time.replace(/-/g, "/")).toDateString().split(" ");
			let newTime = `${chinaDateArray[1]} ${chinaDateArray[2]} ${chinaDateArray[3]}`;
			$(this).text(newTime);
		});
	};

	Theme.getArchiveDate = () => {
		$(".archive_time").each(function (index, item) {
			let time = $(this).text();
			let chinaDateArray = new Date(time.replace(/-/g, "/")).toDateString().split(" ");
			let newTime = `${chinaDateArray[1]} ${chinaDateArray[2]}`;
			$(this).text(newTime);
		});
	};
	/**添加黑幕title */
	Theme.addHeimuTitle = () => {
		$(".heimu").attr("title", "你知道太多啦~");
	};

	/**随机诗句 */
	Theme.ranVerse = {
		//注册
		register: function () {
			window.verseDate = Number(window.localStorage.getItem("verseDate"));
			//检查时间戳
			let now = Date.parse(new Date());
			if (window.verseDate == 0 || now - window.verseDate > 86400000) {
				Theme.ranVerse.loadVersion();
			} else {
				window.verse = JSON.parse(window.localStorage.getItem("verse"));
				if (!window.verse || window.verse.length == 0) {
					Theme.ranVerse.loadVerse();
				} else {
					Theme.ranVerse.random();
				}
			}
		},

		//尝试更新版本
		loadVersion: function () {
			$.get("/text/VerseVersion.json", function (data) {
				window.verseDate = Date.parse(new Date());
				window.localStorage.setItem("verseDate", window.verseDate);
				window.verseUrl = data.verseUrl;
				window.localStorage.setItem("verseUrl", window.verseUrl);
				window.verseVersion = window.localStorage.getItem("verseVersion");
				if (window.verseVersion == null || window.verseVersion < data.verseVersion) {
					window.verseVersion = data.verseVersion;
					window.localStorage.setItem("verseVersion", window.verseVersion);
					Theme.ranVerse.loadVerse();
				} else {
					//懒得检查了.--- 还是检查以下吧.
					window.verse = JSON.parse(window.localStorage.getItem("verse"));
					if (!window.verse || window.verse.length == 0) {
						Theme.ranVerse.loadVerse();
					} else {
						Theme.ranVerse.random();
					}
				}
			});
		},
		//尝试更新诗句
		loadVerse: function () {
			window.verseUrl = window.localStorage.getItem("verseUrl");
			if (!window.verseUrl) {
				Theme.ranVerse.loadVersion();
			} else {
				window.verse = [];
				$.get(window.verseUrl, function (data) {
					var lines = data.split("\n"); //按行读取
					$.each(lines, function (i, v) {
						if (!!v && v != "\r") {
							window.verse.push(v);
						}
					});
					window.localStorage.setItem("verse", JSON.stringify(window.verse));
					Theme.ranVerse.random();
				});
			}
		},
		//随机诗句
		random: function () {
			$(".verse").text(window.verse[Math.floor(Math.random() * window.verse.length)]);
		},
	};

	/**展示图片的Alt信息 */
	Theme.showImgAlt = () => {
		$(document).ready(function () {
			$("p img").each(function () {
				var altText = $(this).attr("alt");
				if (altText) {
					$("<p>").addClass("imgAlt").text(altText).appendTo($(this).parent());
				}
			});
		});
	};

	Theme.getEllipsisText = (element) => {
		let style = window.getComputedStyle(element);
		let maxWidth = parseFloat(style.maxWidth);
		let text = $(element).text();
		let ellipsisText = text;

		let testElement = window.testElement || (window.testElement = document.createElement("div"));

		testElement.style.fontFamily = style.fontFamily;
		testElement.style.fontSize = style.fontSize;
		testElement.style.fontWeight = style.fontWeight;
		testElement.style.fontStyle = style.fontStyle;
		testElement.style.maxWidth = style.maxWidth;
		testElement.style.whiteSpace = "nowrap";

		document.body.appendChild(testElement);

		$(testElement).text(text);
		if (testElement.scrollWidth <= maxWidth) {
			ellipsisText = text;
		} else {
			for (let i = text.length; i > 0; i--) {
				let testText = text.substring(0, i) + "...";
				$(testElement).text(testText);
				if (testElement.scrollWidth <= maxWidth) {
					ellipsisText = text.substring(0, i - 2) + "...";
					break;
				}
			}
		}

		document.body.removeChild(testElement);
		return ellipsisText;
	};

	Theme.changePager = () => {
		$(".page_prev").ready(function () {
			$(".page_prev").each(function (index, item) {
				let ellipsisText = Theme.getEllipsisText(item);
				$(item).text("< " + ellipsisText);
			});
		});
		$(".page_next").ready(function () {
			$(".page_next").each(function (index, item) {
				let ellipsisText = Theme.getEllipsisText(item);
				$(item).text(ellipsisText + " >");
			});
		});
	};

	window.Theme = Theme;
})();
