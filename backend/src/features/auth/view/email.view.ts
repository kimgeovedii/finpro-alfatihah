const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const logoUrl = `${frontendUrl}/assets/logo-apps.png`;

/**
 * Layout common for all emails
 */
const getBaseLayout = (title: string, content: string) => `
  <div style="font-family: Arial, sans-serif; text-align: center; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; padding: 30px;">
    <img src="${logoUrl}" alt="Alfatihah Apps" style="max-height: 50px; margin-bottom: 20px;" />
    <h2 style="color: #008b8b; margin-bottom: 10px;">${title}</h2>
    ${content}
    <p style="font-size: 14px; color: #888; margin-top: 30px;">Tautan ini akan kedaluwarsa dalam 24 jam.</p>
  </div>
`;

export const getRegistrationEmailHtml = (userName: string, verificationToken: string) => {
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo ${userName},</p>
    <p style="font-size: 16px; margin-bottom: 30px;">Terima kasih telah mendaftar di Alfatihah Apps. Untuk melanjutkan, silakan verifikasi alamat email Anda dengan mengeklik tombol di bawah ini:</p>
    <a href="${verificationUrl}" style="background-color: #008b8b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verifikasi Email</a>
  `;
  return getBaseLayout("Verifikasi Email Anda", content);
};

export const getResendVerificationEmailHtml = (userName: string, verificationToken: string) => {
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo ${userName},</p>
    <p style="font-size: 16px; margin-bottom: 30px;">Kami menerima permintaan untuk mengirimkan ulang tautan verifikasi email Anda. Silakan verifikasi alamat email Anda dengan mengeklik tombol di bawah ini:</p>
    <a href="${verificationUrl}" style="background-color: #008b8b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verifikasi Email</a>
  `;
  return getBaseLayout("Kirim Ulang Verifikasi Email", content);
};
