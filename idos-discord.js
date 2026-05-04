const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function main() {
  if (!WEBHOOK_URL) {
    throw new Error("Chybí WEBHOOK_URL secret");
  }

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "IDOS bot funguje!"
    })
  });

  console.log("Odesláno do Discordu.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});