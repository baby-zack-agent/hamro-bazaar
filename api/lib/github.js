// GitHub REST helper: read/write the git-backed JSON data files.
// Every admin write commits to the repo, which triggers a Vercel redeploy.
const API = 'https://api.github.com';

function cfg() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not configured');
  return {
    token,
    repo: process.env.GITHUB_REPO || 'baby-zack-agent/hamro-bazaar',
    branch: process.env.GITHUB_BRANCH || 'main',
  };
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'hamro-bazaar-admin',
    'Content-Type': 'application/json',
  };
}

export async function getJsonFile(path) {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const content = Buffer.from(json.content || '', 'base64').toString('utf8');
  return { sha: json.sha, data: JSON.parse(content) };
}

export async function putJsonFile(path, data, message) {
  const { token, repo, branch } = cfg();
  const { sha } = await getJsonFile(path); // guards against clobbering concurrent edits
  const url = `${API}/repos/${repo}/contents/${path}`;
  const body = {
    message,
    content: Buffer.from(JSON.stringify(data, null, 1), 'utf8').toString('base64'),
    sha,
    branch,
    committer: { name: 'baby-zack-agent', email: 'baby-zack-agent@users.noreply.github.com' },
  };
  const res = await fetch(url, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export const LISTINGS_PATH = 'src/data/listings.json';
export const ANNOUNCEMENTS_PATH = 'src/data/announcements.json';
export const SUBMISSIONS_PATH = 'src/data/submissions.json';
