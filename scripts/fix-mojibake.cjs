const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "src");

const replacements = [
  [/evoluÃ.*?o/g, "evolução"],
  [/EvoluÃ.*?o/g, "Evolução"],
  [/versÃ.*?o/g, "versão"],
  [/VersÃ.*?o/g, "Versão"],
  [/preparaÃ.*?o/g, "preparação"],
  [/PreparaÃ.*?o/g, "Preparação"],
  [/promoÃ.*?es/g, "promoções"],
  [/PromoÃ.*?es/g, "Promoções"],
  [/diÃ.*?rio/g, "diário"],
  [/DiÃ.*?rio/g, "Diário"],
  [/saÃ.*?de/g, "saúde"],
  [/SaÃ.*?de/g, "Saúde"],
  [/acessÃ.*?rios/g, "acessórios"],
  [/AcessÃ.*?rios/g, "Acessórios"],
  [/experiÃ.*?ncias/g, "experiências"],
  [/ExperiÃ.*?ncias/g, "Experiências"],
  [/grÃ.*?tis/g, "grátis"],
  [/GrÃ.*?tis/g, "Grátis"],
  [/comeÃ.*?ar/g, "começar"],
  [/ComeÃ.*?ar/g, "Começar"],
  [/vocÃ.*?/g, "você"],
  [/VocÃ.*?/g, "Você"],
  [/nÃ.*?o/g, "não"],
  [/NÃ.*?o/g, "Não"],
  [/jÃ.*?/g, "já"],
  [/JÃ.*?/g, "Já"],
  [/inteligÃ.*?ncia/g, "inteligência"],
  [/InteligÃ.*?ncia/g, "Inteligência"],
  [/emocional/g, "emocional"],
];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      walk(full);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx)$/.test(item.name)) continue;

    let content = fs.readFileSync(full, "utf8");
    const before = content;

    for (const [from, to] of replacements) {
      content = content.replace(from, to);
    }

    if (content !== before) {
      fs.writeFileSync(full, content, "utf8");
      console.log("Corrigido:", full);
    }
  }
}

walk(root);
console.log("Finalizado.");