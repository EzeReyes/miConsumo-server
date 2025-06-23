import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  realizado: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // 🧠 Referencia al ID del documento
    ref: 'User',                           // 🔗 Nombre del modelo al que hace referencia
    required: true                         // ✅ Para que no se cree un gasto sin usuario
  }
});

export default mongoose.model('Task', TaskSchema);