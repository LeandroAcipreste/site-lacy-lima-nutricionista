# Site Lacy Lima · Nutricionista

HTML, CSS e JavaScript puros, sem build. Abrir com qualquer servidor
estático a partir da raiz (os módulos ES não funcionam em `file://`):

```bash
npx serve .        # ou python -m http.server
```

## Estrutura

Cada dobra da home tem a **sua pasta**, com o CSS e o JS dela juntos. O número
do arquivo é a posição na página; a pasta leva o nome da seção.

```
index.html                       home
assets/
  images/shared/                 assinatura-lacy.png, marca-lacy.png (máscaras)
  images/pages/home/             fotos das dobras, já em .webp
  videos/hero-lacy.mp4           hero, 738 KB, sem áudio, faststart
  icons/favicon.png
src/
  css/                           o que vale para o site inteiro
    reset.css → variables.css → base.css → components/  (ordem de import)
    components/  preloader, animacoes, botao, header, footer
    style.css    só @import, nenhuma regra solta
  js/
    main.js      orquestra pelo data-page do <body>
    config.js    número do WhatsApp num lugar só
    utils/       split-texto.js, observador.js, parallax.js
    components/  preloader, header, contato   (globais, não dobras)
    libs/        gsap-setup.js
  pages/
    home/
      home.css   só @import das seções — a ordem É a cascata
      home.js    só orquestração — quem roda e em que ordem
      secoes/
        hero/            01-hero.css  01-hero.js  01-hero-video.js
        marquee/         02-faixa.css  02-faixa.js
        sobre/           03-sobre.css
        numeros/         04-numeros.css
        especialidades/  05-especialidades.css  05-especialidades.js
        exames/          06-exames.css
        treino/          07-treino.css
        cuidado/         08-cuidado.css
        miriam/          09-miriam.css
        metodo/          10-metodo.css  10-metodo.js
        missao/          11-missao.css
        conteudos/       12-conteudos.css
        cta/             13-cta.css
    privacidade/ privacidade.html, .css, .js
desginsystem/                    material de referência, não é código do site
```

## O padrão de animação

**O CSS anima, o GSAP só controla.** O JavaScript escreve exatamente quatro
coisas e nada mais:

- a classe `.is-in` no elemento (via IntersectionObserver);
- as variáveis `--i` e `--n` nos caracteres do split;
- as variáveis de progresso `--p` e `--py`, escritas pelo ScrollTrigger;
- a classe `.is-aberto` / `.tem-aberto` no acordeão.

Nenhum `gsap.to()` interpola opacity, transform ou cor. Cada elemento nasce
com um estado "fora" declarado no CSS, sempre dentro de
`@media (prefers-reduced-motion: no-preference)`, e a travessia é `transition`
ou `@keyframes`. Para calibrar o ritmo de qualquer animação, abra o CSS.

O GSAP entra por CDN e é opcional: se o CDN não responder, `initGsap()`
devolve `false`, avisa no console e o site continua funcionando só com CSS.

## Onde fica cada coisa

**Cada dobra tem a sua PASTA, com o CSS e o JS dela juntos.** A pasta leva o
nome da seção; o arquivo mantém o número, que é a posição na página.

**Regra para achar: o prefixo da classe antes do `__` é o nome da pasta.**
`.treino__copia` → `src/pages/home/secoes/treino/07-treino.css`.

| # | dobra          | classes            | pasta `secoes/`  | arquivos                          |
|---|----------------|--------------------|-----------------|-----------------------------------|
| 1 | hero           | `.hero__*`         | `hero/`         | `01-hero.css` `.js` `-video.js` |
| 2 | faixa          | `.faixa__*`        | `marquee/`      | `02-faixa.css` `.js`             |
| 3 | sobre          | `.sobre__*`        | `sobre/`        | `03-sobre.css`                    |
| 4 | números        | `.numeros__*`      | `numeros/`      | `04-numeros.css`                  |
| 5 | especialidades | `.pilha__*`        | `especialidades/`| `05-...css` `.js`               |
| 6 | exames         | `.exame__*`        | `exames/`       | `06-exames.css`                   |
| 7 | treino         | `.treino__*`       | `treino/`       | `07-treino.css`                   |
| 8 | cuidado        | `.cuidado__*`      | `cuidado/`      | `08-cuidado.css`                  |
| 9 | miriam         | `.miriam__*`       | `miriam/`       | `09-miriam.css`                   |
| 10| método         | `.metodo__*`       | `metodo/`       | `10-metodo.css` `.js`            |
| 11| missão         | `.missao__*`       | `missao/`       | `11-missao.css`                   |
| 12| conteúdos      | `.conteudos__*`    | `conteudos/`    | `12-conteudos.css`                |
| 13| cta            | `.cta__*`          | `cta/`          | `13-cta.css`                      |

Pasta só com CSS é dobra que o CSS resolve sozinho: é o normal aqui, não
arquivo faltando.

**O que serve mais de uma dobra não mora em pasta de dobra.** O parallax vale
para `sobre`, `miriam` e `missao` — pô-lo em qualquer uma delas mentiria
sobre o alcance —, então vive em `src/js/utils/parallax.js`. Entra na conta
quem declara `data-parallax` no HTML.

**Cada arquivo de seção é autossuficiente:** leva as próprias quebras de layout
(1023 / 767 / 479px) no fim dele, do maior para o menor. Antes elas moravam
todas num bloco `RESPONSIVO` no fim de um arquivo de 1075 linhas, e o mobile de
uma dobra ficava a centenas de linhas do desktop dela.

`home.css` e `home.js` não têm conteúdo próprio: são índice e orquestração. **A
ordem dos `@import` em `home.css` é a cascata** — não reordenar por gosto.

O que vale para o site inteiro fica fora de `secoes/`: `src/css/` (reset,
tokens, base, botão, header, footer, preloader, animações) e
`src/js/components/` (header, contato, preloader), mais `src/js/utils/`
(observador, split de texto, parallax) e `src/js/libs/` (gsap).

**Ao mover um arquivo de seção, o que quebra calado são os imports DENTRO
dele**, que ficam um nível mais fundo. Não conte `../` no olho: resolva o
caminho real de cada alvo contra o disco. Um script que varre `src/` +
`index.html` e testa todo `from`, `@import`, `url()`, `src` e `href` contra o
sistema de arquivos pega isso em segundos — hoje são 96 referências.

A divisão foi verificada comparando estilo computado de 841 elementos em 7
larguras (1440 / 1024 / 900 / 767 / 600 / 479 / 390) e 42 propriedades, entre o
arquivo único antigo e a árvore nova: **zero diferenças**. Para a comparação ser
honesta é preciso tirar três fontes de ruído — semente fixa no `Math.random`
(o `split--sorteio` lê dele), transições e animações congeladas, e `--v`
travado em 1 (a hero segue o relógio do vídeo, que corre entre uma captura e
outra). Sem isso o próprio teste acusa 354 diferenças que não existem.

## Medições (Fase 3)

Tomadas em Chrome headless via CDP, com
`Emulation.setEmulatedMedia prefers-reduced-motion: no-preference` — sem isso
o headless finge ter a preferência e nenhuma animação roda.

### Preloader

A assinatura é uma máscara PNG de 413×266 extraída do material da Lacy. A
tinta por baixo é um degradê com a borda esfumada, que atravessa de
`translateX(-100%)` a `translateX(2%)`.

Por que 2% e não 0%: a tinta mede 114% do palco e a parte opaca termina aos
86% dela, então o traço só cobre a assinatura inteira em
`(1 − 0.86 × 1.14) / 1.14 ≈ 1,7%`.

A ponta da caneta segue a trajetória real, medida como média ponderada de y
por coluna do PNG:

| x%  | 0  | 15 | 25 | 35 | 45 | 55 | 65 | 75 | 85 | 100 |
|-----|----|----|----|----|----|----|----|----|----|-----|
| y%  | 75 | 48 | 52 | 65 | 67 | 63 | 48 | 43 | 43 | 48  |

### Especialidades: a pilha de cartões percorrida no scroll

Os quatro cartões ficam **um sobre o outro** no mesmo palco. Ao chegar na dobra
o palco gruda na tela, o scroll passa a trazer um cartão por cima do anterior, e
quando o último assenta a página volta a rolar. Vale em todos os tamanhos de
tela — não há versão empilhada só para desktop.

**Quem prende o palco é `position: sticky`, não o `pin` do ScrollTrigger.** O
pin reescreve o DOM e insere um espaçador; qualquer falha dele deixa um buraco
de layout de quatro telas. Com sticky o CSS resolve sozinho e o JS escreve uma
variável só, `--p`, de 0 a 1 ao longo da travessia.

Antes de desenhar isso foi preciso confirmar que sticky funciona aqui:
`body { overflow-x: hidden }` costuma transformar o body em contêiner de
rolagem e matar sticky **em silêncio**. Medido nesta página, com a regra, com
`overflow-x: clip` e sem nada: gruda nos três casos.

**Quatro cartões são TRÊS trocas, não quatro.** Com o denominador em `--n` o
último assentava em `--p` 0,75 e sobrava quase uma tela inteira de rolagem sem
nada acontecer. O denominador é `--passos = --n - 1 + --respiro`, com
`--respiro: .38`, e aí o último assenta em 0,89 — a cauda parada, que existe
para ele ser lido antes de soltar, cai para cerca de um terço de tela.

Travessia medida em 1440×900, com o palco preso em `top: 0` por 3195 px
contínuos (topo do cartão na tela, e a escala dele):

| `--p`  | cartão 1  | cartão 2       | cartão 3        | cartão 4       |
|--------|-----------|----------------|-----------------|----------------|
| 0,00   | 120       | fora (912)     | fora            | fora           |
| 0,29   | 142 · 0,93| chegou (147)   | fora            | fora           |
| 0,57   | 0,93      | 0,94           | chegando (174)  | fora           |
| 0,93   | 0,93      | 0,93           | 0,93            | chegou (120)   |

Em 390×844 a pilha tem 4,20 telas e o comportamento é o mesmo.

**Sem `.is-scrub`** — sem JS, sem GSAP ou com `prefers-reduced-motion: reduce`
— a pilha é uma lista de cartões na vertical. Nada some, nada trava, e a dobra
não fica com altura de quatro telas vazias. A classe só entra quando o JS
confirma que dá para animar.

**`--e` e `--s` não são legíveis por `getComputedStyle`.** Propriedade
customizada sem `@property` não computa: ela substitui texto. Para inspecionar
a pilha, medir o resultado — a posição do cartão na tela e a matriz de
`transform` — e não as variáveis.

### O vocabulário de entrada das figuras

Quatro variantes, todas em `src/css/components/animacoes.css`:

| `data-anim`        | o que faz                              | onde        |
|--------------------|----------------------------------------|-------------|
| `cortina`          | recorte abre de cima para baixo        | 9 miriam    |
| `cortina-lateral`  | recorte abre da esquerda para a direita| 7 treino    |
| `levanta`          | a foto sobe como se estivesse deitada  | 11 missão   |
| `cai`              | a foto despenca de cima e assenta      | 3 sobre     |

**Nenhuma delas transforma o elemento observado.** Recorte a zero *e* `rotateX`
perto de 90° achatam a caixa, e o IntersectionObserver volta a reportar área 0 —
a mesma armadilha que deixava as quatro cortinas travadas. Quem se transforma é
sempre a mídia dentro da figura.

**Um transform só, montado por partes.** As figuras de `sobre`, `miriam` e
`missao` também têm parallax, e parallax e entrada querem escrever `transform`
no mesmo elemento com a mesma especificidade: a última regra apagaria a outra em
silêncio. Por isso o transform é montado uma vez em `.parallax > img`, e cada
efeito só escreve a variável dele — `--py`, `--cai`, `--cai-giro`,
`--levanta`. **Quem adicionar um efeito novo nessa mídia acrescenta uma
variável, não uma regra de transform nova.**

**Ângulo e deslocamento animados precisam de `@property`.** Sem declarar
`syntax: "<angle>"` / `"<number>"`, o navegador não sabe interpolar a variável,
trata a troca como discreta, e o movimento acontece de um quadro para o outro
sem animar. Foi assim que `--levanta` apareceu primeiro como um salto.

Curvas medidas com amostragem por `requestAnimationFrame` dentro da própria
página — capturar tela custa centenas de ms e desalinha qualquer cronômetro
externo:

| tempo  | `--levanta` | opacidade |   | tempo  | `--cai` |
|--------|------------|-----------|---|--------|--------|
| 0ms    | 84°        | 0         |   | 0ms    | −104%  |
| 500ms  | 80,9°      | 0,01      |   | 350ms  | −99,3% |
| 700ms  | 32,1°      | 0,47      |   | 700ms  | −79,4% |
| 900ms  | 13,5°      | 0,82      |   | 900ms  | −49,3% |
| 1400ms | 0,9°       | 1         |   | 1100ms | −4,0%  |

A queda usa `cubic-bezier(.55, .06, .68, .19)`, que acelera até o fim: é o que
dá peso, porque ela para seco em vez de desacelerar.

### Entrada das dobras: o que quebrava e o ritmo

Auditado em Chrome headless: a página inteira percorrida de cima a baixo e de
baixo a cima, parando a cada meia tela, esperando 1,9 s e cobrando animação de
todo `[data-anim]`/`[data-split]` que já tivesse passado da linha do
observador. Desktop 1440×900, mobile 390×844 e com `prefers-reduced-motion:
reduce` — nas três, descida e subida.

**O bug que estava lá.** As QUATRO figuras com `data-anim="cortina"` nunca
apareciam, em nenhuma direção: `is-in=false` e `clip-path: inset(0 0 100%)`
para sempre. `clip-path` zerado no elemento observado faz o
IntersectionObserver reportar razão 0 permanentemente. Medido na mesma caixa de
1205 px inteira na tela:

| estado do elemento          | isIntersecting | ratio  |
|-----------------------------|----------------|--------|
| `inset(0 0 100% 0)`         | false          | 0      |
| `clip-path: none`           | true           | 0,4335 |
| `inset(0 0 100% 0)` de novo | false          | 0      |

Como abrir a cortina é mudança de **pintura**, não de layout, o observador não
roda de novo e o elemento fica preso. A correção: o elemento observado mantém a
caixa limpa e quem se recorta é a mídia dentro dele.

Cuidado ao mexer nisso: `transition` é shorthand. A foto da Miriam tem o cinza
do hover no mesmo elemento, e declarar só a transição do `clip-path` apagaria a
outra em silêncio — as duas vêm juntas em `.miriam__figura img`.

**Por que a primeira varredura não pegou.** Ela media `opacity`, e cortina anima
`clip-path`: uma travada fechada tem `opacity: 1` e passa como aprovada. Foi
preciso uma sonda que lesse `is-in` e `clipPath` das cortinas.

**Ritmo.** As dobras fora da hero entram com fator ~1,33 sobre o que era:

| o quê                          | antes | agora |
|--------------------------------|-------|-------|
| `--anim-dur` padrão            | .9s   | 1.2s  |
| `sobe-alto`                    | 1.2s  | 1.6s  |
| `cortina`                      | 1.25s | 1.7s  |
| `regua`                        | 1.1s  | 1.5s  |
| caractere, opacidade           | .5s   | .68s  |
| caractere, deslocamento        | .78s  | 1.05s |
| `--passo-char`                 | .026  | .034  |
| escalonamento entre irmãos     | .085  | .115  |

O passo entre irmãos sobe junto porque com a entrada mais longa um passo curto
faz os irmãos se sobreporem e a sequência deixa de ser lida. A hero fica em
`.9s`: lá o compasso é o tempo do vídeo, e esticar atrasaria o painel em
relação à cena.

O acordeão abre 830 ms depois da fita entrar (era 620 ms, calibrado para a
entrada antiga), para abrir depois do fade e não no meio dele.

Os `ScrollTrigger` medem start/end quando nascem, antes das webfonts trocarem;
quando trocam, os títulos mudam de altura e tudo abaixo desloca. Há um
`ScrollTrigger.refresh()` em `document.fonts.ready` e em `preloader:fim`.

**As dobras animam nas duas direções.** `revelarAoEntrar` roda com
`repetir: true`: a classe `.is-in` sai quando o elemento deixa a faixa de
disparo, e entra de novo quando ele volta. Sem isso a classe entrava uma vez e
nunca saía, e quem subia o scroll encontrava tudo montado e parado.

Duas coisas mudaram junto, e as duas são necessárias para isso não piscar:

- a faixa recua nos **dois** lados (`rootMargin: -10% 0px -12% 0px`, e
  `-14% / -18%` para o texto quebrado, cuja cascata por caractere é mais
  longa). Com recuo só no rodapé, descendo o elemento entrava no lugar certo,
  mas subindo ele entrava pela borda de cima e a animação acontecia quase fora
  da tela;
- o gatilho é `threshold: 0`, não uma fração. Com fração, elemento alto perto
  do limite fica oscilando em volta do valor e, com o reaproveitamento ligado,
  pisca. Com 0 a conta é binária.

Provado por ciclo completo, nove alvos: chega e anima (1), sai de vista e reseta
(0), volta e anima de novo (1). Os nove passam.

### Continuidade entre a hero e o fundo do vídeo

O painel de vídeo é uma coluna 9:16 encostada na direita, e a dobra tem de
continuar o ciclorama que aparece dentro dele. **Não há imagem de fundo na
hero**: ela é uma cor só, e a cor é o próprio ciclorama do vídeo, medido numa
coluna de 5px colada na borda esquerda do painel, média da altura toda, em
quatro tamanhos de tela.

| viewport  | ciclorama do vídeo (R,G,B) |
|-----------|----------------------------|
| 1440×900  | 0,4 · 28,7 · 25,8          |
| 1920×1080 | 0,2 · 28,0 · 24,1          |
| 1600×820  | 0,2 · 28,1 · 24,3          |
| 1280×860  | 0,2 · 28,2 · 24,5          |

Média (0,25 / 28,25 / 24,7) → `--video-cenario: #001c19`. Mesma cor dos dois
lados da junção, então não existe emenda para ver.

Tentativas descartadas, com o motivo: uma textura de fundo verde chegava
+7,7 / +10,3 / +6,1 mais clara que o vídeo na junção, e mesmo corrigida por
multiplicação ainda entregava a borda — o fundo do vídeo é liso e a textura
tem grão, e isso aparece com o nível certo. Um verde chapado mas arbitrário
(#00261e) errava por até 7. O que resolve é medir o vídeo e usar o número.

### Desempenho da hero: onde estava o travamento

A cena da hero rodava a **17 fps**. A suspeita natural é o vídeo carregando ao
mesmo tempo em que as letras entram — e estava errada. Isolado em três
execuções, na mesma máquina:

| cenário                                   | fps |
|-------------------------------------------|-----|
| como estava                               | 17  |
| vídeo tocando, sem escrever `--v`         | 59  |
| sem vídeo, só escrevendo `--v`            | 27  |

**O custo era escrever `--v` no `<html>` a cada quadro.** Propriedade
customizada na raiz invalida o estilo de tudo que herda dela — 840 elementos —
para servir os 47 que de fato leem a variável: o `.header` e o que está dentro
da `.hero`. Escrevendo nesses dois elementos, e pulando a escrita quando o
valor não mudou, a cena foi para **54 fps**.

Quando o preloader solta, o vídeo já está com `readyState 4` e o buffer cheio:
o preloader faz o trabalho dele. O gargalo nunca foi o download.

### A cena não pode depender do vídeo para andar

Num celular com CPU 4× estrangulada o vídeo engasga e leva 9,4 s para uma cena
de 8 s. Como as letras liam `currentTime`, elas congelavam junto — e letra
parada no meio da entrada é exatamente o "travou" que o visitante vê.

O progresso passou a ser o **maior** entre o do vídeo e o de um relógio de
parede no mesmo ritmo. Com o vídeo normal os dois coincidem e quem manda é ele;
se ele engasga, o relógio carrega a cena até o fim. Só cresce, nunca volta.

### Vídeo picotado é pior que pôster parado

Em 4G o preloader entregava o vídeo no `canplay` (readyState 3, **1,82 s de 8**
bufferizados) e ele engasgava **quatro vezes** durante a cena.

Agora só o `canplaythrough` conta: ou o vídeo pode ir até o fim sem parar, ou
não começa, e a dobra roda com o pôster e o cronômetro. O `readyState` é
conferido de novo no instante de tocar, porque ele pode cair entre a promessa e
o play.

| cenário            | antes            | depois                  |
|--------------------|------------------|-------------------------|
| desktop            | 17 fps           | 54–58 fps               |
| celular, CPU 4×    | 49 fps, 1 travada| 43–50 fps               |
| celular 4G, CPU 4× | 4 travadas       | **0 travadas**, 50 fps  |

As 42 letras do título completam nos dois caminhos — com vídeo e sem.

**O vídeo tem 3,3 MB.** Em 4G ele não chega a tempo e o site cai no pôster, que
é o comportamento correto, mas significa que boa parte dos visitantes de celular
não vê o vídeo. Para ele aparecer no celular, precisa caber em algo como
800 KB – 1 MB para os 8 segundos.

### O vídeo da hero: o que pesava, e o que era pior que o peso

O arquivo tinha 3 395 KB. Três problemas, e o maior **não** era o tamanho.

| | antes | depois |
|---|---|---|
| tamanho | 3 395 KB | 738 KB |
| trilha de áudio | 140 kbps | removida |
| átomo `moov` | no **fim** do arquivo | a 3 KB do início |

**O `moov` no fim era o pior.** É o índice do MP4: sem ele o navegador não sabe
onde estão os quadros, então precisava baixar os 3,4 MB **inteiros** antes de
tocar o primeiro frame. `-movflags +faststart` move o índice para a frente e a
reprodução começa depois de 3 KB. Para conferir num MP4 qualquer, basta ler a
ordem dos átomos no começo do arquivo: `ftyp moov ... mdat` é certo,
`ftyp ... mdat moov` é o problema.

**A trilha de áudio** ocupava 140 kbps num vídeo que toca `muted` e
`aria-hidden`. `-an` e pronto.

O encode é `libx264 -crf 28` sem áudio, com `-g 48` para o `currentTime = 0`
antes do play não custar uma busca longa. SSIM contra o original: 0,970 a 0,977
conforme o CRF; a 611 KB (CRF 29) o rosto já é indistinguível a 100% de zoom, e
o vídeo ainda é exibido reduzido — 506×900 no desktop, 390×844 no celular.

**Preset alto comprime melhor e decodifica pior.** `-preset veryslow` gera mais
quadros de referência e perfil High; num decodificador por software isso vira
travada com o vídeo já 100% bufferizado. Para o mesmo CRF o tamanho é o mesmo
(754 KB em perfil Main, nível 3.1, 2 B-frames), então não há motivo para pagar
o custo de decodificação.

**Em conexão ruim o vídeo não é baixado.** Medido em 3G lento: o download
disputava banda com CSS, fontes e pôster, e a página levava 33 s para ficar de
pé. `navigator.connection` decide — em `2g`/`3g` ou com `saveData` ligado, o
vídeo nem começa a carregar, fica o pôster e a cena roda no cronômetro.

Resultado em celular 4G com CPU 4× estrangulada: antes o vídeo **não tocava**
(caía no pôster) e o preloader ficava 14,7 s no ar; depois ele toca até o fim,
sem travar no meio, com o preloader em 7,7 s.

### Dobras, viewport 1440×900

| dobra           | topo  | altura |
|-----------------|-------|--------|
| hero            | 0     | 900    |
| faixa           | 900   | 57     |
| sobre           | 957   | 1101   |
| números         | 2058  | 308    |
| especialidades  | 2366  | 1307   |
| exames          | 3673  | 1157   |
| treino          | 4830  | 961    |
| abordagem       | 5791  | 1288   |
| miriam          | 7079  | 675    |
| método          | 7754  | 642    |
| missão          | 8396  | 957    |
| conteúdos       | 9353  | 856    |
| contato         | 10209 | 396    |
| footer          | 10605 | 537    |

Para remedir a qualquer momento, abra a home com `?medir=1` e leia o
`console.table`.

## Assets

As imagens de referência em PNG somavam ~20 MB. Convertidas para WebP e o
vídeo reencodado (720×1280 a 7 Mbps → 608×1080), o site inteiro carrega
cerca de 1 MB de mídia.

O pôster da hero é o mesmo caso: `hero-poster.png` tem 1,8 MB e vira 98 KB em
WebP. O PNG fica no repo como original — quem é servido é o `.webp`.

A assinatura e a logo são PNGs **de máscara**: RGB branco e o desenho no
canal alfa. Isso permite recolorir os dois em CSS com `mask` +
`background: currentColor`, e é por isso que a mesma assinatura aparece em
creme no preloader, em tinta na dobra "Sobre" e em branco no rodapé.

## Conteúdo recuperado do site antigo

A dobra **Exames** (calorimetria indireta e polissonografia) e a logo vieram
de `desginsystem/design-da-pagina/site-antigo/`, que não estavam na
referência nova. O WhatsApp `5579998116061` mora em `src/js/config.js`, e os
links são montados a partir de `[data-wpp]` — para trocar o número, é um
lugar só.
