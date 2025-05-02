import React from "react";
import { FaMapMarkerAlt, FaPhone, FaClock, FaStore } from "react-icons/fa";

// Define the type for a store
type Store = {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
};

const StoreShowcase: React.FC = () => {
  const stores: Store[] = [
    {
      id: 1,
      name: "Downtown Market Hub",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      hours: "9:00 AM - 9:00 PM",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a"
    },
    {
      id: 2,
      name: "Sunset Valley Store",
      address: "456 Sunset Boulevard, Valley City",
      phone: "(555) 234-5678",
      hours: "8:00 AM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1546213290-e1b492ab3eee"
    },
    {
      id: 3,
      name: "Harbor View Market",
      address: "789 Harbor View Road, Seaside",
      phone: "(555) 345-6789",
      hours: "7:00 AM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
    },
    {
      id: 4,
      name: "Green Hills Grocery",
      address: "321 Hill Road, Green Valley",
      phone: "(555) 456-7890",
      hours: "8:30 AM - 9:30 PM",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a"
    },
    {
      id: 5,
      name: "City Center Store",
      address: "555 City Center, Metro Area",
      phone: "(555) 567-8901",
      hours: "9:00 AM - 11:00 PM",
      image: "https://images.unsplash.com/photo-1546213290-e1b492ab3eee"
    },
    {
      id: 6,
      name: "Riverside Market",
      address: "888 Riverside Drive, River City",
      phone: "(555) 678-9012",
      hours: "7:30 AM - 9:30 PM",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Các cửa hàng của chúng tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 relative"
            aria-label={`Store card for ${store.name}`}
          >
            {/* Triangle roof */}
            <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[75px] border-r-[75px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-500 z-10"></div>

            {/* Store image */}
            <div className="relative h-48 overflow-hidden mt-8">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            {/* Store info */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaStore className="text-red-500 text-xl mr-2" />
                <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                  <p className="text-gray-600">{store.address}</p>
                </div>

                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-2" />
                  <p className="text-gray-600">{store.phone}</p>
                </div>

                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-2" />
                  <p className="text-gray-600">{store.hours}</p>
                </div>
              </div>

              <button
                className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                aria-label={`View details for ${store.name}`}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreShowcase;
