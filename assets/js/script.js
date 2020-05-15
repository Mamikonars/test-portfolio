(function () {

	var body = document.querySelector('body');

	//прелоадер >>>>>>>>>>>>>>>>>>>>>>*/
	var preloader = document.querySelector('.loader');
	//body.classList.add('overflow');
	window.onload = function () {
		window.setTimeout(function () {
			preloader.classList.add('disable');
			//document.body.classList.remove('overflow');
			preloader.remove();
		}, 800);
	}

	/* Slider >>>>>>>>>>>>>>>>>>>*/
	var rightArrow = document.getElementById('right-arrow');
	var leftArrow = document.getElementById('left-arrow');
	var slides = document.getElementsByClassName('review-item');
	var activeSlide = document.querySelector('.review-item.active')



	function changeSlideRight() {
		//activeSlide.classList.remove('active');
		for (var i = 0; i < slides.length; i++) {
			if (slides[i].classList.contains('active')) {
				slides[i].classList.remove('active');
				if (i < slides.length - 1)
					slides[++i].classList.add('active');
				else
					slides[0].classList.add('active');
				return;
			}
		}
	}

	function changeSlideLeft() {
		//activeSlide.classList.remove('active');
		for (var i = slides.length - 1; i >= 0; i--) {
			if (slides[i].classList.contains('active')) {
				slides[i].classList.remove('active');
				if (i > 0)
					slides[--i].classList.add('active');
				else
					slides[slides.length - 1].classList.add('active');
				return;
			}
		}
	}

	rightArrow.addEventListener('click', function () {
		changeSlideRight()
	})


	leftArrow.addEventListener('click', function () {
		changeSlideLeft()
	})

	/* Slider />>>>>>>>>>>>>>>>>>>*/

	/* carousel >>>>>>>>>>>>>>>>>>>*/
	var root = document.documentElement;
	var carouselElementsDisplayed = getComputedStyle(root).getPropertyValue("--carousel-elements-displayed");
	var carouselContent = document.querySelector("ul.carousel-content");

	root.style.setProperty("--carousel-elements", carouselContent.children.length);

	for (var i = 0; i < carouselElementsDisplayed; i++) {
		carouselContent.appendChild(carouselContent.children[i].cloneNode(true));
	}

	/* carousel />>>>>>>>>>>>>>>>>>>*/

	//load-more >>>>>>>>>>>>>>>>>>>>>>*/
	var loadMore = document.querySelector("#load-more");
	var hiddenWorks = document.querySelectorAll(".portfolio-hidden");
	var catalogBlock = document.querySelector('.portfolio-content');

	loadMore.addEventListener('click', loadContent);

	function loadContent() {
		loadMore.style.display = 'none';
		for (var i = 0; i < hiddenWorks.length; i++) {
			catalogBlock.appendChild(hiddenWorks[i]);
		}
	}

	//load-more />>>>>>>>>>>>>>>>>>>>>>*/

	/* filter >>>>>>>>>>>>>>>>>>>>>>*/

	var closestsElementClass = function (elem, className) {
		var node = elem;
		while (node) {
			if (node.classList.contains(className)) {
				return node; //класс есть — значит его и возвращаем, прекращая функцию
			}
			node = node.parentElement;
		}
		return null;
	}

	var catalog = document.querySelector('.portfolio-content');
	//блок с табами
	var catalogNav = document.querySelector('.portfolio-filter');

	var catalogItems = document.querySelectorAll('.portfolio-content__item');

	//Очистка блока с элементами, чтобы при фильрации добавлялись новые в чиситый блок
	function removeChildren(item) {
		while (item.firstChild) {
			item.removeChild(item.firstChild)
		}
	}

	//обновляем элементы в каталоге | item это блок каталога
	function updateChildren(item, children) {
		removeChildren(item);
		for (var i = 0; i < children.length; i++) {
			item.appendChild(children[i]);
		}
	}

	catalogNav.addEventListener('click', function (e) {

		var target = e.target;
		var item = closestsElementClass(target, 'portfolio-filter__link');
		if (item === null || item.classList.contains('is-active')) {
			return;
		}
		loadContent();

		e.preventDefault();
		//Получаем значение из атрибута data-filter="" 
		var filterValue = item.getAttribute('data-filter');
		var previousActiveBtn = document.querySelector('.portfolio-filter__link.is-active');
		previousActiveBtn.classList.remove('is-active');
		item.classList.add('is-active');

		//Если выбраны ВСЕ, то просто их всех выводим
		if (filterValue === 'all') {
			updateChildren(catalog, catalogItems);
			return;
		}

		//Отфильтрованные элементы перемещаем в массив
		var filteredItems = [];
		for (var i = 0; i < catalogItems.length; i++) {
			var currentItem = catalogItems[i];
			if (currentItem.getAttribute('data-category') === filterValue) {
				filteredItems.push(currentItem);
			}
		}
		updateChildren(catalog, filteredItems);

	});

	/* filter />>>>>>>>>>>>>>>>>>>>>>*/

	/* переход по якорям />>>>>>>>>>>>>>>>>>>>>>*/
	var smoothScroll = function (targetEl, duration) {
		var headerElHeight = document.querySelector('#header').clientHeight; // класс хедера
		var target = document.querySelector(targetEl);
		var targetPosition = target.getBoundingClientRect().top; //- headerElHeight; //вычитаем размер хедера, если он фиксированный
		var startPosition = window.pageYOffset;
		var startTime = null;

		var ease = function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t + b;
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		};

		var animation = function (currentTime) {
			if (startTime === null) startTime = currentTime;
			var timeElapsed = currentTime - startTime;
			var run = ease(timeElapsed, startPosition, targetPosition, duration);
			window.scrollTo(0, run);
			if (timeElapsed < duration) requestAnimationFrame(animation);
		};
		requestAnimationFrame(animation);
	};

	var scrollTo = function () {
		var headerNav = document.querySelector('.navigation');
		//var links = document.querySelectorAll('.js-scroll'); //добавляем классы к линкам
		var links = document.querySelectorAll('.nav-link'); //добавляем классы к линкам

		links.forEach(each => {
			each.addEventListener('click', function () {
				var currentTarget = this.getAttribute('href');
				smoothScroll(currentTarget, 1000);
				//выход из мобильного меню
				headerNav.classList.remove('active');
				document.querySelector("#burger").classList.remove('hamburger_active');
				//body.classList.toggle('overflow')
				if (body.classList.contains('overflow'))
					body.classList.remove('overflow')
			});
		});
	};
	scrollTo();

	/* переход по якорям />>>>>>>>>>>>>>>>>>>>>>*/

	/* мобильное меню >>>>>>>>>>>>>>>>>>>>>>*/
	var burger = document.querySelector("#burger");
	var navigation = document.querySelector(".navigation");

	var contactBtn = document.querySelector(".hire--btn");
	burger.addEventListener('click', function () {
		body.classList.toggle('overflow')
		navigation.classList.toggle('active');
		burger.classList.toggle('hamburger_active');
	})

	contactBtn.addEventListener('click', function () {
		navigation.classList.toggle('active');
		burger.classList.toggle('hamburger_active');
		//body.classList.toggle('overflow')
		if (body.classList.contains('overflow'))
			body.classList.remove('overflow')
	})
	/* мобильное меню />>>>>>>>>>>>>>>>>>>>>>*/

	//filter >>>>>>>>>>>>>>>>>>>>>>*/
	var filter = document.querySelector("#filter");
	var filterBlock = document.querySelector(".portfolio-filter");
	filter.addEventListener('click', function () {
		filterBlock.classList.toggle('open');
	})
	//filter />>>>>>>>>>>>>>>>>>>>>>*/

	//popup  >>>>>>>>>>>>>>>>>>>>>>*/

	//Функция для поиска атрибута по вложенным тегам
	var closestsElementAttr = function (elem, attr) {
		var node = elem;
		/*/	если клик по дочернему элементу, то возвращаем
		*	атрибут родителя, перескакивая вверх через ноду по циклу
		/*/
		while (node) {
			var attribute = node.getAttribute(attr);
			if (attribute) {
				return attribute; //атрибут есть — значит его и возвращаем, прекращая функцию
			}
			/*/ если атрибут пуст, то вместо текущего елемента берется его родительский
			*	и так по циклу до тех пор, пока у конечного родителя не найдется атрибут, 
			*   иначе return null
			/*/
			node = node.parentElement;
		}
		//возврат null если нет нашего атрибута ни у элемента, ни у его дочерних узлов
		return null;
	}

	//Поиск ближайшего элемента по классу
	var closestsElementClass = function (elem, className) {
		var node = elem;
		/*/	если клик по дочернему элементу, то возвращаем
		*	класс родителя, перескакивая вверх через ноду по циклу
		/*/
		while (node) {
			/*/ если текущий элемент содержит тот класс, который мы ему передали,
			*	при вызове функции, то просто возвращаем этот элемент, 
			/*/
			if (node.classList.contains(className)) {
				return node; //класс есть — значит его и возвращаем, прекращая функцию
			}
			/*/ если класса нет, то вместо текущего елемента берется его родительский
			*	и так по циклу до тех пор, пока у конечного родителя не найдется класс, 
			*   который мы передали, иначе return null
			/*/
			node = node.parentElement;
		}
		//возврат null если нет нашего класса ни у элемента, ни у его дочерних узлов
		return null;
	}

	//Показ попапа
	function showPopup(target) {
		target.classList.add('is-active');
	}

	//Скрытие попапа
	function closePopup(target) {
		target.classList.remove('is-active');
	}

	//BODY overflow hidden, чтобы при открытом попапе фон не скролился
	function bodyOverflow() {
		body.classList.toggle('overflow');
	}


	//Открытие попапа при клике на бургер меню
	body.addEventListener('click', function (e) {
		var target = e.target;
		//Поиск названия data-popup, который задан у кнопки бургера
		//var popupClass = target.getAttribute('data-popup');
		var popupClass = closestsElementAttr(target, 'data-popup');

		//если элемент, на котором кликнули, не имеет аттрибут data-popup, то выходим
		if (popupClass === null) {
			return;
		}
		e.preventDefault();
		var popup = document.querySelector('.' + popupClass);
		if (popup) {
			showPopup(popup);
			bodyOverflow();
		}
	})

	//Закрытие попапа при клике X или на область вне попапа
	body.addEventListener('click', function (e) {
		var target = e.target;
		//Если клик был на кнопку Х или фон вне попапа, то закрываем его
		if (e.target.classList.contains('popup__close') || e.target.classList.contains('popup__wrapper') || e.target.classList.contains('popup__inner')) {
			//поиск той кноки Х, которая относится к конкретному попапу
			var popup = closestsElementClass(target, 'popup');
			closePopup(popup);
			bodyOverflow();
		}

	});

	//Закрытие попапа при клике на escape (Esc)
	body.addEventListener('keydown', function (e) {
		if (e.keyCode !== 27)
			return;
		else {
			var popup = document.querySelector('.popup.is-active');
			closePopup(popup);
			bodyOverflow();
		}
	});

	//popup  />>>>>>>>>>>>>>>>>>>>>>*/


	//scroll-up  >>>>>>>>>>>>>>>>>>>>>>*/

	var intervalId = 0; // Needed to cancel the scrolling when we're at the top of the page
	var scrollButton = document.querySelector('.to-top'); // Reference to our scroll button
	var header = document.querySelector('#header');
	var headerHeight = header.clientHeight;


	window.addEventListener('scroll', function () {
		if (window.pageYOffset > headerHeight)
			scrollButton.style.display = "block";
		else
			scrollButton.style.display = "none";
	});


	function scrollStep() {
		if (window.pageYOffset === 0) {
			clearInterval(intervalId);
		}
		window.scroll(0, window.pageYOffset - 50);
	}

	function scrollToTop() {
		//speed
		intervalId = setInterval(scrollStep, 10);
	}

	scrollButton.addEventListener('click', scrollToTop);

	//scroll-up  />>>>>>>>>>>>>>>>>>>>>>*/
	
	//tooltip    >>>>>>>>>>>>>>>>>>>>>>*/
	let tooltipElem;

	document.onmouseover = function (event) {
		let target = event.target;

		// если у нас есть подсказка...
		let tooltipHtml = target.dataset.tooltip;
		if (!tooltipHtml) return;

		// ...создадим элемент для подсказки

		tooltipElem = document.createElement('div');
		tooltipElem.className = 'tooltip';
		tooltipElem.innerHTML = tooltipHtml;
		document.body.append(tooltipElem);

		// спозиционируем его сверху от аннотируемого элемента (top-center)
		let coords = target.getBoundingClientRect();

		let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
		if (left < 0) left = 0; // не заезжать за левый край окна

		let top = coords.top - tooltipElem.offsetHeight - 5;
		if (top < 0) { // если подсказка не помещается сверху, то отображать её снизу
			top = coords.top + target.offsetHeight + 5;
		}

		tooltipElem.style.left = left + 'px';
		tooltipElem.style.top = top + 'px';
	};

	document.onmouseout = function (e) {

		if (tooltipElem) {
			tooltipElem.remove();
			tooltipElem = null;
		}

	};
	//tooltip    />>>>>>>>>>>>>>>>>>>>>>*/

})()
