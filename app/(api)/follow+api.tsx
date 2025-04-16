import { pool } from "@/configs/NilePostgresConfig"; // Use pool

export async function POST(request: Request) {
    try {
        const { follower_id, following_id } = await request.json();

        if (!follower_id || !following_id) {
            return Response.json({ error: "Both follower_id and following_id are required" }, { status: 400 });
        }

        // Parameterized query
        const query = `
          INSERT INTO followers (follower_id, following_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING; -- Consider adding ON CONFLICT if needed
        `;
        const values = [follower_id, following_id];

        // Use pool.query()
        await pool.query(query, values);
        // No connect/end

        return Response.json({ success: true, message: "User followed successfully" });
    } catch (error) {
        console.error("❌ Error following user:", error);
        if (error instanceof Error) {
            return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
        }
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Assuming body usage based on your code:
        const { follower_id, following_id } = await request.json();

        if (!follower_id || !following_id) {
            return Response.json({ error: "Both follower_id and following_id are required" }, { status: 400 });
        }

        // Parameterized query
        const query = `
          DELETE FROM followers
          WHERE follower_id = $1 AND following_id = $2;
        `;
        const values = [follower_id, following_id];

        // Use pool.query()
        await pool.query(query, values);
        // No connect/end

        return Response.json({ success: true, message: "User unfollowed successfully" });
    } catch (error) {
        console.error("❌ Error unfollowing user:", error);
        if (error instanceof Error) {
            return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
        }
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}