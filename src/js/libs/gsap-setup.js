/**
 * gsap-setup.js
 * O GSAP entra por CDN, antes do módulo (ver o fim do <body>).
 * Ele existe aqui para UMA coisa: ler o progresso do scroll e
 * escrever variáveis CSS. Nenhuma interpolação de opacity,
 * transform ou cor sai daqui — isso é trabalho do CSS.
 */

let pronto = false;

export function initGsap() {
  if (pronto) return true;
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("[gsap] CDN não respondeu — o site segue só com CSS.");
    return false;
  }
  window.gsap.registerPlugin(window.ScrollTrigger);
  pronto = true;
  return true;
}

/**
 * Escreve uma variável CSS com o progresso do scroll de um trecho.
 * @param {string} seletor  elemento que recebe a variável
 * @param {object} config   { variavel, start, end, escala, gatilho }
 */
export function progressoParaVariavel(seletor, config = {}) {
  if (!initGsap()) return null;

  const el = document.querySelector(seletor);
  if (!el) return null;

  const {
    variavel = "--p",
    start = "top bottom",
    end = "bottom top",
    escala = 1,
    gatilho = seletor,
  } = config;

  return window.ScrollTrigger.create({
    trigger: gatilho,
    start,
    end,
    scrub: true,
    onUpdate: (self) => {
      el.style.setProperty(variavel, (self.progress * escala).toFixed(4));
    },
  });
}
