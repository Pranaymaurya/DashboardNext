"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface SolicitedChartProps {
  data: {
    solicited: number
    received: number
    consumed: number
    pending: number
  }
}

export function SolicitedChart({ data }: SolicitedChartProps) {
  const [selectedTab, setSelectedTab] = useState('individual')
  
  const total = data.solicited + data.received + data.consumed + data.pending
  
  // Calculate percentages for each segment
  const solicitedPercent = (data.solicited / total) * 100
  const receivedPercent = (data.received / total) * 100
  const consumedPercent = (data.consumed / total) * 100
  const pendingPercent = (data.pending / total) * 100
  
  // Calculate cumulative percentages for positioning
  const solicitedOffset = 0
  const receivedOffset = solicitedPercent
  const consumedOffset = solicitedPercent + receivedPercent
  const pendingOffset = solicitedPercent + receivedPercent + consumedPercent
  
  const radius = 40
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  
  const createArc = (percentage: number, offset: number) => {
    const strokeDasharray = `${percentage * circumference / 100} ${circumference}`
    const strokeDashoffset = -offset * circumference / 100
    return { strokeDasharray, strokeDashoffset }
  }
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex space-x-6">
            <button className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1">
              Solicited
            </button>
            <button className="text-sm font-medium text-gray-400">
              Unsolicited
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button 
              className={`px-3 py-1 text-xs rounded ${selectedTab === 'individual' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('individual')}
            >
              Individual
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded ${selectedTab === 'non-individual' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('non-individual')}
            >
              Non Individual
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {/* Multi-ring Donut Chart */}
        <div className="relative flex items-center justify-center mb-6">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background rings */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f3f4f6" strokeWidth="6"/>
            <circle cx="50" cy="50" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6"/>
            <circle cx="50" cy="50" r="21" fill="none" stroke="#f3f4f6" strokeWidth="6"/>
            <circle cx="50" cy="50" r="14" fill="none" stroke="#f3f4f6" strokeWidth="6"/>
            
            {/* Outer ring - Solicited (Dark Blue-Green) */}
            <circle 
              cx="50" 
              cy="50" 
              r="35" 
              fill="none" 
              stroke="#0f766e" 
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="100 220"
              strokeDashoffset="0"
            />
            
            {/* Third ring - Received (Blue) */}
            <circle 
              cx="50" 
              cy="50" 
              r="28" 
              fill="none" 
              stroke="#1d4ed8" 
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="110 176"
              strokeDashoffset="0"
            />
            
            {/* Second ring - Consumed (Cyan) */}
            <circle 
              cx="50" 
              cy="50" 
              r="21" 
              fill="none" 
              stroke="#06b6d4" 
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="90 132"
              strokeDashoffset="0"
            />
            
            {/* Inner ring - Pending (Red) */}
            <circle 
              cx="50" 
              cy="50" 
              r="14" 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="50 88"
              strokeDashoffset="0"
            />
          </svg>
          
          {/* Center Total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-teal-700 mr-3"></div>
            <span className="text-gray-700">No of PANs Solicited</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-700 mr-3"></div>
            <span className="text-gray-700">Received</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyan-500 mr-3"></div>
            <span className="text-gray-700">Consumed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-3"></div>
            <span className="text-gray-700">Pending</span>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">No. Of PANs Solicited</div>
                <div className="text-sm text-gray-600">400 KF in KRA • 250 With Image • 256 Without Image</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">956</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Data Received</div>
                <div className="text-sm text-gray-600">300 KF in KRA • 100 With Image • 20 Without Image</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">320</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}