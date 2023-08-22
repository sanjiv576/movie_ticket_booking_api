
const mongoose = require('mongoose')

const reserveSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String,
    movieName: String,
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    // seatNumber: {
    //     type: Number,
    //     required: true
    // },

    // store seat number in array
    seatNumber: [],

    // seatNumber : [
    //     {
    //         seat: String,
    //     }
    // ],
    charge: {
        type: String,
        required: true
    }
})

reserveSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString();
        returnedDocument.id = document.userId.toString();
        returnedDocument.id = document.movieId.toString();

        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
})

module.exports = new mongoose.model('Reserve', reserveSchema)