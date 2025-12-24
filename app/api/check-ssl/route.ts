import { NextResponse } from 'next/server';
import tls from 'node:tls';

// 1. Ensure the helper function is clearly typed
function getValidationType(subject: any): "DV" | "OV" | "EV" | "Unknown" {
  if (!subject) return "Unknown";
  const hasOrg = !!subject.O;
  const hasEVFields = !!(subject.jurisdictionC || subject.businessCategory || subject.serialNumber);
  if (hasOrg && hasEVFields) return "EV";
  if (hasOrg) return "OV";
  return "DV";
}

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    const host = domain.replace(/^(https?:\/\/)/, "").split('/')[0].split('?')[0];

    // 2. ADD THE TYPE <NextResponse> TO THE PROMISE CONSTRUCTOR
    return await new Promise<NextResponse>((resolve) => {
      const socket = tls.connect({
        host,
        port: 443,
        servername: host,
        rejectUnauthorized: false,
      }, () => {
        const cert = socket.getPeerCertificate(true);
        
        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          resolve(NextResponse.json({ error: "No certificate found" }, { status: 404 }));
          return;
        }

        const expiry = new Date(cert.valid_to);
        const daysLeft = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        const data = {
          valid: socket.authorized,
          issuer: cert.issuer.O || cert.issuer.CN || "Unknown Issuer",
          expiryDate: cert.valid_to,
          daysLeft: daysLeft > 0 ? daysLeft : 0,
          type: getValidationType(cert.subject),
        };

        socket.destroy();
        resolve(NextResponse.json(data));
      });

      socket.on('error', (err) => {
        socket.destroy();
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve(NextResponse.json({ error: "Connection Timeout" }, { status: 504 }));
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }
}