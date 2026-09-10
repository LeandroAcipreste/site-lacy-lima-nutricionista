/**
 * 10-metodo.js — o título dos quatro passos entra E sai no scroll.
 *
 * O ScrollTrigger escreve só --p na seção, de 0 a 2: 0→1 é a
 * entrada, 1→2 é a saída. Cada caractere pega a sua fatia dessa
 * faixa através de --i e --n, e a conta inteira acontece no CSS
 * (animacoes.css, .split--scrub). Nada de interpolação aqui.
 */

import { progressoParaVariavel } from "../../../../js/libs/gsap-setup.js";

export function initMetodo() {
  return progressoParaVariavel(".metodo__titulo-scrub", {
    variavel: "--p",
    gatilho: ".metodo",
    start: "top 78%",
    end: "bottom 42%",
    escala: 2,
  });
}
