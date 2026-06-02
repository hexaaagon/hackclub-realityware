export async function getCurrentGitHash() {
  const process = Bun.spawn(["git", "rev-parse", "--short", "HEAD"]);
  const hash = (await new Response(process.stdout).text()).trim();

  return hash.includes("fatal:") ? "unknown" : hash;
}
