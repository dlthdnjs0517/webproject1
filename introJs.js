const header = document.querySelector('header');
const headerLogo = document.querySelector('header h1 img');
const headerInner = document.querySelector('.header-inner');
const subMenus = document.querySelectorAll('.sub');
const headerbg = document.querySelector('.headerbg');


header.addEventListener('mouseenter', function () {
	if (headerInner) {
		headerInner.classList.add('active');
	}
	if (subMenus) {
		subMenus.forEach(function (menu) {
			menu.style.display = 'none';
		})
		subMenus.forEach(function (menu) {
			menu.style.opacity = 0;
		})
		let opacity = 0;
		const fadeInInterval = setInterval(function () {
			if (opacity < 1) {
				opacity += 0.1;
				subMenus.forEach(function (menu) {
					menu.style.opacity = opacity;
					menu.style.display = 'block';
				})
			} else {
				clearInterval(fadeInInterval);
			}
		}, 30);
	}
	this.classList.add('active');
	if (headerbg) {
		headerbg.classList.add('active');
	}
});

header.addEventListener('mouseleave', function () {
	this.classList.remove('active');
	if (headerbg) {
		headerbg.classList.remove('active');
	}
	// Hide subMenus immediately on mouse leave as in the original jQuery
	if (subMenus) {
		subMenus.forEach(function (menu) {
			menu.style.display = 'none';
		})
	} else {
		console.log('subMenu 요소를 찾을 수 없습니다');
	}
});

// 230705 Accessibility work (Keyup event)
header.addEventListener('keyup', function (e) {
	// Check if the pressed key is Tab,레거시 코드라서 수정 원래는 e.key ==='9'였음
	if (e.key === 'Tab') {
		// Check if headerInner exists before trying to add a class
		if (headerInner) {
			headerInner.classList.add('active');
		}
		// Simple fade-in approximation for subMenus
		if (subMenus) {
			subMenus.forEach(function (menu) {
				menu.style.display = 'none';
			})
			subMenus.forEach(function (menu) {
				menu.style.opacity = 0;
			})
			let opacity = 0;
			const fadeInInterval = setInterval(function () {
				if (opacity < 1) {
					opacity += 0.1; // Adjust increment for speed
					subMenus.forEach(function (menu) {
						menu.style.opacity = 0;
					})
				} else {
					clearInterval(fadeInInterval);
				}
			}, 30); // Adjust interval for speed
		}
		this.classList.add('active');
		if (headerbg) {
			headerbg.classList.add('active');
		}
	}
});

// Focusout event
header.addEventListener('focusout', function () {
	// The original jQuery had commented out code here.
	// If you need specific focusout behavior on the last link,
	// you would need to add a separate event listener for that element.

	// Revert logo and remove classes
	this.classList.remove('active');
	if (headerbg) {
		headerbg.classList.remove('active');
	}
	// Hide subMenus immediately on focus out
	if (subMenus) {
		subMenus.forEach(function (menu) {
			menu.style.display = 'none';
		})
	}
});

//swiper 코드, class를 만든다.
window.addEventListener('DOMContentLoaded', function () {
	const swiper = new Swiper('.swiper', {
		loop: true,
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: true,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		effect: 'fade'

	});
});


