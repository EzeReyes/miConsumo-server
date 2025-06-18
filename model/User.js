import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
        surname: {
        type: String,
        required: true,
        trim: true
    },
        email: {
        type: String,
        required: true,
        trim: true
    },
        password: {
        type: String,
        required: true,
        trim: true
    },
        token: {
        type: String,
    },
        confirmado: {
        type: Boolean,
        default: null
        }
})

export default mongoose.model('User', UserSchema);