import React from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  note: string;
}

interface CartPanelProps {
  cart: CartItem[];
  onNoteChange: (index: number, note: string) => void;
  onRemove: (index: number) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ cart, onNoteChange, onRemove }) => {
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
      {cart.map((item, index) => (
        <div key={item.id} className="flex items-start mb-4 bg-gray-700 p-2 rounded-lg relative">
          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
          <div className="flex-1">
            <h3 className="font-medium text-sm">{item.name}</h3>
            <p className="text-xs text-gray-300">Giá: {item.price.toLocaleString()}₫</p>
            <textarea
              className="mt-2 w-full text-black text-sm p-1 rounded"
              rows={2}
              placeholder="Ghi chú..."
              value={item.note}
              onChange={(e) => onNoteChange(index, e.target.value)}
            />
          </div>
          <button
            onClick={() => onRemove(index)}
            className="absolute top-1 right-2 text-gray-400 hover:text-red-400 text-sm"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="border-t border-gray-600 pt-2 mt-4 text-sm">
        <p>Tổng số món: {totalItems}</p>
        <p className="font-semibold">Tổng tiền: {totalPrice.toLocaleString()}₫</p>
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm">
          Đặt món
        </button>
      </div>
    </div>
  );
};

export default CartPanel;






// import React from "react";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
//   note: string;
// }

// interface CartPanelProps {
//   cart: CartItem[];
//   onNoteChange: (index: number, note: string) => void;
// }

// const CartPanel: React.FC<CartPanelProps> = ({ cart, onNoteChange }) => {
//   const total = cart.reduce((sum, item) => sum + item.price, 0);

//   return (
//     <div>
//       {cart.map((item, idx) => (
//         <div key={idx} className="mb-4 border-b border-gray-600 pb-2">
//           <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded mb-2" />
//           <div className="text-sm font-medium">{item.name}</div>
//           <textarea
//             placeholder="Ghi chú..."
//             className="w-full p-1 text-sm rounded bg-gray-700 text-white mt-1 outline-none"
//             value={item.note}
//             onChange={(e) => onNoteChange(idx, e.target.value)}
//           />
//         </div>
//       ))}
//       <div className="mt-4 font-semibold">Số lượng sản phẩm: {cart.length}</div>
//       <div className="mt-2 font-semibold">Tổng cộng: {total.toLocaleString()} đ</div>
//       <button className="mt-4 bg-blue-600 w-full py-2 rounded hover:bg-blue-700">
//         Thêm vào giỏ hàng
//       </button>
//     </div>
//   );
// };

// export default CartPanel;