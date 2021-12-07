import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendResetMail = async function (
  token: string,
  to: string
): Promise<unknown | undefined> {
  const html = `
  <table style="text-align: center;">
  <p>Alors comme ça tu as perdu ton mot de passe...</p>
  <p>
    Fais gaffe quand meme, la prochine fois met en un tout simple genre ta date
    de naissance ou bien ecrit le sur un post it que tu colles sur ton pc
  </p>
  <a
    id="link-button"
    href="overbookd.${process.env.DOMAIN}/reset/${token}"
    style="
      background-color: green;
      padding: 1rem 1rem 1rem 1rem;
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      display: inline-block;
      margin: 1rem;
    "
    >Réinitiliser</a
  >
  <p>
    Si le lien ne marche pas, va a cette adresse :
    overbookd.${process.env.DOMAIN}/reset/${token}
  </p>

  <p>
    Bisous <br />
    La Team OB
  </p>
</table>`;

  const mailOptions = {
    from: "tom26.sampic@gmail.com",
    to,
    subject: "Tu as perdu ton mot de passe. LOL",
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
};
