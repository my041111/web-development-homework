"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WakaTimeFooter() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchWakaTimeData = async () => {
      try {
        setLoading(true);
        // 获取最近30天的数据
        const response = await fetch('/api/wakatime?range=last_30_days&use_backup=true');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.data) {
          const wakaData = data.data;
          setStats(wakaData);

          // 提取前4种编程语言
          if (wakaData.languages && wakaData.languages.length > 0) {
            setLanguages(wakaData.languages.slice(0, 4));
          }
          
          setError(null);
        } else {
          throw new Error('API返回的数据格式不正确');
        }
      } catch (err) {
        console.error('WakaTime API错误:', err);
        setError('获取WakaTime数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchWakaTimeData();
  }, []);

  // 计算语言使用百分比的颜色
  const getLanguageColor = (name) => {
    const colors = {
      'JavaScript': 'bg-yellow-400',
      'HTML': 'bg-red-500',
      'CSS': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-orange-500',
      'C++': 'bg-purple-500',
      'PHP': 'bg-indigo-500',
    };
    
    return colors[name] || 'bg-gray-500';
  };

  return (
    <div className="mt-4">
      <Link href="/wakatime" className="text-sm text-blue-500 hover:text-blue-700 flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        查看完整编程统计
      </Link>
      
      <div className="flex flex-wrap items-center space-x-2">
        <span className="text-sm font-medium">编程语言分布:</span>
        
        {loading ? (
          <div className="text-sm">
            <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
            <span className="ml-1">加载中...</span>
          </div>
            ) : error ? (
          <span className="text-sm text-red-300">{error}</span>
        ) : languages.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center" title={`${lang.name}: ${lang.text}`}>
                <div className={`h-3 w-3 rounded-full ${getLanguageColor(lang.name)}`}></div>
                <span className="ml-1 text-xs">{lang.name} {Math.round(lang.percent)}%</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      
      {stats && (
        <div className="mt-2 text-xs text-gray-400">
          总编码时间: {stats.human_readable_total} | 日均: {stats.daily_average || '计算中...'}
        </div>
      )}
      </div>
  );
}