/** config.js — constantes que aparecem em mais de um lugar. */

export const WHATSAPP = "5579998116061";

export const INSTAGRAM = "https://www.instagram.com/lacylima/";

/** Monta o link do WhatsApp já com a mensagem certa. */
export function linkWhatsapp(mensagem) {
  const base = `https://api.whatsapp.com/send/?phone=${WHATSAPP}`;
  return `${base}&text=${encodeURIComponent(mensagem)}&type=phone_number&app_absent=0`;
}
