// app/api/check-ssl/route.ts
import { NextResponse } from 'next/server';
import tls from 'node:tls';
import { getValidationType, calculateDaysLeft } from '@/lib/ssl-parser';

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    
    // Sanitize input: remove https:// and any trailing paths
    const host = domain.replace(/^(https?:\/\/)/, "").split('/')[0];

    return new Promise((resolve) => {
      const socket = tls.connect({
        host,
        port: 443,
        servername: host, // Critical for SNI support
        rejectUnauthorized: false, // We want to see invalid/self-signed certs too
      }, () => {
        const cert = socket.getPeerCertificate(true); // Fetch the full chain
        
        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          resolve(NextResponse.json({ error: "No certificate found" }, { status: 404 }));
          return;
        }

        const result = {
          valid: socket.authorized, // Check if CA is trusted
          issuer: cert.issuer.O || cert.issuer.CN,
          expiryDate: cert.valid_to,
          daysLeft: calculateDaysLeft(cert.valid_to),
          type: getValidationType(cert.subject),
          rawSubject: cert.subject,
        };

        socket.destroy();
        resolve(NextResponse.json(result));
      });

      // Handle connection errors (e.g., domain not found)
      socket.on('error', (err) => {
        socket.destroy();
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      });

      // Set a 10-second timeout to prevent hanging
      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve(NextResponse.json({ error: "Connection timed out" }, { status: 504 }));
      });
    });

  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}