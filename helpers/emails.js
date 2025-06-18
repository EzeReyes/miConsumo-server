import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST_NODEMAILER,
        port: process.env.PORT_NODEMAILER,
        auth: {
            user: process.env.USERNAME_NODEMAILER,
            pass: process.env.PASSWORD_NODEMAILER
        }
    });

    const {email, nombre, token} = datos;

    // Enviar email
    await transport.sendMail({
        from: 'miConsumo.com',
        to: email,
        subject: 'Confirma tu cuenta en miConsumo.com',
        text: 'Confirma tu cuenta en miConsumo.com',
        html: `
            <p>Hola comprueba tu cuenta en miConsumo.com.</p>

            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:5173/confirmar/${token}" >Confirma tu cuenta</a>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })

}

const olvideMiPass = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST_NODEMAILER,
        port: process.env.PORT_NODEMAILER,
        auth: {
            user: process.env.USERNAME_NODEMAILER,
            pass: process.env.PASSWORD_NODEMAILER
        }
    });

    const {email, nombre, token} = datos;

    // Enviar email
    await transport.sendMail({
        from: 'miConsumo.com',
        to: email,
        subject: 'Reestablece tu password en miConsumo.com',
        text: 'Reestablece tu password en miConsumo.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en miConsumo.com</p>

            <p>Sigue el siguiente enlace para generar un password nuevo:
            <a href="${process.env.BACKEND_URL}:5173/reset-password/${token}" >Reestablece tu password</a>
            <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
        `
    })

}

export {
    emailRegistro, 
    olvideMiPass
}