import { pool } from "@/configs/NilePostgresConfig"; // Use pool

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parent_id = searchParams.get("parent_id");
    const user_id = searchParams.get("user_id"); // Can be null

    if (!parent_id) {
      return Response.json({ error: "parent_id is required" }, { status: 400 });
    }

    // Parameterized query
    const query = `
      SELECT
        c.*,
        u.name AS username,
        u.image AS profile_image,
        (
          SELECT COUNT(*)
          FROM comment_likes
          WHERE comment_id = c.id
        ) AS likes,
        EXISTS (
          SELECT 1
          FROM comment_likes
          WHERE comment_id = c.id AND user_id = $1 -- Parameter for user_id
        ) AS userlike
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.parent_id = $2 -- Parameter for parent_id
      ORDER BY c.created_at ASC;
    `;
    const values = [user_id, parent_id]; // Pass potentially null user_id

    // Use pool.query()
    const result = await pool.query(query, values);
    // No connect/end

    const sanitizedRows = result.rows.map(row => ({
      ...row,
      likes: Number(row.likes),
      userlike: row.userlike
    }));

    return Response.json(sanitizedRows);

  } catch (error) {
    console.error("❌ Error fetching replies:", error);
     if (error instanceof Error) {
         return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}