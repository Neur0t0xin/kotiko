// Burger-menu
const menuIcon = document.querySelector(".burger-menu");
const menuContainer = document.querySelector(".navigation-header__body");
const darkOverlay = document.querySelector(".dark-overlay");
const menuButton = document.querySelectorAll('.button-menu');
const anchors = document.querySelectorAll('a[href*="#"]');

if (menuIcon) {
	menuIcon.addEventListener('click', (e) => {
		toggleMenu()
	});
};

function toggleMenu() {
	menuButton.forEach(el => { el.classList.toggle('active') });
	document.body.classList.toggle('lock');
	menuIcon.classList.toggle("active");
	menuContainer.classList.toggle("active");
	darkOverlay.classList.toggle("active");
}

menuContainer.addEventListener('click', (e) => {
	if (e.target.tagName === 'A') {
		menuButton.forEach(el => { el.classList.remove('active') });
		document.body.classList.remove('lock');
		menuIcon.classList.remove("active");
		menuContainer.classList.remove("active");
		darkOverlay.classList.remove("active");
	}
});

for (let anchor of anchors) {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();

		const blockID = anchor.getAttribute('href').substr(1)
		const block = document.getElementById(blockID);

		if (block) {
			window.scrollTo({
				top: block.offsetTop,
				behavior: 'smooth'
			});
		}
	});
}

// Sliders Swiper
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
	speed: 500,
	startedSlides: true,
	breakpoints: {
		270: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		575: {
			slidesPerView: 1,
			spaceBetween: 0,
		}
	}

});
const gallerySwiperTracks = new Swiper('.gallery__swiper.gallery-swiper__tracks', {
	loop: true,
	slidesPerView: 2,
	spaceBetween: 30,
	initialSlide: 1,
	allowTouchMove: false,
});

gallerySwiperMain.on('slideChange', function () {
	gallerySwiperTracks.slideToLoop(gallerySwiperMain.realIndex + 1, 500)
});

// DatePicker
const start = datepicker('.date-arrival', {
	id: 'datepicker',
	startDay: 1,
	disableYearOverlay: true,
	formatter: (input, date, instance) => {
		input.value = date.toLocaleString('ru', options)
	},
});
const end = datepicker('.date-departure', {
	id: 'datepicker',
	startDay: 1,
	disableYearOverlay: true,
	formatter: (input, date, instance) => {
		input.value = date.toLocaleString('ru', options)
	},
});

let options = { year: 'numeric', month: 'long', day: 'numeric' };

// Button Show-more
window.onload = function () {
	let itemsCamera = document.getElementsByClassName('camera-item');
	let btnShowMore = document.getElementById('button__show-more');
	let showItems = 9;
	if (window.innerWidth < 767) {
		for (let i = showItems; i < itemsCamera.length; i++) {
			itemsCamera[i].style.display = "none";
		}

		btnShowMore.addEventListener("click", () => {
			showItems += 9;
			console.log(showItems);
			if (showItems <= itemsCamera.length) {
				for (let i = 0; i < showItems; i++) {
					itemsCamera[i].style.display = "block";
					console.log('+');
				}
			} else {
				for (let i = 0; i < itemsCamera.length; i++) {
					itemsCamera[i].style.display = "block";
					console.log('-');
				}
				btnShowMore.style.display = "none";
			}
		});
	} else {
		btnShowMore.style.display = "none";
	}
}
// Spoilers
const spoilersArray = document.querySelectorAll('[data-spoilers]');
if (spoilersArray.length > 0) {
	const spoilersRegular = Array.from(spoilersArray).filter(item => {
		return !item.dataset.spoilers.split(',')[0];
	});
	if (spoilersRegular.length > 0) {
		initSpoilers(spoilersRegular);
	}

	const spoilersMedia = Array.from(spoilersArray).filter(item => {
		return item.dataset.spoilers.split(',')[0]
	});
	if (spoilersMedia.length > 0) {
		const breakpointsArray = [];
		spoilersMedia.forEach(item => {
			const params = item.dataset.spoilers;
			const paramsArray = params.split(',');
			const breakpoint = {};
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		const mediaQueries = breakpointsArray.map(item => {
			return '(' + item.type + '-width:' + item.value + 'px)' + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter((item, index, self) => {
			return self.indexOf(item) === index;
		});

		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(',');
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);
			const spoilersArray = breakpointsArray.filter(item => {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			matchMedia.addEventListener('change', () => {
				initSpoilers(spoilersArray, matchMedia);
			});
			initSpoilers(spoilersArray, matchMedia);
		});
	}

	function initSpoilers(spoilersArray, matchMedia = false) {
		spoilersArray.forEach(spoilersBlock => {
			spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
			if (matchMedia.matches || !matchMedia) {
				spoilersBlock.classList.add('_init');
				initSpoilersBody(spoilersBlock);
				spoilersBlock.addEventListener('click', setSpoilerAction);
			} else {
				spoilersBlock.classList.remove('_init');
				initSpoilersBody(spoilersBlock, false);
				spoilersBlock.removeEventListener('click', setSpoilerAction);
			}
		});
	}

	function initSpoilersBody(spoilersBlock, hideSpoilerBody = true) {
		const spoilersTitle = spoilersBlock.querySelectorAll('[data-spoiler]');
		if (spoilersTitle.length > 0) {
			spoilersTitle.forEach(spoilersTitle => {
				if (hideSpoilerBody) {
					spoilersTitle.removeAttribute('tabindex');
					if (!spoilersTitle.classList.contains('_active')) {
						spoilersTitle.nextElementSibling.hidden = true;
					}
				} else {
					spoilersTitle.setAttribute('tabindex', '-1');
					spoilersTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	function setSpoilerAction(e) {
		const el = e.target;
		if (el.hasAttribute('[data-spoiler]') || el.closest('[data-spoiler]')) {
			const spoilerTitle = el.hasAttribute('[data-spoiler]') ? el : el.closest('[data-spoiler]');
			const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
			const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;
			if (!spoilersBlock.querySelectorAll('._slide').length) {
				if (oneSpoiler && !spoilerTitle.classList.contains('_active')) {
					hideSpoilersBody(spoilersBlock);
				}
				spoilerTitle.classList.toggle('_active');
				_slideToggle(spoilerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}

	function hideSpoilersBody(spoilersBlock) {
		const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');
		if (spoilerActiveTitle) {
			spoilerActiveTitle.classList.remove('_active');
			_slideUp(spoilerActiveTitle.nextElementSibling, 500)
		}
	}

	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}


	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';


			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}


	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}

}
// Button Copy-link
const button = document.getElementById("button__copy-link");
const addressMaps = "https://goo.gl/maps/CgxZXn7hoyButJWPA";
const copyFieldFirst = document.createElement("textarea");
copyFieldFirst.style.display = "none";
copyFieldFirst.classList.add("copyFieldFirst");
copyFieldFirst.value = addressMaps;
document.body.appendChild(copyFieldFirst);

button.addEventListener("click", () => {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(copyFieldFirst.value).then(() => {
			alert("Адрес для навигатора успешно скопирован!");
			console.log('Используется clipboardAPI');
		});
	} else {
		copyToClipboard(copyFieldFirst.value);
		alert("Адрес для навигатора успешно скопирован!");
		console.log('Используется execCommand');
	}
});

function copyToClipboard(text) {
	const copyFieldSecond = document.createElement('textarea');
	copyFieldSecond.style.display = "none";
	copyFieldSecond.value = text;
	document.body.appendChild(copyFieldSecond);
	copyFieldSecond.select();
	document.execCommand('copy');
	document.body.removeChild(copyFieldSecond);
}

// Форма валидация


