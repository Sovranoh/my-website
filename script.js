document.addEventListener('DOMContentLoaded', () => {
  const backgroundWave = document.querySelector('.background-wave');

  if (backgroundWave) {
    const waveContext = backgroundWave.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;

    const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

    function resizeBackgroundWave() {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      backgroundWave.width = Math.round(canvasWidth * pixelRatio);
      backgroundWave.height = Math.round(canvasHeight * pixelRatio);
      waveContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function drawBackgroundWave(timestamp = 0) {
      const time = timestamp * 0.001;
      const motionSpeed = 0.4;
      const movementTime = time * motionSpeed;
      const spacing = canvasWidth < 700 ? 16 : 20;
      const waveWidth = canvasWidth * 0.78;
      const startY = canvasHeight * 0.24;

      waveContext.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let y = startY; y < canvasHeight + spacing; y += spacing) {
        for (let x = -spacing; x < waveWidth; x += spacing) {
          const horizontalFade = clamp(1 - Math.pow(Math.max(x, 0) / waveWidth, 1.75), 0, 1);
          const wave = Math.sin(x * 0.024 + y * 0.018 - movementTime * 2.6);
          const ripple = Math.sin(x * 0.012 - y * 0.027 + movementTime * 1.7);
          const crest = canvasHeight * 0.34
            + Math.sin(x * 0.011 - movementTime * 1.05) * canvasHeight * 0.105
            + Math.sin(x * 0.028 + movementTime * 0.7) * canvasHeight * 0.035;

          if (y < crest || horizontalFade <= 0) {
            continue;
          }

          const depth = (wave + 1) * 0.5;
          const pointX = x + (wave * 15 + ripple * 7) * horizontalFade;
          const pointY = y + (wave * 34 + ripple * 10) * horizontalFade;
          const edgeFade = clamp((y - crest) / (canvasHeight * 0.18), 0, 1);
          const alpha = (0.13 + depth * 0.64) * horizontalFade * edgeFade;
          const radius = 0.55 + depth * 2.7;

          waveContext.beginPath();
          waveContext.ellipse(pointX, pointY, radius * (1 + Math.abs(ripple) * 0.5), radius * (0.72 + depth * 0.24), ripple * 0.6, 0, Math.PI * 2);
          waveContext.fillStyle = `rgba(37, 99, 235, ${alpha})`;
          waveContext.fill();
        }
      }

      if (!reduceMotion.matches && !document.hidden) {
        animationFrame = window.requestAnimationFrame(drawBackgroundWave);
      }
    }

    function restartBackgroundWave() {
      window.cancelAnimationFrame(animationFrame);
      resizeBackgroundWave();
      animationFrame = window.requestAnimationFrame(drawBackgroundWave);
    }

    window.addEventListener('resize', restartBackgroundWave, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !reduceMotion.matches) {
        animationFrame = window.requestAnimationFrame(drawBackgroundWave);
      }
    });

    resizeBackgroundWave();
    drawBackgroundWave();
  }

  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-links');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const observers = document.querySelectorAll('.fade-in');

  function handleScrollSpy() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      }
    });
  }

  function handleScrollTopVisibility() {
    if (window.scrollY > 450) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  observers.forEach(element => observer.observe(element));

  window.addEventListener('scroll', () => {
    handleScrollSpy();
    handleScrollTopVisibility();
  });

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove('success', 'error');
    formMessage.classList.add(type);
  }

  function clearFormMessage() {
    formMessage.textContent = '';
    formMessage.classList.remove('success', 'error');
  }

  function validateForm() {
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const project = contactForm.project.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !project || !message) {
      showFormMessage('يرجى ملء جميع الحقول قبل الإرسال.', 'error');
      return false;
    }

    if (!validateEmail(email)) {
      showFormMessage('يرجى إدخال بريد إلكتروني صالح.', 'error');
      return false;
    }

    return true;
  }

  // تم تعيين القيم التالية من حساب EmailJS الخاص بك
  const EMAILJS_SERVICE_ID = 'service_5prwcbb';
  const EMAILJS_TEMPLATE_ID = 'template_x1ko1mj';
  const EMAILJS_PUBLIC_KEY = 'T93AGcqGFxIq3NGG9';

  emailjs.init(EMAILJS_PUBLIC_KEY);

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFormMessage();

    if (!validateForm()) {
      return;
    }

    if (typeof window.emailjs === 'undefined') {
      showFormMessage('لم يتم تحميل خدمة البريد الإلكتروني. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.', 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'جاري الإرسال...';

    const templateParams = {
      from_name: contactForm.name.value.trim(),
      from_email: contactForm.email.value.trim(),
      reply_to: contactForm.email.value.trim(),
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      project: contactForm.project.value.trim(),
      message: contactForm.message.value.trim(),
      to_email: 'agdn978@gmail.com'
    };

    console.log('Sending EmailJS:', EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        showFormMessage('تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.', 'success');
        contactForm.reset();
      })
      .catch((error) => {
        console.error('EmailJS send error:', error);
        const errorMessage = error?.text || error?.message || JSON.stringify(error);
        showFormMessage(`حدث خطأ أثناء إرسال الرسالة. ${errorMessage}`, 'error');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'أرسل الرسالة';
      });
  });
});
