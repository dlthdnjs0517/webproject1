document.addEventListener('DOMContentLoaded', () => {
	const openBtn = document.querySelector('.addLink');
	const modal = document.getElementById('popupForm');
	const closeBtn = document.querySelectorAll('.close');
	function closePopup() {
		modal.classList.add('hidden');
	}

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			if (modal && !modal.classList.contains('hidden')) {
				closePopup();
			}

		}
	})



	if (openBtn && modal) {
		openBtn.addEventListener('click', function (e) {
			e.preventDefault(); //a 태그의 기본 동작 막기(페이지 맨 위로 올라가는 동작 방지
			modal.classList.remove('hidden');
		});
	}

	if (modal && closeBtn.length > 0) {
		closeBtn.forEach(btn => {
			btn.addEventListener('click', () => {
				modal.classList.add('hidden');
			});
		});
	}
});