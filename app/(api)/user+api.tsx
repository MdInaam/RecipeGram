import { pool } from "@/configs/NilePostgresConfig"; // Use pool

export async function POST(request: Request) {
  try { // Add try...catch
    const { name, email, image } = await request.json();

    if (!name || !email) { // Basic validation
        return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Parameterized query - Safer to list columns
    const query = `
      INSERT INTO users (name, email, image)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING -- Example: prevent duplicate emails
      RETURNING *; -- Return the created/existing user
    `;
    const values = [name, email, image ?? null]; // Handle potentially null image

    // Use pool.query()
    const result = await pool.query(query, values);
    // No connect/end

    if (result.rows.length === 0) {
         // This might happen if ON CONFLICT DO NOTHING was triggered
         // You might want to query again by email here if needed, or return specific message
         console.log(`User with email ${email} likely already exists.`);
         // Fetch existing user if needed
         const existingUserResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
         if (existingUserResult.rows.length > 0) {
             return Response.json(existingUserResult.rows[0]);
         } else {
             // Should not happen if insert failed cleanly, but handle defensively
             return Response.json({ error: "Failed to create or find user" }, { status: 500 });
         }
    }

    return Response.json(result.rows[0]); // Return the newly created user

  } catch(error) {
      console.error("❌ Error creating user:", error);
      // Check for specific error codes if needed (e.g., unique constraint violation if not using ON CONFLICT)
      if (error instanceof Error) {
          return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
      }
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email');

  if (!email) {
      return Response.json({ error: "Email query parameter is required" }, { status: 400 });
  }

  try {
    // Parameterized query
    const query = `
        SELECT * FROM users WHERE email = $1;
      `;
    const values = [email];

    // Use pool.query()
    const result = await pool.query(query, values);
    // No connect/end

    if (result.rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);

  } catch (error) { // Catch specific error
    console.error("❌ Error fetching user:", error);
    if (error instanceof Error) {
        return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}