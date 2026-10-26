# A Última Honra de um Cavaleiro

Uma visual novel curtinha (cerca de um minuto) feita como pedido de desculpas e convite.

Jogar: https://lucas-amaralz.github.io/a-ultima-honra/

## Como funciona

- HTML, CSS e JavaScript puro, sem dependências.
- Todos os textos, escolhas e dados do convite ficam em `js/historia.js`.
- `js/motor.js` cuida das cenas, do texto letra por letra e das escolhas.
- `js/agenda.js` monta o link do Google Agenda e o arquivo `.ics`.
- Funciona com toque, clique e teclado (Espaço, Enter e setas), no celular em pé, deitado e no PC.

## Arte

As cenas ficam em `assets/img/`. Elas saem das folhas originais com:

```
python -I tools/preparar-arte.py
```

## Rodar localmente

```
python -m http.server
```

E abrir http://localhost:8000.
