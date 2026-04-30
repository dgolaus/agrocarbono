/* ==============================================================
   AGROCARBONO — Lógica da calculadora + interações
   Concurso Agrinho 2026 · Subcategoria 3
   ============================================================== */

(() => {
  'use strict';

  /* --------------------------------------------------------------
     1) Fatores de emissão (kg CO₂ equivalente)
        Valores médios baseados em literatura pública brasileira e
        internacional. Estimativas educativas — não substituem
        inventários oficiais.

        Fontes consultadas:
        • IPCC 2006 — Guidelines for National GHG Inventories,
          Vol. 2 (Energy): combustão de óleo diesel.
        • Embrapa — estudos de pegada de carbono em sistemas
          agrícolas (fertilizantes nitrogenados e adubação orgânica).
        • MCTI — Inventário Nacional de Emissões Atmosféricas
          (transporte rodoviário de carga).
     -------------------------------------------------------------- */
  const FATORES = {
    diesel:        2.68,   // kg CO₂eq/L queimado — IPCC 2006 Vol. 2
    fertilizante: {
      quimico:     3.8,    // kg CO₂eq/kg — NPK / ureia (Embrapa)
      misto:       2.0,    // kg CO₂eq/kg — média ponderada
      organico:    0.35,   // kg CO₂eq/kg — esterco / composto (Embrapa)
    },
    // Caminhão médio carregado (~0.9 kg CO₂eq/km — fonte: MCTI).
    // No cálculo abaixo multiplicamos por 2 (ida + volta).
    transporteKm: 0.9,
  };

  /* --------------------------------------------------------------
     2) Função para calcular a pegada de carbono total e por hectare,
        somando emissões de diesel, fertilizante e transporte.
     -------------------------------------------------------------- */
  function calcular(dados) {
    const dieselCO2 =
      (Number(dados.diesel) || 0) * FATORES.diesel;

    const fertFator =
      FATORES.fertilizante[dados.fertilizanteTipo] ?? FATORES.fertilizante.quimico;
    const fertilizanteCO2 =
      (Number(dados.fertilizanteKg) || 0) * fertFator;

    const viagensAno =
      (Number(dados.transporteFreq) || 0) * 12;
    const transporteCO2 =
      (Number(dados.transporteKm) || 0) * 2 * viagensAno * FATORES.transporteKm;

    const total = dieselCO2 + fertilizanteCO2 + transporteCO2;

    const area = Math.max(Number(dados.area) || 1, 0.1);
    const porHectare = total / area;

    return {
      total,
      porHectare,
      partes: {
        diesel:       dieselCO2,
        fertilizante: fertilizanteCO2,
        transporte:   transporteCO2,
      },
    };
  }

  /* --------------------------------------------------------------
     3) Função para classificar a intensidade da pegada por hectare
        em três faixas: baixa, moderada ou elevada.
        Faixas educativas — não substituem inventário oficial.
     -------------------------------------------------------------- */
  function classificar(porHectare) {
    if (porHectare < 800)   return { label: 'Pegada baixa',     classe: 'rating-low' };
    if (porHectare < 2500)  return { label: 'Pegada moderada',  classe: 'rating-medium' };
    return                  { label: 'Pegada elevada',          classe: 'rating-high' };
  }

  /* --------------------------------------------------------------
     4) Função para gerar dicas sustentáveis personalizadas conforme
        o perfil da propriedade (maior fonte emissora, cultura, etc.).
     -------------------------------------------------------------- */
  function gerarDicas(dados, resultado) {
    const dicas = [];
    const { partes, total } = resultado;

    // Maior contribuinte = prioridade
    const ordenadas = Object.entries(partes).sort((a, b) => b[1] - a[1]);
    const maior = ordenadas[0]?.[0];

    if (maior === 'fertilizante' || dados.fertilizanteTipo === 'quimico') {
      dicas.push('Substitua parte do fertilizante químico por composto orgânico ou esterco curtido — pode reduzir até 70% das emissões dessa fonte.');
      dicas.push('Faça análise de solo antes de adubar: aplicar a dose certa evita desperdício de insumo e emissões desnecessárias.');
    }
    if (maior === 'diesel' || (Number(dados.diesel) || 0) > 1000) {
      dicas.push('Avalie plantio direto ou cultivo mínimo: menos passagens de máquina significam menos diesel queimado.');
      dicas.push('Mantenha máquinas com manutenção em dia — motores regulados consomem menos combustível por hora.');
    }
    if (maior === 'transporte' || (Number(dados.transporteKm) || 0) > 100) {
      dicas.push('Procure cooperativas ou pontos de venda mais próximos: menos quilômetros rodados = menos CO₂.');
      dicas.push('Combine cargas com produtores vizinhos para reduzir o número de viagens mensais.');
    }

    // Dicas universais
    dicas.push('Plante árvores nas bordas da propriedade ou em áreas degradadas: cada hectare reflorestado pode capturar 5–10 t de CO₂ por ano.');
    dicas.push('Implante sistemas agroflorestais ou integração lavoura-pecuária-floresta para diversificar renda e capturar carbono.');

    if (total > 5000) {
      dicas.push('Considere fontes de energia renovável (biogás, painéis solares) para alimentar irrigação e secadores.');
    }
    if (dados.cultura === 'soja' || dados.cultura === 'milho') {
      dicas.push('Use rotação com leguminosas e plantas de cobertura para fixar nitrogênio naturalmente e reduzir a necessidade de adubo nitrogenado.');
    }

    return dicas;
  }

  /* --------------------------------------------------------------
     5) Função para renderizar o resultado na tela (HTML dinâmico
        com classificação, números, breakdown e dicas).
     -------------------------------------------------------------- */
  const fmt  = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  const fmt1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

  // Função utilitária para calcular a porcentagem de uma parte sobre o total.
  function pct(parte, total) {
    if (!total) return '0%';
    return `${Math.round((parte / total) * 100)}%`;
  }

  function renderResultado(resultado, dados) {
    const result = document.getElementById('result');
    if (!result) return;

    const cls = classificar(resultado.porHectare);
    const dicas = gerarDicas(dados, resultado);

    result.innerHTML = `
      <div class="result-headline">
        <span class="result-rating ${cls.classe}">● ${cls.label}</span>
        <span class="result-value">${fmt.format(resultado.total)}</span>
        <span class="result-unit">kg CO₂eq por safra · ${fmt1.format(resultado.porHectare)} kg/ha</span>
      </div>

      <div class="result-breakdown">
        <div class="breakdown-item">
          <span class="lbl">Combustível</span>
          <span class="val">${fmt.format(resultado.partes.diesel)} kg</span>
          <span class="pct">${pct(resultado.partes.diesel, resultado.total)} do total</span>
        </div>
        <div class="breakdown-item">
          <span class="lbl">Fertilizantes</span>
          <span class="val">${fmt.format(resultado.partes.fertilizante)} kg</span>
          <span class="pct">${pct(resultado.partes.fertilizante, resultado.total)} do total</span>
        </div>
        <div class="breakdown-item">
          <span class="lbl">Transporte</span>
          <span class="val">${fmt.format(resultado.partes.transporte)} kg</span>
          <span class="pct">${pct(resultado.partes.transporte, resultado.total)} do total</span>
        </div>
      </div>

      <div class="tips">
        <h3>Como reduzir sua pegada</h3>
        <ul>
          ${dicas.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    `;

    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* --------------------------------------------------------------
     6) Função para tratar o envio do formulário: previne reload,
        valida campos mínimos e dispara o cálculo + renderização.
     -------------------------------------------------------------- */
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    // Coleta dados como objeto simples
    const dados = Object.fromEntries(new FormData(form).entries());

    // Validação mínima: área é obrigatória para fazer sentido por-hectare
    if (!dados.area || Number(dados.area) <= 0) {
      const areaInput = form.querySelector('#area');
      areaInput?.focus();
      return;
    }

    const resultado = calcular(dados);
    renderResultado(resultado, dados);
  }

  /* --------------------------------------------------------------
     7) Função para esconder o resultado quando o usuário
        limpa o formulário (clique em "Limpar").
     -------------------------------------------------------------- */
  function handleReset() {
    const result = document.getElementById('result');
    if (result) {
      result.hidden = true;
      result.innerHTML = '';
    }
  }

  /* --------------------------------------------------------------
     8) Função para revelar elementos [data-reveal] quando entram
        na viewport, usando IntersectionObserver (sem libs externas).
     -------------------------------------------------------------- */
  function setupRevealAnimations() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------
     9) Função para criar o cursor glow — esfera difusa que segue
        o mouse com lerp, criando o efeito sutil de "luz
        acompanhando o cursor" (ref: growgames.com).
        Desligado em touch e em prefers-reduced-motion.
     -------------------------------------------------------------- */
  function setupCursorGlow() {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover      = matchMedia('(hover: none)').matches;
    if (reduceMotion || noHover) return;

    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX  = mouseX;
    let glowY  = mouseY;
    let active = false;

    const EASE = 0.16; // quanto maior, mais "colado" no cursor

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) {
        // primeira aparição: começa exatamente sob o cursor
        glowX = mouseX;
        glowY = mouseY;
        glow.classList.add('is-active');
        active = true;
      }
    }

    function onLeave() {
      active = false;
      glow.classList.remove('is-active');
    }

    function tick() {
      glowX += (mouseX - glowX) * EASE;
      glowY += (mouseY - glowY) * EASE;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', () => glow.classList.add('is-active'));
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------------------------
     10) Função para implementar smooth scroll global — interpolamos
         a posição do scroll em direção ao alvo a cada frame, dando
         a sensação "manteiga" (ref: estilo growgames/dobig).
         Desligado em touch e em prefers-reduced-motion.
     -------------------------------------------------------------- */
  function setupSmoothScroll() {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover      = matchMedia('(hover: none)').matches;
    if (reduceMotion || noHover) return;

    document.documentElement.classList.add('has-smooth-scroll');

    let current = window.scrollY;
    let target  = window.scrollY;
    let animating = false;
    const EASE = 0.09;

    function maxScroll() {
      return document.documentElement.scrollHeight - window.innerHeight;
    }
    function clamp(v) {
      return Math.max(0, Math.min(v, maxScroll()));
    }

    function start() {
      if (animating) return;
      animating = true;
      requestAnimationFrame(tick);
    }

    function tick() {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        animating = false;
      }
      window.scrollTo(0, current);
      if (animating) requestAnimationFrame(tick);
    }

    function onWheel(e) {
      // Permite scroll dentro de elementos com overflow próprio (ex.: <select>)
      if (e.ctrlKey) return; // não interfere no zoom
      e.preventDefault();
      target = clamp(target + e.deltaY);
      start();
    }

    function onAnchorClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const dest = document.getElementById(href.slice(1));
      if (!dest) return;
      e.preventDefault();
      const top = dest.getBoundingClientRect().top + window.scrollY - 8;
      target = clamp(top);
      start();
    }

    // Se o usuário usar teclado/Find/etc., o scroll nativo muda — sincronizamos.
    function onScroll() {
      if (animating) return;
      const drift = Math.abs(window.scrollY - current);
      if (drift > 2) {
        current = target = window.scrollY;
      }
    }

    function onResize() {
      target = clamp(target);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('click', onAnchorClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }

  /* --------------------------------------------------------------
     11) Função para animar contadores [data-counter] — sobem de 0
         até o valor final em ~2s com easing ease-out cubic e depois
         travam no destino. Disparados via IntersectionObserver.
     -------------------------------------------------------------- */
  function setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function format(el, value) {
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      return `${prefix}${value}${suffix}`;
    }

    // Estado inicial: zera o número visível para evitar "salto" depois.
    counters.forEach(el => {
      el.textContent = format(el, 0);
    });

    function animate(el) {
      const target = parseFloat(el.dataset.target) || 0;

      if (reduceMotion) {
        el.textContent = format(el, target);
        return;
      }

      const duration = 2000;
      const start = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const value = Math.round(target * easeOutCubic(t));
        el.textContent = format(el, value);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = format(el, target); // garante o valor final exato
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------
     12) Função para inicializar o app (bootstrap): liga eventos
         do formulário e dispara as animações da página.
     -------------------------------------------------------------- */
  function init() {
    const form = document.getElementById('carbon-form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
      form.addEventListener('reset', handleReset);
    }
    setupRevealAnimations();
    setupCursorGlow();
    setupSmoothScroll();
    setupCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
