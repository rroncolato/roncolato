const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Storage simples baseado em arquivos JSON.
 * Cada coleção é um arquivo: data/<nome>.json
 * Estrutura: { seq: number, items: [] }
 */
class Collection {
  constructor(name) {
    this.name = name;
    this.file = path.join(DATA_DIR, `${name}.json`);
    this._load();
  }

  _load() {
    if (fs.existsSync(this.file)) {
      try {
        const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        this.seq = raw.seq || 0;
        this.items = raw.items || [];
        return;
      } catch (e) {
        console.error(`Erro lendo ${this.file}, iniciando vazio:`, e.message);
      }
    }
    this.seq = 0;
    this.items = [];
    this._save();
  }

  _save() {
    fs.writeFileSync(this.file, JSON.stringify({ seq: this.seq, items: this.items }, null, 2));
  }

  all() {
    return this.items;
  }

  find(fn) {
    return this.items.filter(fn);
  }

  get(id) {
    return this.items.find(i => i.id === Number(id)) || null;
  }

  insert(data) {
    this.seq += 1;
    const item = { id: this.seq, ...data, criadoEm: new Date().toISOString() };
    this.items.push(item);
    this._save();
    return item;
  }

  update(id, data) {
    const idx = this.items.findIndex(i => i.id === Number(id));
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...data, id: Number(id), atualizadoEm: new Date().toISOString() };
    this._save();
    return this.items[idx];
  }

  remove(id) {
    const idx = this.items.findIndex(i => i.id === Number(id));
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    this._save();
    return true;
  }

  removeWhere(fn) {
    const before = this.items.length;
    this.items = this.items.filter(i => !fn(i));
    this._save();
    return before - this.items.length;
  }
}

const db = {
  contas: new Collection('contas'),
  transacoes: new Collection('transacoes'),
  cartoes: new Collection('cartoes'),
  categorias: new Collection('categorias'),
  orcamentos: new Collection('orcamentos'),
  objetivos: new Collection('objetivos')
};

module.exports = db;
