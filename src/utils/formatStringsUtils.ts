export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove all non-digit characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  // Apply the formatting regex for US numbers (10 digits)
  if (cleanedNumber.length === 10) {
    return cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    // Handle other lengths or return original if not a 10-digit number
    return phoneNumber;
  }
};
