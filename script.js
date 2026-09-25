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

	function detectLang() {
		var saved = null;
		try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
		if (saved) return saved;
		var browserLangs = navigator.languages || [navigator.language || ''];
		var isGerman = browserLangs.some(function (l) { return /^de\b/i.test(l); });
		return isGerman ? 'de' : 'en';
	}

	applyLang(detectLang());

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

	// Photo lightbox: click any project/profile photo to view it full size.
	// Photos inside a gallery can be stepped through with the arrows, arrow
	// keys, a swipe, or by clicking the photo itself.
	var lightbox = document.getElementById('lightbox');
	var lightboxImg = document.getElementById('lightbox-img');
	var lightboxCount = document.getElementById('lightbox-count');
	var galleryImgs = [];
	var galleryIndex = 0;

	function showLightboxImg(i) {
		galleryIndex = (i + galleryImgs.length) % galleryImgs.length;
		var img = galleryImgs[galleryIndex];
		lightboxImg.src = img.currentSrc || img.src;
		lightboxImg.alt = img.alt;
		lightboxCount.textContent = (galleryIndex + 1) + ' / ' + galleryImgs.length;
	}

	function closeLightbox() {
		lightbox.classList.remove('open');
	}

	document.addEventListener('click', function (e) {
		var img = e.target.closest('.center img, .mobile-screen img');
		if (!img) return;
		var gallery = img.closest('[class^="gallery-"]');
		galleryImgs = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('img')) : [img];
		lightbox.classList.toggle('gallery', galleryImgs.length > 1);
		showLightboxImg(galleryImgs.indexOf(img));
		lightbox.classList.add('open');
	});

	lightbox.addEventListener('click', function (e) {
		var isGallery = galleryImgs.length > 1;
		if (e.target.closest('.lightbox-prev')) {
			showLightboxImg(galleryIndex - 1);
		} else if (e.target.closest('.lightbox-next') || (isGallery && e.target === lightboxImg)) {
			showLightboxImg(galleryIndex + 1);
		} else {
			closeLightbox();
		}
	});

	document.addEventListener('keydown', function (e) {
		if (!lightbox.classList.contains('open')) return;
		if (e.key === 'Escape') closeLightbox();
		if (galleryImgs.length < 2) return;
		if (e.key === 'ArrowLeft') showLightboxImg(galleryIndex - 1);
		if (e.key === 'ArrowRight') showLightboxImg(galleryIndex + 1);
	});

	var touchStartX = null;
	lightbox.addEventListener('touchstart', function (e) {
		touchStartX = e.touches[0].clientX;
	}, { passive: true });
	lightbox.addEventListener('touchend', function (e) {
		if (touchStartX === null || galleryImgs.length < 2) return;
		var dx = e.changedTouches[0].clientX - touchStartX;
		touchStartX = null;
		if (Math.abs(dx) > 40) {
			showLightboxImg(galleryIndex + (dx < 0 ? 1 : -1));
			e.preventDefault(); // suppress the follow-up click
		}
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
