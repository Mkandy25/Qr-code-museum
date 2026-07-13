const BREVO_API_KEY = process.env.API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "mannenswana270@gmail.com";
const SENDER_NAME = process.env.SENDER_NAME || "Musée National de Lubumbashi";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mannenswana270@gmail.com";

async function sendBrevoEmail(to, toName, subject, htmlContent) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Brevo HTTP ${response.status}`);
  }
}

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

  if (!BREVO_API_KEY) {
    return res.status(500).json({ error: "Clé Brevo non configurée" });
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

    // ========================================
    // EMAIL 1 : Au visiteur (confirmation)
    // ========================================
    await sendBrevoEmail(
      email,
      fullName,
      "Confirmation de réservation - Musée National de Lubumbashi",
      `
        <h2>Bonjour ${fullName},</h2>
        <p>Votre réservation pour le Musée National de Lubumbashi a bien été confirmée !</p>
        <br>
        <p><strong> Date de visite :</strong> ${visitDate}</p>
        <p><strong> Type de billet :</strong> ${ticketType}</p>
        <p><strong> Quantité :</strong> ${quantity}</p>
        <p><strong> Total :</strong> ${totalPrice} Fc</p>
        <br>
        <p>Votre réservation est valable toute la journée du ${visitDate}.</p>
        <p>Merci de présenter cet email à l'entrée du musée.</p>
        <br>
        <p>À très bientôt !</p>
        <p><strong>L'équipe du Musée National de Lubumbashi</strong></p>
      `,
    );

    // ========================================
    // EMAIL 2 : À l'admin (notification)
    // ========================================
    await sendBrevoEmail(
      ADMIN_EMAIL,
      "Admin Musée",
      " Nouvelle réservation - Musée National de Lubumbashi",
      `
        <h2>Nouvelle réservation reçue !</h2>
        <br>
        <p><strong> Nom :</strong> ${fullName}</p>
        <p><strong> Email :</strong> ${email}</p>
        <p><strong> Date de visite :</strong> ${visitDate}</p>
        <p><strong> Type de billet :</strong> ${ticketType}</p>
        <p><strong> Quantité :</strong> ${quantity}</p>
        <p><strong> Total :</strong> ${totalPrice} Fc</p>
        <br>
        <p><em>Réservation effectuée le ${currentDate}</em></p>
      `,
    );

    return res.status(200).json({
      success: true,
      message: "Réservation confirmée ! Les emails ont été envoyés.",
    });
  } catch (error) {
    console.error(" Erreur Brevo :", error);
    return res.status(500).json({
      error: "Erreur lors de l'envoi des emails",
      details: error.message,
    });
  }
}
