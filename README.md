# AgroCarbono

> Calculadora de pegada de carbono para produção agrícola — Concurso Agrinho 2026.

**Tema:** "Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente"
**Subcategoria:** 3 — Programação Front-End

[Acesse o projeto online](https://dgolaus.github.io/agrocarbono/)

---

## Sobre

O **AgroCarbono** é uma ferramenta web que permite ao produtor rural estimar, em poucos minutos, a pegada de carbono (em kg de CO₂ equivalente) da sua safra. A partir de dados simples — área cultivada, consumo de combustível, uso de fertilizantes e logística de transporte — o sistema calcula as emissões, classifica o impacto e gera recomendações personalizadas para reduzir o passivo ambiental sem sacrificar produtividade.

A proposta é mostrar que tecnologia útil ao campo pode ser **leve, acessível e aberta** — uma página estática roda em qualquer celular antigo com conexão fraca, e ainda assim oferece ao produtor uma fotografia confiável do impacto da sua operação.

## Funcionalidades

- Calculadora de emissões em **CO₂e por safra e por hectare**
- Classificação automática do impacto (baixo / médio / alto)
- Dicas personalizadas geradas a partir do perfil da propriedade
- Animações de contagem nas estatísticas do hero
- *Glow* seguindo o cursor no desktop (efeito sutil)
- *Smooth scroll* customizado com interpolação linear
- Layout responsivo (mobile-first)
- Suporte a `prefers-reduced-motion` e dispositivos sem hover

## Tecnologias

- **HTML5** semântico — `header`, `main`, `section`, `fieldset`, `legend`, atributos ARIA
- **CSS3** moderno — Custom Properties, Grid, Flexbox, `clamp()`, `color-mix()`, `mask-image`, `mix-blend-mode`, `backdrop-filter`
- **JavaScript** vanilla (ES6+) — `IntersectionObserver`, `requestAnimationFrame`, IIFE, *lerp* para movimento suave
- **Google Fonts** — Space Grotesk (títulos) + Inter (corpo)

> Conforme regulamento do Concurso Agrinho 2026 (Subcategoria 3), **nenhum framework** (React, Vue, Bootstrap, Tailwind, jQuery) ou biblioteca externa pesada foi utilizado. Todo CSS está em `styles/style.css` e todo JS em `scripts/main.js` — sem código *inline* no HTML.

## Estrutura do projeto

```
agro2026/
├── index.html          # marcação semântica
├── styles/
│   └── style.css       # estilos, tokens e responsividade
├── scripts/
│   └── main.js         # cálculo, dicas, animações
└── README.md
```

## Como usar

1. Acesse o site pelo link acima.
2. Clique em **"Começar agora"** no topo ou role até a seção **Calcular**.
3. Preencha os campos do formulário com dados da sua propriedade:
   - **Propriedade** — área cultivada (hectares) e cultura principal
   - **Máquinas & combustível** — litros de diesel e horas de máquina por safra
   - **Fertilizantes** — tipo predominante (químico, misto ou orgânico) e quantidade aplicada por ano
   - **Transporte** — distância até o ponto de venda e número de viagens por mês
4. Clique em **Calcular pegada**.
5. O site exibirá:
   - Emissão total estimada (kg de CO₂ equivalente por safra)
   - Emissão por hectare
   - Classificação do impacto (baixo / médio / alto)
   - Dicas personalizadas baseadas no seu perfil de produção

> Os valores são estimativas educativas baseadas em fatores médios da agricultura brasileira — servem como **ponto de partida** para decisões mais sustentáveis e **não substituem** inventários oficiais de emissões.

## Fontes dos fatores de emissão

Os fatores usados em `scripts/main.js` foram baseados em referências públicas brasileiras e internacionais. São médias agregadas, com fins **educativos** — não substituem inventários oficiais de emissões.

| Fator | Valor | Fonte |
|---|---|---|
| Diesel agrícola | 2,68 kg CO₂e / L | IPCC 2006 — *Guidelines for National Greenhouse Gas Inventories*, Vol. 2 (Energy) |
| Fertilizante químico (NPK / ureia) | 3,8 kg CO₂e / kg | Embrapa — estudos de pegada de carbono em sistemas agrícolas |
| Fertilizante misto | 2,0 kg CO₂e / kg | Estimativa intermediária derivada das fontes acima |
| Fertilizante orgânico | 0,35 kg CO₂e / kg | Embrapa — análise de ciclo de vida de adubação orgânica |
| Transporte rodoviário | 0,9 kg CO₂e / km | MCTI — Inventário Nacional de Emissões Atmosféricas (transporte de carga) |

## Uso de Inteligência Artificial

Em conformidade com o regulamento do Concurso Agrinho 2026, declaro o uso de **IA generativa (Claude, da Anthropic)** como ferramenta de apoio durante o desenvolvimento. Os principais *prompts* usados foram:

1. *"Quero criar a Calculadora de Pegada de Carbono Agrícola para o Agrinho 2026 (Subcategoria 3 — Front-End). Tema: agro forte, futuro sustentável. Quero estética bold/dark inspirada em growgames.com, dobig.com, cubethumbs.com e sakwu.com. Tipografia oversized, paleta verde profundo + lima vibrante. HTML/CSS/JS puros, arquivos separados, sem frameworks. Por onde começamos?"*

2. *"Podemos fazer uma pequena esfera de glow que segue o mouse onde ele estiver indo, parecida com a do growgames.com? Tem que ser da mesma cor da página e não pode ser muito forte. Também queria deixar o scroll mais smooth e aplicar contagens subindo (~24%, 3 min, +10) em cerca de 2 segundos."*

3. *"Está cortando entre as seções e ficando feio visualmente. Que tal mesclar a primeira página em todas, decorando a atmosfera conforme o usuário desce?"*

4. *"O site está OK com o regulamento do Concurso Agrinho 2026?"*

A IA atuou como **consultora técnica e par programador**. Toda a definição de escopo, identidade visual, conteúdo textual, escolha dos fatores de emissão a citar e arquitetura final do projeto partiu de mim. O código foi revisado, testado e ajustado por mim antes de ser publicado.

## Autoria

**Douglas Aldrovandi da Silva**
Colégio Estadual Cívico-Militar Castro Alves
Rondon — Paraná, Brasil

Projeto desenvolvido para o **Concurso Agrinho 2026** · Subcategoria 3 — Programação Front-End.
