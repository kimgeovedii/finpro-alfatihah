"use client"

import React from 'react'
import { useUser } from '@/features/auth/hooks/useUser'

export default function DashboardPage() {
  const { user, isLoading } = useUser()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">
            {isLoading 
              ? "Loading your farming overview..." 
              : `Welcome back, ${user?.name || "User"}. Here's what's happening.`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Active Projects', 'Total Tracking', 'Pending Tasks', 'Harvest Volume'].map((stat, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-default">
            <h3 className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">{stat}</h3>
            <p className="text-3xl font-bold mt-2 text-slate-800">
              {['12', '48', '5', '8.4t'][i]}
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <span>+{(Math.random() * 10).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area placeholder */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[400px]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activities</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-16 bg-slate-100/50 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium">No recent activities to show</p>
            <p className="text-sm mt-1">When your team completes tasks, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}