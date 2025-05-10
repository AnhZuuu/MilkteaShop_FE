// ComboGrid.tsx
import React from "react";


interface ComboGridProps {
  combos: ComboItem[];
  onAddToCart: (combo: ComboItem) => void;
}

function getSizeLabel(size: number): string {
  switch (size) {
    case 0:
      return 'size S';
    case 1:
      return 'size M';
    case 2:
      return 'size L';
    case -1:
      return 'Topping';
    default:
      return 'Unknown Size';
  }
}


const ComboGrid: React.FC<ComboGridProps> = ({ combos, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {combos.map((combo) => (
        <div
          key={combo.id}
          className="bg-white text-black p-4 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">{combo.comboCode}</h2>
          <p className="mb-2">{combo.description}</p>
          <div className="gap-2 overflow-x-auto">
            {combo.products.map((p) => (
              <div className="flex m-2 bg-gray-100">
                <img
                  key={p.productId}
                  src={p.imageUrl}
                  alt={p.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="p-2">
                  <p>{p.productName}</p>
                  <p>{getSizeLabel(p.productSize.size)}</p>
                </div>
                
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">{combo.price.toLocaleString()}đ</span>
            <button
              onClick={() => onAddToCart(combo)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComboGrid;