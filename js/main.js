// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});

menu.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// Terminal animado
const lines = [
  { t: '$ nexti diagnostico --completo', c: 'prompt' },
  { t: '> Verificando hardware...........', c: '' },
  { t: '  [OK] CPU: temperatura normal', c: 'ok' },
  { t: '  [OK] Memória RAM: 16 GB', c: 'ok' },
  { t: '  [OK] SSD: saúde 98%', c: 'ok' },
  { t: '> Verificando segurança..........', c: '' },
  { t: '  [OK] Antivírus atualizado', c: 'ok' },
  { t: '  [OK] Backup realizado hoje', c: 'ok' },
  { t: '> Verificando rede...............', c: '' },
  { t: '  [OK] Latência: 12 ms', c: 'ok' },
  { t: '$ echo "Tudo funcionando! 🚀"', c: 'prompt' },
];

const term = document.getElementById('terminal-text');

async function typeTerminal() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  while (true) {
    term.innerHTML = '';
    for (const line of lines) {
      const span = document.createElement('span');
      if (line.c) span.className = line.c;
      term.appendChild(span);
      for (const ch of line.t) {
        span.textContent += ch;
        await sleep(line.c === 'prompt' ? 45 : 12);
      }
      term.appendChild(document.createTextNode('\n'));
      await sleep(220);
    }
    await sleep(4000);
  }
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  term.textContent = lines.map(l => l.t).join('\n');
} else {
  typeTerminal();
}

// Contadores
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const duration = 1500;
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const value = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = value.toLocaleString('pt-BR') + (p === 1 ? el.dataset.suffix || '' : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: .5 });
counters.forEach(c => countObserver.observe(c));

// Animação ao rolar
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Filtro de dicas
const filters = document.querySelectorAll('.filter');
const posts = document.querySelectorAll('.post');
filters.forEach(btn =>
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    posts.forEach(p => p.classList.toggle('hidden', cat !== 'todos' && p.dataset.cat !== cat));
  })
);

// Botões de plano preenchem o formulário
document.querySelectorAll('[data-plano]').forEach(btn =>
  btn.addEventListener('click', () => {
    document.getElementById('servico').value = 'Plano ' + btn.dataset.plano;
  })
);

// Formulário de contato
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    const ok = input.value.trim() !== '' && (input.type !== 'email' || /^\S+@\S+\.\S+$/.test(input.value));
    input.parentElement.classList.toggle('error', !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.textContent = 'Por favor, preencha todos os campos corretamente.';
    status.className = 'form-status fail';
    return;
  }

  const nome = form.nome.value.trim().split(' ')[0];
  status.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada. Retornaremos em breve.`;
  status.className = 'form-status success';
  form.reset();
});

// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();
