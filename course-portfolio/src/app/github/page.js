"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GitHubRepoCreator from '@/components/GitHubRepoCreator';
import dynamic from 'next/dynamic';

// 动态导入背景组件以避免SSR问题
const KaleidoscopeBackground = dynamic(
  () => import('@/components/KaleidoscopeBackground'),
  { ssr: false }
);

export default function GitHubPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('my041111');
  const [searchTerm, setSearchTerm] = useState('');
  const [commitHistory, setCommitHistory] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showCommits, setShowCommits] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // browse, create, commit

  // 获取用户仓库列表
  const fetchUserRepos = async (user) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=10`);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`GitHub API 限流错误: 请稍后再试或使用访问令牌`);
        } else if (response.status === 404) {
          throw new Error(`用户 ${user} 不存在或没有公开仓库`);
        } else {
          throw new Error(`GitHub API 错误: ${response.status}`);
        }
      }
      
      const data = await response.json();
      setRepos(data);
    } catch (err) {
      console.error('获取仓库失败:', err);
      setError(err.message);
      // 清空仓库列表，避免显示旧数据
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  // 自动加载用户仓库
  useEffect(() => {
    fetchUserRepos(username);
  }, []);

  // 获取仓库的提交历史
  const fetchCommitHistory = async (repoName) => {
    if (!username || !repoName) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=10`);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`GitHub API 限流错误: 请稍后再试或使用访问令牌`);
        } else if (response.status === 404) {
          throw new Error(`仓库 ${username}/${repoName} 不存在或无法访问`);
        } else {
          throw new Error(`GitHub API 错误: ${response.status}`);
        }
      }
      
      const data = await response.json();
      setCommitHistory(data);
      setShowCommits(true);
    } catch (err) {
      console.error('获取提交历史失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUserRepos(username);
    setShowCommits(false);
    setSelectedRepo(null);
  };

  // 处理仓库点击
  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
    fetchCommitHistory(repo.name);
  };

  // 处理仓库创建成功
  const handleRepoCreated = (repo) => {
    // 如果用户名与创建的仓库所有者匹配，刷新仓库列表
    if (username && repo.owner && username.toLowerCase() === repo.owner.login.toLowerCase()) {
      fetchUserRepos(username);
    }
    // 切换到浏览标签
    setActiveTab('browse');
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 动态背景 */}
      <KaleidoscopeBackground opacity={0.3} />
      
      <div className="bg-white bg-opacity-80 shadow-sm backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">GitHub 仓库管理 - my041111</h1>
            <div className="flex space-x-2">
              <Link 
                href="/"
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 ${activeTab === 'browse' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-lg transition`}
            >
              浏览仓库
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-lg transition`}
            >
              创建仓库
            </button>
          </div>
        </div>
        
        {activeTab === 'browse' && (
          <div className="bg-white bg-opacity-90 rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6 mb-4 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">查看 GitHub 仓库</h2>
            
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">GitHub 用户名</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入 GitHub 用户名"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="self-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-6"
                  >
                    查询
                  </button>
                </div>
              </div>
            </form>
            
            {error && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-medium">{error}</p>
                {error.includes('限流错误') && (
                  <p className="mt-2 text-sm">
                    GitHub API 有请求限制。未认证用户每小时限制60次请求。
                    请稍后再试或在"创建仓库"标签中添加访问令牌以提高限制。
                  </p>
                )}
              </div>
            )}
            
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {!loading && repos.length > 0 && (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="搜索仓库..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {repos
                    .filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(repo => (
                      <div 
                        key={repo.id}
                        className={`border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedRepo && selectedRepo.id === repo.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}
                        onClick={() => handleRepoClick(repo)}
                      >
                        <h3 className="text-lg font-semibold text-blue-600">{repo.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{repo.description || '无描述'}</p>
                        <div className="flex items-center mt-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.3 8.3a1 1 0 011.4-1.4L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4z" clipRule="evenodd" />
                            </svg>
                            更新于 {formatDate(repo.updated_at)}
                          </span>
                          <span className="flex items-center ml-4">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582a1 1 0 00-.62.919v4.352a1 1 0 00.62.919l3.954 1.582V15a1 1 0 002 0v-1.323l3.954-1.582a1 1 0 00.62-.919V6.824a1 1 0 00-.62-.919L11 4.323V3a1 1 0 00-1-1zm0 2.618l3.79 1.516v3.732L10 11.382V4.618zM8 11.382L4.21 9.866V6.134L8 4.618v6.764z" clipRule="evenodd" />
                            </svg>
                            {repo.language || 'N/A'}
                          </span>
                          <span className="flex items-center ml-4">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                            </svg>
                            {repo.visibility}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {!loading && repos.length === 0 && !error && (
              <div className="text-center py-8 text-gray-500">
                <p>无可用仓库</p>
              </div>
            )}
            
            {showCommits && selectedRepo && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">
                  <span className="text-blue-600">{selectedRepo.name}</span> 最近提交历史
                </h3>
                
                {commitHistory.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交信息</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {commitHistory.map(commit => (
                            <tr key={commit.sha} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <a 
                                  href={commit.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {commit.commit.message.split('\n')[0].substring(0, 60)}{commit.commit.message.length > 60 ? '...' : ''}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {commit.author ? commit.author.login : commit.commit.author.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(commit.commit.author.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>无提交历史</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'create' && (
          <GitHubRepoCreator onRepoCreated={handleRepoCreated} />
        )}
      </div>
      
      <footer className="bg-white bg-opacity-80 border-t border-gray-200 py-4 mt-auto backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>GitHub API 集成 | <a href="https://docs.github.com/cn/rest" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub REST API 文档</a></p>
        </div>
      </footer>
    </div>
  );
}