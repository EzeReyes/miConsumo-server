import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// dotenv.config({path: "./config.env"});
dotenv.config()

// ESTA FUNCIÓN GENERA UN ID ÚNICO
const generarTokenID = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

const descifrarToken = (token) => {
    try {
        console.log("Descifrando token:", token);
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload decodificado:", payload);
        return payload;
    } catch (error) {
        console.error("Token inválido o expirado:", error.message);
        return null;
    }
}


const crearToken = (id, name) => {

 const token = jwt.sign({id: id, name: name}, process.env.JWT_SECRET, {
    expiresIn: "1d"
})

console.log('Token:',token)
return token;

}

export {
    crearToken,
    descifrarToken,
    generarTokenID
}