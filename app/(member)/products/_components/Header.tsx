export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10 rounded-b-xl">
      <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
        EC Shop AI
      </h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="商品を検索..."
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        <button className="relative p-2 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </button>
      </div>
    </header>
  );
};