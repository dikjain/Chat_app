const LoadMoreButton = ({ onLoadMore, remainingCount, loadMoreIncrement }) => {
  // Don't render if there are no more messages to load
  if (remainingCount <= 0) {
    return null;
  }

  const loadCount = remainingCount > loadMoreIncrement ? loadMoreIncrement : remainingCount;

  return (
    <div className="flex justify-center py-2">
      <button
        onClick={onLoadMore}
        className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm"
      >
        Load {loadCount} more {loadCount === 1 ? 'message' : 'messages'}
      </button>
    </div>
  );
};

export default LoadMoreButton;

