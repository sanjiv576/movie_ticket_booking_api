const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    picture: {
        type: String,
        default: 'logo.png'
    },
    seats: {
        type: Number,
        default: 100,
    },
})

movieSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString();
        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
})

module.exports = new mongoose.model('Movie', movieSchema)