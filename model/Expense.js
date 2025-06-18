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
  }
});

export default mongoose.model('Expense', ExpenseSchema);
