/**
 * contato.js
 * Monta os links de WhatsApp a partir de [data-wpp] e preenche
 * o ano no rodapé. O número mora em config.js, num lugar só.
 */

import { linkWhatsapp } from "../config.js";

export function initContato() {
  document.querySelectorAll("[data-wpp]").forEach((el) => {
    el.href = linkWhatsapp(el.dataset.wpp);
    el.target = "_blank";
    el.rel = "noopener";
  });

  const ano = document.querySelector("[data-ano]");
  if (ano) ano.textContent = new Date().getFullYear();
}
