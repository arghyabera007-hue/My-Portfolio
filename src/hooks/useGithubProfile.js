import { useState, useEffect, useRef } from "react";
import { githubProfile } from "../data/github";

// Polls the GitHub public user API at the given interval (ms).
// Cleans up the interval when the component using this hook unmounts.
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function getInitialProfile(username) {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`github_profile_${username}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  if (githubProfile && githubProfile.username === username) {
    return githubProfile;
  }
  return null;
}

export function useGithubProfile(username) {
  const [profile, setProfile] = useState(() => getInitialProfile(username));
  const [loading, setLoading] = useState(!profile);
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
        const profileData = {
          username: data.login,
          name: data.name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          publicRepos: data.public_repos,
          followers: data.followers,
          following: data.following,
          profileUrl: data.html_url,
        };
        setProfile(profileData);
        setError(null);

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              `github_profile_${username}`,
              JSON.stringify(profileData)
            );
          } catch {
            // Ignore localStorage errors
          }
        }
      } catch (err) {
        // Do not overwrite existing profile data on failure so the
        // card keeps showing the last known / fallback values.
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

