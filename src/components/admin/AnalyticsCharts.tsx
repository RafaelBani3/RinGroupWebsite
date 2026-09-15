'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, Eye, TrendingUp, Compass, AlertCircle } from 'lucide-react';

const COLORS = ['#B69B63', '#9E2F2F', '#4A5568', '#718096'];

interface AnalyticsData {
  isDemoData?: boolean;
  periodLabel: string;
  timeline: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  topBrands: { name: string; slug: string; share: number }[];
  trafficSources: { name: string; percentage: number }[];
}

export function AnalyticsDashboardClient({ data }: { data: AnalyticsData }) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const calculatedViews = data.timeline.reduce((acc, curr) => acc + curr.views, 0);
  const calculatedVisitors = data.timeline.reduce((acc, curr) => acc + curr.visitors, 0);

  const totalViews = data.isDemoData ? 12480 : calculatedViews;
  const totalVisitors = data.isDemoData ? 7850 : calculatedVisitors;

  return (
    <div className="space-y-6">
      {/* Demo / Simulation Mode Warning Banner */}
      {data.isDemoData && (
        <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl flex items-start gap-3 text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-amber-300">
              Demonstration Mode (Simulated Metrics)
            </p>
            <p className="text-amber-200/80 leading-relaxed">
              No live website visit events have been recorded yet in Neon PostgreSQL. The figures and graphs below are illustrative demonstration data. Live analytics will populate automatically as visitors interact with the website or when Google Analytics 4 (GA4) is configured in System Settings.
            </p>
          </div>
        </div>
      )}

      {/* Period Filter Buttons */}
      <div className="flex items-center justify-between bg-[#161616] border border-[#262626] p-3 rounded-xl">
        <span className="text-xs text-neutral-400 font-medium">
          Reporting Period: <strong className="text-white">{data.periodLabel}</strong>
          {data.isDemoData && (
            <span className="ml-2 px-1.5 py-0.5 bg-amber-900/50 border border-amber-700/50 text-[10px] text-amber-300 rounded font-mono">
              DEMO DATA
            </span>
          )}
        </span>
        <div className="flex items-center gap-1 bg-[#111] p-1 rounded-lg border border-[#262626]">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                period === p
                  ? 'bg-[#B69B63] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161616] border border-[#262626] p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs">Total Visitors</span>
            <Users className="w-4 h-4 text-[#B69B63]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{totalVisitors.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{data.isDemoData ? '+14.2% (Benchmark)' : '+0% vs baseline'}</span>
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs">Page Views</span>
            <Eye className="w-4 h-4 text-[#B69B63]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{data.isDemoData ? '+18.5% (Benchmark)' : '+0% vs baseline'}</span>
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs">Avg. Engagement</span>
            <Compass className="w-4 h-4 text-[#B69B63]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {data.isDemoData ? '64.8%' : '—'}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {data.isDemoData ? '2m 42s avg session' : 'Live tracking active'}
          </p>
        </div>

        <div className="bg-[#161616] border border-[#262626] p-5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs">Inquiry Conversion</span>
            <TrendingUp className="w-4 h-4 text-[#B69B63]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {data.isDemoData ? '3.2%' : '—'}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {data.isDemoData ? 'Form submission rate' : 'Awaiting form submissions'}
          </p>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="bg-[#161616] border border-[#262626] p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">Traffic & Engagement Timeline</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={
                data.timeline.length > 0
                  ? data.timeline
                  : [
                      { date: '01', views: 420, visitors: 280 },
                      { date: '05', views: 680, visitors: 450 },
                      { date: '10', views: 920, visitors: 580 },
                      { date: '15', views: 1150, visitors: 790 },
                      { date: '20', views: 890, visitors: 610 },
                      { date: '25', views: 1340, visitors: 890 },
                      { date: '30', views: 1520, visitors: 980 },
                    ]
              }
            >
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B69B63" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B69B63" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  borderColor: '#333',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#B69B63"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#viewsGrad)"
                name="Page Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split Charts: Top Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visited Pages */}
        <div className="bg-[#161616] border border-[#262626] p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Top Visited Pages</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data.topPages}
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis type="number" stroke="#666" fontSize={11} />
                <YAxis dataKey="path" type="category" stroke="#888" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderColor: '#333',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="views" fill="#B69B63" radius={[0, 4, 4, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Channels Breakdown */}
        <div className="bg-[#161616] border border-[#262626] p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Traffic Acquisition Channels</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.trafficSources}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {data.trafficSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderColor: '#333',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-neutral-400">
            {data.trafficSources.map((item, idx) => (
              <span key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span>
                  {item.name} ({item.percentage}%)
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
