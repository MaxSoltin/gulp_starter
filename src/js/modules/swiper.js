import { Swiper, Navigation, Pagination, Mousewheel, EffectFade, Controller, A11y, Autoplay } from 'swiper'
Swiper.use([Mousewheel, Navigation, Pagination, EffectFade, Controller, A11y, Autoplay])

$(function () {
	const accessibilitySwiper = {
		firstSlideMessage: 'Это первый слайд',
		lastSlideMessage: 'Это последний слайд',
		prevSlideMessage: 'Предыдущий слайд',
		nextSlideMessage: 'Следующий слайд',
		paginationBulletMessage: 'Перейти к слайду номер {{index}}',
	}

	const simpleSlider = new Swiper('.simpleSlider', {
		speed: 2400,
		loop: true,
		autoplay: {
			delay: 5000,
		},
		navigation: {
			nextEl: '.simpleSlider__arrow-next',
			prevEl: '.simpleSlider__arrow-prev',
		},
		a11y: accessibilitySwiper,
	})
})

$(function () {
	const sliderText = new Swiper('.slider-text', {
		speed: 2400,
		loop: true,
		autoplay: {
			delay: 5000,
		},
	})

	const sliderImage = new Swiper('.slider-img', {
		speed: 2400,
		loop: true,
	})

	sliderText.controller.control = sliderImage
	sliderImage.controller.control = sliderText
})
