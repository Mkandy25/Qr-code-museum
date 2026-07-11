import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { fullName, email, visitDate, ticketType, quantity, totalPrice } =
      req.body;

    if (!fullName || !email || !visitDate || !ticketType || !quantity) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const now = new Date();
    const currentDate =
      now.toLocaleDateString("fr-FR") + " à " + now.toLocaleTimeString("fr-FR");

    // Email au visiteur
    await resend.emails.send({
      from: "Musée National de Lubumbashi <onboarding@resend.dev>",
      to: email,
      subject: "✅ Confirmation de réservation - Musée National de Lubumbashi",
      html: `
        <h2>Bonjour ${fullName},</h2>
        <p>Votre réservation pour le Musée National de Lubumbashi a bien été confirmée !</p>
        <br>
        <p><strong>📅 Date de visite :</strong> ${visitDate}</p>
        <p><strong>🎫 Type de billet :</strong> ${ticketType}</p>
        <p><strong>👤 Quantité :</strong> ${quantity}</p>
        <p><strong>💰 Total :</strong> ${totalPrice} Fc</p>
        <br>
        <p>Votre réservation est valable toute la journée du ${visitDate}.</p>
        <p>Merci de présenter cet email à l'entrée du musée.</p>
        <br>
        <p>À très bientôt !</p>
        <p><strong>L'équipe du Musée National de Lubumbashi</strong></p>
      `,
    });

    // Email à l'admin
    await resend.emails.send({
      from: "Musée National de Lubumbashi <onboarding@resend.dev>",
      to: "mannenswana2708@gmail.com",
      subject: "📋 Nouvelle réservation - Musée National de Lubumbashi",
      html: `
        <h2>Nouvelle réservation reçue !</h2>
        <br>
        <p><strong>👤 Nom :</strong> ${fullName}</p>
        <p><strong>📧 Email :</strong> ${email}</p>
        <p><strong>📅 Date de visite :</strong> ${visitDate}</p>
        <p><strong>🎫 Type de billet :</strong> ${ticketType}</p>
        <p><strong>👤 Quantité :</strong> ${quantity}</p>
        <p><strong>💰 Total :</strong> ${totalPrice} Fc</p>
        <br>
        <p><em>Réservation effectuée le ${currentDate}</em></p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Réservation confirmée ! Les emails ont été envoyés.",
    });
  } catch (error) {
    console.error("❌ Erreur :", error);
    return res.status(500).json({
      error: "Erreur lors de l'envoi des emails",
      details: error.message,
    });
  }
}
