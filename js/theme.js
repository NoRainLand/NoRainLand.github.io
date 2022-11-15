(function () {
	"use strict";

	var Theme = {};

	Theme.backToTop = {
		register: function () {
			let $backToTop = $("#back_to_top");

			$(window).on("scroll", function () {
				if ($(window).scrollTop() > 100) {
					$backToTop.fadeIn(1000);
					$backToTop.style;
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

	this.Theme = Theme;
}.call(this));
