import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UnauthenticatedModal } from "@/components/common/UnauthenticatedModal";
import { useAuth } from "@/hooks/useAuth";
import { likeReview, unlikeReview } from "@/api/reviewApi";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";
import { Clock, Lightbulb, MessageCircle, Share2, ThumbsUp } from "lucide-react";

const AVATAR_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500",
  "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const DIFFICULTY_MAP = {
  1: { label: "Sangat Mudah", emoji: "😊", className: "bg-green-50 text-green-700 border-green-200" },
  2: { label: "Mudah", emoji: "🙂", className: "bg-green-50 text-green-700 border-green-200" },
  3: { label: "Sedang", emoji: "😐", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  4: { label: "Sulit", emoji: "🤯", className: "bg-orange-50 text-orange-700 border-orange-200" },
  5: { label: "Sangat Sulit", emoji: "🤬", className: "bg-red-50 text-red-700 border-red-200" },
};

export const RecruitmentProcessCard = ({ data, companySlug }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(Boolean(data?.isLiked));
  const [likeLoading, setLikeLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [likeCount, setLikeCount] = useState(
    data?.totalLikes ?? data?.likeCount ?? data?.helpfulCount ?? data?.helpful ?? 0
  );

  const {
    jobTitle,
    durationMonths,
    admissionTrack,
    recruitmentDuration,
    interviewDifficulty,
    recruitmentSteps = [],
    selectionProcess,
    exampleQuestions,
    tipsTricks,
    createdByName,
  } = data;

  const displayName = createdByName ?? "Anonim";
  const difficulty = DIFFICULTY_MAP[interviewDifficulty];
  const processDetailId =
    data?.internshipDetailId ??
    data?.reviewId ??
    data?.reviewID ??
    data?.review_id ??
    data?.id ??
    data?.detailId ??
    data?.internshipDetail?.internshipDetailId ??
    data?.internshipDetail?.id;
  const internshipHeaderId =
    data?.internshipHeaderId ??
    data?.headerId ??
    data?.internshipReviewId ??
    data?.reviewID ??
    data?.review_id ??
    data?.internshipHeader?.internshipHeaderId ??
    data?.internshipHeader?.id ??
    data?.internshipDetail?.internshipHeaderId ??
    data?.internshipDetail?.internshipHeader?.internshipHeaderId;

  useEffect(() => {
    setLiked(Boolean(data?.isLiked));
    setLikeCount(
      data?.totalLikes ?? data?.likeCount ?? data?.helpfulCount ?? data?.helpful ?? 0
    );
  }, [data]);

  const handleShare = async () => {
    if (!processDetailId || !companySlug) {
      toast.error("Link recruitment process tidak dapat dibuat karena data belum lengkap");
      return;
    }

    try {
      const processPath = `/company/${companySlug}/recruitment/${processDetailId}`;
      const shareUrl = `${window.location.origin}${processPath}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      toast.success("Link recruitment process berhasil disalin");
    } catch {
      setCopied(false);
      toast.error("Gagal menyalin link recruitment process");
    }
  };

  const handleOpenDetail = () => {
    if (!processDetailId) {
      toast.error("Recruitment process ID tidak ditemukan");
      return;
    }
    if (!companySlug) {
      toast.error("Slug company tidak ditemukan");
      return;
    }

    navigate(`/company/${companySlug}/recruitment/${processDetailId}`);
  };

  const handleLikeClick = async () => {
    if (likeLoading) return;

    if (!internshipHeaderId) {
      toast.error("Recruitment process Header ID tidak ditemukan");
      return;
    }

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const previousLiked = liked;
    const previousCount = likeCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikeCount(nextCount);
    setLikeLoading(true);

    try {
      const response = nextLiked
        ? await likeReview(internshipHeaderId)
        : await unlikeReview(internshipHeaderId);
      const { success, message, data: result } = handleApiResponse(response);

      if (!success) {
        setLiked(previousLiked);
        setLikeCount(previousCount);
        toast.error(message || "Gagal memperbarui like recruitment process");
        return;
      }

      const serverCount =
        result?.totalLikes ?? result?.likeCount ?? result?.helpfulCount ?? result?.helpful ?? null;
      if (typeof serverCount === "number") {
        setLikeCount(serverCount);
      }

      if (typeof result?.isLiked === "boolean") {
        setLiked(result.isLiked);
      }
    } catch (error) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error(
        normalizeErrorMessage(error, "Gagal memperbarui like recruitment process")
      );
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      onClick={handleOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenDetail();
        }
      }}
      className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md md:p-5"
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(displayName)}`}
        >
          {getInitials(displayName)}
        </div>
        <div>
          <p className="font-plus-jakarta text-[19px] font-semibold text-slate-900 md:text-[20px]">{displayName}</p>
          <p className="font-inter text-sm text-slate-600">{jobTitle}</p>
          {durationMonths && (
            <p className="font-inter text-xs text-slate-400">Magang {durationMonths} bulan</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {admissionTrack && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-100/70 px-2.5 py-1 font-inter text-sm font-semibold text-sky-700">
            🌐 {admissionTrack}
          </span>
        )}
        {difficulty && (
            <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-inter text-sm font-semibold ${difficulty.className}`}>
            {difficulty.emoji} {difficulty.label}
          </span>
        )}
        {recruitmentDuration && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 font-inter text-sm font-semibold text-slate-600">
            <Clock size={12} /> {recruitmentDuration}
          </span>
        )}
      </div>

      {recruitmentSteps.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <p className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-slate-500">Tahapan Seleksi</p>
          <div className="flex flex-wrap gap-1.5">
            {recruitmentSteps.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 font-inter text-sm text-slate-700"
              >
                <span className="text-orange-400">○</span> {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectionProcess && (
        <div>
            <p className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-slate-500">Pengalaman Seleksi</p>
          <p className="font-inter text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">{selectionProcess}</p>
        </div>
      )}

      {exampleQuestions && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <p className="mb-2 flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-wide text-slate-500">
            <MessageCircle size={13} /> Contoh Pertanyaan Wawancara
          </p>
          <p className="font-inter text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">{exampleQuestions}</p>
        </div>
      )}

      {tipsTricks && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
          <p className="mb-2 flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Lightbulb size={13} /> Tips Lolos Seleksi
          </p>
          <p className="font-inter text-[15px] leading-relaxed text-amber-800 whitespace-pre-line">{tipsTricks}</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleLikeClick();
          }}
          disabled={likeLoading}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 font-inter text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
            liked
              ? "border-orange-200 bg-orange-50 text-orange-600"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
          type="button"
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {likeLoading ? "Saving..." : `Helpful (${likeCount})`}
        </button>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={(event) => {
              event.stopPropagation();
              handleShare();
            }}
            type="button"
            title={copied ? "Copied" : "Share"}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {showAuthModal && (
        <UnauthenticatedModal
          redirectPath={location.pathname}
          onClose={() => setShowAuthModal(false)}
          message="You need to log in first to continue this action."
        />
      )}
    </div>
  );
};
