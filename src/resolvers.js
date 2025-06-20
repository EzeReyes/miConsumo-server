import { response } from 'express';
import Expense from '../model/Expense.js'
import User from '../model/User.js'
import  bcrypt  from 'bcrypt'; 
const  saltRounds  =  10; 
import { generarTokenID, descifrarToken, crearToken } from '../helpers/tokens.js'
import { emailRegistro, olvideMiPass } from '../helpers/emails.js';

const resolvers = {
    Query: {
        getExpenses: async () => {
            const expenses = await Expense.find({});
            try {
                return expenses;
            } catch (error) {
                console.log(error);
            }
        },
        getExpensesByID: async (_, { id }) => {
            const expense = await Expense.findById(id);
            return expense;
        },
        getUser: async (_, { email, password }, { res }) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
            return { success: false, message: 'El usuario no existe', user: null };
            }

            if (!user.confirmado) {
            return { success: false, message: 'El usuario no ha sido confirmado, verifica tu casilla de correo', user: null };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            return { success: false, message: 'Contraseña incorrecta', user: null };
            }

            // Token
            const token = crearToken(user.id, user.name);
            await res.cookie('_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
              maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
            })

            return { success: true, message: 'Autenticado con éxito', user: user };
        } catch (error) {
            console.error(error);
            throw new Error('Error al autenticar usuario');
        }
        },
        getToken: async (_, __, { req }) => {
            const token = req.cookies?._token; // Asegurate de tener cookie-parser habilitado
            if (!token) {
                return {
                    success: false,
                    message: "No token found",
                    user: null
                };
            }
            console.log('t:', token)
            const payload = await descifrarToken(token);
            console.log("El payload es:", payload)
            if (!payload) {
                return {
                    success: false,
                    message: "Token inválido o expirado",
                    user: null
                };
            }

            // podés buscar al usuario en tu base de datos si querés validar que aún exista
            const user = await User.findById(payload.id); // Ajustá según tu modelo
            console.log(user)
            return {
                success: true,
                message: "Token válido",
                user: user
            };
        },
        getUserPass: async (_, { email }) => {
            try {
                const user = await User.findOne({ email }); // ✅ Usar findOne, no find
                if (!user) {
                        return null;
                } else {
                    user.token = generarTokenID();
                    await user.save()
                    
                    // Enviar email
                    olvideMiPass({
                    nombre: user.name,
                    email: user.email,
                    token: user.token
                    })
                    
                    // Renderizar mensaje
                    return user;
            }
            } catch (error) {
                console.log(error)
            }
            },
                confirmUser: async (_, {token}) => {
                    const user = await User.findOne({token});
                    if(!user) {
                        return null
                    } else {
                        user.token ='';
                        user.confirmado=true;
                        user.save()
                        return user
                    }
    }
    }, 
    Mutation: {
        newExpense: async (_, {input})  => {
        try {
            const newExpense = new Expense(input);
            newExpense.save();
            return "Consumo creado correctamente";
        } catch (error) {
            console.log(error);
        }
        },
        updatedExpense: async (_, { id, input }) => {
            try {
                const expense = await Expense.findByIdAndUpdate(id, input, { new: true });
                if (!expense) {
                throw new Error('Consumo inexistente');
                }
                return expense;
            } catch (error) {
                // Podés loguearlo o relanzarlo
                throw new Error(error.message = 'Error al actualizar el consumo');
            }         
        }, 
        deleteExpense: async (_, { id }) => {
        try {
            // Validar si el id es un ObjectId válido

            const deleted = await Expense.findByIdAndDelete(id);

            if (!deleted) {
            throw new Error('Consumo inexistente');
            }

            return 'Consumo eliminado correctamente';
        } catch (error) {
            // Captar mensaje de error y modificarlo
            if(error.message === "ObjectId is not defined") {
                throw new Error('ID inválido para consumo');
            }        
        }
        },
        newUser: async (_, { input }) => {
            const { email } = input;
            try {
            const existeUsuario = await User.findOne({email});
            if(existeUsuario) {
                return ('Ese Usuario existe');
            } else {
                const salt = (saltRounds);
                const hashed = await bcrypt.hash(input.password, salt);
                const user = new User({...input, password : hashed});

                // Autenticar usuario
                user.token = generarTokenID();
                await user.save();

                emailRegistro({
                    nombre: user.name,
                    email: user.email,
                    token: user.token
                })
                return ('En breve recibiras un correo para que confirmes tu cuenta en miConsumo.com')
            }
            } catch (error) {
                console.log(error)
            }
        },
        updatedUser: async (_, {id, input}) => {
            try {
                const user = await User.findByIdAndUpdate(id, input, {new: true});
                // Verificar que el usuario existe
                if (!user) {
                throw new Error('Usuario inexistente');
                }
                    const nuevaPassword = input.password;

                // Verificar que la contraseña sea la misma, sino es la misma hay que encriptarla y guardarla
                const mismoPass = await bcrypt.compare(nuevaPassword, user.password);
                if(mismoPass) {
                    console.log('El password es el mismo')
                } else {
                const salt = (saltRounds);
                const hashed = await bcrypt.hash(nuevaPassword, salt);
                user.password = hashed;
                // Después de estos procesos se guardaría el usuario 
                }
                await user.save()
                return user;


            } catch (error) {
                // Podés loguearlo o relanzarlo
                throw new Error('Error al actualizar el usuario');
            }      
        },
        newPass: async (_, { email, password }) => {
            try {
                const user = await User.findOne({email});
                

                console.log(`El usuario a modificar es ${user}, y el pass nuevo es ${password}`);

                // Hasear la contraseña
                const salt = (saltRounds);
                const hashed = await bcrypt.hash(password, salt);
                user.password = hashed;
                await user.save();
                return "Password restablecido, inicie sesión"
            } catch (error) {
                console.log(error)
            }
        }
    }
}

export default resolvers;