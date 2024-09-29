const {mailScripter} = require('mailscripter');
const mailer = new mailScripter(process.env.Google_mail_script);
module.exports = mailer;