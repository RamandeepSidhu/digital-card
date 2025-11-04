/**
 * QR Code generation utilities
 */

/**
 * Generate a shareable URL for a card
 */
export function generateCardUrl(cardId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/card/${cardId}`;
}

/**
 * Generate vCard content for business cards
 */
export function generateVCard(businessCard: {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  address?: string;
}): string {
  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  vcard += `FN:${businessCard.name}\n`;
  vcard += `ORG:${businessCard.company}\n`;
  vcard += `TITLE:${businessCard.title}\n`;
  vcard += `EMAIL:${businessCard.email}\n`;
  vcard += `TEL:${businessCard.phone}\n`;
  
  if (businessCard.website) {
    vcard += `URL:${businessCard.website}\n`;
  }
  
  if (businessCard.linkedin) {
    vcard += `URL:${businessCard.linkedin}\n`;
  }
  
  if (businessCard.address) {
    vcard += `ADR:;;${businessCard.address};;;;\n`;
  }
  
  vcard += 'END:VCARD';
  return vcard;
}

/**
 * Generate vCard content for personal cards
 */
export function generatePersonalVCard(personalCard: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthday?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}): string {
  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  vcard += `FN:${personalCard.name}\n`;
  vcard += `EMAIL:${personalCard.email}\n`;
  vcard += `TEL:${personalCard.phone}\n`;
  
  if (personalCard.address) {
    vcard += `ADR:;;${personalCard.address};;;;\n`;
  }
  
  if (personalCard.birthday) {
    vcard += `BDAY:${personalCard.birthday}\n`;
  }
  
  if (personalCard.website) {
    vcard += `URL:${personalCard.website}\n`;
  }
  
  if (personalCard.socialMedia) {
    if (personalCard.socialMedia.linkedin) {
      vcard += `URL:${personalCard.socialMedia.linkedin}\n`;
    }
    if (personalCard.socialMedia.twitter) {
      vcard += `URL:${personalCard.socialMedia.twitter}\n`;
    }
    if (personalCard.socialMedia.facebook) {
      vcard += `URL:${personalCard.socialMedia.facebook}\n`;
    }
    if (personalCard.socialMedia.instagram) {
      vcard += `URL:${personalCard.socialMedia.instagram}\n`;
    }
  }
  
  vcard += 'END:VCARD';
  return vcard;
}

/**
 * Download vCard file
 */
export function downloadVCard(vcardContent: string, filename: string = 'contact.vcf'): void {
  const blob = new Blob([vcardContent], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

