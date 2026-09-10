/**
 * header.js — estado de rolagem, menu mobile e link ativo.
 * O JS só troca classes e atributos; as transições são do CSS.
 */

export function initHeader() {
  const header = document.querySelector(".header");
  const botao = document.querySelector(".header__menu-btn");
  const menu = document.querySelector(".menu-mobile");
  if (!header) return;

  // --- sólido depois de sair do hero ---
  // páginas internas não têm hero: o header nasce sólido e
  // fica assim, senão vira creme sobre creme e desaparece
  if (!header.classList.contains("header--solido")) {
    const gatilho = 40;
    let ticking = false;

    const aoRolar = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle("is-rolado", window.scrollY > gatilho);
        ticking = false;
      });
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
  }

  // --- menu mobile ---
  if (botao && menu) {
    const fechar = () => {
      botao.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-aberto");
      document.body.style.overflow = "";
    };

    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      if (aberto) return fechar();
      botao.setAttribute("aria-expanded", "true");
      menu.classList.add("is-aberto");
      document.body.style.overflow = "hidden";
    });

    menu.querySelectorAll("a").forEach((a, i) => {
      a.style.setProperty("--i", i);
      a.addEventListener("click", fechar);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fechar();
    });
  }

  // --- marca o link da seção visível ---
  const links = [...document.querySelectorAll(".header__link[href^='#']")];
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
    { rootMargin: "-45% 0px -50% 0px" }
  );

  secoes.forEach((s) => espiao.observe(s));
}
