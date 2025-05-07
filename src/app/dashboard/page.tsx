'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface Screening {
  id: string;
  restaurantName: string;
  status: 'pending' | 'completed' | 'in_progress';
  lastUpdated: string;
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [screenings, setScreenings] = useState<Screening[]>([
    {
      id: '1',
      restaurantName: 'Sample Restaurant',
      status: 'pending',
      lastUpdated: '2024-03-20',
    },
    {
      id: '2',
      restaurantName: 'Urban Bistro',
      status: 'completed',
      lastUpdated: '2024-04-15',
    },
    {
      id: '3',
      restaurantName: 'Seaside Grill',
      status: 'in_progress',
      lastUpdated: '2024-05-01',
    },
  ]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="app-header">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="header-logo">Apollo Guide</h1>
            <div>
              <button 
                className="btn-secondary"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Screenings</h2>
          <button 
            className="btn-primary"
            onClick={() => router.push('/screening/new')}
            style={{ width: 'auto' }}
          >
            New Screening
          </button>
        </div>
        
        <div className="card" style={{ maxWidth: 'none', padding: '0' }}>
          <table className="w-full">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {screenings.map((screening) => (
                <tr key={screening.id}>
                  <td>{screening.restaurantName}</td>
                  <td>
                    <span className={`status-badge ${screening.status.replace('_', '-')}`}>
                      {screening.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{screening.lastUpdated}</td>
                  <td>
                    <Link href={`/screening/${screening.id}`} className="text-primary">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 