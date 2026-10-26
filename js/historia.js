// Tudo que é texto do jogo fica aqui. Dá pra editar sem mexer no resto.

export const CONVITE = {
  titulo: 'Café da tarde com o cavaleiro',
  data: '2026-10-31',
  inicio: '14:00',
  fim: '16:00',
  fusoUTC: '-03:00',
  fuso: 'America/Sao_Paulo',
  local: '',                 // vazio aparece como "a combinar"
  traje: 'o divo vai de armadura',
  folhinha: { mes: 'Outubro', dia: '31', semana: 'Sábado' },
  detalhes: 'Convite real do cavaleiro arrependido. Válido para uma única rainha, intransferível.',
};

// Cada cena é uma arte. foco = ponto que importa (x%, y%), zoom = aproximação,
// pan = de onde até onde a câmera passeia no celular em pé (x%).
export const CENAS = {
  '01-reino':     { foco: [60, 45], pan: [35, 75] },
  '02-varanda':   { foco: [50, 40], pan: [25, 72] },
  '03-chegada':   { foco: [50, 45], pan: [22, 72] },
  '04-ajoelhado': { foco: [50, 45], zoom: 1.2 },
  '05-perdao':    { foco: [50, 35] },
  '06-rainha':    { foco: [55, 40] },
  '07-acabado':   { foco: [50, 36], zoom: 1.35 },
  '08-escolha':   { foco: [50, 45], pan: [18, 85] },
  '09-bolsinha':  { foco: [50, 40], pan: [22, 78] },
  '10-entrega':   { foco: [50, 40], pan: [30, 75] },
  '11-olhinho':   { foco: [50, 35] },
  '12-cafe':      { foco: [50, 55] },
  '14-final':     { foco: [50, 45], pan: [30, 70] },
};

// tipos: narracao, fala, escolha, convite, agenda, fim
// "ir" pula pra um id. Sem "ir", segue pro próximo da lista.
export const ROTEIRO = [
  { id: 'inicio', cena: '01-reino', tipo: 'narracao',
    texto: 'Nas terras distantes de Porto Alegre, onde a paz e a felicidade reinavam, tudo estava indo de forma formidável...' },
  { cena: '02-varanda', tipo: 'narracao',
    texto: '...mas não para um cavaleiro que estava tentando se redimir com sua rainha.' },
  { cena: '03-chegada', tipo: 'narracao',
    texto: 'Após uma longa jornada atravessando um mar gigante batizado de Guaíba, ele finalmente chegou ao castelo...' },
  { cena: '04-ajoelhado', tipo: 'narracao',
    texto: 'Diante de sua rainha, ele se ajoelhou.' },
  { cena: '05-perdao', tipo: 'fala', quem: 'Cavaleiro',
    texto: 'Rainha, peço perdão pelas minhas lacrações. Não era minha intenção que isso a ofendesse...' },
  { cena: '06-rainha', tipo: 'fala', quem: 'Rainha',
    texto: 'O divo realmente acha que isso será o suficiente, depois de todos os insultos?' },
  { cena: '07-acabado', tipo: 'fala', quem: 'Cavaleiro',
    texto: 'Minha rainha, sei que fui um grande tolo ao usar vossas palavras contra vós. Peço que me perdoeis, prometo que jamais voltarei a lacrar.' },

  { id: 'veredito', cena: '08-escolha', tipo: 'escolha',
    texto: 'O que você irá fazer?',
    opcoes: [
      { texto: 'Perdoar o divo', ir: 'perdoado' },
      { texto: 'Expulsá-lo do reino', ir: 'expulso' },
    ] },

  { id: 'expulso', cena: '07-acabado', tipo: 'fala', quem: 'Cavaleiro',
    texto: 'Espera, majestade! Eu sei que mereço... mas pense em quantas risadas eu ainda posso te render. Me dá só mais uma chance?' },
  { cena: '08-escolha', tipo: 'escolha',
    texto: 'O que você irá fazer?',
    opcoes: [{ texto: 'Perdoar o divo', ir: 'perdoado' }] },

  { id: 'perdoado', cena: '09-bolsinha', tipo: 'fala', quem: 'Rainha',
    texto: 'Está perdoado, divo. Mas não pense que escapará tão facilmente da próxima vez.' },
  { cena: '09-bolsinha', tipo: 'fala', quem: 'Cavaleiro',
    texto: 'Sendo assim... tenho algo para você.' },

  { cena: '10-entrega', tipo: 'escolha',
    texto: 'O cavaleiro deseja te entregar um convite. Deseja recebê-lo?',
    opcoes: [
      { texto: 'Sim', ir: 'convite' },
      { texto: 'Não', ir: 'insistir' },
    ] },
  { id: 'insistir', cena: '11-olhinho', tipo: 'escolha',
    texto: 'Mas ele se esforçou tanto pra te entregar esse convite... e até o golden e o husky estão torcendo. Tem certeza? Vamos tentar de novo: gostaria de recebê-lo?',
    opcoes: [{ texto: 'Sim, por sua coragem.', ir: 'convite' }] },

  { id: 'convite', cena: '12-cafe', tipo: 'convite' },
  { id: 'agenda', cena: '12-cafe', tipo: 'agenda' },

  { id: 'final', cena: '14-final', tipo: 'fim',
    texto: 'No fim, tudo deu certo...\nE o cavaleiro aprendeu que jamais deve lacrar sua princesa novamente, e que o maior ato de coragem é saber pedir o seu perdão.',
    botao: 'Jogar novamente' },
];
