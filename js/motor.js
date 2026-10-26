// Motor da visual novel: troca de cena, texto letra por letra, escolhas e entrada.

const VELOCIDADE = 26;               // ms por letra
const PAUSAS = { '.': 260, '!': 260, '?': 260, ',': 120, '…': 260 };
const TROCA_CENA = 900;              // mesmo tempo da transição no CSS

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export class Motor {
  constructor({ raiz, roteiro, cenas, aoConvite, aoAgenda }) {
    this.raiz = raiz;
    this.roteiro = roteiro;
    this.cenas = cenas;
    this.aoConvite = aoConvite;
    this.aoAgenda = aoAgenda;

    this.porId = new Map(roteiro.map((no, i) => [no.id ?? `#${i}`, i]));
    this.fundos = [...raiz.querySelectorAll('.fundo')];
    this.caixa = raiz.querySelector('.caixa');
    this.nome = raiz.querySelector('.nome');
    this.texto = raiz.querySelector('.texto');
    this.opcoes = raiz.querySelector('.opcoes');
    this.dica = raiz.querySelector('.dica');

    this.indice = -1;
    this.cenaAtual = null;
    this.esperando = null;           // 'avancar' | 'escolha' | null
    this.digitando = false;
    this.terminarTexto = null;
    this.vez = 0;                    // invalida passos antigos quando a cena muda
  }

  ligarEntrada() {
    this.raiz.addEventListener('click', (e) => {
      if (e.target.closest('button, a, .modal, #abertura')) return;
      this.avancar();
    });

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (this.esperando === 'escolha') return this.teclaNaEscolha(e);
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target.closest?.('button, a')) return;
        e.preventDefault();
        this.avancar();
      }
    });
  }

  teclaNaEscolha(e) {
    const botoes = [...this.opcoes.querySelectorAll('button')];
    if (!botoes.length) return;
    let atual = botoes.findIndex((b) => b.classList.contains('ativa'));
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      const passo = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
      atual = (atual + passo + botoes.length) % botoes.length;
      botoes.forEach((b, i) => b.classList.toggle('ativa', i === atual));
      botoes[atual].focus({ preventScroll: true });
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (this.digitando) return this.terminarTexto?.();
      (botoes[atual] ?? botoes[0]).click();
    }
  }

  avancar() {
    if (this.digitando) return this.terminarTexto?.();
    if (this.esperando === 'avancar') this.seguir();
  }

  seguir(id) {
    const no = this.roteiro[this.indice];
    const alvo = id ?? no?.ir;
    this.irPara(alvo != null ? this.porId.get(alvo) : this.indice + 1);
  }

  async irPara(indice) {
    const no = this.roteiro[indice];
    if (!no) return;
    const vez = ++this.vez;
    this.indice = indice;
    this.esperando = null;
    this.dica.classList.remove('visivel');

    if (no.cena !== this.cenaAtual) {
      this.caixa.classList.remove('visivel');
      await this.trocarCena(no.cena);
      if (vez !== this.vez) return;
    }

    switch (no.tipo) {
      case 'narracao':
      case 'fala':
        await this.mostrarTexto(no, vez);
        if (vez !== this.vez) return;
        this.esperando = 'avancar';
        this.dica.classList.add('visivel');
        break;
      case 'escolha':
        await this.mostrarTexto(no, vez);
        if (vez !== this.vez) return;
        this.mostrarOpcoes(no.opcoes.map((o) => ({ texto: o.texto, acao: () => this.seguir(o.ir) })));
        break;
      case 'fim':
        await this.mostrarTexto(no, vez);
        if (vez !== this.vez) return;
        this.mostrarOpcoes([{ texto: no.botao, acao: () => this.irPara(0) }]);
        break;
      case 'convite':
        this.caixa.classList.remove('visivel');
        this.aoConvite(() => this.seguir());
        break;
      case 'agenda':
        this.caixa.classList.remove('visivel');
        this.aoAgenda(() => this.seguir());
        break;
    }
  }

  async trocarCena(nome) {
    const cfg = this.cenas[nome] ?? {};
    const [fx, fy] = cfg.foco ?? [50, 50];
    const [proxima, anterior] = this.fundos[0].classList.contains('visivel') ? [this.fundos[1], this.fundos[0]] : this.fundos;

    proxima.src = `assets/img/${nome}.webp`;
    proxima.style.setProperty('--fx', `${fx}%`);
    proxima.style.setProperty('--fy', `${fy}%`);
    proxima.style.setProperty('--zoom', cfg.zoom ?? 1);
    proxima.style.setProperty('--px1', cfg.pan ? `${cfg.pan[0]}%` : `${fx}%`);
    proxima.style.setProperty('--px2', cfg.pan ? `${cfg.pan[1]}%` : `${fx}%`);
    try { await proxima.decode(); } catch { /* imagem já está no cache do preload */ }

    proxima.classList.add('visivel');
    anterior.classList.remove('visivel');
    this.cenaAtual = nome;
    await esperar(TROCA_CENA * 0.7);
  }

  async mostrarTexto(no, vez) {
    this.caixa.className = `caixa ${no.tipo}`;
    this.nome.textContent = no.quem ?? '';
    this.opcoes.replaceChildren();
    this.texto.textContent = '';
    this.caixa.offsetWidth;          // reinicia a animação de entrada
    this.caixa.classList.add('visivel');
    await this.escrever(no.texto, vez);
    if (vez === this.vez) this.caixa.classList.add('pronta');
  }

  escrever(texto, vez) {
    return new Promise((resolver) => {
      let i = 0;
      let acumulado = 0;
      let antes = performance.now();
      let ativo = true;
      this.digitando = true;

      const terminar = () => {
        if (!ativo) return;
        ativo = false;
        if (this.terminarTexto === terminar) {
          this.digitando = false;
          this.terminarTexto = null;
          this.texto.textContent = texto;
        }
        resolver();
      };
      this.terminarTexto = terminar;

      const atraso = (k) => {
        const letra = texto[k - 1];
        const seguinte = texto[k];
        return PAUSAS[letra] && (seguinte === ' ' || seguinte === '\n' || seguinte === undefined) && texto[k - 2] !== '.'
          ? PAUSAS[letra]
          : VELOCIDADE;
      };

      const passo = (agora) => {
        if (!ativo) return;
        if (vez !== this.vez) return terminar();
        acumulado += agora - antes;
        antes = agora;
        while (i < texto.length && acumulado >= atraso(i + 1)) {
          acumulado -= atraso(i + 1);
          i++;
        }
        this.texto.textContent = texto.slice(0, i);
        if (i >= texto.length) terminar();
        else requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }

  mostrarOpcoes(lista) {
    this.esperando = 'escolha';
    this.caixa.classList.add('com-opcoes');
    const botoes = lista.map(({ texto, acao }, i) => {
      const b = document.createElement('button');
      b.className = 'opcao';
      b.type = 'button';
      b.textContent = texto;
      b.style.animationDelay = `${i * 90}ms`;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.esperando !== 'escolha') return;
        this.esperando = null;
        b.classList.add('ativa');
        setTimeout(acao, 180);
      });
      b.addEventListener('pointerenter', () => {
        botoes.forEach((x) => x.classList.toggle('ativa', x === b));
      });
      return b;
    });
    this.opcoes.replaceChildren(...botoes);
  }
}
