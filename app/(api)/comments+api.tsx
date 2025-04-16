import { pool } from "@/configs/NilePostgresConfig"; // Import pool

export async function POST(request: Request) {
  try {
    const { user_id, post_id, text, parent_id } = await request.json();

    if (!user_id || !post_id || !text) {
      return Response.json({ error: "user_id, post_id, and text are required" }, { status: 400 });
    }

    // Use a parameterized query with placeholders ($1, $2, etc.)
    const query = `
      INSERT INTO comments (user_id, post_id, text, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    // Pass the values as an array in the same order as the placeholders
    // Ensure parent_id is explicitly null if not provided
    const values = [user_id, post_id, text, parent_id === undefined ? null : parent_id];

    console.log("📄 Query to be executed:\n", query);
    console.log("📦 Values to be used:\n", values);

    // Use pool.query() directly. It handles connection checkout/release.
    const result = await pool.query(query, values);

    // NO pool.connect() or pool.end() here!

    if (result.rows.length === 0) {
        // Handle case where RETURNING * didn't return anything (shouldn't happen on success)
        console.error("⚠️ Insert seemed successful but returned no rows.");
        return Response.json({ error: "Failed to create comment" }, { status: 500 });
    }

    return Response.json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error posting comment:", error);
    // Check if error is a Postgres error for more details potentially
    if (error instanceof Error) {
         return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get("post_id");
    const user_id = searchParams.get("user_id"); // This might be null if user isn't logged in or it's not passed
    console.log("🔍 Incoming GET request with post_id:", post_id, "user_id:", user_id);

    if (!post_id) {
      console.error("⚠️ post_id missing from query parameters.");
      return Response.json({ error: "post_id is required" }, { status: 400 });
    }

    // Parameterized query for GET request
    // IMPORTANT: Handle potential null user_id gracefully.
    // If user_id is required for the 'userlike' logic, ensure it's passed or handle the null case.
    // Assuming user_id can be null here, adjust if that's not the case.
    const query = `
      SELECT
          c.*,
          u.name AS username,
          u.image AS profile_image,
          (
            SELECT COUNT(*)
            FROM comments r
            WHERE r.parent_id = c.id
          ) AS reply_count,
          (
            SELECT COUNT(*)
            FROM comment_likes cl
            WHERE cl.comment_id = c.id
          ) AS likes,
          -- Ensure EXISTS handles NULL user_id if necessary
          -- If $1 is NULL, EXISTS(...) will likely be false, which might be intended.
          EXISTS (
            SELECT 1
            FROM comment_likes
            WHERE comment_id = c.id AND user_id = $1
          ) AS userlike
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $2 AND c.parent_id IS NULL
      ORDER BY c.created_at ASC;
    `;

    // Pass user_id (which can be null) and post_id
    const values = [user_id, post_id];

    console.log("📄 Prepared SQL query:\n", query);
    console.log("📦 Using values as parameters:", values);

    // Use pool.query()
    const result = await pool.query(query, values);
    console.log("📊 Query executed successfully. Rows returned:", result.rowCount);

    // NO pool.connect() or pool.end() here!

    const sanitizedRows = result.rows.map(row => ({
      ...row,
      reply_count: Number(row.reply_count), // Counts should already be numbers, but explicit conversion is safe
      likes: Number(row.likes),
      userlike: row.userlike
    }));

    return Response.json(sanitizedRows);

  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    if (error instanceof Error) {
      return Response.json(
        {
          error: "Internal Server Error",
          details: error.message
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        error: "Internal Server Error",
        details: "An unknown error occurred"
      },
      { status: 500 }
    );
  }
}