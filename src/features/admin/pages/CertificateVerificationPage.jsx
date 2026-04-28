import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCertificateVerificationList,
  approveCertificateRequest,
  rejectCertificateRequest,
} from "@/api/certificateApi";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  const cls = STATUS_BADGE[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}

export function CertificateVerificationPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const noteRef = useRef(null);

  const fetchRequests = useCallback(() => {
    setLoading(true);
    getCertificateVerificationList({ search, status: statusFilter })
      .then((data) => setRequests(data.result ?? []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const openModal = (requestId, action) => {
    setModal({ requestId, action });
    setReviewNote("");
    setTimeout(() => noteRef.current?.focus(), 50);
  };

  const closeModal = () => {
    setModal(null);
    setReviewNote("");
  };

  const handleSubmitReview = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      if (modal.action === "approve") {
        await approveCertificateRequest(modal.requestId, reviewNote);
      } else {
        await rejectCertificateRequest(modal.requestId, reviewNote);
      }
      closeModal();
      fetchRequests();
    } finally {
      setSubmitting(false);
    }
  };

  const activeStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage student certificate submission requests
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by student or certificate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                {activeStatusLabel}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onSelect={() => setStatusFilter(opt.value)}
                  className={statusFilter === opt.value ? "font-medium" : ""}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Submitter</th>
                <th className="px-4 py-3">Certificate Name</th>
                <th className="px-4 py-3">Date Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                    No certificate requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isPending = req.status?.toLowerCase() === "pending";
                  return (
                    <tr key={req.requestId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        {req.submittedBy ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/inbox/${req.requestId}?type=UPLOAD_CERTIFICATES`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {req.certificateName ?? "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {req.createdAt ? req.createdAt.slice(0, 10) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status?.toLowerCase()} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(req.requestId, "approve")}
                            disabled={!isPending}
                            className="rounded p-1 text-green-500 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => openModal(req.requestId, "reject")}
                            disabled={!isPending}
                            className="rounded p-1 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">
              {modal.action === "approve" ? "Approve" : "Reject"} Certificate Request
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {modal.action === "approve"
                ? "Optionally add a note before approving."
                : "Optionally explain why you are rejecting this request."}
            </p>
            <textarea
              ref={noteRef}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Review note (optional)..."
              rows={3}
              className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  modal.action === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {submitting
                  ? "Submitting..."
                  : modal.action === "approve"
                  ? "Approve"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
