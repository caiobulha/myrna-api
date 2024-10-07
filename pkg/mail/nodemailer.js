import nodemailer from 'nodemailer'

export default class Mailer {
    SendEmail(receiver, subject, text) {
        let transporter = nodemailer.createTransport({
            service: 'Gmail', 
            host: 'smtppro.zoho.in',
            secure: true,
            port: 465,
            auth: {
                user: 'encomenda.myrna@gmail.com', 
                pass: 'wgqm luml eieu fape' 
            }
        });
        
        //'limaa.diogi@gmail.com'
        let mailOptions = {
            from: 'encomenda.myrna@gmail.com', 
            to: receiver, 
            subject: subject, 
            text: text 
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        
    }
}



