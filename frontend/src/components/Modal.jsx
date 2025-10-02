const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose} 
          ></div>

          <div className="relative bg-white rounded-lg z-10 w-full max-w-md sm:max-w-lg p-4 sm:p-6">
            <button
              className="absolute top-2 right-2 text-black font-semibold hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              X
            </button>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
