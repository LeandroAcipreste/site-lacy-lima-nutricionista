/**
 * main.js — ponto de entrada.
 * Componentes globais primeiro, página depois, pelo data-page.
 *
 * A página é inicializada antes do preloader de propósito: é ela
 * que devolve a promessa do vídeo da hero, e o preloader só sai
 * depois que esse vídeo pode tocar.
 */

import { initPreloader } from "./components/preloader.js";
import { initHeader } from "./components/header.js";
import { initContato } from "./components/contato.js";
import { initHome } from "../pages/home/home.js";
import { initPrivacidade } from "../pages/privacidade/privacidade.js";

initHeader();
initContato();

const pagina = document.body.dataset.page;

let aguardar = null;
if (pagina === "home") aguardar = initHome();
if (pagina === "privacidade") initPrivacidade();

initPreloader({ aguardar });
