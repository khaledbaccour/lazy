const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;
const OUTPUT_DIR = path.join(__dirname, '../factory-output');
const STATUS_FILE = path.join(OUTPUT_DIR, 'status.json');

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Real-time SSE stream of status.json
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const send = () => {
    try {
      const raw = fs.existsSync(STATUS_FILE)
        ? fs.readFileSync(STATUS_FILE, 'utf-8')
        : '{}';
      res.write(`data: ${raw.replace(/\n/g, ' ')}\n\n`);
    } catch {
      res.write('data: {}\n\n');
    }
  };

  send();
  const iv = setInterval(send, 1500);
  req.on('close', () => clearInterval(iv));
});

// Trigger the pipeline by writing a trigger file
app.post('/start', (req, res) => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, '.start_trigger'), new Date().toISOString());
  res.json({ ok: true });
});

// Serve any output file
app.get('/output/:file', (req, res) => {
  const fp = path.join(OUTPUT_DIR, req.params.file);
  if (!fs.existsSync(fp)) return res.status(404).send('Not found');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(fs.readFileSync(fp, 'utf-8'));
});

app.listen(PORT, () => {
  console.log(`\n  Startup Factory Dashboard\n  http://localhost:${PORT}\n`);
});
