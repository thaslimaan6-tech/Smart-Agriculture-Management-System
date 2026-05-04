export const InlineError = ({ message, onRetry }) => (
  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
        >
          Retry
        </button>
      ) : null}
    </div>
  </div>
)

export const LoadingState = ({ label = 'Loading data...' }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  </div>
)

export const EmptyState = ({ label = 'No records found.' }) => (
  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
    {label}
  </div>
)
