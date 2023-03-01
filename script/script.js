const menuIcon = document.querySelector(".burger-menu");
if (menuIcon) {
	const menuBody = document.querySelector(".navigation-header__body");
	menuIcon.addEventListener('click', function (e) {
		document.body.classList.toggle('lock');
		menuIcon.classList.toggle("active");
		menuBody.classList.toggle("active");
	});
}

const swiperRoom = new Swiper('.room__swiper', {
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next.room__arrow-next',
		prevEl: '.swiper-button-prev.room__arrow-prev',
	},
});

const gallerySwiperMain = new Swiper('.gallery__swiper.gallery-swiper__main', {
	loop: true,
	navigation: {
		prevEl: '.swiper-button-next.gallery__arrow',
		nextEl: '.swiper-button-prev.gallery__arrow',


	},
	pagination: {
		el: '.gallery__pagination',
		type: 'fraction',
	},
	keyboard: {
		enabled: true,
		onlyInViewport: true,
		pageUpDown: true,
	},
	slidesPerView: 1,
	breakpoints: {
		270: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		575: {
			slidesPerView: 1,
		}
	}

})
const gallerySwiperTracks = new Swiper('.gallery__swiper.gallery-swiper__tracks', {
	loop: true,
	slidesPerView: 2,
	spaceBetween: 30,
	initialSlide: 1,
	allowTouchMove: false,
})

gallerySwiperMain.on('slideChange', function () {
	gallerySwiperTracks.slideToLoop(gallerySwiperMain.realIndex + 1, 200)
});

