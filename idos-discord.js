const WEBHOOK_URL = process.env.WEBHOOK_URL;

const IDOS_URL =
  "https://idos.cz/vlakyautobusymhdvse/odjezdy/vysledky/?f=Praha%20hl.n.&fc=100003&byarr=true&cmd=cmdSearch";

async function send(content) {
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
  const res = await fetch(IDOS_URL, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const html = await res.text();

  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  const times = [...text.matchAll(/\b\d{1,2}:\d{2}\b/g)]
    .map(m => m[0])
    .slice(0, 10);

  if (!times.length) {
    await send("IDOS načten, ale nepodařilo se najít příjezdy do Praha hl.n.");
    return;
  }

  await send(
    "🚆 **Příjezdy do Praha hl.n.**\n\n" +
    times.map(t => `• ${t}`).join("\n") +
    "\n\n" +
    IDOS_URL
  );
}

main().catch(async err => {
  console.error(err);
  await send("Chyba IDOS bota: " + err.message);
  process.exit(1);
});
