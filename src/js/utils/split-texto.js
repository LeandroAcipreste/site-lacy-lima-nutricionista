/**
 * split-texto.js
 * Quebra um texto em linha > palavra > caractere, cada
 * caractere num <span> numerado.
 *
 * A palavra existe por um motivo prático: com os caracteres
 * soltos como inline-block, o navegador quebra no meio da
 * palavra ("pre / screver"). Envolver cada palavra num
 * inline-block resolve, e é o mesmo desenho do SplitText.
 *
 * O JS não anima nada: ele só cria os spans e escreve --i
 * (índice) e --n (total). Quem move é o CSS, em
 * components/animacoes.css.
 */

/**
 * @param {HTMLElement} el     elemento cujo texto será quebrado
 * @param {{sorteio?: boolean}} opcoes  sorteio distribui os delays ao acaso
 * @returns {number} quantidade de caracteres criados
 */
export function quebrarEmCaracteres(el, opcoes = {}) {
  if (!el || el.dataset.split === "pronto") return 0;

  const linhas = el.innerHTML.split(/<br\s*\/?>/i);
  el.textContent = "";

  let indice = 0;
  const pendentes = [];

  linhas.forEach((linha) => {
    const caixaLinha = document.createElement("span");
    caixaLinha.className = "split__linha";

    // volta a texto puro: nada de reinjetar markup vindo do HTML
    const texto = new DOMParser()
      .parseFromString(linha, "text/html")
      .body.textContent.trim();

    texto.split(/\s+/).forEach((palavra, iPalavra, todas) => {
      if (!palavra) return;

      const caixaPalavra = document.createElement("span");
      caixaPalavra.className = "split__palavra";

      for (const letra of palavra) {
        const span = document.createElement("span");
        span.className = "split__char";
        span.style.setProperty("--i", indice);
        // --f é a mesma posição em fração (0 a 1). Existe para o
        // CSS não precisar dividir por var(--n): divisor de calc
        // tem de ser número, e escrever o número aqui é mais
        // seguro do que confiar nessa resolução.
        pendentes.push(span);
        if (opcoes.sorteio) span.style.setProperty("--r", Math.random().toFixed(3));
        span.textContent = letra;
        caixaPalavra.appendChild(span);
        indice += 1;
      }

      caixaLinha.appendChild(caixaPalavra);
      // o espaço fica fora da palavra: é nele que a linha pode quebrar
      if (iPalavra < todas.length - 1) {
        caixaLinha.appendChild(document.createTextNode(" "));
      }
    });

    // .split__linha já é display:block — um <br> aqui dobraria a quebra
    el.appendChild(caixaLinha);
  });

  const total = indice || 1;
  pendentes.forEach((span, i) => {
    span.style.setProperty("--f", (i / Math.max(total - 1, 1)).toFixed(4));
  });

  el.style.setProperty("--n", total);
  el.classList.add("split");
  if (opcoes.sorteio) el.classList.add("split--sorteio");
  el.dataset.split = "pronto";

  return indice;
}

/** Quebra todos os elementos que pedirem, via [data-split]. */
export function quebrarTodos(raiz = document) {
  const alvos = raiz.querySelectorAll("[data-split]:not([data-split='pronto'])");
  alvos.forEach((el) => {
    quebrarEmCaracteres(el, { sorteio: el.dataset.split === "sorteio" });
  });
  return alvos.length;
}
