// main scripts
// slider on homepage, form validation on contact page

// image slider
(function () {
  var track = document.querySelector('.slides');
  if (!track) return;

  var items  = track.querySelectorAll('.slide');
  var dots   = document.querySelectorAll('.dot');
  var total  = items.length;
  var cur    = 0;
  var timer;

  function show(n) {
    if (n < 0) n = total - 1;
    if (n >= total) n = 0;
    cur = n;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('on', i === cur);
    });
  }

  function next() { show(cur + 1); }
  function prev() { show(cur - 1); }

  function startTimer() { timer = setInterval(next, 4500); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  var btnNext = document.querySelector('.go-next');
  var btnPrev = document.querySelector('.go-prev');
  if (btnNext) btnNext.addEventListener('click', function () { next(); resetTimer(); });
  if (btnPrev) btnPrev.addEventListener('click', function () { prev(); resetTimer(); });

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { show(i); resetTimer(); });
  });

  // arrow keys
  document.addEventListener('keydown', function (e) {
    if (!document.querySelector('.slider')) return;
    if (e.key === 'ArrowRight') { next(); resetTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
  });

  // swipe on touch screens
  var startX = 0;
  var sliderEl = document.querySelector('.slider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
        resetTimer();
      }
    }, { passive: true });
  }

  show(0);
  startTimer();
})();


// contact form validation
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  function markError(id, msg) {
    var errEl = document.getElementById(id + '-err');
    var input = document.getElementById(id);
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    if (input)  { input.style.borderColor = '#ff0000'; }
  }

  function clearError(id) {
    var errEl = document.getElementById(id + '-err');
    var input = document.getElementById(id);
    if (errEl) { errEl.style.display = 'none'; }
    if (input)  { input.style.borderColor = ''; }
  }

  function validEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  }

  ['fname', 'femail', 'fsubject', 'fmessage'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { clearError(id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = document.getElementById('fname').value;
    var email   = document.getElementById('femail').value;
    var subject = document.getElementById('fsubject').value;
    var message = document.getElementById('fmessage').value;
    var ok      = true;

    ['fname', 'femail', 'fsubject', 'fmessage'].forEach(clearError);

    if (name.trim().length < 2) {
      markError('fname', 'Please enter your full name.');
      ok = false;
    }
    if (!email.trim()) {
      markError('femail', 'Please enter your email address.');
      ok = false;
    } else if (!validEmail(email)) {
      markError('femail', 'That email doesn\'t look right try name@example.com.');
      ok = false;
    }
    if (!subject.trim()) {
      markError('fsubject', 'Please add a subject.');
      ok = false;
    }
    if (message.trim().length < 15) {
      markError('fmessage', 'Please write a bit more at least 15 characters.');
      ok = false;
    }

    if (ok) {
      var success = document.getElementById('form-ok');
      if (success) {
        var first = name.trim().split(' ')[0];
        success.textContent = 'Thanks, ' + first + '! We\'ll get back to you within tow business days.';
        success.style.display = 'block';
      }
      form.reset();
      form.style.opacity = '0.6';
      setTimeout(function () {
        form.style.opacity = '1';
        if (success) success.style.display = 'none';
      }, 6000);
    }
  });
})();


// highlight the current page in the nav
(function () {
  var page  = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a');
  links.forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('here');
  });
})();
