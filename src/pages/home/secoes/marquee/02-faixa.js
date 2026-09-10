/**
 * 02-faixa.js — a faixa de pilares correndo em marquee.
 *
 * O movimento é do CSS (animacoes.css, @keyframes marquee). Aqui
 * o JS faz UMA coisa: parar a animação quando a faixa sai da
 * tela, porque animação fora de vista é bateria à toa.
 *
 * A classe é .is-parado e não .is-rodando: se este arquivo não
 * subir, a faixa anda do mesmo jeito em vez de ficar congelada.
 */

export function initFaixa() {
  const marquee = document.querySelector(".marquee");
  if (!marquee) return null;

  const olho = new IntersectionObserver(
    ([e]) => marquee.classList.toggle("is-parado", !e.isIntersecting),
    { threshold: 0 }
  );
  olho.observe(marquee);
  return olho;
}
