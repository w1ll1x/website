// Live digital clock (24-hour, local time) — bottom-left on desktop
function tickClock() {
	var el = document.getElementById('clock');
	if (!el) return;
	var d = new Date();
	var pad = function (n) { return String(n).padStart(2, '0'); };
	el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}
tickClock();
setInterval(tickClock, 1000);

// Mirror the desktop Projects / CV content into the mobile screens so the
// copy only has to be maintained in one place.
document.addEventListener('DOMContentLoaded', function () {
	var projectsSource = document.getElementById('projects-content');
	var projectsTarget = document.getElementById('mobile-projects-inner');
	if (projectsSource && projectsTarget) {
		projectsTarget.innerHTML = projectsSource.innerHTML;
	}

	var cvSource = document.getElementById('cv-content');
	var cvTarget = document.getElementById('mobile-cv-inner');
	if (cvSource && cvTarget) {
		cvTarget.innerHTML = cvSource.innerHTML;
	}

	// EN/DE language toggle. Each translatable element carries a .i18n
	// class and a data-de attribute; its original (English) markup is
	// captured into data-en the first time it's swapped.
	var LANG_KEY = 'site-lang';

	function applyLang(lang) {
		document.querySelectorAll('.i18n').forEach(function (el) {
			if (el.dataset.en === undefined) {
				el.dataset.en = el.innerHTML;
			}
			el.innerHTML = lang === 'de' ? el.dataset.de : el.dataset.en;
		});
		document.documentElement.lang = lang;
		document.querySelectorAll('.lang-btn').forEach(function (btn) {
			btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
		});
		try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
	}

	var savedLang = 'en';
	try { savedLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) {}
	applyLang(savedLang);

	document.querySelectorAll('.lang-btn').forEach(function (btn) {
		btn.addEventListener('click', function () {
			applyLang(btn.getAttribute('data-lang'));
		});
	});

	// Mobile tab switching
	var tabLinks = document.querySelectorAll('.mobile-tab-link');
	var screens = document.querySelectorAll('.mobile-screen');
	var navLinks = document.querySelectorAll('.mobile-nav .mobile-tab-link');

	function showScreen(id) {
		screens.forEach(function (s) { s.classList.toggle('active', s.id === id); });
		navLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('data-screen') === id); });
		window.scrollTo(0, 0);
	}

	tabLinks.forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			showScreen(link.getAttribute('data-screen'));
		});
	});

	// Contact modal
	var modal = document.getElementById('contact-modal');
	var contactLinks = document.querySelectorAll('.contact-link');
	var closeModal = document.getElementById('close-modal');

	contactLinks.forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			modal.classList.add('open');
		});
	});

	if (closeModal) {
		closeModal.addEventListener('click', function (e) {
			e.preventDefault();
			modal.classList.remove('open');
		});
	}

	modal.addEventListener('click', function (e) {
		if (e.target === modal) modal.classList.remove('open');
	});
});
