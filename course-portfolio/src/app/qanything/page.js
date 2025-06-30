"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import QAnythingChat from '@/components/QAnythingChat';
import Script from 'next/script';

// 动态导入背景组件以避免SSR问题
const KaleidoscopeBackground = dynamic(
  () => import('@/components/KaleidoscopeBackground'),
  { ssr: false }
);

// 导入CSS样式
import './qanything-chat.css';

export default function QAnythingPage() {
  const [showIframe, setShowIframe] = useState(false);
  
  // 动态加载QAnything脚本
  useEffect(() => {
    // 清理函数，移除之前可能存在的脚本
    const cleanup = () => {
      const existingScript = document.getElementById('qanything-iframe-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
    
    // 如果不使用iframe嵌入模式，则清理脚本
    if (!showIframe) {
      cleanup();
    }
    
    return cleanup; // 组件卸载时清理
  }, [showIframe]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 动态背景 */}
      <KaleidoscopeBackground opacity={0.3} />
      
      <div className="bg-white bg-opacity-80 shadow-sm backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">QAnything 知识库问答</h1>
            <div className="flex space-x-2">
              <Link 
                href="/"
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                返回首页
              </Link>
              <button
                onClick={() => setShowIframe(!showIframe)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                {showIframe ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    使用进阶路径
                  </>
                ) : (
                  <>
                    使用基础路径
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
          </div>
      
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">QAnything 知识库问答系统</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">当前模式:</span>
              <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {showIframe ? '基础路径' : '进阶路径'}
              </span>
            </div>
          </div>
          <p className="mb-6 text-gray-600">
            {showIframe 
              ? '下方是QAnything基础路径界面，您可以直接在此与知识库进行对话。' 
              : '下方是QAnything进阶路径界面，通过调用QAnything API实现，您可以直接在此与知识库进行对话。'}
          </p>
          
          {showIframe ? (
            // 基础路径界面 - 直接嵌入iframe
            <div className="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden">
              <iframe 
                src="https://ai.youdao.com/saas/qanything/#/bots/0EB21221BF754E5B/share"
                className="w-full h-full"
                allow="microphone"
                title="QAnything 对话框"
              />
            </div>
          ) : (
            // 进阶路径界面
            <QAnythingChat />
          )}
        </div>
      </div>
      
      <footer className="bg-white bg-opacity-80 border-t border-gray-200 py-4 mt-auto backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>QAnything API 集成 | <a href="https://github.com/netease-youdao/QAnything" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub 仓库</a></p>
        </div>
      </footer>
    </div>
  );
}