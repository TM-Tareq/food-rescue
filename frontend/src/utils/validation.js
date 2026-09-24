/**
 * Frontend Validation Helpers for Bangladesh Mobile Numbers and OTPs
 */
export const validateBdPhone = (phone) => {
  const bdRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
  return bdRegex.test(phone.trim());
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateOtpCode = (otp) => {
  return /^\d{4}$/.test(otp.trim());
};
