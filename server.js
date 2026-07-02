const express = require('express');
const path = require('path');
const app = express();
const PORT = 3006;

// Only serve files from the built 'dist' directory. Never expose the repo
// root (which contains server.js, package.json, fix-paths.js, source, etc.).
const distDir = path.join(__dirname, 'dist');

app.use(express.static(distDir, {
    extensions: ['html', 'htm'],
    index: 'index.html'
}));

// SPA-style fallback: serve <path>.html, <path>/index.html, else 404.
// All file serving goes through res.sendFile with { root: distDir }, which
// rejects any path that resolves outside distDir (prevents path traversal).
app.get('*', (req, res) => {
    // Strip any leading ../ segments that path.join would honour.
    const requested = path.normalize(req.path).replace(/^(\.\.[/\\])+/, '');

    // Containment check: the resolved path must live under distDir.
    const resolved = path.resolve(distDir, requested);
    if (!resolved.startsWith(distDir + path.sep) && resolved !== distDir) {
        return res.status(404).sendFile('/404.html', { root: distDir });
    }

    // sendFile with { root } enforces containment and calls the callback
    // (instead of throwing) when the file is missing — no sync fs needed.
    res.sendFile(requested, {
        root: distDir,
        extensions: ['html', 'htm']
    }, (err) => {
        if (err && err.code !== 'ENOENT' && err.statusCode !== 404) {
            console.error('Error serving', req.path, err);
        }
        res.status(404).sendFile('/404.html', { root: distDir });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
