const WEBHOOK_URL = process.env.WEBHOOK_URL;

const IDOS_URL =
  "https://idos.cz/vlakyautobusymhdvse/odjezdy/vysledky/?f=Praha%20hl.n.&fc=100003&byarr=true&cmd=cmdSearch";

async function send(content) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "IDOS Bot",
      content: content
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

  const spoje = [...text.matchAll(/\b((?:Os|Sp|R|Rx|Ex|IC|EC|EN|RJ|LE)\s?\d+)\b.{0,120}?(\d{1,2}:\d{2})/g)]
    .map(m => ({
      vlak: m[1],
      cas: m[2]
    }))
    .slice(0, 10);

  if (!spoje.length) {
    await send("⚠️ Nepodařilo se načíst názvy vlaků.");
    return;
  }

  await send(
    "🚆 **Příjezdy do Praha hl.n.**\n\n" +
    spoje.map(s => `• **${s.cas}** — ${s.vlak}`).join("\n") +
    "\n\n" +
    IDOS_URL
  );
}

main().catch(async err => {
  console.error(err);
  await send("Chyba IDOS bota: " + err.message);
  process.exit(1);
});
