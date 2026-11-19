// Заміни ці три адреси на реальні посилання свого закладу.
const BOOKING_URL = 'https://example.com/booking';
const INSTAGRAM_URL = 'https://www.instagram.com/';
const TELEGRAM_URL = 'https://t.me/';

const header = document.getElementById('header');
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('navLinks');
const track = document.getElementById('teamTrack');
const previous = document.getElementById('prevBarber');
const next = document.getElementById('nextBarber');
const cards = [...track.querySelectorAll('.barber')];

// Зовнішній запис. Параметр barber можна використати, якщо сервіс бронювання його підтримує.
document.querySelectorAll('.booking-link').forEach(link => {
  const url = new URL(BOOKING_URL);
  if (link.dataset.barber) url.searchParams.set('barber', link.dataset.barber);
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
document.querySelectorAll('.instagram-link').forEach(a => a.href = INSTAGRAM_URL);
document.querySelectorAll('.telegram-link').forEach(a => a.href = TELEGRAM_URL);

const updateHeader = () => header.classList.toggle('scrolled', scrollY > 32);
window.addEventListener('scroll', updateHeader, {passive:true});updateHeader();
toggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(isOpen));toggle.textContent=isOpen?'×':'☰'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));

function closeMobileMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}
document.addEventListener('keydown', e => {if(e.key==='Escape') closeMobileMenu()});
document.addEventListener('click', e => {if(nav.classList.contains('open') && !header.contains(e.target)) closeMobileMenu()});
window.addEventListener('resize', () => {if(window.innerWidth>900) closeMobileMenu()});


// Реальні анімації появи блоків під час прокрутки.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  }),{threshold:.10,rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
} else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

// Інтерактивне підсвічування головного екрана курсором.
const hero = document.getElementById('home');
hero.addEventListener('pointermove', e => {
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const rect = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width*100)+'%');
  hero.style.setProperty('--my', ((e.clientY-rect.top)/rect.height*100)+'%');
});

// Карусель підтримує стрілки, свайпи та клавіатуру.
function stepSize(){return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth}
function maxIndex(){return Math.max(0, cards.length - Math.max(1,Math.round((track.clientWidth+22)/stepSize())))}
function currentIndex(){return Math.min(maxIndex(),Math.max(0,Math.round(track.scrollLeft/stepSize())))}
function goTo(index){track.scrollTo({left:Math.max(0,Math.min(maxIndex(),index))*stepSize(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
function updateCarousel(){const active=currentIndex();previous.disabled=active===0;next.disabled=active>=maxIndex();}
function buildDots(){updateCarousel()}
previous.addEventListener('click',()=>goTo(currentIndex()-1));
next.addEventListener('click',()=>goTo(currentIndex()+1));
track.addEventListener('scroll',()=>requestAnimationFrame(updateCarousel),{passive:true});
track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();goTo(currentIndex()+1)}if(e.key==='ArrowLeft'){e.preventDefault();goTo(currentIndex()-1)}});
window.addEventListener('resize',buildDots);
window.addEventListener('load',buildDots);
buildDots();
document.getElementById('year').textContent=new Date().getFullYear();
