import React from 'react'

export function Statistics() {
  return (
    <section className="mb-8">
      <h2 className="text-gray-800 text-xl font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-medium">Sales</h3>
            <div className="flex space-x-2">
              {['1Y', '3Y', '5Y', 'All'].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-xs rounded-full ${period === '1Y' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-700">Monthly Average</span>
              <div className="flex items-center">
                <h2 className="text-gray-800 text-3xl font-bold">$32,748</h2>
                <span className="ml-2 text-xs font-medium px-2 py-1 bg-green-100 text-green-600 rounded">
                  +8%
                </span>
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-600 mr-2"></span>
                <span className="text-xs text-gray-700">Direct Sales</span>
                <span className="text-gray-800 ml-2 text-xs font-medium">$16,321</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="text-xs text-gray-700">
                  Waiting List Registration
                </span>
                <span className="text-gray-800 ml-2 text-xs font-medium">$19,235</span>
              </div>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {Array.from({
                length: 12,
              }).map((_, i) => {
                const height = Math.random() * 60 + 20
                const month = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ][i]
                const isActive = i === 6 // July
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full relative">
                      {isActive && (
                        <div className="absolute bottom-0 w-full">
                          <div className="h-32 bg-blue-600 rounded-t-sm"></div>
                          <div className="h-6 bg-yellow-500 rounded-t-sm"></div>
                        </div>
                      )}
                      {!isActive && (
                        <div
                          className="bg-gray-200 rounded-t-sm"
                          style={{
                            height: `${height}%`,
                          }}
                        ></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-700 mt-2">{month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* Conversion Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800 font-medium">Conversion</h3>
            <div className="flex items-center border border-gray-200 rounded px-3 py-1.5">
              <span className="text-gray-800 text-sm">Dec 2024</span>
              <svg
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="35.2"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="220"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-gray-800 text-3xl font-bold">85.8%</span>
                <span className=" text-xs text-red-500 flex items-center">
                  -8% from last month
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></span>
                <span className="text-gray-800 text-xs">Purchased</span>
              </div>
              <span className="text-gray-800 text-xs font-medium">2,321</span>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="text-gray-800 text-xs">Registered</span>
              </div>
              <span className="text-gray-800 text-xs font-medium">225</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
