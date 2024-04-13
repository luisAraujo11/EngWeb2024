const mongoose = require("mongoose");
const Pessoa = require("../models/Pessoa"); // Ensure the correct path to your model file

module.exports.list = () => {
    return Pessoa
        .find() // Retrieves all documents from the 'pessoas' collection
        .sort({nome : 1}) // Sorts the results by the 'nome' field in ascending order
        .exec(); // Executes the query
};

module.exports.listModalidades = () => {
    return Pessoa
    .distinct('desportos')
    .exec();
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id : id}) // Finds a single document by its MongoDB ObjectID
        .exec(); // Executes the query
};

module.exports.insert = pessoa => {
        return Pessoa.create(pessoa); // Inserts a new document into the 'pessoas' collection
};

module.exports.updatePessoa = (id, pessoa) => {
    return Pessoa.updateOne({_id : id}, pessoa); // Updates an existing document in the 'pessoas' collection
};

module.exports.removeById = id => {
    return Pessoa.deleteOne({_id: id});
}

module.exports.update = (id, pessoa) => {
    return Pessoa.findByIdAndUpdate(id, pessoa);
}

module.exports.findAtletasByModalidade = modalidade => {
    return Pessoa
        .find({desportos : modalidade}) // Finds all documents that contain the specified 'modalidade' in the 'desportos' array
        .sort({nome : 1}) // Sorts the results by the 'nome' field in ascending order
        // .distinct("_id")
        .exec(); // Executes the query
}


