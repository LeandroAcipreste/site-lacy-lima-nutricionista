/**
 * hero.js — a dobra se constrói no compasso do vídeo.
 *
 * O preloader sai, o vídeo começa a rodar, e a dobra vai se
 * montando ao longo dos 10 s da cena: primeiro a linha de
 * especialidades, depois o título letra por letra, depois o
 * parágrafo, os botões e o "role". Quando ela termina de
 * sentar, a dobra está inteira e o vídeo descansa no último
 * quadro.
 *
 * Este arquivo escreve UMA coisa na tela: --v, o progresso do
 * vídeo de 0 a 1. Em que fração cada bloco entra está no HTML
 * dele (--v0 e --vd), e a conta acontece no CSS. Trocar o
 * ritmo da abertura é mexer nesses números, não aqui.
 *
 * Devolve a promessa do vídeo, para o preloader poder segurar
 * a saída até o primeiro quadro existir.
 */

import { initVideoHero } from "./01-hero-video.js";

/* Quanto dura a cena, em ms.

   É a duração do vídeo da hero, e serve para o caminho SEM vídeo:
   quando o autoplay é recusado, ou o arquivo não chega a tempo, a
   coreografia anda por cronômetro em vez de por currentTime. Os
   dois precisam durar o mesmo, senão a mesma dobra tem dois
   ritmos diferentes dependendo de o vídeo ter carregado ou não.

   Trocou o vídeo? Este é o número a acertar. */
const DURACAO_CENA = 7700;

export function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return Promise.resolve(null);

  const video = initVideoHero();

  /* O painel entra por classe, como qualquer outro elemento.
     O texto NÃO: ele é regido por --v, o progresso do vídeo. */
  const acenderPainel = () => {
    hero.querySelectorAll("[data-anim]").forEach((el) => el.classList.add("is-in"));
  };

  /* A única coisa que este arquivo escreve na tela: uma
     variável com o progresso da cena, de 0 a 1. Quem decide o
     que acontece em cada fração é o CSS, no HTML de cada
     bloco (--v0 e --vd). */
  /* --v vai nos DOIS elementos que o leem, e NÃO no <html>.

     Medido nesta página: escrevendo na raiz, a cena da hero rodava
     a 17 fps; o mesmo vídeo, na mesma máquina, sem essa escrita
     por quadro, rodava a 59. Custom property na raiz invalida o
     estilo de tudo que herda dela — 840 elementos — para servir os
     47 que de fato leem a variável (o .header e o que está dentro
     da .hero).

     E não reescreve quando o valor não mudou: o currentTime anda
     no ritmo do vídeo, não no do requestAnimationFrame, então
     parte dos quadros pediria o mesmo número de novo. */
  const leitores = [hero, document.querySelector(".header")].filter(Boolean);
  let ultimo = "";
  const escrever = (v) => {
    const texto = v.toFixed(4);
    if (texto === ultimo) return;
    ultimo = texto;
    for (const el of leitores) el.style.setProperty("--v", texto);
  };

  escrever(0);

  /* A coreografia segue o vídeo, mas NÃO depende dele para andar.

     O problema medido: num celular com CPU estrangulada o vídeo
     engasga (evento "waiting") e leva 9,4 s para uma cena de 8 s.
     Como as letras liam currentTime, elas congelavam junto — e
     letra parada no meio da entrada é exatamente o "travou" que
     aparece para quem está olhando.

     Aqui o progresso é o MAIOR entre o do vídeo e o de um relógio
     de parede que anda no mesmo ritmo. Enquanto o vídeo roda
     normal os dois coincidem e quem manda é ele; se ele engasga, o
     relógio carrega a cena e o texto termina de entrar. Nunca
     volta atrás, porque só cresce. */
  function seguirVideo(el) {
    let parar = false;
    let pico = 0;
    const t0 = performance.now();

    const quadro = (agora) => {
      if (parar) return;
      const d = el.duration;
      if (d && isFinite(d)) {
        const doVideo = el.currentTime / d;
        const doRelogio = (agora - t0) / 1000 / d;
        pico = Math.min(Math.max(pico, doVideo, doRelogio), 1);
        escrever(pico);
      }
      requestAnimationFrame(quadro);
    };

    el.addEventListener("ended", () => { parar = true; escrever(1); }, { once: true });
    requestAnimationFrame(quadro);
  }

  /* Rede de segurança: sem vídeo, ou com autoplay recusado, a
     dobra não pode ficar em branco. Aqui o tempo vem de um
     cronômetro, com a mesma duração da cena. */
  function seguirRelogio(ms) {
    const inicio = performance.now();
    const quadro = (agora) => {
      const v = Math.min((agora - inicio) / ms, 1);
      escrever(v);
      if (v < 1) requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  }

  let jaRodou = false;

  async function abrir() {
    if (jaRodou) return;
    jaRodou = true;

    if (!video) {
      acenderPainel();
      seguirRelogio(DURACAO_CENA);
      return;
    }

    // O vídeo toca mesmo com movimento reduzido: ele é o conteúdo da
    // dobra, curto, mudo e sem loop. O que a preferência desliga é o
    // deslocamento das letras, e disso o CSS já cuida.
    // Espera limitada: se o vídeo demorar, o texto entra sem ele.
    const el = await Promise.race([
      video.pronto,
      new Promise((r) => setTimeout(() => r(null), 2500)),
    ]);

    /* O readyState pode CAIR entre a promessa e este instante: a
       conexão oscila e o buffer que existia já foi consumido.
       Conferir de novo aqui é o que impede a cena de começar com o
       vídeo prestes a engasgar. */
    const daParaTocar = el && el.readyState >= 4;

    // o vídeo roda e as palavras entram junto, não uma depois da outra
    if (daParaTocar) {
      el.muted = true; // a política de autoplay olha a propriedade
      el.currentTime = 0;
      el.play().catch(() => {
        /* autoplay recusado: fica o pôster, e o texto entra igual */
      });
    }

    acenderPainel();

    if (!daParaTocar) {
      // fica o pôster, e a cena anda no cronômetro
      seguirRelogio(DURACAO_CENA);
      return;
    }

    // se o autoplay for recusado o tempo não anda: o cronômetro assume
    setTimeout(() => {
      if (el.paused && el.currentTime === 0) seguirRelogio(DURACAO_CENA);
    }, 900);

    seguirVideo(el);

    /* O vídeo roda até o fim e descansa no último quadro. Cortar
       no meio, como eu fazia aos 2,6 s, pegava ela ainda andando
       para a poltrona: não lia como "assentou", lia como travou.
       As palavras continuam entrando por cima enquanto ele roda. */
    el.addEventListener(
      "ended",
      () => {
        el.classList.add("is-congelado");
        hero.dispatchEvent(new CustomEvent("hero:congelado"));
      },
      { once: true }
    );

    console.log(`[hero] dobra amarrada ao vídeo: ${el.duration.toFixed(1)}s de cena`);
  }

  // fora da tela o vídeo não precisa continuar decodificando.
  // Depois de congelado ele não volta a tocar: o quadro parado
  // é o estado final, não uma pausa temporária.
  const olho = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        const el = video?.el;
        if (!el || !el.src || el.classList.contains("is-congelado")) return;
        if (!e.isIntersecting) el.pause();
      });
    },
    { threshold: 0.15 }
  );
  if (video) olho.observe(video.el);

  // "saindo" é o começo do fade do preloader, quando a página
  // já está visível: é aí que o vídeo tem de começar a rodar.
  // "fim" fica como rede de segurança, e abrir() é idempotente.
  document.addEventListener("preloader:saindo", abrir, { once: true });
  document.addEventListener("preloader:fim", abrir, { once: true });
  // se o preloader já saiu antes deste módulo carregar
  if (!document.querySelector(".preloader")) abrir();

  return video ? video.pronto : Promise.resolve(null);
}
