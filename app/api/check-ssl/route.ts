import { NextResponse } from 'next/server';
import tls from 'node:tls'; //

// Custom interface for EV certificate fields
interface EVSubject {
  O?: string;
  jurisdictionC?: string;
  businessCategory?: string;
  serialNumber?: string;
}

function getValidationType(subject: any): "DV" | "OV" | "EV" | "Unknown" {
  if (!subject) return "Unknown";
  const s = subject as EVSubject;
  const hasOrg = !!s.O;
  const hasEVFields = !!(s.jurisdictionC || s.businessCategory || s.serialNumber);
  if (hasOrg && hasEVFields) return "EV";
  if (hasOrg) return "OV";
  return "DV";
}

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    const host = domain.trim().replace(/^(https?:\/\/)/, "").split('/')[0].split('?')[0];

    // Parallel fetch: SSL Handshake + RDAP Domain Ownership
    const [sslData, whoisData] = await Promise.all([
      performSSLCheck(host),
      fetch(`https://rdap.org/domain/${host}`).then(res => res.json()).catch(() => ({}))
    ]);

    // Extracting domain registration expiry from RDAP events
    const expiryEvent = whoisData.events?.find((e: any) => e.eventAction === 'expiration');
    const domainExpiry = expiryEvent ? expiryEvent.eventDate : "Not Available";

    return NextResponse.json({ ...sslData, domainExpiry });
  } catch (error) {
    return NextResponse.json({ error: "Diagnostic failed" }, { status: 500 });
  }
}

async function performSSLCheck(host: string): Promise<any> {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate(true);
      if (!cert || Object.keys(cert).length === 0) {
        socket.destroy();
        resolve({ valid: false, error: "No certificate found" });
        return;
      }
      const daysLeft = Math.ceil((new Date(cert.valid_to).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      resolve({
        valid: socket.authorized,
        issuer: cert.issuer.O || cert.issuer.CN || "Unknown Issuer",
        expiryDate: cert.valid_to,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        type: getValidationType(cert.subject)
      });
      socket.destroy();
    });
    socket.on('error', () => resolve({ valid: false, error: "SSL Handshake Failed" }));
  });
}