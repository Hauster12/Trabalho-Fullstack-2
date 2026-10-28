const nodemailer = require('nodemailer');

/**
 * Cria o transportador de e-mail (Gmail SMTP ou Ethereal para testes)
 */
async function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    // Usar SMTP configurado (Gmail, SendGrid, etc)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }

  // Fallback: criar conta de testes Ethereal Mail
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.warn('⚠️ Não foi possível conectar ao Ethereal SMTP. Usando logger em console.');
    return null;
  }
}

/**
 * Envia o código de verificação para o e-mail do cliente
 */
async function sendVerificationCodeEmail(email, codigo) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: '"ImobiSelect Verification" <no-reply@imobisenac.com>',
      to: email,
      subject: '🔑 Seu Código de Verificação - ImobiSelect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #ea580c; margin: 0;">ImobiSelect</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Portal & Gestão de Imóveis</p>
          </div>
          <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin-bottom: 20px;">
            <h3 style="color: #9a3412; margin: 0 0 10px 0;">Código de Verificação de Cadastro</h3>
            <p style="color: #475569; font-size: 14px; margin: 0;">Utilize o código abaixo para confirmar a criação da sua conta no portal:</p>
          </div>
          <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a; margin-bottom: 20px;">
            ${codigo}
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">Este código expira em 10 minutos. Se você não solicitou este cadastro, desconsidere esta mensagem.</p>
        </div>
      `
    };

    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 E-mail de verificação enviado para ${email}. MessageId: ${info.messageId}`);
      if (nodemailer.getTestMessageUrl(info)) {
        console.log(`🔗 Link de visualização do e-mail (Ethereal Test): ${nodemailer.getTestMessageUrl(info)}`);
      }
    } else {
      console.log(`📧 [Simulação E-mail] Código para ${email}: ${codigo}`);
    }

    return true;
  } catch (err) {
    console.error('Erro ao enviar e-mail de verificação:', err.message);
    return false;
  }
}

module.exports = {
  sendVerificationCodeEmail
};
