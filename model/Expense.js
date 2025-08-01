import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['ALIMENTO', 'HOBBIE', 'SERVICIO', 'ENTRENAMIENTO', 'ROPA', 'CALZADO', 'OTROS'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // 🧠 Referencia al ID del documento
    ref: 'User',                           // 🔗 Nombre del modelo al que hace referencia
    required: true                         // ✅ Para que no se cree un gasto sin usuario
  }
});

export default mongoose.model('Expense', ExpenseSchema);
