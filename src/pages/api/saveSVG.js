import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090"); // URL de ton serveur PB

export const POST = async ({ request }) => {
    try {
        const { name, code } = await request.json();

        const record = await pb.collection("svgs").create({
            name,
            code,
        });

        return new Response(JSON.stringify(record), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to save SVG" }), {
            status: 500,
        });
    }
};
