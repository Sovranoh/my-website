document.addEventListener('DOMContentLoaded', () => {
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
