'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

export default function ScreeningPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [restaurantInfo] = useState({
    name: params.id === '1' ? 'Sample Restaurant' : 
          params.id === '2' ? 'Urban Bistro' : 'Seaside Grill',
    status: params.id === '2' ? 'completed' : 
            params.id === '3' ? 'in_progress' : 'pending',
    location: 'San Francisco, CA',
    cuisine: 'Contemporary',
    lastUpdated: params.id === '1' ? '2024-03-20' : 
                 params.id === '2' ? '2024-04-15' : '2024-05-01'
  });

  useEffect(() => {
    console.log("TTTTT");
    alert("TTTTT");
  }, []);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      name: 'House Salad',
      description: 'Mixed greens, cherry tomatoes, cucumber, red onion with house dressing',
      price: '12',
      category: 'Appetizers',
    },
    {
      name: 'Grilled Salmon',
      description: 'Wild-caught salmon with seasonal vegetables and lemon butter sauce',
      price: '24',
      category: 'Main Courses',
    }
  ]);
  
  const [newItem, setNewItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  const addMenuItem = () => {
    if (newItem.name && newItem.price) {
      setMenuItems([...menuItems, newItem]);
      setNewItem({ name: '', description: '', price: '', category: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="app-header">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="header-logo">Apollo Guide</h1>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{restaurantInfo.name}</h2>
            <p className="text-secondary">{restaurantInfo.location} • {restaurantInfo.cuisine}</p>
          </div>
          <span className={`status-badge ${restaurantInfo.status.replace('_', '-')}`}>
            {restaurantInfo.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Add Menu Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input-field"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="00.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="e.g. Appetizers"
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={addMenuItem}
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Menu Items</h3>
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-secondary">{item.description}</p>
                    </div>
                    <span className="font-medium">${item.price}</span>
                  </div>
                  {item.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-50 rounded text-sm text-secondary">
                      {item.category}
                    </span>
                  )}
                </div>
              ))}
              {menuItems.length === 0 && (
                <p className="text-secondary text-center py-4">
                  No menu items added yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 