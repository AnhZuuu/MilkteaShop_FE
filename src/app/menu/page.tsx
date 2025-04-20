// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/menu/Sidebar';
import ProductGrid from '@/components/menu/ProductGrid';
import CartPanel from '@/components/menu/CartPanel';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  note?: string;
}

const sampleProducts: Product[] = [
  { id: 1, name: 'Hoa quả sơn', price: 20000, image: '/fruit.jpg', category: 'an-vat' },
  { id: 2, name: 'Khô bò', price: 31000, image: '/beef.jpg', category: 'an-vat' },
  { id: 3, name: 'Khô gà', price: 26000, image: '/chicken.jpg', category: 'an-vat' },
  { id: 4, name: 'Snack tôm cay', price: 10000, image: '/snack.jpg', category: 'an-vat' },
  { id: 5, name: 'Coca Cola', price: 12000, image: '/coke.jpg', category: 'nuoc-uong' },
  { id: 6, name: 'Pepsi', price: 12000, image: '/pepsi.jpg', category: 'nuoc-uong' },
];

const MenuPage = () => {
    interface CartItem extends Product {
        note: string;
      }
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, { ...product, note: '' }]);
  };

  const handleNoteChange = (index: number, note: string) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].note = note;
      return updated;
    });
  };
  
  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };
  

  return (
    <div className="flex h-screen bg-blue-200 text-white">
      <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div
        className={`transition-all duration-300 ${
          cart.length ? 'w-[65%]' : 'w-[85%]'
        } p-4 overflow-y-auto`}
      >
        <ProductGrid
          category={selectedCategory}
          products={sampleProducts}
          onAddToCart={handleAddToCart}
        />
      </div>
      {cart.length > 0 && (
        <div className="w-[20%] bg-gray-800 p-4 overflow-y-auto">
          <CartPanel 
          cart={cart} onNoteChange={handleNoteChange} 
          onRemove={handleRemoveFromCart}/>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
