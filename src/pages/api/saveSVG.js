import PocketBase from "pocketbase";

const PB_URL = import.meta.env.PB_URL || "http://127.0.0.1:8090";
const COLLECTION = "svgs"; // assure-toi que ça s'appelle exactement comme ça

export const POST = async ({ request }) => {
  try {
    const { name, code } = await request.json();

    if (!name || !code) {
      return new Response(JSON.stringify({ error: "Missing name or code" }), { status: 400 });
    }

    const pb = new PocketBase(PB_URL);

    // --- Option A: permissions ouvertes (Create = true) -> pas d'auth nécessaire
    // --- Option B: si Create n'est PAS public, dé-commente ces 2 lignes et ajoute .env :
    // PB_ADMIN_EMAIL="admin@local"
    // PB_ADMIN_PASSWORD="xxxx"
    // await pb.admins.authWithPassword(import.meta.env.PB_ADMIN_EMAIL, import.meta.env.PB_ADMIN_PASSWORD);

    const record = await pb.collection(COLLECTION).create({ name, code });

    return new Response(JSON.stringify(record), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("saveSVG error:", err);
    // renvoyer un message clair au client
    return new Response(JSON.stringify({ error: err?.message || "Failed to save SVG" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
