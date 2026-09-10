import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// ─── Configuration ───────────────────────────────────────────────────────────
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const REPO_OWNER    = 'victogarcia4';
const REPO_NAME     = 'ap2-notebook-lm-fall2026';
const FILE_PATH     = 'data/games.json';
const BRANCH        = 'main';

// Exam ordering for organized JSON output
const EXAM_ORDER: Record<string, number> = {
  exam1: 1, exam2: 2, exam3: 3, exam4: 4, exam5: 5,
};

// ─── GitHub helpers ──────────────────────────────────────────────────────────

/** Check if GITHUB_TOKEN is a real token and not a placeholder or empty */
function isValidGitHubToken(token?: string): boolean {
  if (!token) return false;
  const trimmed = token.trim();
  if (
    trimmed === '' ||
    trimmed.includes('your_token') ||
    trimmed.includes('your_github_token') ||
    trimmed.includes('placeholder') ||
    trimmed.length < 20
  ) {
    return false;
  }
  return true;
}

/** Fetch the current games.json file content + SHA from GitHub. */
async function getFileFromGitHub(): Promise<{ content: any[]; sha: string | null }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'AP2-NotebookLM-App',
  };

  if (isValidGitHubToken(GITHUB_TOKEN)) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN!.trim()}`;
  }

  let res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers },
  );

  // If token is rejected with 401 Unauthorized, retry as unauthenticated public request
  if (res.status === 401 && headers.Authorization) {
    delete headers.Authorization;
    res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers },
    );
  }

  if (res.status === 404) return { content: [], sha: null };

  if (!res.ok) {
    // If GitHub API is rate-limited or fails, try raw github content for public repository
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${FILE_PATH}`,
      );
      if (rawRes.ok) {
        const rawJson = await rawRes.json();
        return { content: Array.isArray(rawJson) ? rawJson : [], sha: null };
      }
    } catch {
      // ignore
    }
    throw new Error(`GitHub GET error ${res.status}`);
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content: JSON.parse(decoded), sha: data.sha };
}

/** Commit an updated games array to the repo. */
async function commitToGitHub(
  games: any[],
  sha: string | null,
  message: string,
) {
  const encoded = Buffer.from(JSON.stringify(games, null, 2) + '\n').toString('base64');

  const body: Record<string, unknown> = { message, content: encoded, branch: BRANCH };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT error ${res.status}: ${err}`);
  }
  return res.json();
}

/** Sort games by exam order then alphabetically by author. */
function organizeGames(games: any[]): any[] {
  return [...games].sort((a, b) => {
    const examDiff = (EXAM_ORDER[a.examId] ?? 99) - (EXAM_ORDER[b.examId] ?? 99);
    if (examDiff !== 0) return examDiff;
    return (a.author ?? '').localeCompare(b.author ?? '');
  });
}

/** Local file helpers for fallback when GitHub token is not configured */
async function getLocalFile(): Promise<any[]> {
  try {
    const fullPath = path.resolve(process.cwd(), FILE_PATH);
    const raw = await fs.promises.readFile(fullPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveLocalFile(games: any[]): Promise<void> {
  const fullPath = path.resolve(process.cwd(), FILE_PATH);
  await fs.promises.writeFile(fullPath, JSON.stringify(games, null, 2) + '\n', 'utf-8');
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── GET: public read ──────────────────────────────────────────────────
    if (req.method === 'GET') {
      const localContent = await getLocalFile();
      try {
        const { content } = await getFileFromGitHub();
        const merged = Array.isArray(content) ? [...content] : [];
        for (const item of localContent) {
          if (!merged.some(m => m.id === item.id || (m.url && item.url && m.url === item.url))) {
            merged.push(item);
          }
        }
        return res.status(200).json(merged.length > 0 ? merged : localContent);
      } catch {
        return res.status(200).json(localContent);
      }
    }

    // ── POST: admin-only write ────────────────────────────────────────────
    if (req.method === 'POST') {
      // Authenticate
      const password = req.headers['x-admin-password'] as string | undefined;
      if (ADMIN_PASSWORD && password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized — invalid admin credentials.' });
      }

      const { action } = req.body ?? {};

      // Action: verify — just check password
      if (action === 'verify') {
        return res.status(200).json({ authenticated: true });
      }

      // Action: save — commit games array
      if (action === 'save') {
        const { games, commitMessage } = req.body;

        if (!Array.isArray(games)) {
          return res.status(400).json({ error: 'games must be an array.' });
        }

        // Organize: sort by exam, then author
        const organized = organizeGames(games);

        if (isValidGitHubToken(GITHUB_TOKEN)) {
          try {
            // Get current SHA for update
            const { sha } = await getFileFromGitHub();

            const message =
              commitMessage ||
              `🎮 Update AI Game repository — ${new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`;

            await commitToGitHub(organized, sha, message);
            await saveLocalFile(organized).catch(() => {});

            return res.status(200).json({
              success: true,
              message: 'Changes committed to GitHub successfully.',
              count: organized.length,
            });
          } catch (ghErr: any) {
            console.warn('[api/games] GitHub commit failed, saving locally:', ghErr?.message || ghErr);
            await saveLocalFile(organized);
            return res.status(200).json({
              success: true,
              message: 'Saved to local repository (GitHub commit failed).',
              count: organized.length,
            });
          }
        }

        // If no valid GITHUB_TOKEN configured, save locally
        await saveLocalFile(organized);
        return res.status(200).json({
          success: true,
          message: 'Changes saved locally (GITHUB_TOKEN not configured).',
          count: organized.length,
        });
      }

      return res.status(400).json({ error: 'Invalid action. Use "verify" or "save".' });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error: any) {
    console.error('[api/games] Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error.' });
  }
}
