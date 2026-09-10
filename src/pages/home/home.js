/**
 * home.js — ORQUESTRAÇÃO da página inicial.
 *
 * Este arquivo não tem regra de movimento nem de layout: ele só
 * diz o que roda e em que ordem. O comportamento de cada dobra
 * mora ao lado do CSS dela, em secoes/, com o mesmo nome:
 *
 *   | dobra           | CSS                      | JS                     |
 *   |-----------------|--------------------------|------------------------|
 *   | 1 hero          | secoes/01-hero.css       | secoes/01-hero.js      |
 *   | 2 faixa         | secoes/02-faixa.css      | secoes/02-faixa.js     |
 *   | 3 sobre         | secoes/03-sobre.css      | secoes/parallax.js     |
 *   | 4 números       | secoes/04-numeros.css    | (só CSS)               |
 *   | 5 especialidades| secoes/05-...css         | (só CSS: sticky)        |
 *   | 6 exames        | secoes/06-exames.css     | (só CSS)               |
 *   | 7 treino        | secoes/07-treino.css     | (só CSS)               |
 *   | 8 cuidado       | secoes/08-cuidado.css    | (só CSS)               |
 *   | 9 miriam        | secoes/09-miriam.css     | secoes/parallax.js     |
 *   | 10 método       | secoes/10-metodo.css     | secoes/10-metodo.js    |
 *   | 11 missão       | secoes/11-missao.css     | secoes/parallax.js     |
 *   | 12 conteúdos    | secoes/12-conteudos.css  | (só CSS)               |
 *   | 13 cta          | secoes/13-cta.css        | (só CSS)               |
 *
 * Dobra sem JS é dobra que o CSS resolve sozinho — é o normal
 * aqui, e não falta de arquivo.
 *
 * Nada neste projeto interpola valor de estilo no JavaScript: o
 * JS escreve classe e variável CSS, o CSS anima. As medições
 * estão no README.
 *
 * Devolve a promessa do vídeo da hero, para o preloader esperar.
 */

import { quebrarTodos } from "../../js/utils/split-texto.js";
import { revelarAoEntrar, escalonar } from "../../js/utils/observador.js";
import { initGsap } from "../../js/libs/gsap-setup.js";

import { initHero } from "./secoes/hero/01-hero.js";
import { initFaixa } from "./secoes/marquee/02-faixa.js";
import { initMetodo } from "./secoes/metodo/10-metodo.js";
import { initParallax } from "../../js/utils/parallax.js";

export function initHome() {
  // 1. quebra os títulos em caracteres (o CSS é quem move)
  quebrarTodos();

  // 2. escalona os delays dentro de cada grupo. O passo acompanha
  //    o --anim-dur das dobras: com a entrada mais longa, um passo
  //    curto faz os irmãos se sobreporem e a sequência some.
  escalonar("[data-escalona]", 0.115);

  // 3. observadores de entrada. A hero fica de fora: lá quem
  //    acende é o initHero, junto com o play do vídeo.
  //
  //    repetir: true — a dobra anima na descida E na subida. Sem
  //    ele a classe entra uma vez e nunca sai, então quem volta
  //    pelo scroll encontra tudo já montado e parado.
  revelarAoEntrar("[data-anim]", { repetir: true, ignorarDentroDe: ".hero" });

  //    o texto quebrado espera um pouco mais para entrar: a
  //    cascata por caractere é longa, e disparar na borda deixaria
  //    metade dela acontecendo fora da tela
  revelarAoEntrar("[data-split]", {
    repetir: true,
    opcoes: { rootMargin: "-14% 0px -18% 0px", threshold: 0 },
    ignorarDentroDe: ".hero",
  });

  // 4. as dobras, na ordem em que aparecem na tela
  const videoPronto = initHero();
  initFaixa();
  // 5 especialidades não tem JS: a pilha é sticky puro, no CSS

  // 5. o que depende do scroll amarrado ao GSAP
  if (initGsap()) {
    initParallax();   // 3 sobre, 9 miriam, 11 missão
    initMetodo();     // 10 método

    // As posições de start/end são medidas no instante em que o
    // gatilho nasce, e aí as webfonts ainda não trocaram. Quando
    // trocam, os títulos mudam de altura, tudo abaixo desce, e cada
    // gatilho passa a disparar no lugar errado. O sintoma aparece
    // principalmente na SUBIDA, com o trecho de scrub travado num
    // valor porque o fim dele ficou fora do alcance real do scroll.
    // Remedir quando as fontes assentam e quando o preloader sai.
    const remedir = () => window.ScrollTrigger.refresh();
    document.fonts?.ready.then(remedir);
    document.addEventListener("preloader:fim", remedir, { once: true });
  }

  // 6. medição sob demanda, para não virar loop de print
  if (new URLSearchParams(location.search).has("medir")) medir();

  return videoPronto;
}

function medir() {
  const alvos = document.querySelectorAll("section[id], .hero, .esp, .esp__cartao");
  console.table(
    [...alvos].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el: el.id || el.className.split(" ")[0],
        top: Math.round(r.top + window.scrollY),
        largura: Math.round(r.width),
        altura: Math.round(r.height),
        proporcao: (r.width / r.height).toFixed(3),
      };
    })
  );
  console.log("scrollHeight total:", document.documentElement.scrollHeight);
}
