import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Kategorija = new Schema({
    naziv: {
        type: String,
        required: true,
        unique: true
    },
    potkategorije: {
        type: [String],
        default: []
    }
});

export default mongoose.model(
    'KategorijaModel',
    Kategorija,
    'kategorije'
);