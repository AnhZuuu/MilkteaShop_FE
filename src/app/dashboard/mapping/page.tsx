'use client';

import { useEffect, useState } from 'react';
import { ProductList } from '@/components/mapping/ProductList';
import { MappingArea } from '@/components/mapping/MappingArea';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Product } from '@/components/mapping/ProductCard';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [main, setMain] = useState<Product | null>(null);
  const [extra, setExtra] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/"); 
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "Admin" && parsedUser.role !== "Manager") {
        router.replace("/"); 
      } else {
        setUser(parsedUser);
        setLoading(false);
      }
    }

    fetch('https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product') // Replace with your real API endpoint
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
      
  }, []);

  // console.log(products)

  // useEffect(() => {
  //   // Fake data
  //   const fakeData: Product[] = [
  //     { id: '1', ProductName: 'Main Product 1', productType: 'Main' },
  //     { id: '2', ProductName: 'Main Product 2', productType: 'Main' },
  //     { id: '3', ProductName: 'Extra Product 1', productType: 'Extra' },
  //     { id: '4', ProductName: 'Extra Product 2', productType: 'Extra' },
  //   ];
  //   setProducts(fakeData);
  // }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 space-y-6 max-w-4xl mx-auto">

        <MappingArea
          main={main}
          extra={extra}
          setMain={setMain}
          setExtra={setExtra}
        />
        <ProductList products={products} />
      </div>
    </DndProvider>
  );
}
