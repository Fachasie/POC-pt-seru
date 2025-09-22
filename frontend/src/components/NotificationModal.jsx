const NotificationModal = ({ message, isError }) => {
  return (
    <div className="fixed top-20 right-4 z-50 transition-transform duration-500 ease-in-out">
      <div
        className={`alert ${isError ? "alert-error" : "alert-success"} shadow-lg rounded-lg max-w-sm`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`stroke-current flex-shrink-0 h-6 w-6 ${isError ? "text-white" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={
              isError
                ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}