import { pool } from "@/configs/NilePostgresConfig"; // Use pool

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("name");
  const loggedInUserId = searchParams.get("loggedInUserId"); // Can be null if not logged in

  console.log("Extracted name:", username);
  console.log("Logged-in User ID:", loggedInUserId);

  if (!username) {
    console.error("❌ Name parameter is missing!");
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    // Parameterized query
    // Use $1 for loggedInUserId, $2 for username
    const query = `
        SELECT
            u.id,
            u.name,
            u.image,
            COUNT(DISTINCT f1.follower_id) AS followers,
            COUNT(DISTINCT f2.following_id) AS following,
            COUNT(DISTINCT p.id) AS posts,
            -- Aggregate posts safely
            COALESCE(json_agg(json_build_object('id', p.id, 'media_url', p.media_url)) FILTER (WHERE p.id IS NOT NULL), '[]'::json) AS user_posts,
            -- Parameterize the EXISTS check
            EXISTS (
                SELECT 1
                FROM followers
                WHERE follower_id = $1 AND following_id = u.id
            ) AS is_following
        FROM users u
        LEFT JOIN followers f1 ON u.id = f1.following_id
        LEFT JOIN followers f2 ON u.id = f2.follower_id
        LEFT JOIN posts p ON u.id = p.user_id
        WHERE u.name = $2 -- Parameterize the username lookup
        GROUP BY u.id;
      `;

    const values = [loggedInUserId, username]; // Pass potentially null loggedInUserId

    console.log("Executing parameterized query:", query);
    console.log("With values:", values);

    // Use pool.query()
    const result = await pool.query(query, values);
    // No connect/end

    if (result.rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Your BigInt conversion logic is fine
    const fixedResult = {
      ...result.rows[0],
      followers: Number(result.rows[0].followers),
      following: Number(result.rows[0].following),
      posts: Number(result.rows[0].posts),
      is_following: result.rows[0].is_following,
    };

    return Response.json(fixedResult);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
     if (error instanceof Error) {
        return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}