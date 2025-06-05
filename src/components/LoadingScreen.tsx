
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <img
            src="/lovable-uploads/890e1d54-dd60-4b0b-8627-5ccc8c57ad4f.png"
            alt="Restaurant Logo"
            className="w-32 h-32 mx-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-white text-lg mt-4">Loading our delicious menu...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
