/**
 * preloader.js — a marca sendo carregada.
 *
 * A animação inteira (o giro do símbolo, o nome sendo
 * descoberto, o espacejamento abrindo) é CSS, em
 * components/preloader.css. Aqui só existe o tempo: esperar a
 * animação terminar, esperar o vídeo da hero poder tocar, e
 * sair sem deixar um elemento fixo cobrindo a página.
 *
 * O preloader é real, não decorativo: ele segura a saída até o
 * vídeo poder tocar. Sem isso a dobra abria com o pôster
 * parado e o vídeo entrava dois segundos depois, quebrando a
 * coreografia de "as palavras entram enquanto o vídeo roda".
 */

/* A coreografia inteira, 1,5x mais lenta que era: o giro fecha em
   4,72s e o subtítulo em 4,95s. O preloader existe para o vídeo da
   hero chegar antes da dobra abrir, e o vídeo tem 2,7 MB — com os
   3,5s de antes ele não chegava a tempo em conexão comum. */
const DURACAO = 5200;

/* Tolerância extra esperando o vídeo, depois sai de qualquer jeito. */
const ESPERA_MAXIMA = 4800;

/* TETO ABSOLUTO, contado do início do carregamento da página.

   DURACAO e ESPERA_MAXIMA contam a partir do momento em que ESTE
   módulo roda — e em rede lenta ele roda tarde, porque o HTML, o
   CSS e as fontes vêm antes. Medido num celular em 4G: o módulo
   subia por volta dos 11s, e os 10s da janela viravam 21s de
   preloader na tela.

   performance.now() é o tempo desde o começo da navegação, então
   este teto é o único número que o visitante realmente sente. */
const TETO_ABSOLUTO = 11000;

/** quanto ainda podemos segurar, sem passar do teto */
function restante() {
  return Math.max(0, TETO_ABSOLUTO - performance.now());
}

/**
 * @param {{aguardar?: Promise<unknown>|null}} config
 *   aguardar: promessa que precisa resolver antes da saída
 */
export function initPreloader(config = {}) {
  const { aguardar = null } = config;

  const pre = document.querySelector(".preloader");
  const pagina = document.querySelector(".pagina");
  if (!pre || !pagina) return;

  let encerrado = false;

  /** A marca terminou de aparecer: espera o vídeo, com teto, e sai. */
  async function fechar() {
    if (aguardar) {
      const teto = new Promise((r) =>
        setTimeout(r, Math.min(ESPERA_MAXIMA, restante())));
      await Promise.race([aguardar.catch(() => null), teto]);
    }
    encerrar();
  }

  function encerrar() {
    if (encerrado) return;
    encerrado = true;

    pagina.classList.add("is-visivel");
    document.body.dataset.preload = "pronto";
    pre.classList.add("is-saindo");

    // avisa no INÍCIO do fade, não no fim: a página já está
    // visível aqui, e esperar os .85s da transição deixava a
    // hero quase um segundo no ar, vazia
    document.dispatchEvent(new CustomEvent("preloader:saindo"));

    // some do DOM só quando a transição realmente termina
    pre.addEventListener("transitionend", function sair(ev) {
      if (ev.target !== pre || ev.propertyName !== "opacity") return;
      pre.removeEventListener("transitionend", sair);
      pre.remove();
      document.dispatchEvent(new CustomEvent("preloader:fim"));
    });

    // rede de segurança: se o transitionend não vier, libera assim mesmo
    setTimeout(() => {
      if (document.body.contains(pre)) {
        pre.remove();
        document.dispatchEvent(new CustomEvent("preloader:fim"));
      }
    }, 1400);
  }

  // quem pediu menos movimento não espera o giro inteiro
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(fechar, Math.min(semMovimento ? 2200 : DURACAO, restante()));
}
