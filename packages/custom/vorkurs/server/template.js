'use strict';

var striptags = require('striptags');

module.exports = {
    registration_mail: function (user, req, token, config, mailOptions) {
        var kurs = config.public.vorkursConfig.kurse[user.kurs];
        var body = [
            (user.sex === 'frau' ? 'Sehr geehrte Frau ' : user.sex === 'herr' ? 'Sehr geehrter Herr ' : 'Hallo ') + user.name + ',',
            '',
            'Sie wurden erfolgreich für den Kurs \"' + kurs.name + '\" eingetragen.',
            'Sollten Sie Ihre Registrierung bearbeiten wollen, so können Sie dies unter folgendem Link tun:',
            '<a href="http://' + req.headers.host + '/vorkurs/status/' + token + '">' + 'http://' + req.headers.host + '/vorkurs/status/' + token + '</a>.',
            ' ',
            ' ',
            kurs.email
        ];

        user.gruppen.forEach(function (value) {
            var gruppe = config.public.vorkursConfig.gruppen[value];
            if (gruppe.hasOwnProperty('mail') && gruppe.mail !== '') {
                body.push(' ');
                body.push(gruppe.mail);
            }
            if (gruppe.hasOwnProperty('mailPDF') && gruppe.mailPDF !== '') {
                if (!mailOptions.hasOwnProperty('attachments')) {
                    mailOptions.attachments = [];
                }
                mailOptions.attachments.push({
                    // filename and content type is derived from path
                    path: __dirname + '/../public/' + gruppe.mailPDF
                });
            }
        });

        body.push(' ');

        body.push('Mit freundlichem Gruß,');
        body.push('die HiWis des IPS');

        mailOptions.html = body.join('<br>\n');
        mailOptions.subject = 'Technische Universität Braunschweig - Anmeldung: ' + kurs.name;
        mailOptions.text = striptags(mailOptions.html, ['a']);
        return mailOptions;
    },
    resend_mail: function (user, req, token, config, mailOptions) {
        var body = [
            (user.sex === 'frau' ? 'Sehr geehrte Frau ' : user.sex === 'herr' ? 'Sehr geehrter Herr ' : 'Hallo ') + user.name + ',',
            '',
            'mit dieser Email erhalten Sie den Link mit der Sie Ihre Registrierung bearbeiten können:.',
            '<a href="http://' + req.headers.host + '/vorkurs/status/' + token + '">' + 'http://' + req.headers.host + '/vorkurs/status/' + token + '</a>.',
            '',
            'Mit freundlichem Gruß,',
            'die HiWis des IPS'
        ];

        mailOptions.html = body.join('<br>\n');
        mailOptions.subject = 'Technische Universität Braunschweig - Link zum Status Ihrer Kurs Anmeldung';
        mailOptions.text = striptags(mailOptions.html, ['a']);
        return mailOptions;
    }/*,
     forgot_password_email: function (user, req, token, mailOptions) {
     mailOptions.html = [
     'Hi ' + user.name + ',',
     'We have received a request to reset the password for your account.',
     'If you made this request, please click on the link below or paste this into your browser to complete the process:',
     'http://' + req.headers.host + '/reset/' + token,
     'This link will work for 1 hour or until your password is reset.',
     'If you did not ask to change your password, please ignore this email and your account will remain unchanged.'
     ].join('\n\n');
     mailOptions.subject = 'Resetting the password';
     return mailOptions;
     }*/
};
