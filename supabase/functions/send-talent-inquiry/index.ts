import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const { voice_profile_id, sender_name, sender_email, company, project_type, budget, message } = await req.json();

    if (!voice_profile_id || !sender_name || !sender_email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error: profileError } = await supabase
      .from("voice_profiles")
      .select("user_id, name")
      .eq("id", voice_profile_id)
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Voice profile not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);

    if (userError || !user?.email) {
      return new Response(
        JSON.stringify({ error: "Could not resolve talent email." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const talentEmail = user.email;
    const talentName = profile.name;

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

    const detailRows = [
      company ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:100px;">Company</td><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${company}</td></tr>` : '',
      project_type ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Project</td><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${project_type}</td></tr>` : '',
      budget ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Budget</td><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${budget}</td></tr>` : '',
    ].join('');

    await transporter.sendMail({
      from: `"VoiceyPro" <${SMTP_USER}>`,
      to: talentEmail,
      replyTo: `"${sender_name}" <${sender_email}>`,
      subject: `New inquiry from ${sender_name} via VoiceyPro`,
      text: [
        `Hi ${talentName},`,
        ``,
        `You have a new inquiry from ${sender_name} (${sender_email}) through your VoiceyPro listing.`,
        ``,
        company ? `Company: ${company}` : '',
        project_type ? `Project type: ${project_type}` : '',
        budget ? `Budget: ${budget}` : '',
        ``,
        `Message:`,
        message,
        ``,
        `Reply directly to this email to respond to ${sender_name}.`,
        ``,
        `— VoiceyPro`,
      ].filter(Boolean).join('\n'),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <div style="margin-bottom:20px;">
            <h2 style="color:#38bdf8;margin:0 0 4px;">New Inquiry — VoiceyPro</h2>
            <p style="color:#64748b;margin:0;font-size:14px;">Someone found you on voiceypro.com</p>
          </div>
          <p style="color:#cbd5e1;font-size:14px;margin-bottom:20px;">Hi <strong>${talentName}</strong>, you have a new project inquiry.</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:100px;">From</td><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">${sender_name} &lt;${sender_email}&gt;</td></tr>
            ${detailRows}
          </table>
          <div style="background:#1e293b;border-radius:8px;padding:16px;border-left:3px solid #38bdf8;">
            <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="margin-top:20px;color:#94a3b8;font-size:13px;">
            To respond to ${sender_name}, click the button below or reply to <strong style="color:#e2e8f0;">${sender_email}</strong>.
          </p>
          <a href="mailto:${sender_email}?subject=Re: Your VoiceyPro inquiry&body=Hi ${sender_name},%0A%0A"
             style="display:inline-block;margin-top:12px;padding:12px 24px;background:#38bdf8;color:#0f172a;font-weight:600;font-size:14px;text-decoration:none;border-radius:8px;">
            Reply to ${sender_name}
          </a>
          <p style="margin-top:24px;color:#475569;font-size:12px;border-top:1px solid #1e293b;padding-top:16px;">
            Sent via your VoiceyPro talent listing. To manage your profile, visit voiceypro.com/dashboard.
          </p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Talent inquiry error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
