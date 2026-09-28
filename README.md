# DualDev — Academia

Campus digital de estudo (HTML, CSS, JavaScript, Python e Java). Abra `index.html` no navegador — não precisa de servidor nem de instalação.

```
dualdev/
├── index.html              # casca da página + ordem de carregamento dos scripts
├── css/
│   ├── base.css            # tokens (cores), reset, tipografia, botões, navegação
│   └── components.css      # cards, roadmap, playground, quiz, XP, conquistas, toast
├── js/
│   ├── core/               # state.js (estado/tema) · router.js (navegação)
│   ├── data/               # achievements.js · tracks.js · resources.js (links W3Schools) · missions.js · lessons/{html,css,js,python,java}.js
│   ├── features/           # progress.js (XP, toast) · transpilers.js · playground.js
│   ├── pages/              # home.js · academia.js · conquistas.js · sobre.js
│   └── main.js             # inicialização
└── assets/icons/           # logos SVG das linguagens (usados em Sobre → Cobertura do currículo)
```

Os scripts são carregados na ordem do `index.html` (estado → dados → recursos → páginas → roteador → main). Para adicionar uma lição, edite `js/data/lessons/<linguagem>.js`.
