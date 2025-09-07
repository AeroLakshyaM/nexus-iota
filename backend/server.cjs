const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./localdb.sqlite");

app.use(cors());
app.use(express.json());

// Create or update users table to include password and status
function ensureUserColumns() {
  db.all("PRAGMA table_info(users)", (err, columns) => {
    if (!columns.some((col) => col.name === "password")) {
      db.run("ALTER TABLE users ADD COLUMN password TEXT", () => {});
    }
    if (!columns.some((col) => col.name === "status")) {
      db.run(
        "ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'",
        () => {},
      );
    }
  });
}

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
    ensureUserColumns,
  );
});

// Create a profile table if it doesn't exist
// and insert a default profile if not exists
// (Place this after the users table creation)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    name TEXT,
    title TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    joinDate TEXT,
    bio TEXT,
    avatar TEXT,
    coverImage TEXT,
    stats TEXT,
    skills TEXT,
    experience TEXT,
    projects TEXT,
    achievements TEXT,
    socialLinks TEXT
  )`);
  db.get("SELECT COUNT(*) as count FROM profile", (err, row) => {
    if (row.count === 0) {
      db.run(
        `INSERT INTO profile (
        id, name, title, location, email, phone, joinDate, bio, avatar, coverImage, stats, skills, experience, projects, achievements, socialLinks
      ) VALUES (
        1, "Your Name", "Your Title", "Your Location", "your@email.com", "1234567890", "2023", "Your bio", "", "", ?, ?, ?, ?, ?, ?
      )`,
        [
          JSON.stringify({ projects: 0, followers: 0, following: 0, likes: 0 }),
          JSON.stringify({ design: [], development: [] }),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify({
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
          }),
        ],
      );
    }
  });
});

// Create user_profiles table for individual user profiles
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    title TEXT,
    location TEXT,
    phone TEXT,
    joinDate TEXT,
    bio TEXT,
    avatar TEXT,
    coverImage TEXT,
    stats TEXT,
    skills TEXT,
    experience TEXT,
    projects TEXT,
    achievements TEXT,
    socialLinks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Create admin tables
db.serialize(() => {
  // Skills table for tracking skill swaps
  db.run(`CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    category TEXT,
    swap_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User skills table for tracking user-skill relationships
  db.run(`CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    skill_id INTEGER,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (skill_id) REFERENCES skills (id)
  )`);

  // Moderation reports table
  db.run(`CREATE TABLE IF NOT EXISTS moderation_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER,
    reported_user_id INTEGER,
    reported_skill_id INTEGER,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (reporter_id) REFERENCES users (id),
    FOREIGN KEY (reported_user_id) REFERENCES users (id),
    FOREIGN KEY (reported_skill_id) REFERENCES skills (id)
  )`);

  // System messages table
  db.run(`CREATE TABLE IF NOT EXISTS system_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    sent_by TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admin activity logs
  db.run(`CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    target_type TEXT,
    target_id INTEGER,
    details TEXT,
    admin_id TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Swap requests table
  db.run(`CREATE TABLE IF NOT EXISTS swap_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER,
    to_user_id INTEGER,
    offered_skill TEXT,
    wanted_skill TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users (id),
    FOREIGN KEY (to_user_id) REFERENCES users (id)
  )`);

  // Notifications table
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    title TEXT,
    message TEXT,
    related_id INTEGER,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Chat messages table
  db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swap_request_id INTEGER,
    sender_id INTEGER,
    receiver_id INTEGER,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (swap_request_id) REFERENCES swap_requests (id),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id)
  )`);

  // Insert some sample data
  db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
    if (row.count === 0) {
      const sampleSkills = [
        ["JavaScript", "development", 45],
        ["React", "development", 38],
        ["Node.js", "development", 32],
        ["Photoshop", "design", 28],
        ["Figma", "design", 25],
        ["Python", "development", 22],
        ["CSS", "development", 20],
        ["HTML", "development", 18],
        ["Illustrator", "design", 15],
        ["Blockchain", "development", 5],
        ["Assembly", "development", 2],
      ];

      sampleSkills.forEach((skill) => {
        db.run(
          "INSERT INTO skills (name, category, swap_count) VALUES (?, ?, ?)",
          skill,
        );
      });
    }
  });

  // Insert sample users
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      const sampleUsers = [
        ["John Doe", "john@example.com"],
        ["Jane Smith", "jane@example.com"],
        ["Bob Johnson", "bob@example.com"],
        ["Alice Brown", "alice@example.com"],
        ["Charlie Wilson", "charlie@example.com"],
      ];

      sampleUsers.forEach((user) => {
        db.run("INSERT INTO users (name, email) VALUES (?, ?)", user);
      });

      // After inserting users, assign some skills to them
      setTimeout(() => {
        // Assign skills to users (skill IDs 1-11 correspond to the skills we inserted)
        const userSkills = [
          [1, [1, 2, 3]], // John Doe: JavaScript, React, Node.js
          [2, [4, 5, 6]], // Jane Smith: Photoshop, Figma, Python
          [3, [7, 8, 9]], // Bob Johnson: CSS, HTML, Illustrator
          [4, [1, 5, 10]], // Alice Brown: JavaScript, Figma, Blockchain
          [5, [2, 6, 11]], // Charlie Wilson: React, Python, Assembly
        ];

        userSkills.forEach(([userId, skillIds]) => {
          skillIds.forEach((skillId) => {
            db.run(
              "INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)",
              [userId, skillId],
            );
          });
        });
      }, 1000); // Small delay to ensure users are inserted first
    }
  });

  // Insert sample moderation reports
  db.get("SELECT COUNT(*) as count FROM moderation_reports", (err, row) => {
    if (row.count === 0) {
      const sampleReports = [
        [1, 2, 1, "Inappropriate content"],
        [3, 1, 5, "Spam"],
        [2, 3, 2, "Misleading information"],
      ];

      sampleReports.forEach((report) => {
        db.run(
          "INSERT INTO moderation_reports (reporter_id, reported_user_id, reported_skill_id, reason) VALUES (?, ?, ?, ?)",
          report,
        );
      });
    }
  });
});

// Add a root route for a friendly welcome message
app.get("/", (req, res) => {
  res.send("Local database server is running!");
});

// Get all users
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Test endpoint to check if server is working
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

// Assign skills to users (for demo purposes)
app.post("/api/users/:id/skills", (req, res) => {
  const { id } = req.params;
  const { skillIds } = req.body;

  // First, remove existing skills for this user
  db.run("DELETE FROM user_skills WHERE user_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Then add new skills
    const promises = skillIds.map((skillId) => {
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)",
          [id, skillId],
          (err) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });
    });

    Promise.all(promises)
      .then(() => {
        res.json({ success: true });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
});

// Get dashboard users with skills and profile info
app.get("/api/dashboard/users", (req, res) => {
  // First, get all active users
  db.all(
    'SELECT * FROM users WHERE status = "active" OR status IS NULL',
    [],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!rows || rows.length === 0) {
        return res.json([]);
      }

      // For each user, get their skills
      const usersWithSkills = rows.map((user) => {
        return new Promise((resolve) => {
          // Get skills offered by this user
          db.all(
            `
          SELECT s.name, s.category
          FROM user_skills us
          JOIN skills s ON us.skill_id = s.id
          WHERE us.user_id = ?
        `,
            [user.id],
            (err, offeredSkills) => {
              if (err) {
                console.error(
                  "Error fetching skills for user",
                  user.id,
                  ":",
                  err,
                );
                offeredSkills = [];
              }

              // For demo purposes, generate some wanted skills
              const allSkills = [
                "JavaScript",
                "Python",
                "React",
                "Node.js",
                "Photoshop",
                "Figma",
                "UI/UX Design",
                "Graphic Design",
                "CSS",
                "HTML",
                "TypeScript",
                "Vue.js",
                "Angular",
                "PHP",
                "Java",
                "C++",
                "Swift",
                "Kotlin",
                "Flutter",
                "React Native",
              ];
              const wantedSkills = allSkills
                .filter(
                  (skill) =>
                    !offeredSkills.some((offered) => offered.name === skill),
                )
                .slice(0, Math.floor(Math.random() * 4) + 2);

              resolve({
                ...user,
                skillsOffered: offeredSkills.map((s) => s.name),
                skillsWanted: wantedSkills,
                rating: (3.5 + Math.random() * 1.5).toFixed(1), // Random rating between 3.5-5.0
                username: user.name.toLowerCase().replace(/\s+/g, ""),
                avatar: user.name.substring(0, 2).toUpperCase(),
                isOnline: Math.random() > 0.3, // Random online status for demo
                stats: {
                  projects: Math.floor(Math.random() * 50),
                  followers: Math.floor(Math.random() * 1000),
                  following: Math.floor(Math.random() * 500),
                  likes: Math.floor(Math.random() * 5000),
                },
              });
            },
          );
        });
      });

      Promise.all(usersWithSkills)
        .then((users) => {
          res.json(users);
        })
        .catch((err) => {
          console.error("Promise.all error:", err);
          res.status(500).json({ error: "Failed to process users" });
        });
    },
  );
});

// Add a user (now with password)
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, email });
    },
  );
});

// Get a specific user by ID
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.get(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    },
  );
});

// Update a specific user's basic info
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "User not found" });
      res.json({ success: true, message: "User updated successfully" });
    },
  );
});

// Update a specific user's detailed profile
app.put("/api/users/:id/profile", (req, res) => {
  const { id } = req.params;
  const {
    title,
    location,
    phone,
    joinDate,
    bio,
    avatar,
    coverImage,
    stats,
    skills,
    experience,
    projects,
    achievements,
    socialLinks,
  } = req.body;

  // First, check if user exists
  db.get("SELECT id FROM users WHERE id = ?", [id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if profile exists for this user, if not create it
    db.get(
      "SELECT id FROM user_profiles WHERE user_id = ?",
      [id],
      (err, profile) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!profile) {
          // Create new profile
          db.run(
            `
          INSERT INTO user_profiles (
            user_id, title, location, phone, joinDate, bio, avatar, coverImage,
            stats, skills, experience, projects, achievements, socialLinks
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
              id,
              title,
              location,
              phone,
              joinDate,
              bio,
              avatar,
              coverImage,
              JSON.stringify(stats),
              JSON.stringify(skills),
              JSON.stringify(experience),
              JSON.stringify(projects),
              JSON.stringify(achievements),
              JSON.stringify(socialLinks),
            ],
            function (err) {
              if (err) return res.status(500).json({ error: err.message });
              res.json({
                success: true,
                message: "Profile created successfully",
              });
            },
          );
        } else {
          // Update existing profile
          db.run(
            `
          UPDATE user_profiles SET 
            title = ?, location = ?, phone = ?, joinDate = ?, bio = ?, 
            avatar = ?, coverImage = ?, stats = ?, skills = ?, experience = ?,
            projects = ?, achievements = ?, socialLinks = ?
          WHERE user_id = ?
        `,
            [
              title,
              location,
              phone,
              joinDate,
              bio,
              avatar,
              coverImage,
              JSON.stringify(stats),
              JSON.stringify(skills),
              JSON.stringify(experience),
              JSON.stringify(projects),
              JSON.stringify(achievements),
              JSON.stringify(socialLinks),
              id,
            ],
            function (err) {
              if (err) return res.status(500).json({ error: err.message });
              res.json({
                success: true,
                message: "Profile updated successfully",
              });
            },
          );
        }
      },
    );
  });
});

// Get a specific user's detailed profile
app.get("/api/users/:id/profile", (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM user_profiles WHERE user_id = ?",
    [id],
    (err, profile) => {
      if (err) return res.status(500).json({ error: err.message });

      if (profile) {
        // Parse JSON fields
        profile.stats = profile.stats ? JSON.parse(profile.stats) : {};
        profile.skills = profile.skills ? JSON.parse(profile.skills) : {};
        profile.experience = profile.experience
          ? JSON.parse(profile.experience)
          : [];
        profile.projects = profile.projects ? JSON.parse(profile.projects) : [];
        profile.achievements = profile.achievements
          ? JSON.parse(profile.achievements)
          : [];
        profile.socialLinks = profile.socialLinks
          ? JSON.parse(profile.socialLinks)
          : {};
      }

      res.json(profile || {});
    },
  );
});

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid email or password." });
    // For now, just return a dummy token and userId
    res.json({ token: "dummy-token", userId: user.id });
  });
});

// Get profile
app.get("/api/profile", (req, res) => {
  db.get("SELECT * FROM profile WHERE id = 1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      // Parse JSON fields
      row.stats = row.stats ? JSON.parse(row.stats) : {};
      row.skills = row.skills ? JSON.parse(row.skills) : {};
      row.experience = row.experience ? JSON.parse(row.experience) : [];
      row.projects = row.projects ? JSON.parse(row.projects) : [];
      row.achievements = row.achievements ? JSON.parse(row.achievements) : [];
      row.socialLinks = row.socialLinks ? JSON.parse(row.socialLinks) : {};
    }
    res.json(row);
  });
});

// Update profile
app.put("/api/profile", (req, res) => {
  const {
    name,
    title,
    location,
    email,
    phone,
    joinDate,
    bio,
    avatar,
    coverImage,
    stats,
    skills,
    experience,
    projects,
    achievements,
    socialLinks,
  } = req.body;
  db.run(
    `UPDATE profile SET name=?, title=?, location=?, email=?, phone=?, joinDate=?, bio=?, avatar=?, coverImage=?, stats=?, skills=?, experience=?, projects=?, achievements=?, socialLinks=? WHERE id=1`,
    [
      name,
      title,
      location,
      email,
      phone,
      joinDate,
      bio,
      avatar,
      coverImage,
      JSON.stringify(stats),
      JSON.stringify(skills),
      JSON.stringify(experience),
      JSON.stringify(projects),
      JSON.stringify(achievements),
      JSON.stringify(socialLinks),
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

// ===== DASHBOARD ENDPOINTS =====

// Get dashboard stats for regular users
app.get("/api/dashboard/stats", (req, res) => {
  db.get(
    'SELECT COUNT(*) as totalUsers FROM users WHERE status = "active" OR status IS NULL',
    (err, userCount) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        'SELECT COUNT(*) as activeSkills FROM skills WHERE status = "active"',
        (err, skillCount) => {
          if (err) return res.status(500).json({ error: err.message });

          db.get(
            'SELECT COUNT(*) as successfulSwaps FROM swap_requests WHERE status = "accepted"',
            (err, swapCount) => {
              if (err) return res.status(500).json({ error: err.message });

              db.get(
                'SELECT COUNT(*) as newThisWeek FROM users WHERE created_at >= date("now", "-7 days")',
                (err, newUsers) => {
                  if (err) return res.status(500).json({ error: err.message });

                  res.json({
                    totalUsers: userCount.totalUsers || 0,
                    activeSkills: skillCount.activeSkills || 0,
                    successfulSwaps: swapCount.successfulSwaps || 0,
                    newThisWeek: newUsers.newThisWeek || 0,
                  });
                },
              );
            },
          );
        },
      );
    },
  );
});

// ===== ADMIN ENDPOINTS =====

// Get admin dashboard stats
app.get("/api/admin/stats", (req, res) => {
  db.get("SELECT COUNT(*) as total_users FROM users", (err, userCount) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(
      "SELECT COUNT(*) as total_swaps FROM user_skills",
      (err, swapCount) => {
        if (err) return res.status(500).json({ error: err.message });

        db.get(
          "SELECT name, swap_count FROM skills ORDER BY swap_count DESC LIMIT 1",
          (err, mostSwapped) => {
            if (err) return res.status(500).json({ error: err.message });

            db.get(
              "SELECT name, swap_count FROM skills ORDER BY swap_count ASC LIMIT 1",
              (err, leastSwapped) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                  total_users: userCount.total_users,
                  total_swaps: swapCount.total_swaps,
                  most_swapped_skill: mostSwapped ? mostSwapped.name : "None",
                  least_swapped_skill: leastSwapped
                    ? leastSwapped.name
                    : "None",
                });
              },
            );
          },
        );
      },
    );
  });
});

// Get moderation stats
app.get("/api/admin/moderation", (req, res) => {
  db.get(
    'SELECT COUNT(*) as pending_reports FROM moderation_reports WHERE status = "pending"',
    (err, pending) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        'SELECT COUNT(*) as flagged_users FROM users WHERE status = "flagged"',
        (err, flagged) => {
          if (err) return res.status(500).json({ error: err.message });

          db.get(
            'SELECT COUNT(*) as banned_users FROM users WHERE status = "banned"',
            (err, banned) => {
              if (err) return res.status(500).json({ error: err.message });

              res.json({
                pending_reports: pending.pending_reports,
                flagged_users: flagged.flagged_users,
                banned_users: banned.banned_users,
              });
            },
          );
        },
      );
    },
  );
});

// Get moderation reports
app.get("/api/admin/reports", (req, res) => {
  db.all(
    `
    SELECT 
      mr.*,
      u1.name as reporter_name,
      u2.name as reported_user_name,
      s.name as skill_name
    FROM moderation_reports mr
    LEFT JOIN users u1 ON mr.reporter_id = u1.id
    LEFT JOIN users u2 ON mr.reported_user_id = u2.id
    LEFT JOIN skills s ON mr.reported_skill_id = s.id
    ORDER BY mr.created_at DESC
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Update moderation report status
app.put("/api/admin/reports/:id", (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  db.run(
    "UPDATE moderation_reports SET status = ?, admin_notes = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, admin_notes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Log admin action
      db.run(
        "INSERT INTO admin_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)",
        [
          "update_report",
          "moderation_report",
          id,
          `Status changed to ${status}`,
        ],
      );

      res.json({ success: true });
    },
  );
});

// Send system message
app.post("/api/admin/messages", (req, res) => {
  const { message } = req.body;

  db.run(
    "INSERT INTO system_messages (message) VALUES (?)",
    [message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Log admin action
      db.run(
        "INSERT INTO admin_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)",
        [
          "send_message",
          "system_message",
          this.lastID,
          "Broadcast message sent",
        ],
      );

      res.json({ success: true, id: this.lastID });
    },
  );
});

// Get system messages
app.get("/api/admin/messages", (req, res) => {
  db.all(
    "SELECT * FROM system_messages ORDER BY created_at DESC LIMIT 10",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Get admin activity logs
app.get("/api/admin/logs", (req, res) => {
  db.all(
    "SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 50",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Ban/Unban user
app.put("/api/admin/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(
    "UPDATE users SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Log admin action
      db.run(
        "INSERT INTO admin_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)",
        ["update_user_status", "user", id, `User status changed to ${status}`],
      );

      res.json({ success: true });
    },
  );
});

// Get skills analytics
app.get("/api/admin/skills", (req, res) => {
  db.all("SELECT * FROM skills ORDER BY swap_count DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ===== SWAP REQUESTS ENDPOINTS =====

// Create a new swap request
app.post("/api/swap-requests", (req, res) => {
  const { from_user_id, to_user_id, offered_skill, wanted_skill, message } =
    req.body;

  if (!from_user_id || !to_user_id || !offered_skill || !wanted_skill) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    "INSERT INTO swap_requests (from_user_id, to_user_id, offered_skill, wanted_skill, message) VALUES (?, ?, ?, ?, ?)",
    [from_user_id, to_user_id, offered_skill, wanted_skill, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const requestId = this.lastID;

      // Create notification for the recipient
      db.run(
        "INSERT INTO notifications (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)",
        [
          to_user_id,
          "swap_request",
          "New Swap Request",
          `You have a new swap request from ${from_user_id}`,
          requestId,
        ],
        function (err) {
          if (err) console.error("Error creating notification:", err);
        },
      );

      res.json({
        success: true,
        id: requestId,
        message: "Swap request sent successfully",
      });
    },
  );
});

// Get swap requests for a user (received)
app.get("/api/swap-requests/received/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    `
    SELECT 
      sr.*,
      u1.name as from_user_name,
      u1.email as from_user_email
    FROM swap_requests sr
    JOIN users u1 ON sr.from_user_id = u1.id
    WHERE sr.to_user_id = ?
    ORDER BY sr.created_at DESC
  `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Get swap requests sent by a user
app.get("/api/swap-requests/sent/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    `
    SELECT 
      sr.*,
      u2.name as to_user_name,
      u2.email as to_user_email
    FROM swap_requests sr
    JOIN users u2 ON sr.to_user_id = u2.id
    WHERE sr.from_user_id = ?
    ORDER BY sr.created_at DESC
  `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Update swap request status (accept/reject)
app.put("/api/swap-requests/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: 'Invalid status. Must be "accepted" or "rejected"' });
  }

  db.run(
    "UPDATE swap_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Get the request details to create notifications
      db.get(
        "SELECT * FROM swap_requests WHERE id = ?",
        [id],
        (err, request) => {
          if (request) {
            // Create notification for the sender
            const notificationTitle =
              status === "accepted"
                ? "Swap Request Accepted"
                : "Swap Request Rejected";
            const notificationMessage =
              status === "accepted"
                ? `Your swap request has been accepted!`
                : `Your swap request has been rejected.`;

            db.run(
              "INSERT INTO notifications (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)",
              [
                request.from_user_id,
                "swap_response",
                notificationTitle,
                notificationMessage,
                id,
              ],
              function (err) {
                if (err) console.error("Error creating notification:", err);
              },
            );
          }
        },
      );

      res.json({ success: true, message: `Swap request ${status}` });
    },
  );
});

// ===== NOTIFICATIONS ENDPOINTS =====

// Get notifications for a user
app.get("/api/notifications/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    `
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Mark notification as read
app.put("/api/notifications/:id/read", (req, res) => {
  const { id } = req.params;

  db.run(
    "UPDATE notifications SET is_read = 1 WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

// Mark all notifications as read for a user
app.put("/api/notifications/:userId/read-all", (req, res) => {
  const { userId } = req.params;

  db.run(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
    [userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

// Get unread notification count
app.get("/api/notifications/:userId/unread-count", (req, res) => {
  const { userId } = req.params;

  db.get(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0",
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ count: row.count });
    },
  );
});

// ===== CHAT ENDPOINTS =====

// Get chat messages for a swap request
app.get("/api/chat/:swapRequestId", (req, res) => {
  const { swapRequestId } = req.params;

  db.all(
    `
    SELECT 
      cm.*,
      u.name as sender_name
    FROM chat_messages cm
    JOIN users u ON cm.sender_id = u.id
    WHERE cm.swap_request_id = ?
    ORDER BY cm.created_at ASC
  `,
    [swapRequestId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// Send a chat message
app.post("/api/chat/:swapRequestId", (req, res) => {
  const { swapRequestId } = req.params;
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Verify the swap request exists and is accepted
  db.get(
    "SELECT status FROM swap_requests WHERE id = ?",
    [swapRequestId],
    (err, request) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!request)
        return res.status(404).json({ error: "Swap request not found" });
      if (request.status !== "accepted") {
        return res
          .status(400)
          .json({ error: "Chat is only available for accepted swap requests" });
      }

      // Insert the message
      db.run(
        "INSERT INTO chat_messages (swap_request_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)",
        [swapRequestId, sender_id, receiver_id, message],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          // Create notification for the receiver
          db.run(
            "INSERT INTO notifications (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)",
            [
              receiver_id,
              "chat_message",
              "New Message",
              `You have a new message from user ${sender_id}`,
              this.lastID,
            ],
            function (err) {
              if (err) console.error("Error creating chat notification:", err);
            },
          );

          res.json({
            success: true,
            id: this.lastID,
            message: "Message sent successfully",
          });
        },
      );
    },
  );
});

// Get active chats for a user (accepted swap requests with chat)
app.get("/api/chat/user/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    `
    SELECT 
      sr.id as swap_request_id,
      sr.offered_skill,
      sr.wanted_skill,
      sr.created_at as request_date,
      u1.name as other_user_name,
      u1.id as other_user_id,
      (SELECT COUNT(*) FROM chat_messages cm WHERE cm.swap_request_id = sr.id AND cm.receiver_id = ? AND cm.id NOT IN (
        SELECT cm2.id FROM chat_messages cm2 
        JOIN notifications n ON n.related_id = cm2.id 
        WHERE n.user_id = ? AND n.type = 'chat_message' AND n.is_read = 1
      )) as unread_count
    FROM swap_requests sr
    JOIN users u1 ON (sr.from_user_id = u1.id OR sr.to_user_id = u1.id)
    WHERE sr.status = 'accepted' 
    AND (sr.from_user_id = ? OR sr.to_user_id = ?)
    AND u1.id != ?
    ORDER BY sr.updated_at DESC
  `,
    [userId, userId, userId, userId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
