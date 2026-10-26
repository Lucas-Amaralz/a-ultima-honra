"""Recorta as folhas do storyboard em cenas e gera as imagens do jogo (webp).

Uso: python -I tools/preparar-arte.py  (rodar na raiz do projeto)
"""
from pathlib import Path
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "arte-original"
SAIDA = RAIZ / "assets" / "img"
LARGURA = 1600  # cenas pequenas sao ampliadas ate aqui

# nome da cena: (arquivo, caixa de recorte (x0, y0, x1, y1) ou None pra imagem inteira)
A = "folha-1-3x3.png"
B = "folha-2-2x2.png"
C = "folha-3-2x1.png"
COLS_A, LINHAS_A = [(0, 508), (514, 1020), (1026, 1536)], [(0, 336), (342, 678), (684, 1024)]


def celula_a(c, l):
    return (COLS_A[c][0], LINHAS_A[l][0], COLS_A[c][1], LINHAS_A[l][1])


CENAS = {
    "01-reino": (A, celula_a(0, 0)),
    "02-varanda": (A, celula_a(1, 0)),
    "03-chegada": (A, celula_a(2, 0)),
    "04-ajoelhado": ("cena-04-ajoelhado.png", None),
    "05-perdao": (A, celula_a(1, 1)),
    "06-rainha": (A, celula_a(2, 1)),
    "07-acabado": ("cena-07-acabado.png", None),
    "08-escolha": ("cena-08-escolha.png", None),
    "09-bolsinha": (C, (0, 772, 1024, 1536)),
    "10-entrega": (B, (770, 0, 1536, 466)),
    "11-olhinho": (B, (0, 512, 766, 978)),
    "12-cafe": (A, celula_a(1, 2)),
    "14-final": (B, (770, 512, 1536, 978)),
}


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    for nome, (arquivo, caixa) in CENAS.items():
        img = Image.open(ORIG / arquivo).convert("RGB")
        if caixa:
            img = img.crop(caixa)
        if img.width < LARGURA:
            altura = round(img.height * LARGURA / img.width)
            img = img.resize((LARGURA, altura), Image.LANCZOS)
            img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
        destino = SAIDA / f"{nome}.webp"
        img.save(destino, "WEBP", quality=82, method=6)
        print(f"{nome}: {img.width}x{img.height}  {destino.stat().st_size // 1024} KB")

    # capa pra pré-visualização do link (WhatsApp, email)
    capa = Image.open(SAIDA / "01-reino.webp").convert("RGB")
    altura = round(capa.width * 630 / 1200)
    topo = (capa.height - altura) // 3
    capa.crop((0, topo, capa.width, topo + altura)).resize((1200, 630), Image.LANCZOS).save(SAIDA / "capa.jpg", quality=85)


if __name__ == "__main__":
    main()
