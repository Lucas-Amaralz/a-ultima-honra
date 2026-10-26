"""Converte as cenas de arte-original/ nas imagens do jogo (webp) e gera a capa do link.

Uso: python -I tools/preparar-arte.py  (rodar na raiz do projeto)
Cada cena é um arquivo arte-original/cena-<nome>.png gerado sozinho em 1536x864.
"""
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "arte-original"
SAIDA = RAIZ / "assets" / "img"


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    for origem in sorted(ORIG.glob("cena-*.png")):
        nome = origem.stem.removeprefix("cena-")
        destino = SAIDA / f"{nome}.webp"
        Image.open(origem).convert("RGB").save(destino, "WEBP", quality=90, method=6)
        print(f"{nome}: {destino.stat().st_size // 1024} KB")

    # capa pra pré-visualização do link (WhatsApp, email)
    capa = Image.open(ORIG / "cena-01-reino.png").convert("RGB")
    altura = round(capa.width * 630 / 1200)
    topo = (capa.height - altura) // 3
    capa.crop((0, topo, capa.width, topo + altura)).resize((1200, 630), Image.LANCZOS).save(SAIDA / "capa.jpg", quality=85)


if __name__ == "__main__":
    main()
