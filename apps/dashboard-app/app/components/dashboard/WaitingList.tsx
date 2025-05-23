import React from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react'
import Image from 'next/image'

interface WaitingListItem {
  id: number
  name: string
  email: string
  device: 'Mobile' | 'Tablet' | 'Desktop'
  country: string
  dateAdded: string
  status: 'Completed' | 'Waiting'
  avatar: string
}

export function WaitingList() {
  const waitingListData: WaitingListItem[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      device: 'Mobile',
      country: 'United States',
      dateAdded: '2024-12-01',
      status: 'Completed',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      name: 'Maria Gonzales',
      email: 'maria.gonzalez@example.com',
      device: 'Tablet',
      country: 'Spain',
      dateAdded: '2024-12-02',
      status: 'Waiting',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      id: 3,
      name: 'Ahmed Khan',
      email: 'ahmed.khan@example.com',
      device: 'Desktop',
      country: 'Pakistan',
      dateAdded: '2024-12-03',
      status: 'Waiting',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@example.com',
      device: 'Mobile',
      country: 'China',
      dateAdded: '2024-12-01',
      status: 'Completed',
      avatar: 'https://randomuser.me/api/portraits/women/79.jpg',
    },
    {
      id: 5,
      name: 'Carlos Silva',
      email: 'carlos.silva@example.com',
      device: 'Mobile',
      country: 'Brazil',
      dateAdded: '2024-12-04',
      status: 'Waiting',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
  ]

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone size={16} className="text-gray-500" />
      case 'Tablet':
        return <Tablet size={16} className="text-gray-500" />
      case 'Desktop':
        return <Monitor size={16} className="text-gray-500" />
      default:
        return null
    }
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Waiting List</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-md bg-white text-sm">
            <Filter size={16} className="mr-2" />
            Filter
            <ChevronDown size={16} className="ml-2" />
          </button>
          <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-md bg-white text-sm">
            Sort
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left">
              <th className="px-6 py-3 w-10">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {waitingListData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={item.avatar} 
                        alt={item.name} 
                        width={32} 
                        height={32}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.email}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getDeviceIcon(item.device)}
                    <span className="ml-2 text-sm text-gray-700">
                      {item.device}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.country}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.dateAdded}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${item.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
