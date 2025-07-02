type Props = {
  setIsChatOpen: (isOpen: boolean) => void;
};

export const AIChatMock: React.FC<Props> = ({ setIsChatOpen }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-end z-50 p-4">
    <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-sm h-3/4 flex flex-col">
      <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="text-lg font-bold">AIアバター店員</h3> 
        <button
          onClick={() => setIsChatOpen(false)}
          className="text-xl font-bold"
        >
          &times;
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <p className="text-gray-700">いらっしゃいませ！何かお探しですか？</p>
      </div>
      <div className="p-4 border-t border-gray-200">
        <input
          type="text"
          placeholder="メッセージを入力..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  </div>
);
