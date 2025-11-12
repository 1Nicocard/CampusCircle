// Estado de posts (likes) en localStorage con evento global para sincronizar vistas
import { getCurrentUser } from "./auth";

const GUEST_KEY_LS = "cc:guestId";

function getLikeKey(): string {
  const me = getCurrentUser();
  if (me) return String(me.id || me.email || "user");

  // fallback guest id persisted per browser
  try {
    let g = localStorage.getItem(GUEST_KEY_LS);
    if (!g) {
      g = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem(GUEST_KEY_LS, g);
    }
    return g;
  } catch {
    return "guest";
  }
}

const LS_KEY = "posts"; // tu Feed ya guarda aquí

export type PostFile = {
  id: string;
  type: "pdf" | "img" | "doc" | "other";
  url: string;
  label?: string;
};

export type Post = {
  id: string;
  content: string;
  createdAt: string;
  user?: { name?: string; email?: string; avatar?: string; id?: string };
  files?: PostFile[];
  likes?: number;
  comments?: number;
  commentsList?: { id: string; text: string; user?: { name?: string; avatar?: string }; createdAt: string; attachments?: PostFile[] }[];
  likedBy?: string[];   // <-- NUEVO
  tag?: string;         // "Design", etc
};

export function getAllPosts(): Post[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]") as Post[];
  } catch {
    return [];
  }
}

export function saveAllPosts(posts: Post[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(posts));
  // Notifica a Feed/Profile para re-render sin recargar
  window.dispatchEvent(new CustomEvent("posts:update"));
}

export function isLikedByMe(post: Post): boolean {
  const key = getLikeKey();
  return !!(post.likedBy || []).includes(String(key));
}

export function toggleLike(postId: string): Post | null {
  const key = getLikeKey();

  const posts = getAllPosts();
  const i = posts.findIndex(p => String(p.id) === String(postId));
  if (i === -1) return null;

  const p = posts[i];
  const likedBy = Array.isArray(p.likedBy) ? [...p.likedBy] : [];
  const has = likedBy.includes(key);

  const nextLikedBy = has ? likedBy.filter(x => x !== key) : [key, ...likedBy];
  const nextLikes = nextLikedBy.length;

  const updated: Post = { ...p, likedBy: nextLikedBy, likes: nextLikes };
  posts[i] = updated;
  saveAllPosts(posts);
  return updated;
}
