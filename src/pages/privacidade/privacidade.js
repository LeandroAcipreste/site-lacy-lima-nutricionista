/**
 * privacidade.js
 * A página é de leitura: só revela os blocos e acende o índice
 * lateral conforme a seção entra na tela.
 */

import { revelarAoEntrar } from "../../js/utils/observador.js";
import { quebrarTodos } from "../../js/utils/split-texto.js";

export function initPrivacidade() {
  quebrarTodos();
  revelarAoEntrar("[data-anim]");
  revelarAoEntrar("[data-split]", { opcoes: { threshold: 0.2 } });

  const links = [...document.querySelectorAll(".sumario a")];
  const secoes = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (!secoes.length) return;

  const espiao = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.removeAttribute("aria-current"));
        const ativo = links.find((l) => l.getAttribute("href") === `#${e.target.id}`);
        if (ativo) ativo.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-20% 0px -65% 0px" }
  );

  secoes.forEach((s) => espiao.observe(s));
}
