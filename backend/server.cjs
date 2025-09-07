const express = require("express");
const cors = require("cors");
const db = require("./pgAdapter.cjs");

const app = express();

app.use(cors());
app.use(express.json());

async function initDb() {
  // users
  await new Promise((resolve) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      [],
      () => resolve(),
    ),
  );
  // Ensure required columns exist if a pre-existing users table schema differs
  await new Promise((resolve) => db.run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT`, [], () => resolve()));
  await new Promise((resolve) => db.run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT`, [], () => resolve()));
  await new Promise((resolve) => db.run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT`, [], () => resolve()));
  await new Promise((resolve) => db.run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT`, [], () => resolve()));
  await new Promise((resolve) => db.run(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP`, [], () => resolve()));

  // profile (single record editable from /api/profile)
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS profile (
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
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // ensure default profile row exists
  const countRow = await new Promise((resolve, reject) =>
    db.get(`SELECT COUNT(*) as count FROM profile`, [], (err, row) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); resolve(null); } else resolve(row); },
    ),
  );
  if (!countRow || Number(countRow.count) === 0) {
    await new Promise((resolve, reject) =>
      db.run(
        `INSERT INTO profile (
          id, name, title, location, email, phone, joinDate, bio, avatar, coverImage, stats, skills, experience, projects, achievements, socialLinks
        ) VALUES (
          1, 'Your Name', 'Your Title', 'Your Location', 'your@email.com', '1234567890', '2023', 'Your bio', '', '', $1, $2, $3, $4, $5, $6
        )`,
        [
          JSON.stringify({ projects: 0, followers: 0, following: 0, likes: 0 }),
          JSON.stringify({ design: [], development: [] }),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify({ github: '', linkedin: '', twitter: '', website: '' }),
        ],
        (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
      ),
    );
  }

  // user_profiles
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // skills
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        category TEXT,
        swap_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // user_skills
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS user_skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        skill_id INTEGER,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id)
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // moderation_reports
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS moderation_reports (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER,
        reported_user_id INTEGER,
        reported_skill_id INTEGER,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        CONSTRAINT fk_mod_reporter FOREIGN KEY (reporter_id) REFERENCES users (id),
        CONSTRAINT fk_mod_reported_user FOREIGN KEY (reported_user_id) REFERENCES users (id),
        CONSTRAINT fk_mod_reported_skill FOREIGN KEY (reported_skill_id) REFERENCES skills (id)
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // system_messages
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS system_messages (
        id SERIAL PRIMARY KEY,
        message TEXT,
        sent_by TEXT DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // admin_logs
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        action TEXT,
        target_type TEXT,
        target_id INTEGER,
        details TEXT,
        admin_id TEXT DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // swap_requests (renamed to avoid collision with user's Supabase table)
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS swap_requests_app (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER,
        to_user_id INTEGER,
        offered_skill TEXT,
        wanted_skill TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_sr_from_user FOREIGN KEY (from_user_id) REFERENCES users (id),
        CONSTRAINT fk_sr_to_user FOREIGN KEY (to_user_id) REFERENCES users (id)
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // notifications (renamed to avoid collision)
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS notifications_app (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        type TEXT,
        title TEXT,
        message TEXT,
        related_id INTEGER,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // chat_messages
  await new Promise((resolve, reject) =>
    db.run(
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        swap_request_id INTEGER,
        sender_id INTEGER,
        receiver_id INTEGER,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cm_sr FOREIGN KEY (swap_request_id) REFERENCES swap_requests_app (id),
        CONSTRAINT fk_cm_sender FOREIGN KEY (sender_id) REFERENCES users (id),
        CONSTRAINT fk_cm_receiver FOREIGN KEY (receiver_id) REFERENCES users (id)
      )`,
      [],
      (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
    ),
  );

  // seed skills
  const skillsCount = await new Promise((resolve, reject) =>
    db.get(`SELECT COUNT(*) as count FROM skills`, [], (err, row) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); resolve(null); } else resolve(row); },
    ),
  );
  if (!skillsCount || Number(skillsCount.count) === 0) {
    const sampleSkills = [
      ['JavaScript', 'development', 45],
      ['React', 'development', 38],
      ['Node.js', 'development', 32],
      ['Photoshop', 'design', 28],
      ['Figma', 'design', 25],
      ['Python', 'development', 22],
      ['CSS', 'development', 20],
      ['HTML', 'development', 18],
      ['Illustrator', 'design', 15],
      ['Blockchain', 'development', 5],
      ['Assembly', 'development', 2],
    ];
    for (const [name, category, swap_count] of sampleSkills) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve, reject) =>
        db.run(
          `INSERT INTO skills (name, category, swap_count) VALUES (?, ?, ?)`,
          [name, category, swap_count],
          (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
        ),
      );
    }
  }

  // seed users
  const userCount = await new Promise((resolve, reject) =>
    db.get(`SELECT COUNT(*) as count FROM users`, [], (err, row) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); resolve(null); } else resolve(row); },
    ),
  );
  if (!userCount || Number(userCount.count) === 0) {
    const sampleUsers = [
      ['John Doe', 'john@example.com'],
      ['Jane Smith', 'jane@example.com'],
      ['Bob Johnson', 'bob@example.com'],
      ['Alice Brown', 'alice@example.com'],
      ['Charlie Wilson', 'charlie@example.com'],
    ];
    for (const [name, email] of sampleUsers) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve, reject) =>
        db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], (err) =>
          err ? reject(err) : resolve(),
        ),
      );
    }

    // Assign skills
    const assignments = [
      [1, [1, 2, 3]],
      [2, [4, 5, 6]],
      [3, [7, 8, 9]],
      [4, [1, 5, 10]],
      [5, [2, 6, 11]],
    ];
    for (const [userId, skillIds] of assignments) {
      for (const skillId of skillIds) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve, reject) =>
          db.run(
            `INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)`,
            [userId, skillId],
            (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
          ),
        );
      }
    }
  }

  // seed moderation reports
  const modCount = await new Promise((resolve, reject) =>
    db.get(`SELECT COUNT(*) as count FROM moderation_reports`, [], (err, row) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); resolve(null); } else resolve(row); },
    ),
  );
  if (!modCount || Number(modCount.count) === 0) {
    const sampleReports = [
      [1, 2, 1, 'Inappropriate content'],
      [3, 1, 5, 'Spam'],
      [2, 3, 2, 'Misleading information'],
    ];
    for (const rep of sampleReports) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve, reject) =>
        db.run(
          `INSERT INTO moderation_reports (reporter_id, reported_user_id, reported_skill_id, reason) VALUES (?, ?, ?, ?)`,
          rep,
          (err) => { if (err) { console.warn('DB init warning:', err && err.message ? err.message : err); } resolve(); },
        ),
      );
    }
  }
}

// Initialize DB on startup
initDb().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('DB init failed', e);
  console.warn('Continuing without completing DB initialization. Some features may be limited.');
});

// Routes
app.get('/', (req, res) => {
  res.send('Postgres-backed server is running!');
});

// Users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.post('/api/users/:id/skills', (req, res) => {
  const { id } = req.params;
  const { skillIds } = req.body;
  db.run('DELETE FROM user_skills WHERE user_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const promises = (skillIds || []).map(
      (skillId) =>
        new Promise((resolve, reject) =>
          db.run(
            'INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)',
            [id, skillId],
            (e) => (e ? reject(e) : resolve()),
          ),
        ),
    );

    Promise.all(promises)
      .then(() => res.json({ success: true }))
      .catch((e) => res.status(500).json({ error: e.message }));
  });
});

app.get('/api/dashboard/users', (req, res) => {
  db.all("SELECT * FROM users WHERE status = 'active' OR status IS NULL", [], (err, rows) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!rows || rows.length === 0) return res.json([]);

    const usersWithSkills = rows.map(
      (user) =>
        new Promise((resolve) => {
          db.all(
            `
            SELECT s.name, s.category
            FROM user_skills us
            JOIN skills s ON us.skill_id = s.id
            WHERE us.user_id = ?
          `,
            [user.id],
            (e, offeredSkills) => {
              if (e) offeredSkills = [];
              const allSkills = [
                'JavaScript',
                'Python',
                'React',
                'Node.js',
                'Photoshop',
                'Figma',
                'UI/UX Design',
                'Graphic Design',
                'CSS',
                'HTML',
                'TypeScript',
                'Vue.js',
                'Angular',
                'PHP',
                'Java',
                'C++',
                'Swift',
                'Kotlin',
                'Flutter',
                'React Native',
              ];
              const wantedSkills = allSkills
                .filter((skill) => !(offeredSkills || []).some((o) => o.name === skill))
                .slice(0, Math.floor(Math.random() * 4) + 2);

              resolve({
                ...user,
                skillsOffered: (offeredSkills || []).map((s) => s.name),
                skillsWanted: wantedSkills,
                rating: (3.5 + Math.random() * 1.5).toFixed(1),
                username: user.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'user',
                avatar: user.name ? user.name.substring(0, 2).toUpperCase() : 'US',
                isOnline: Math.random() > 0.3,
                stats: {
                  projects: Math.floor(Math.random() * 50),
                  followers: Math.floor(Math.random() * 1000),
                  following: Math.floor(Math.random() * 500),
                  likes: Math.floor(Math.random() * 5000),
                },
              });
            },
          );
        }),
    );

    Promise.all(usersWithSkills)
      .then((users) => res.json(users))
      .catch(() => res.status(500).json({ error: 'Failed to process users' }));
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });

  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email });
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'User updated successfully' });
  });
});

app.put('/api/users/:id/profile', (req, res) => {
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

  db.get('SELECT id FROM users WHERE id = ?', [id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    db.get('SELECT id FROM user_profiles WHERE user_id = ?', [id], (e, profile) => {
      if (e) return res.status(500).json({ error: e.message });

      if (!profile) {
        db.run(
          `INSERT INTO user_profiles (
            user_id, title, location, phone, joinDate, bio, avatar, coverImage,
            stats, skills, experience, projects, achievements, socialLinks
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          function (err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ success: true, message: 'Profile created successfully' });
          },
        );
      } else {
        db.run(
          `UPDATE user_profiles SET 
            title = ?, location = ?, phone = ?, joinDate = ?, bio = ?, 
            avatar = ?, coverImage = ?, stats = ?, skills = ?, experience = ?,
            projects = ?, achievements = ?, socialLinks = ?
          WHERE user_id = ?`,
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
          function (err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ success: true, message: 'Profile updated successfully' });
          },
        );
      }
    });
  });
});

app.get('/api/users/:id/profile', (req, res) => {
  db.get('SELECT * FROM user_profiles WHERE user_id = ?', [req.params.id], (err, profile) => {
    if (err) return res.status(500).json({ error: err.message });
    if (profile) {
      profile.stats = profile.stats ? JSON.parse(profile.stats) : {};
      profile.skills = profile.skills ? JSON.parse(profile.skills) : {};
      profile.experience = profile.experience ? JSON.parse(profile.experience) : [];
      profile.projects = profile.projects ? JSON.parse(profile.projects) : [];
      profile.achievements = profile.achievements ? JSON.parse(profile.achievements) : [];
      profile.socialLinks = profile.socialLinks ? JSON.parse(profile.socialLinks) : {};
    }
    res.json(profile || {});
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: 'dummy-token', userId: user.id });
  });
});

app.get('/api/profile', (req, res) => {
  db.get('SELECT * FROM profile WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
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

app.put('/api/profile', (req, res) => {
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

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  db.get("SELECT COUNT(*) as totalUsers FROM users WHERE status = 'active' OR status IS NULL", (err, userCount) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get("SELECT COUNT(*) as activeSkills FROM skills WHERE status = 'active'", (err2, skillCount) => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.get(
        "SELECT COUNT(*) as successfulSwaps FROM swap_requests_app WHERE status = 'accepted'",
        (err3, swapCount) => {
          if (err3) return res.status(500).json({ error: err3.message });

          db.get(
            "SELECT COUNT(*) as newThisWeek FROM users WHERE created_at >= NOW() - INTERVAL '7 days'",
            (err4, newUsers) => {
              if (err4) return res.status(500).json({ error: err4.message });

              res.json({
                totalUsers: userCount.totalusers || userCount.totalUsers || 0,
                activeSkills: skillCount.activeskills || skillCount.activeSkills || 0,
                successfulSwaps: swapCount.successfulswaps || swapCount.successfulSwaps || 0,
                newThisWeek: newUsers.newthisweek || newUsers.newThisWeek || 0,
              });
            },
          );
        },
      );
    });
  });
});

// Admin endpoints
app.get('/api/admin/stats', (req, res) => {
  db.get('SELECT COUNT(*) as total_users FROM users', (err, userCount) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get('SELECT COUNT(*) as total_swaps FROM user_skills', (err2, swapCount) => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.get(
        'SELECT name, swap_count FROM skills ORDER BY swap_count DESC LIMIT 1',
        (err3, mostSwapped) => {
          if (err3) return res.status(500).json({ error: err3.message });

          db.get(
            'SELECT name, swap_count FROM skills ORDER BY swap_count ASC LIMIT 1',
            (err4, leastSwapped) => {
              if (err4) return res.status(500).json({ error: err4.message });

              res.json({
                total_users: userCount.total_users,
                total_swaps: swapCount.total_swaps,
                most_swapped_skill: mostSwapped ? mostSwapped.name : 'None',
                least_swapped_skill: leastSwapped ? leastSwapped.name : 'None',
              });
            },
          );
        },
      );
    });
  });
});

app.get('/api/admin/moderation', (req, res) => {
  db.get("SELECT COUNT(*) as pending_reports FROM moderation_reports WHERE status = 'pending'", (err, pending) => {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT COUNT(*) as flagged_users FROM users WHERE status = 'flagged'", (err2, flagged) => {
      if (err2) return res.status(500).json({ error: err2.message });
      db.get("SELECT COUNT(*) as banned_users FROM users WHERE status = 'banned'", (err3, banned) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({
          pending_reports: pending.pending_reports || pending.pendingReports || 0,
          flagged_users: flagged.flagged_users || flagged.flaggedUsers || 0,
          banned_users: banned.banned_users || banned.bannedUsers || 0,
        });
      });
    });
  });
});

app.get('/api/admin/reports', (req, res) => {
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

app.put('/api/admin/reports/:id', (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  db.run(
    'UPDATE moderation_reports SET status = ?, admin_notes = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, admin_notes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run(
        'INSERT INTO admin_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
        ['update_report', 'moderation_report', id, `Status changed to ${status}`],
      );
      res.json({ success: true });
    },
  );
});

app.post('/api/admin/messages', (req, res) => {
  const { message } = req.body;
  db.run('INSERT INTO system_messages (message) VALUES (?)', [message], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run(
      'INSERT INTO admin_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
      ['send_message', 'system_message', this.lastID, 'Broadcast message sent'],
    );
    res.json({ success: true, id: this.lastID });
  });
});

app.get('/api/admin/messages', (req, res) => {
  db.all('SELECT * FROM system_messages ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/admin/logs', (req, res) => {
  db.all('SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 50', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/admin/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run('UPDATE users SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run(
      'INSERT INTO admin_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
      ['update_user_status', 'user', id, `User status changed to ${status}`],
    );
    res.json({ success: true });
  });
});

app.get('/api/admin/skills', (req, res) => {
  db.all('SELECT * FROM skills ORDER BY swap_count DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Swap requests
app.post('/api/swap-requests', (req, res) => {
  const { from_user_id, to_user_id, offered_skill, wanted_skill, message } = req.body;
  if (!from_user_id || !to_user_id || !offered_skill || !wanted_skill) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO swap_requests_app (from_user_id, to_user_id, offered_skill, wanted_skill, message) VALUES (?, ?, ?, ?, ?)',
    [from_user_id, to_user_id, offered_skill, wanted_skill, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const requestId = this.lastID;
      db.run(
        'INSERT INTO notifications_app (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)',
        [to_user_id, 'swap_request', 'New Swap Request', `You have a new swap request from ${from_user_id}`, requestId],
      );
      res.json({ success: true, id: requestId, message: 'Swap request sent successfully' });
    },
  );
});

app.get('/api/swap-requests/received/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    `
    SELECT 
      sr.*,
      u1.name as from_user_name,
      u1.email as from_user_email
    FROM swap_requests_app sr
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

app.get('/api/swap-requests/sent/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    `
    SELECT 
      sr.*,
      u2.name as to_user_name,
      u2.email as to_user_email
    FROM swap_requests_app sr
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

app.put('/api/swap-requests/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected"' });
  }
  db.run('UPDATE swap_requests_app SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM swap_requests_app WHERE id = ?', [id], (e, request) => {
      if (request) {
        const notificationTitle = status === 'accepted' ? 'Swap Request Accepted' : 'Swap Request Rejected';
        const notificationMessage = status === 'accepted' ? 'Your swap request has been accepted!' : 'Your swap request has been rejected.';
        db.run(
          'INSERT INTO notifications_app (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)',
          [request.from_user_id, 'swap_response', notificationTitle, notificationMessage, id],
        );
      }
    });
    res.json({ success: true, message: `Swap request ${status}` });
  });
});

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
  db.all(
    `SELECT * FROM notifications_app WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

app.put('/api/notifications/:id/read', (req, res) => {
  db.run('UPDATE notifications_app SET is_read = TRUE WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.put('/api/notifications/:userId/read-all', (req, res) => {
  db.run('UPDATE notifications_app SET is_read = TRUE WHERE user_id = ?', [req.params.userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.get('/api/notifications/:userId/unread-count', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM notifications_app WHERE user_id = ? AND is_read = FALSE', [req.params.userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: Number(row.count) || 0 });
  });
});

// Chat
app.get('/api/chat/:swapRequestId', (req, res) => {
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
    [req.params.swapRequestId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

app.post('/api/chat/:swapRequestId', (req, res) => {
  const { swapRequestId } = req.params;
  const { sender_id, receiver_id, message } = req.body;
  if (!sender_id || !receiver_id || !message) return res.status(400).json({ error: 'Missing required fields' });

  db.get('SELECT status FROM swap_requests_app WHERE id = ?', [swapRequestId], (err, request) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!request) return res.status(404).json({ error: 'Swap request not found' });
    if (request.status !== 'accepted') return res.status(400).json({ error: 'Chat is only available for accepted swap requests' });

    db.run(
      'INSERT INTO chat_messages (swap_request_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)',
      [swapRequestId, sender_id, receiver_id, message],
      function (e) {
        if (e) return res.status(500).json({ error: e.message });
        db.run(
          'INSERT INTO notifications_app (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)',
          [receiver_id, 'chat_message', 'New Message', `You have a new message from user ${sender_id}`, this.lastID],
        );
        res.json({ success: true, id: this.lastID, message: 'Message sent successfully' });
      },
    );
  });
});

app.get('/api/chat/user/:userId', (req, res) => {
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
        JOIN notifications_app n ON n.related_id = cm2.id 
        WHERE n.user_id = ? AND n.type = 'chat_message' AND n.is_read = TRUE
      )) as unread_count
    FROM swap_requests_app sr
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
const HOST = '127.0.0.1';
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
