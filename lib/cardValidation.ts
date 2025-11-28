/**
 * Detecta el tipo de tarjeta basándose en el BIN (primeros dígitos)
 */
export function detectCardType(cardNumber: string): {
  brand: string;
  logo: string;
  cvvLength: number;
} | null {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Visa: empieza con 4
  if (/^4/.test(cleaned)) {
    return { brand: 'Visa', logo: '💳', cvvLength: 3 };
  }
  
  // MasterCard: 51-55 o 2221-2720
  if (/^5[1-5]/.test(cleaned) || /^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(cleaned)) {
    return { brand: 'MasterCard', logo: '💳', cvvLength: 3 };
  }
  
  // American Express: 34 o 37
  if (/^3[47]/.test(cleaned)) {
    return { brand: 'American Express', logo: '💳', cvvLength: 4 };
  }
  
  // Diners Club: 36, 38, 300-305
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) {
    return { brand: 'Diners Club', logo: '💳', cvvLength: 3 };
  }
  
  // Discover: 6011, 622126-622925, 644-649, 65
  if (/^6(?:011|5|4[4-9]|22(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))/.test(cleaned)) {
    return { brand: 'Discover', logo: '💳', cvvLength: 3 };
  }
  
  return null;
}

/**
 * Valida el formato básico del número de tarjeta
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Debe tener entre 13 y 19 dígitos
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Formatea el número de tarjeta con espacios
 */
export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

/**
 * Valida la fecha de expiración
 */
export function validateExpiryDate(month: string, year: string): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);
  
  if (expMonth < 1 || expMonth > 12) return false;
  
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
}

/**
 * Valida el CVV
 */
export function validateCVV(cvv: string, expectedLength: number = 3): boolean {
  const regex = new RegExp(`^\\d{${expectedLength}}$`);
  return regex.test(cvv);
}
