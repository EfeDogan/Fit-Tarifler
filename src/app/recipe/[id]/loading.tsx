export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-1 bg-gray-100 rounded" />
          <div className="h-4 w-28 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-3/4 bg-gray-100 rounded mb-4" />
        <div className="h-6 w-1/2 bg-gray-100 rounded mb-5" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>

      <div className="w-full h-80 bg-gray-100 rounded-xl mb-8" />

      <div className="space-y-3">
        <div className="h-5 w-full bg-gray-100 rounded" />
        <div className="h-5 w-5/6 bg-gray-100 rounded" />
        <div className="h-5 w-4/6 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
