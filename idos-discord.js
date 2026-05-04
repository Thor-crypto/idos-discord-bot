const WEBHOOK_URL = process.env.WEBHOOK_URL;

const IDOS_URL =
  "https://idos.cz/vlakyautobusymhdvse/odjezdy/vysledky/?date=04.05.2026&time=15:28&f=Praha%20hl.n.&fc=100003&byarr=true&cmd=cmdSearch";

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function sendToDiscord(content) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "IDOS Bot",
      content
    })
  });
}

async function main() {
  if (!WEBHOOK_URL) {
    throw new Error("Chybí WEBHOOK_URL secret");
  }

  const response = await fetch(IDOS_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await response.text();
  const text = cleanText(html);

  const timeMatches = [...text.matchAll(/\b\d{1,2}:\d{2}\b/g)]
    .map((m) => m[0])
    .slice(0, 10);

  let message;

  if (timeMatches.length === 0) {
    message =
      "⚠️ IDOS načten, ale nepodařilo se najít časy spojů.\n" +
      IDOS_URL;
  } else {
    message =
      "🚆 **IDOS – příjezdy Praha hl.n.**\n\n" +
      timeMatches.map((t) => `• ${t}`).join("\n") +
      "\n\n" +
      IDOS_URL;
  }

  await sendToDiscord(message);
  console.log("Odesláno do Discordu.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
