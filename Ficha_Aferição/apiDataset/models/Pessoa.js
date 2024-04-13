const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define nested schema for 'morada'
const moradaSchema = new Schema({
  cidade: String,
  distrito: String
});

// Define nested schema for 'partido_politico'
const partidoPoliticoSchema = new Schema({
  party_abbr: String,
  party_name: String
});

// Define nested schema for 'atributos'
const atributosSchema = new Schema({
  fumador: Boolean,
  gosta_cinema: Boolean,
  gosta_viajar: Boolean,
  acorda_cedo: Boolean,
  gosta_ler: Boolean,
  gosta_musica: Boolean,
  gosta_comer: Boolean,
  gosta_animais_estimacao: Boolean,
  gosta_dancar: Boolean,
  comida_favorita: String
});

// Main schema for 'pessoas'
const pessoaSchema = new Schema({
  nome: String,
  idade: Number,
  sexo: String,
  morada: moradaSchema,
  _id: String,
  CC: String,
  descrição: String,
  profissao: String,
  partido_politico: partidoPoliticoSchema,
  religiao: String,
  desportos: [String],
  animais: [String],
  figura_publica_pt: [String],
  marca_carro: String,
  destinos_favoritos: [String],
  atributos: atributosSchema
});

const Pessoa = mongoose.model('dataset2', pessoaSchema);

module.exports = Pessoa;
