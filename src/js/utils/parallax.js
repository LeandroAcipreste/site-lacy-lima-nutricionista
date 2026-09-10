/**
 * parallax.js — a foto se move mais devagar que a página.
 *
 * Vale para TRÊS dobras, e por isso não tem número no nome:
 * 03-sobre, 09-miriam e 11-missao. Quem entra na conta é quem
 * declara data-parallax no HTML.
 *
 * O JS escreve só --py, em pixels. Quem aplica é o CSS, em
 * animacoes.css (.parallax > img). O scale(1.12) que existe lá
 * é o que dá folga para a imagem deslizar sem mostrar borda.
 */

import { initGsap } from "../libs/gsap-setup.js";

/** deslocamento total, em px, do começo ao fim da travessia */
const CURSO = 70;

export function initParallax() {
  if (!initGsap()) return [];

  return [...document.querySelectorAll("[data-parallax]")].map((el) =>
    window.ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // -0.5 a +0.5: a foto chega centrada no meio da travessia
        el.style.setProperty("--py", ((self.progress - 0.5) * CURSO).toFixed(2));
      },
    })
  );
}
