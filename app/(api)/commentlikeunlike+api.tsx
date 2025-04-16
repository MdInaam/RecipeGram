import { pool } from "@/configs/NilePostgresConfig"; // Use pool

// ✅ Like a comment
export async function POST(request: Request) {
  try {
    const { user_id, comment_id } = await request.json();

    if (!user_id || !comment_id) {
      return Response.json({ error: "User ID and Comment ID are required" }, { status: 400 });
    }

    // Parameterized query
    const query = `
      INSERT INTO comment_likes (user_id, comment_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    const values = [user_id, comment_id];

    // Use pool.query()
    await pool.query(query, values);
    // No connect/end

    return Response.json({ success: true, message: "Comment liked" });
  } catch (error) {
    console.error("❌ Error liking comment:", error);
    if (error instanceof Error) {
         return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Unlike a comment
export async function DELETE(request: Request) {
  try {
    // Use URL search params for DELETE usually, or stick to body if consistent
    // Assuming body usage based on your code:
    const { user_id, comment_id } = await request.json();

    if (!user_id || !comment_id) {
      return Response.json({ error: "User ID and Comment ID are required" }, { status: 400 });
    }

    // Parameterized query
    const query = `
      DELETE FROM comment_likes
      WHERE user_id = $1 AND comment_id = $2;
    `;
    const values = [user_id, comment_id];

    // Use pool.query()
    const result = await pool.query(query, values);
    // No connect/end

    // Optional: Check if a row was actually deleted
    // console.log("Unlike result:", result.rowCount);

    return Response.json({ success: true, message: "Comment unliked" });
  } catch (error) {
    console.error("❌ Error unliking comment:", error);
     if (error instanceof Error) {
         return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}