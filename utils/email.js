const nodemailer = require('nodemailer')
const ejs = require('ejs')
const htmlToText = require('html-to-text');
//new email(user,url).sendWelcome();

module.exports = class Email {
    constructor(user,url) {
        try {
 
            this.to = user.email ;
            this.firstName = user.name;
            this.roles = user.roles || '';
            this.registerResetExpire = user.registerResetExpire || '';
         
       
            this.url = url;
            this.from = `Tegar <${process.env.EMAIL_FROM}`
        } catch (error) {
            consolo.log(error)
        }
       

    }
    newTransport() {
        
        if(process.env.NODE_ENV === 'production') {
            console.log('y00000')
            return nodemailer.createTransport({
                service: 'gmail',
                auth : {
                    user : process.env.GMAIL_EMAIL,
                    pass: process.env.GMAIL_PASSWORD
                }
               
            });

        }else{
            return nodemailer.createTransport({
                host :  process.env.EMAIL_HOST,
                port : process.env.EMAIL_PORT,
                auth : {
                    user : process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
               
            });
           
        }
      
    }


    async send(template,subject){

        try {
            const html = await ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`,{
                firstName: this.firstName,
                url : this.url,
                roles: this.roles,
                registerResetExpire: this.registerResetExpire,
                subject
            }
         
            )
     
            const mailOptions = {
                from :  this.from,
                to : this.to,
                subject,
                html :html,
                text : htmlToText.fromString(html)
            }
    
            await this.newTransport().sendMail(mailOptions)
            
        } catch (error) {
            console.log(error)
        }

    }
    async sendWelcome() {
        await this.send('email', 'Welcome to the skindialogue Family!');
      }
    async sendInviteLink() {
        await this.send('email', 'Anda di undang ');
      }
};

    
