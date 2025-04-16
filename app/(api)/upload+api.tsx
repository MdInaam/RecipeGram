import { pool } from "@/configs/NilePostgresConfig"; // Use pool

export async function POST(request: Request) {
  try { // Add try...catch block
    const { caption, userID, video, recipe } = await request.json();

    if (!userID || !video) { // Add basic validation
        return Response.json({ error: "userID and video URL are required" }, { status: 400 });
    }

    // Parameterized query - Assuming default for ID and created_at
    // Match the order of your table columns if not specifying them explicitly
    // It's safer to list columns: INSERT INTO posts (user_id, media_url, caption, recipe) VALUES (...)
    const query = `
      INSERT INTO posts (user_id, media_url, caption, recipe)
      VALUES ($1, $2, $3, $4)
      RETURNING *; -- Return the created post if needed
    `;
    const values = [userID, video, caption ?? null, recipe ?? null]; // Use null for potentially missing optional fields

    // Use pool.query()
    const result = await pool.query(query, values);
    // No connect/end

    // Return the newly created post row
    return Response.json(result.rows[0]);

  } catch(error) {
    console.error("❌ Error uploading post:", error);
        if (error instanceof Error) {
            return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
        }
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}