import { NextResponse } from 'next/server';
import tls from 'node:tls'; //

// ... rest of your code
// Define a custom type to include EV-specific fields
interface EVSubject {
  O?: string;
  jurisdictionC?: string;
  jurisdictionCountryName?: string;
  businessCategory?: string;
  serialNumber?: string;
}

function getValidationType(subject: any): "DV" | "OV" | "EV" | "Unknown" {
  if (!subject || Object.keys(subject).length === 0) return "Unknown";

  // Cast to our custom type or 'any' to access EV fields
  const s = subject as EVSubject;
  
  const hasOrg = !!s.O;
  const hasEVFields = !!(s.jurisdictionC || s.jurisdictionCountryName || s.businessCategory || s.serialNumber);

  if (hasOrg && hasEVFields) return "EV";
  if (hasOrg) return "OV";
  return "DV";
}

// Update your performSSLCheck function to use this
async function performSSLCheck(host: string): Promise<any> {
  return new Promise((resolve) => {
    const socket = tls.connect({ 
      host, 
      port: 443, 
      servername: host, 
      rejectUnauthorized: false 
    }, () => {
      const cert = socket.getPeerCertificate(true);
      
      // Check if certificate is valid/exists
      if (!cert || Object.keys(cert).length === 0) {
        socket.destroy();
        resolve({ error: "No certificate found" });
        return;
      }

      const expiry = new Date(cert.valid_to);
      const daysLeft = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

      resolve({
        valid: socket.authorized,
        issuer: cert.issuer.O || cert.issuer.CN || "Unknown Issuer",
        expiryDate: cert.valid_to,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        type: getValidationType(cert.subject) // Passed correctly now
      });
      socket.destroy();
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({ error: err.message });
    });
  });
}