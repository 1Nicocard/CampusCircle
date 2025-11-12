import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// avoid importing RootState here to prevent circular type dependency with store
import { getAllPosts, saveAllPosts, toggleLike as postToggleLike } from '../lib/postStore';
import type { Post } from '../lib/postStore';

export type PostState = {
  posts: Post[];
};

const initialState: PostState = {
  posts: getAllPosts(),
};

export const toggleLike = createAsyncThunk<Post | null, string>('posts/toggleLike', async (postId: string) => {
  const updated = postToggleLike(String(postId));
  return updated;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts = [action.payload, ...state.posts];
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
    addComment(state, action: PayloadAction<{ postId: string; comment: NonNullable<Post['commentsList']>[number] }>) {
      const { postId, comment } = action.payload;
      const i = state.posts.findIndex(p => String(p.id) === String(postId));
      if (i === -1) return;
      const existing = Array.isArray(state.posts[i].commentsList) ? [...state.posts[i].commentsList] : [];
      const newList = [...existing, comment];
      const updated = { ...state.posts[i], commentsList: newList, comments: newList.length } as Post;
      state.posts[i] = updated;
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
    updatePost(state, action: PayloadAction<Post>) {
      state.posts = state.posts.map((p) => (p.id === action.payload.id ? action.payload : p));
      try { saveAllPosts(state.posts); } catch { /* ignore */ }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLike.fulfilled, (state, action: PayloadAction<Post | null>) => {
      if (!action.payload) return;
      state.posts = state.posts.map((p) => (p.id === action.payload!.id ? action.payload! : p));
    });
  }
});

export const { setPosts, addPost, addComment, updatePost } = postsSlice.actions;
export default postsSlice.reducer;

import type { RootState } from './store';

export const selectPosts = (s: RootState) => s.posts.posts;
