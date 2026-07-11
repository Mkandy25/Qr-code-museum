import { Resend } from "resend";

// La clé API est dans les variables d'environnement Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Vérifier que c'est bien une requête POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // 2. Récupérer les données du formulaire
    const { fullName, email, visitDate, ticketType, quantity, totalPrice } =
      req.body;

    // 3. Validation des données
    if (!fullName || !email || !visitDate || !ticketType || !quantity) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // 4. Date actuelle pour l'admin
    const now = new Date();
    const currentDate =
      now.toLocaleDateString("fr-FR") + " à " + now.toLocaleTimeString("fr-FR");

    // ========================================
    // EMAIL 1 : Au visiteur (confirmation)
    // ========================================
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

    // ========================================
    // EMAIL 2 : À l'admin (notification)
    // ========================================
    await resend.emails.send({
      from: "Musée National de Lubumbashi <onboarding@resend.dev>",
      to: "andymbuyi08@gmail.com",
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

    // 5. Réponse de succès
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
