(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const EMAIL = 'info@automotivesolu.com';

  // Year
  $('#yr').textContent = new Date().getFullYear();

  // Mobile menu
  const burger = $('#burger'), links = $('#links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => {
    if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  // Consultation buttons open a pre-filled email (same behavior as the current site)
  $$('[data-mail]').forEach(a => {
    a.href = `mailto:${EMAIL}?subject=${encodeURIComponent(a.dataset.mail)}`;
  });

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + 'ms'; io.observe(el); });

  // Rotating headline
  const phrases = ['walk into a dealership', 'haggle over a price', 'sit in a finance office', 'sign a stack of paperwork', 'lose a Saturday to car shopping'];
  const typed = $('#typed');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let p = 0, c = phrases[0].length, erasing = true;
    const step = () => {
      if (erasing) {
        c--;
        if (c <= 0) { erasing = false; p = (p + 1) % phrases.length; }
        typed.textContent = phrases[p].slice(0, Math.max(c, 0)) || '\u00A0';
        return setTimeout(step, 35);
      }
      c++;
      typed.textContent = phrases[p].slice(0, c);
      if (c >= phrases[p].length) { erasing = true; return setTimeout(step, 2400); }
      setTimeout(step, 65);
    };
    setTimeout(step, 2600);
  }

  // Brand marquee: logos tinted via CSS mask; brands without a logo file show as text
  const brands = [
    ['Acura','acura'],['Alfa Romeo','alfaromeo'],['Aston Martin','astonmartin'],['Audi','audi'],['Bentley','bentley'],['BMW','bmw'],['Buick'],['Cadillac','cadillac'],['Chevrolet','chevrolet'],['Chrysler','chrysler'],['Dodge'],['Ferrari','ferrari'],['Fiat','fiat'],['Ford','ford'],['Genesis'],['GMC'],['Honda','honda'],['Hyundai','hyundai'],['Infiniti','infiniti'],['Jaguar','jaguar'],['Jeep','jeep'],['Kia','kia'],['Lamborghini','lamborghini'],['Land Rover','landrover'],['Lexus'],['Lincoln'],['Maserati','maserati'],['Mazda','mazda'],['McLaren','mclaren'],['Mercedes-Benz','mercedes'],['Mini','mini'],['Mitsubishi','mitsubishi'],['Nissan','nissan'],['Polestar','polestar'],['Porsche','porsche'],['Ram','ram'],['Rivian'],['Rolls-Royce','rollsroyce'],['Subaru','subaru'],['Tesla','tesla'],['Toyota','toyota'],['Volkswagen','volkswagen'],['Volvo','volvo']
  ];
  const item = ([name, file]) => file
    ? `<span class="logo" role="img" aria-label="${name}" title="${name}" style="--src:url(assets/brands/${file}.svg)"></span>`
    : `<span class="wordmark">${name}</span>`;
  const track = $('#brandTrack');
  track.innerHTML = [...brands, ...brands].map(item).join('');

  // Testimonial slider
  const slides = $('.slides'), n = $$('.slide').length, dots = $('#dots');
  let idx = 0, timer;
  dots.innerHTML = Array.from({ length: n }, (_, i) => `<i data-i="${i}"></i>`).join('');
  const go = i => {
    idx = (i + n) % n;
    slides.style.transform = `translateX(-${idx * 100}%)`;
    $$('i', dots).forEach((d, k) => d.classList.toggle('on', k === idx));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7000); };
  $('#prev').onclick = () => { go(idx - 1); auto(); };
  $('#next').onclick = () => { go(idx + 1); auto(); };
  dots.onclick = e => { if (e.target.dataset.i) { go(+e.target.dataset.i); auto(); } };
  let sx = 0;
  slides.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  slides.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); auto(); }
  });
  go(0); auto();


})();
