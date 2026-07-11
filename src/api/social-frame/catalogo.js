const fs = require('fs');
const path = require('path');

const CATALOGO_PATH = path.join(__dirname, '../../..', 'SOCIAL-FRAME', 'catalogo.json');

function getCatalogo() {
  try {
    if (!fs.existsSync(CATALOGO_PATH)) {
      return {};
    }
    const data = fs.readFileSync(CATALOGO_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler catalogo.json:', error.message);
    return {};
  }
}

function getClienteData(nomeCliente) {
  const catalogo = getCatalogo();
  const busca = String(nomeCliente).toLowerCase().trim();

  // Busca direta pela chave
  if (catalogo[busca]) return catalogo[busca];

  // Busca por alias (ex: "paula" → "paula-e-marciella")
  for (const dados of Object.values(catalogo)) {
    const aliases = (dados.aliases || []).map((a) => a.toLowerCase());
    if (aliases.includes(busca)) return dados;
  }

  return null;
}

function atualizarCatalogo(catalogo) {
  try {
    fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalogo, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar catalogo.json:', error.message);
    return false;
  }
}

module.exports = {
  getCatalogo,
  getClienteData,
  atualizarCatalogo
};
