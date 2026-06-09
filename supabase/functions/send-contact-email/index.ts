import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "mail.voiceypro.com";
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") ?? "587");
    const SMTP_USER = Deno.env.get("SMTP_USER") ?? "support@voiceypro.com";
    const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";

    const nodemailer = await import("npm:nodemailer@6.9.13");

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"VoiceyPro Contact" <${SMTP_USER}>`,
      to: SMTP_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `[VoiceyPro] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <div style="margin-bottom:24px;">
            <h2 style="color:#38bdf8;margin:0 0 4px;">VoiceyPro Contact Form</h2>
            <p style="color:#64748b;margin:0;font-size:14px;">New message from voiceypro.com</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:80px;">From</td><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${name} &lt;${email}&gt;</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Subject</td><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${subject}</td></tr>
          </table>
          <div style="background:#1e293b;border-radius:8px;padding:16px;border-left:3px solid #38bdf8;">
            <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="margin-top:20px;color:#475569;font-size:12px;">Sent via voiceypro.com contact form</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("SMTP error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
