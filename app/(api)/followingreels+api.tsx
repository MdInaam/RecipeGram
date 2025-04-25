import { pool } from "@/configs/NilePostgresConfig"; // Import pool

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  console.log("Logged-in User ID:", user_id);

  if (!user_id) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const query = `
        SELECT
            p.id AS post_id,
            p.media_url,
            p.caption,
            u.name AS username,
            u.image AS profile_image,
            COUNT(DISTINCT l.id) AS likes,
            COUNT(DISTINCT c.id) AS comments,
            EXISTS (SELECT 1 FROM likes WHERE user_id = $1 AND post_id = p.id) AS userlike
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN followers f ON f.following_id = p.user_id
        LEFT JOIN likes l ON p.id = l.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE f.follower_id = $1
        GROUP BY p.id, u.name, u.image
        ORDER BY p.created_at DESC;
      `;

    const values = [user_id];

    console.log("Executing parameterized query:", query);
    console.log("With values:", values);

    const result = await pool.query(query, values);

    const fixedResult = result.rows.map(row => ({
      ...row,
      post_id: String(row.post_id),
      likes: Number(row.likes),
      comments: Number(row.comments),
      userlike: row.userlike
    }));

    console.log("✅ Successfully fetched following reels:", fixedResult.length, "rows");
    return Response.json(fixedResult);
  } catch (error) {
    console.error("❌ Error fetching following reels:", error);
    if (error instanceof Error) {
      return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}