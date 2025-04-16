import { pool } from "@/configs/NilePostgresConfig"; // Use pool

export async function POST(request: Request) {
    try {
        const { user_id, post_id } = await request.json();

        if (!user_id || !post_id) {
            return Response.json({ error: "User ID and Post ID are required" }, { status: 400 });
        }

        // Parameterized query
        const query = `
          INSERT INTO likes (user_id, post_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING; -- Consider adding ON CONFLICT
        `;
        // Assuming post_id is string/UUID, user_id is appropriate type
        const values = [user_id, post_id];

        // Use pool.query()
        await pool.query(query, values);
        // No connect/end

        return Response.json({ success: true, message: "Post liked" });
    } catch (error) {
        console.error("❌ Error liking post:", error);
        if (error instanceof Error) {
            return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
        }
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Assuming body usage based on your code:
        const { user_id, post_id } = await request.json();

        if (!user_id || !post_id) {
            return Response.json({ error: "User ID and Post ID are required" }, { status: 400 });
        }

        // Parameterized query
        const query = `
          DELETE FROM likes
          WHERE user_id = $1 AND post_id = $2;
        `;
        const values = [user_id, post_id];

        // Use pool.query()
        await pool.query(query, values);
        // No connect/end

        return Response.json({ success: true, message: "Post unliked" });
    } catch (error) {
        console.error("❌ Error unliking post:", error);
        if (error instanceof Error) {
            return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
        }
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}