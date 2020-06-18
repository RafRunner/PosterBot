const connection = require('../database/connection');

module.exports = {
  async get(id, tableName, selectedFields = '*') {
    const object = await connection(tableName).where('id', id).select(selectedFields).first();
    return object;
  },

  async create(object, tableName) {
    try {
      const [id] = await connection(tableName).insert([object], ['id']);
      return { id: id['id'], erro: null };
    } catch (erro) {
      console.log(erro);
      return { id: null, erro: erro.message };
    }
  },

  async exists(id, tableName) {
    const existe = await connection(tableName).where('id', id).select('id').first();
    return existe && true;
  },

  async delete(id, tableName) {
    try {
      if (await this.exists(id, tableName)) {
        await connection(tableName).where('id', id).del();

        return { sucesso: true, erro: null };
      }
      return { sucesso: false, erro: 'objectnot found' };
    } catch (erro) {
      return { sucesso: false, erro: erro.message };
    }
  },
};
