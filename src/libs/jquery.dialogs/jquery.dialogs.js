(function ($) {

  $.fn.modalDialogs = function () {

		var modalOpen = false;

		$('.modal *').attr('tabindex', '-1').attr('aria-hidden', 'true').addClass('notblur');
		$('*').on('focus', function (event) {
			if ($(event.target).closest('.modal *').length === 0 && modalOpen != false) {
				$('.modal__close').focus();
			}
		});

		$('.popup').on('click', function () {
			event.preventDefault();
			modalDialogOpen(this.getAttribute('href'));
		});


		$('.modal').on('click', function () {
			if ($(event.target).closest(".modal__wrapper").length === 0) {
				modalDialogClose();
			}
		});

		$('.modal__close').on('click', function () {
			event.preventDefault();
			modalDialogClose();
		});

		function handleKeyDown(event) {
			const keyCode = event.keyCode || event.which;
			if (keyCode === 27 && modalOpen != false) {
				modalDialogClose();
				event.preventDefault();
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		function modalDialogOpen(idModal){
			$('html').css({'margin-right': '17px', 'overflow': 'hidden'});
			$(idModal).removeClass('vidden')
								.addClass('modalOverlay')
								.addClass('notblur')
								.find('*')
								.removeAttr('tabindex')
								.removeAttr('aria-hidden');
			$(idModal + ' .modal__wrapper').addClass('modalEffect');
			$('body').addClass('bodyBlur bodyHidden').attr('aria-hidden', 'true');
			$('.modal__tab').focus();
			modalOpen = true;
		}

		function modalDialogClose(){
			$('html').css({'margin-right': '0', 'overflow': 'auto'});
			$('.modal__wrapper').removeClass('modalEffect');
			$('.modal').removeClass('modalOverlay');
			$('body').removeClass('bodyBlur bodyHidden')
							 .removeAttr('aria-hidden');
			$('.modal *').attr('tabindex', '-1');
			setTimeout(function () {
				$('.modal').addClass('vidden');
			}, 300);
			modalOpen = false;
		}
  }

})(jQuery);