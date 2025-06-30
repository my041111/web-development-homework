import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import WakaTimeFooter from '@/components/WakaTimeFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '课程项目展示',
  description: 'HTML、CSS、JavaScript、React和Next.js课程项目展示',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold hover:text-blue-200 transition-colors">课程项目展示</Link>
                </div>
                <div className="ml-10 flex items-center space-x-8">
                  <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                    首页
                  </Link>
                  <Link href="/exercises" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                    练习展示
                  </Link>
                  <Link href="/qanything" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                    QAnything
                  </Link>
                  <Link href="/wakatime" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                    WakaTime统计
                  </Link>
                  <Link href="/github" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                    GitHub仓库
                  </Link>
                  <Link href="/readme" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                    项目文档
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        
        <div className="flex flex-col min-h-screen bg-gray-50">
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm">© 2025 课程项目展示</p>
                </div>
                <WakaTimeFooter />
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}