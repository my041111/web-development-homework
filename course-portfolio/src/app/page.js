'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 动态导入背景组件以避免SSR问题
const KaleidoscopeBackground = dynamic(
  () => import('@/components/KaleidoscopeBackground'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* 动态背景 */}
      <KaleidoscopeBackground opacity={0.2} />
      
      <section className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-4xl w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-6 text-center">课程作品集</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/exercises" className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">练习作品</h2>
              <p className="text-gray-700">查看本课程中完成的各种练习和实验性项目。</p>
            </Link>
            
            <Link href="/wakatime" className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <h2 className="text-xl font-semibold mb-2 text-green-800">WakaTime 统计</h2>
              <p className="text-gray-700">查看编码时间统计和编程语言使用情况。</p>
            </Link>
            
            <Link href="/github" className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h2 className="text-xl font-semibold mb-2 text-purple-800">GitHub 集成</h2>
              <p className="text-gray-700">查看与GitHub相关的项目和代码仓库。</p>
            </Link>
            
            <Link href="/qanything" className="block p-6 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              <h2 className="text-xl font-semibold mb-2 text-amber-800">QAnything 知识库</h2>
              <p className="text-gray-700">使用智能问答系统探索课程知识库。</p>
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="p-4 text-center text-gray-600 bg-white bg-opacity-80 backdrop-blur-sm">
        <p>课程作品集 &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}