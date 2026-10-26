import { CONVITE, CENAS, ROTEIRO } from './historia.js';
import { Motor } from './motor.js';
import { linkGoogleAgenda, baixarIcs } from './agenda.js';

const raiz = document.getElementById('jogo');
const abertura = document.getElementById('abertura');
const botaoComecar = abertura.querySelector('.comecar');
const convite = document.getElementById('convite');
const agenda = document.getElementById('agenda');
const particulas = raiz.querySelector('.particulas');

// ---------- pré-carregamento ----------
function carregar(nomes, aoProgresso) {
  let prontas = 0;
  return Promise.all(nomes.map((nome) => new Promise((ok) => {
    const img = new Image();
    img.onload = img.onerror = () => { aoProgresso(++prontas / nomes.length); ok(); };
    img.src = `assets/img/${nome}.webp`;
  })));
}

// ---------- poeirinha de luz ----------
function criarParticulas(qtd) {
  for (let i = 0; i < qtd; i++) {
    const p = document.createElement('span');
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${9 + Math.random() * 9}s`;
    p.style.animationDelay = `${-Math.random() * 18}s`;
    p.style.transform = `scale(${0.5 + Math.random()})`;
    particulas.append(p);
  }
}

function soltarCoracoes(qtd) {
  for (let i = 0; i < qtd; i++) {
    const c = document.createElement('span');
    c.className = 'coracao';
    c.textContent = '♥';
    c.style.left = `${20 + Math.random() * 60}%`;
    c.style.bottom = '20%';
    c.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
    c.style.animationDelay = `${i * 80}ms`;
    c.style.fontSize = `${16 + Math.random() * 18}px`;
    particulas.append(c);
    setTimeout(() => c.remove(), 2600 + i * 80);
  }
}

// ---------- convite e agenda ----------
function preencherConvite() {
  convite.querySelector('.mes').textContent = CONVITE.folhinha.mes;
  convite.querySelector('.dia').textContent = CONVITE.folhinha.dia;
  convite.querySelector('.semana').textContent = CONVITE.folhinha.semana;
  convite.querySelector('[data-campo=hora]').textContent = CONVITE.inicio;
  convite.querySelector('[data-campo=local]').textContent = CONVITE.local || 'a combinar';
  convite.querySelector('[data-campo=traje]').textContent = CONVITE.traje;

  agenda.querySelector('.google').href = linkGoogleAgenda(CONVITE);
  const [, mes, dia] = CONVITE.data.split('-');
  agenda.querySelector('.resumo').textContent =
    `${CONVITE.folhinha.semana}, ${dia}/${mes}, das ${CONVITE.inicio} às ${CONVITE.fim}${CONVITE.local ? ` · ${CONVITE.local}` : ''}`;
  agenda.querySelector('.ics').addEventListener('click', () => baixarIcs(CONVITE));
}

function abrirModal(modal, aoFechar, depois) {
  modal.classList.add('visivel');
  const botoes = [...modal.querySelectorAll('.botoes .opcao')];
  botoes.forEach((b, i) => {
    b.style.animation = 'none';
    b.offsetWidth;
    b.style.animation = '';
    b.style.animationDelay = `${450 + i * 90}ms`;
    b.onclick = (e) => {
      e.stopPropagation();
      botoes.forEach((x) => { x.onclick = null; });
      depois?.();
      setTimeout(() => {
        modal.classList.remove('visivel');
        aoFechar();
      }, depois ? 900 : 250);
    };
  });
}

// ---------- início ----------
const motor = new Motor({
  raiz,
  roteiro: ROTEIRO,
  cenas: CENAS,
  aoConvite: (seguir) => abrirModal(convite, seguir, () => soltarCoracoes(14)),
  aoAgenda: (seguir) => abrirModal(agenda, seguir),
});

preencherConvite();
criarParticulas(window.innerWidth < 700 ? 10 : 18);

// mostra a primeira arte atrás da abertura enquanto o resto carrega
motor.trocarCena(ROTEIRO[0].cena);

carregar(Object.keys(CENAS), (p) => {
  botaoComecar.textContent = `Preparando o reino... ${Math.round(p * 100)}%`;
}).then(() => {
  botaoComecar.textContent = 'Começar';
  botaoComecar.disabled = false;
  botaoComecar.classList.add('ativa');
});

botaoComecar.addEventListener('click', (e) => {
  e.stopPropagation();
  if (matchMedia('(pointer: coarse)').matches) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }
  abertura.classList.add('sumiu');
  raiz.classList.remove('na-abertura');
  motor.ligarEntrada();
  setTimeout(() => motor.irPara(0), 500);
});
