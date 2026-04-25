const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const logoUrl = `${frontendUrl}/assets/logo-apps.png`;

const getBaseLayout = (title: string, content: string, expiryText: string = "Tautan ini akan kedaluwarsa dalam 1 jam.") => `
  <div style="font-family: Arial, sans-serif; text-align: center; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; padding: 30px;">
    <img src="${logoUrl}" alt="Alfatihah Apps" style="max-height: 50px; margin-bottom: 20px;" />
    <h2 style="color: #008b8b; margin-bottom: 10px;">${title}</h2>
    ${content}
    <p style="font-size: 14px; color: #888; margin-top: 30px;">${expiryText}</p>
  </div>
`;

export const getRegistrationEmailHtml = (verificationUrl: string) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Selamat datang di Alfatihah!</p>
    <p style="font-size: 16px; margin-bottom: 30px;">Untuk menyelesaikan pendaftaran dan membuat password Anda, silakan klik tombol di bawah ini:</p>
    <a href="${verificationUrl}" style="background-color: #008b8b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verifikasi & Buat Password</a>
  `;
  return getBaseLayout("Verifikasi Pendaftaran", content);
};

export const getResendVerificationEmailHtml = (verificationUrl: string) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 30px;">Silakan verifikasi alamat email Anda dan buat password untuk melanjutkan pendaftaran di Alfatihah Apps:</p>
    <a href="${verificationUrl}" style="background-color: #008b8b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verifikasi Email</a>
  `;
  return getBaseLayout("Kirim Ulang Verifikasi Email", content);
};

export const getResetPasswordEmailHtml = (resetUrl: string) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo,</p>
    <p style="font-size: 16px; margin-bottom: 30px;">Kami menerima permintaan untuk mengatur ulang password akun Anda. Silakan klik tombol di bawah ini untuk melanjutkan:</p>
    <a href="${resetUrl}" style="background-color: #e63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Atur Ulang Password</a>
    <p style="font-size: 14px; margin-top: 20px; color: #666;">Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
  `;
  return getBaseLayout("Atur Ulang Password", content);
};

export const getEmailChangeVerificationHtml = (verificationUrl: string) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo,</p>
    <p style="font-size: 16px; margin-bottom: 30px;">Anda telah mengubah alamat email akun Alfatihah Anda. Silakan verifikasi alamat email baru ini dengan mengeklik tombol di bawah:</p>
    <a href="${verificationUrl}" style="background-color: #008b8b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verifikasi Email Baru</a>
  `;
  return getBaseLayout("Verifikasi Email Baru", content);
};
