import { useState, useEffect, useRef } from "react";

// Polls the GitHub public user API at the given interval (ms).
// Cleans up the interval when the component using this hook unmounts.
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function useGithubProfile(username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}`
        );
        if (!res.ok) {
          throw new Error(`GitHub API responded with status ${res.status}`);
        }
        const data = await res.json();
        setProfile({
          username: data.login,
          name: data.name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          publicRepos: data.public_repos,
          followers: data.followers,
          following: data.following,
          profileUrl: data.html_url,
        });
        setError(null);
      } catch (err) {
        // Do not overwrite existing profile data on a polling failure so the
        // card keeps showing the last known values.
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Fetch immediately on mount.
    fetchProfile();

    // Then re-fetch on the polling interval.
    intervalRef.current = setInterval(fetchProfile, POLL_INTERVAL_MS);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [username]);

  return { profile, loading, error };
}
