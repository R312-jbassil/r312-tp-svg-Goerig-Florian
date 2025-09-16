// DELETE /api/deleteSVG?id=<recordId>
import PocketBase from "pocketbase";

const PB_URL = import.meta.env.PB_URL || "http://127.0.0.1:8090";
const COLLECTION = "svgs";

export const DELETE = async ({ url }) => {
    try {
        const id = url.searchParams.get("id");
        if (!id) {
            return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
        }

        const pb = new PocketBase(PB_URL);

        // Si ta collection n'autorise pas Delete en public, décommente et configure .env :
        // await pb.admins.authWithPassword(import.meta.env.PB_ADMIN_EMAIL, import.meta.env.PB_ADMIN_PASSWORD);

        await pb.collection(COLLECTION).delete(id);
        return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.error("deleteSVG error:", err);
        return new Response(JSON.stringify({ error: err?.message || "Failed to delete" }), { status: 500 });
    }
};
