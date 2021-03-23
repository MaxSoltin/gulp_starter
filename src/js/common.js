$(function () {

	$('img.lazyload').lazyload();
	console.log(1);

	/* 	$('.owl-carousel').owlCarousel({
			items: 1,
			lazyLoad: true,
			mouseDrag: false,
			responsive: {
				460: {
					items: 2
				}
			}
		}); */


	/* 	$('.fancybox').fancybox({
			loop: false,
			buttons: [
				//"zoom",
				//"close"
			],
			animationEffect: "zoom",
			transitionEffect: "slide",
			transitionDuration: 366,
			clickSlide: 'close',
			clickContent: function (current, event) {
				return current.type === "image" ? "next" : false;
			},
			wheel: false,
		}); */


	/* $('.inputCard').mask("9999 9999 9999 9999",{placeholder:" "}); */

	// $(document).modalDialogs();
	// $(document).rippleWaves();


	$(".textfield__input").focus(function () {
		$(this).siblings('.textfield__label').addClass("textfield__label-active");
	});
	$(".textfield__input").focusout(function () {
		$(this).closest('.textfield').removeClass('invalid');
		if ($(this).attr("type") == 'tel' && $(this).val().replace(/\D+/g, '').length < 11) {
			$(this).siblings('.textfield__label').removeClass("textfield__label-active");
		}
		else if ($(this).val() == "") {
			$(this).siblings('.textfield__label').removeClass("textfield__label-active");
		}
	});

	$(".textfield__input").on('input', function () {
		if ($(this).val() != '') {
			$(this).siblings('.textfield__icon-clear').fadeIn(300).attr('tabindex', '0');
		}
		else {
			$(this).siblings('.textfield__icon-clear').fadeOut(0).attr('tabindex', '-1');
		}
	});

	$('.textfield__icon-clear').on('click', function (event) {
		event.preventDefault();
		$(this).fadeOut(0).attr('tabindex', '-1');
		$(this).siblings('.textfield__input').val('').focus();
	});


	$('.textfield__icon-passwordControl').on('click', function (event) {
		event.preventDefault();
		var input = $(this).siblings('.textfield__input');
		if (input.attr('type') == 'password') {
			$(this).removeClass('fa-eye').addClass('fa-eye-slash');
			input.attr('type', 'text').focus();
		}
		else {
			$(this).removeClass('fa-eye-slash').addClass('fa-eye');
			input.attr('type', 'password').focus();
		}

	});

	// $('.inputPhone').mask("+7 (999) 999-9999");

	// formsInput();

	function formsInput() {

		var siteName = 'localhost'; // имя сайта или приложения для проверки совпадения с паролем

		var validRules = { // правила валидации
			name: {
				minlength: 2, // минимальная длина имени
			},
			email: {// проверка email
				regEx: /^[^а-я]+@[^а-я]+\.[^а-я\._'+;*^&=?~{}\-\.\/,\\]+$/, // Не Кириллица неограниченной длинны + @+ Не Кириллица неограниченной длинны + в конце не должны быть спецсимволы
				example: 'example@mail.com'
			},
			password: {
				minlength: 10, // минимальная длина пароля
				repeats: /(?=(.))\1{3,}/g, // регулярка на случай повторения одного и того же символа несколько раз подряд
				easyPass: [siteName, '1234567890', '0123456789', 'qwertyuiop', 'password12', '9876543210', '0987654321', '123321123321', '18atcskd2w', '1q2w3e4r5t', '3rjs1la7qe', 'zxcvbnm,./', 'asdfghjkl;']
			},
		}
		var validMessages = { // сообщения при ошибке валидации
			empty: 'Обязательное поле*',
			nameLength: 'Минимальная длина 2 символа',
			email: 'Введите действительный email',
			password: {
				minlength: 'Минимальная длина пароля 10 символов',
				easyPass: 'Слишком простой пароль',
				repeats: 'Не используйте подряд один и тот же символ',
				coincidence_name: 'Пароль не должен совпадать с именем пользователя',
				coincidence_email: 'Пароль не должен совпадать с именем'
			}
		}

		var nameVal = ''; //создаём переменную, в которую будем сохранять имя, чтобы оно не совпадало с паролем

		$('.textfield__input').on('keydown', function (event) { //отслеживаем событие нажатия клавиши в тектовом поле

			$(this).closest('.textfield').removeClass('invalid'); //удаляем класс invalid для последующей проверки на валидность

			var textfield = $(this);
			var keyCode = event.keyCode;

			if (keyCode == 13) { // убеждаемся в том, что нажата клавиша enter

				event.preventDefault(); // отменяем стандарное поведение при нажатии этой клавиши

				var validis = validnost(textfield); // создаём переменную, в которую будем записывать результат валидации

				if (validis == true) { // если значение в поле валидно

					textfield.closest(".textfield").find('.textfield__errorText').text(''); //сбрасываем текст ошибки 
					textfield.closest('.textfield').removeClass('invalid'); //сбрасываем стили invalid 

					var fieldIndex = +textfield.attr("data-index") + 1; // создаём переменную, в которую помещаем индекс следующего поля
					var formID = textfield.closest(".form").attr("id"); // создаём переменную, в которую помещаем id формы

					var nextField = $('#' + formID + ' input[data-index="' + fieldIndex + '"]'); // создаем переменную в котором выбираем следующее полу для фокуса на нём

					if (nextField.length != 0) { // если следующее поле существует, фокусируемся на нём
						nextField.focus();
					}
					else { // // если следующее поле не существует, фокусируемся на кнопке отправки формы
						$('#' + formID).find('.form__submit').focus();
					}
				}
				else { // если значение поля не валидно добавляем стили и сообщаем об ошибке пользователю
					textfield.closest(".textfield").addClass('invalid'); 
					textfield.closest(".textfield").find('.textfield__errorText').text(validis);
				}
			}
		});


		$('input[name="name"]').change(function () { // при изменнии значения поля с именем, записываем значение в переменную
			nameVal = $(this).val();
		});


		function validnost(elem) { // функция проверки любого поля на валидность
			if (elem.attr('required')) { // если это обязательное поле
				var inputValue = elem.val(); // получаем значения этого поля
				var inputName = elem.attr('name'); // узнаём какое именно это поле
				if (inputName == 'name') { // если это поле с именем
					return validName(inputValue); // возвращаем результат работы функции проверки имени, с переданным в неё значением поля
				}
				else if (inputName == 'password') { // если поле с паролем
					return validPass(inputValue); // возвращаем результат работы функции проверки пароля, с переданным в неё значением поля
				}
				else if (inputName == 'email') { // если поле с email
					return validMail(inputValue); // возвращаем результат работы функции проверки email, с переданным в неё значением поля
				}
				else { // если это обычное обязательное поле
					if (inputValue == '') { // проверяем не пустоле ли поле
						return validMessages.empty; // и возвращаем ошибку если пустое
					}
					else {
						return true;
					}
				}
			}
			else {
				return true;
			}
		}

		function validName(inputValue) { // функция проверки имени
			if (inputValue == '') { // проверка на пустое поле
				return validMessages.empty; // если пустое возвращаем ошибку
			}
			else if (inputValue.length < validRules.name.minlength) { // проверка на длину
				return validMessages.nameLength; // если длина меньше необходимого возвращаем ошибку
			}
			else {
				return true
			}
		}

		function validMail(inputValue) { // функция проверки email
			console.log(validRules.email.regEx.test(inputValue));
			if(!validRules.email.regEx.test(inputValue)){
				return validMessages.email;
			}
			else{
				return true
			}
		}

		function validPass(inputValue) { // функция проверки пароля
			var res = validRules.password.easyPass.some(function (v) {
				return v == inputValue;
			});
			if (inputValue.length < validRules.password.minlength) {
				return validMessages.password.minlength;
			}
			else if (res) {
				return validMessages.password.easyPass;
			}
			else if (inputValue.match(validRules.password.repeats) != null) {
				return validMessages.password.repeats;
			}
			else if (nameVal != '') {
				if (inputValue == nameVal) {
					return validMessages.password.coincidence_email;
				}
				else {
					return true;
				}
			}
			else {
				return true;
			}
		}

	}


});