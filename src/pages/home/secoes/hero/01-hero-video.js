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
    let pulso = 0;
    const liberar = () => {
      if (pulso) { clearInterval(pulso); pulso = 0; }
      video.classList.add("is-pronto");
      // o invólucro também: é por ele que o CSS apaga o pôster
      video.parentElement?.classList.add("is-pronto");
      resolve(video);
    };

    /* PRONTO PARA TOCAR — um critério que o Safari também cumpre.

       O gate era só o evento "canplaythrough". No iOS ele muitas
       vezes NÃO dispara antes de a reprodução começar: o Safari
       segura o download e espera, então a promessa nunca resolvia
       e a dobra abria sempre no pôster, mesmo com o vídeo já
       baixado.

       O critério agora é o que de fato importa, e vale em todo
       navegador: readyState suficiente para começar E buffer à
       frente bastante para a cena rodar sem engasgar. O evento
       canplaythrough continua valendo como atalho, quando vem.

       Vídeo picotado continua sendo pior que pôster parado: se
       nem isto for atingido a tempo, a promessa resolve null e a
       dobra roda com o pôster e o cronômetro. */
    const FOLGA = 4; // segundos de buffer à frente

    const daParaIr = () => {
      if (video.readyState < 3) return false;
      if (!video.buffered.length) return false;
      const fim = video.buffered.end(video.buffered.length - 1);
      const dur = video.duration;
      return fim >= Math.min(isFinite(dur) ? dur : Infinity, FOLGA);
    };

    const conferir = () => { if (daParaIr()) liberar(); };

    video.addEventListener("canplaythrough", liberar, { once: true });
    for (const nome of ["loadeddata", "canplay", "progress", "suspend"]) {
      video.addEventListener(nome, conferir);
    }
    /* o Safari às vezes para de emitir "progress" com o buffer já
       cheio; um pulso curto cobre esse silêncio */
    pulso = setInterval(conferir, 400);
    setTimeout(() => { if (pulso) { clearInterval(pulso); pulso = 0; } }, 12000);

    // se o vídeo não carregar, ninguém fica esperando para sempre:
    // o pôster continua no lugar e a coreografia segue sem ele
    video.addEventListener("error", () => resolve(null), { once: true });
    /* desiste depois da janela do preloader (5,2 + 4,8 = 10s), não
       antes: desistir cedo entregava null com o vídeo já quase
       pronto, e a dobra abria no pôster à toa */
    setTimeout(() => resolve(null), 11000);
  });

  video.src = video.dataset.src;
  video.load();

  return { el: video, pronto };
}
