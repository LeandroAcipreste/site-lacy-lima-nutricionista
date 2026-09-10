/**
 * observador.js
 * Um único IntersectionObserver liga a classe .is-in em tudo
 * que tem [data-anim] ou [data-split]. O movimento em si é
 * responsabilidade do CSS.
 *
 * Com repetir: true a classe também SAI quando o elemento deixa a
 * faixa, e é isso que faz a dobra animar de novo na subida do
 * scroll, não só na descida.
 */

/* A faixa de disparo é recuada nos DOIS lados, e não só embaixo.
   Com recuo só no rodapé, descendo o elemento entrava no lugar
   certo, mas subindo ele entrava pela borda de cima e a animação
   acontecia quase fora da tela.

   E o gatilho é threshold 0, não uma fração: com fração, elemento
   alto perto do limite fica oscilando em volta do valor e, com o
   reaproveitamento ligado, pisca. Com 0 a conta é binária — ou
   encostou na faixa, ou não. */
const PADRAO = { rootMargin: "-10% 0px -12% 0px", threshold: 0 };

/**
 * @param {string} seletor  o que observar
 * @param {{repetir?: boolean, opcoes?: IntersectionObserverInit, ignorarDentroDe?: string}} config
 *   ignorarDentroDe: pula os alvos dentro desse ancestral, para uma
 *   seção com coreografia própria (a hero) não ser acesa por aqui também
 * @returns {IntersectionObserver}
 */
export function revelarAoEntrar(seletor, config = {}) {
  const { repetir = false, opcoes = PADRAO, ignorarDentroDe = null } = config;

  let alvos = [...document.querySelectorAll(seletor)];
  if (ignorarDentroDe) alvos = alvos.filter((el) => !el.closest(ignorarDentroDe));

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("is-in");
        if (!repetir) observador.unobserve(entrada.target);
      } else if (repetir) {
        entrada.target.classList.remove("is-in");
      }
    });
  }, opcoes);

  alvos.forEach((alvo) => observador.observe(alvo));
  return observador;
}

/**
 * Escalona os elementos de um grupo escrevendo --d (em segundos,
 * número puro: `calc(0s * 1s)` é inválido e mataria a regra).
 */
export function escalonar(seletor, passo = 0.09, inicio = 0) {
  document.querySelectorAll(seletor).forEach((grupo) => {
    const filhos = grupo.querySelectorAll("[data-anim]");
    filhos.forEach((filho, i) => {
      if (filho.style.getPropertyValue("--d")) return;
      filho.style.setProperty("--d", (inicio + i * passo).toFixed(3));
    });
  });
}
