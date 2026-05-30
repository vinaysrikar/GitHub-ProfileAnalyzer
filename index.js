import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import db from './db.js';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// HOME
app.get("/", async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM Profiles ORDER BY analyzed_at DESC');
        res.render("index.ejs", { profile: null, profiles });
    } catch (error) {
        res.render("index.ejs", { profile: null, profiles: [] });
    }
});

// ANALYZE - Fetch from GitHub and Save to MySQL
app.post("/analyze", async (req, res) => {
    try {
        const username = req.body.username;

        // First API call - get profile
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const profile = response.data;

        // Second API call - get repos
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
        const repos = reposResponse.data;

        // Calculate total stars
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

        // Calculate top language
        const languageCount = {};
        repos.forEach(repo => {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });
        const topLanguage = Object.keys(languageCount).sort((a, b) => languageCount[b] - languageCount[a])[0] || 'N/A';

        // Save to MySQL
        await db.query(
            `INSERT INTO Profiles (username, name, avatar_url, bio, followers, following, public_repos, total_stars, top_language)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             followers = VALUES(followers),
             following = VALUES(following),
             public_repos = VALUES(public_repos),
             total_stars = VALUES(total_stars),
             top_language = VALUES(top_language),
             analyzed_at = CURRENT_TIMESTAMP`,
            [
                profile.login,
                profile.name,
                profile.avatar_url,
                profile.bio,
                profile.followers,
                profile.following,
                profile.public_repos,
                totalStars,
                topLanguage
            ]
        );

        // Add calculated fields to profile object for EJS
        profile.totalStars = totalStars;
        profile.topLanguage = topLanguage;

        // Get updated profiles list
        const [profiles] = await db.query('SELECT * FROM Profiles ORDER BY analyzed_at DESC');

        res.render("index.ejs", { profile, profiles });

    } catch (error) {
        console.error(error);
        const [profiles] = await db.query('SELECT * FROM Profiles ORDER BY analyzed_at DESC');
        res.render("index.ejs", {
            profile: null,
            profiles,
            error: "GitHub user not found"
        });
    }
});

// GET all profiles - JSON API
app.get("/profiles", async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM Profiles ORDER BY analyzed_at DESC');
        res.json({
            success: true,
            count: profiles.length,
            data: profiles
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single profile - JSON API
app.get("/profiles/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const [rows] = await db.query('SELECT * FROM Profiles WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
});