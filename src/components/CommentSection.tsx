"use client";

import { useOptimistic, useTransition, useState } from "react";
import { addComment, deleteComment } from "@/lib/actions/recipes";
import { useLanguage } from "@/lib/i18n/context";
import type { Comment } from "@/types/database";
import Link from "next/link";

function timeAgo(dateStr: string, t: (key: keyof import("@/lib/i18n/dictionary").Dictionary, params?: Record<string, string | number>) => string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return t("commentJustNow");
  if (diffMinutes < 60) return t("commentMinutesAgo", { count: diffMinutes });
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return t("commentHoursAgo", { count: diffHours });
  const diffDays = Math.floor(diffHours / 24);
  return t("commentDaysAgo", { count: diffDays });
}

export default function CommentSection({
  recipeId,
  comments: initialComments,
  currentUserId,
}: {
  recipeId: string;
  comments: Comment[];
  currentUserId: string | null;
}) {
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  type OptimisticAction =
    | { type: "add"; comment: Comment }
    | { type: "delete"; commentId: string };

  const [optimisticComments, setOptimisticComments] = useOptimistic(
    initialComments,
    (state, action: OptimisticAction) => {
      if (action.type === "add") return [...state, action.comment];
      if (action.type === "delete") return state.filter((c) => c.id !== action.commentId);
      return state;
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    const optimisticId = `temp-${crypto.randomUUID()}`;
    const tempComment: Comment = {
      id: optimisticId,
      recipe_id: recipeId,
      user_id: currentUserId!,
      content: content.trim(),
      created_at: new Date().toISOString(),
      profiles: { username: "You", avatar_url: null },
    };

    startTransition(async () => {
      setOptimisticComments({ type: "add", comment: tempComment });
      const result = await addComment(recipeId, content.trim());
      if (result.error) {
        setSubmitting(false);
        return;
      }
      setContent("");
      setSubmitting(false);
    });
  };

  const handleDelete = (commentId: string) => {
    if (!confirm(t("commentsDeleteConfirm"))) return;
    startTransition(async () => {
      setOptimisticComments({ type: "delete", commentId });
      await deleteComment(commentId, recipeId);
    });
  };

  const [, startTransition] = useTransition();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        {t("commentsTitle")} ({optimisticComments.length})
      </h2>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("commentsPlaceholder")}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0"
            >
              {submitting ? t("commentsSubmitting") : t("commentsSubmit")}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-500">
          {t("commentsLoginRequired")}
          <Link href="/login" className="text-black font-medium hover:underline">
            {t("commentsLoginLink")}
          </Link>
        </div>
      )}

      {optimisticComments.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          {t("commentsEmpty")}
        </p>
      ) : (
        <div className="space-y-4">
          {optimisticComments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    @{comment.profiles?.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {timeAgo(comment.created_at, t)}
                  </span>
                  {currentUserId === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {t("commentsDelete")}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
