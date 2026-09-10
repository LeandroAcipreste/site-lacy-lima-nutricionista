/**
 * video-hero.js
 * Só carrega o vídeo e avisa quando ele pode tocar. Quem
 * decide o momento de dar play, e o de pausar, é o hero.js.
 *
 * O pôster segura o espaço desde o primeiro frame. O vídeo
 * começa a carregar imediatamente, enquanto o preloader ainda
 * cobre a tela: é exatamente esse o momento de baixá-lo, e é
 * para isso que o preloader existe. Esperar o window load abria
 * 2 s de dobra parada entre a saída do preloader e o primeiro
 * quadro.
 */

/**
 * @returns {{ el: HTMLVideoElement, pronto: Promise<HTMLVideoElement> } | null}
 */
/**
 * Em conexão ruim o vídeo não é baixado — nem começa.
 *
 * Medido num celular em 3G lento: o download do vídeo disputa
 * banda com o CSS, as fontes e o pôster, e a página inteira levava
 * 33 s para ficar de pé. O vídeo é enfeite da abertura; o pôster
 * conta a mesma coisa e já está lá. Não vale estrangular a página
 * por ele.
 *
 * Também respeita "economia de dados": quem ligou isso pediu para
 * não baixar mídia pesada, e um vídeo de 740 KB é exatamente isso.
 */
function conexaoRuim() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return false; // sem informação, segue o caminho normal
  if (c.saveData) return true;
  return ["slow-2g", "2g", "3g"].includes(c.effectiveType);
}

export function initVideoHero() {
  const video = document.querySelector("[data-video-hero]");
  if (!video || !video.dataset.src) return null;

  if (conexaoRuim()) {
    // o pôster continua no lugar e a cena roda no cronômetro
    return { el: video, pronto: Promise.resolve(null) };
  }

  const pronto = new Promise((resolve) => {
    const liberar = () => {
      video.classList.add("is-pronto");
      // o invólucro também: é por ele que o CSS apaga o pôster
      video.parentElement?.classList.add("is-pronto");
      resolve(video);
    };

    /* Só o "canplaythrough" conta, nunca o "canplay".

       canplay é readyState 3: dá para COMEÇAR. canplaythrough é 4:
       dá para ir até o fim sem parar. Medido num celular em 4G,
       soltar no 3 entregava o vídeo com 1,82 s de 8 bufferizados,
       e ele engasgava QUATRO vezes durante a cena.

       Vídeo picotado é pior que pôster parado. Se o 4 não vier a
       tempo, esta promessa resolve null (pelo timeout abaixo) e a
       dobra roda com o pôster e o cronômetro — parada, mas
       inteira. */
    video.addEventListener("canplaythrough", liberar, { once: true });

    // se o vídeo não carregar, ninguém fica esperando para sempre:
    // o pôster continua no lugar e a coreografia segue sem ele
    video.addEventListener("error", () => resolve(null), { once: true });
    setTimeout(() => resolve(null), 9000);
  });

  video.src = video.dataset.src;
  video.load();

  return { el: video, pronto };
}
