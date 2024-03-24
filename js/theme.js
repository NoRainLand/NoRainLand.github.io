(function () {
	"use strict";

	var Theme = {};

	//回到顶部
	Theme.backToTop = {
		register: function () {
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
		},
	};

	//浮动tags以及header
	// Theme.floatTags = {
	// 	register: function () {
	// 		let $tags = $("#list_tags")[0];
	// 		// let $header = $("#header")[0];
	// 		if ($tags) {
	// 			let sTop = 0;
	// 			$(window).on("scroll", function () {
	// 				sTop = $(window).scrollTop();
	// 				// console.log($tags.offsetTop, sTop);
	// 				// $tags.style.top = sTop + "px";
	// 				// $header.style.top = sTop + "px";
	// 			});
	// 		}
	// 	},
	// };
	//修改全局日期
	Theme.getDate = {
		register: function () {
			$(".post_time").each(function (index, item) {
				let time = $(this).text();
				let chinaDateArray = new Date(time.replace(/-/g, "/"))
					.toDateString()
					.split(" ");
				let newTime = `${chinaDateArray[1]} ${chinaDateArray[2]} ${chinaDateArray[3]}`;
				$(this).text(newTime);
			});
		},
	};

	Theme.getArchiveDate = {
		register: function () {
			$(".archive_time").each(function (index, item) {
				let time = $(this).text();
				let chinaDateArray = new Date(time.replace(/-/g, "/"))
					.toDateString()
					.split(" ");
				let newTime = `${chinaDateArray[1]} ${chinaDateArray[2]}`;
				$(this).text(newTime);
			});
		},
	};
	/**添加黑幕title */
	Theme.addHeimuTitle = {
		register: function () {
			$(".heimu").attr("title","你知道太多啦~");
		},
	};

	/**随机诗句 */
	Theme.ranVerse = {
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
				if (
					window.verseVersion == null ||
					window.verseVersion < data.verseVersion
				) {
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
		random: function () {
			$(".verse").text(
				window.verse[Math.floor(Math.random() * window.verse.length)]
			);
		},
	};

	this.Theme = Theme;
}.call(this));
