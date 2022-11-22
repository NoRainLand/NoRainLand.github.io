(function () {
	"use strict";

	var Theme = {};

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

	Theme.ranVerse = {
		register: function () {
			window.verse = JSON.parse(window.localStorage.getItem("verse"));
			if (!window.verse) {
				window.verse = [];
			}

			if (window.verse.length == 0) {
				$.get("/text/verse.text", function (data) {
					var lines = data.split("\n"); //按行读取
					$.each(lines, function (i, v) {
						if (!!v && v != "\r") {
							window.verse.push(v);
						}
					});
					window.localStorage.setItem("verse", JSON.stringify(window.verse));
					Theme.ranVerse.random();
				});
			} else {
				Theme.ranVerse.random();
			}
		},
		random: function () {
			$(".verse").text(
				window.verse[Math.floor(Math.random() * window.verse.length)]
			);
		},
	};

	Theme.showDate = {
		register: function () {
			if ($(".about")) {
				let hour = $(".hour");
				let tips = $(".tips");
				let min = $(".min");
				setInterval(() => {
					let now = new Date();

					if (now.getSeconds() % 2 == 0) {
						tips.addClass("tips1");
						tips.removeClass("tips2");
					} else {
						tips.addClass("tips2");
						tips.removeClass("tips1");
					}

					let numHour = now.getHours();
					numHour = numHour < 10 ? numHour + "0" : numHour;
					let numMin = now.getMinutes();
					numMin = numMin < 10 ? numMin + "0" : numMin;

					if (numMin == "39") {
						if(!min.hasClass("min2")){
							console.log("Miku Miku, you can call me Miku");
							min.addClass("min2");
							min.removeClass("min1");
						}
					} else {
						if (min.hasClass("min2")) {
							min.removeClass("min2");
							min.addClass("min1");
						}
					}
					hour.text(numHour);
					min.text(numMin);
				}, 1000);
			}
		},
	};

	this.Theme = Theme;
}.call(this));
