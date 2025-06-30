"use client";

import { useState } from 'react';

export default function GitHubRepoCreator({ onRepoCreated }) {
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTokenInput, setShowTokenInput] = useState(false);

  // 创建GitHub仓库
  const createRepo = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setShowTokenInput(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`
        },
        body: JSON.stringify({
          name: repoName,
          description: description,
          private: isPrivate,
          auto_init: true
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `GitHub API 错误: ${response.status}`);
      }
      
      setSuccess(`仓库 ${data.full_name} 创建成功！`);
      setRepoName('');
      setDescription('');
      
      // 通知父组件
      if (onRepoCreated) {
        onRepoCreated(data);
      }
    } catch (err) {
      console.error('创建仓库失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <h2 className="text-xl font-bold mb-4">创建新仓库 - my041111</h2>
      
      {showTokenInput && !token ? (
        <div className="mb-6">
          <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <p className="mb-2"><strong>需要 GitHub 个人访问令牌</strong></p>
            <p className="text-sm">要创建仓库，您需要提供一个具有 <code>repo</code> 权限的个人访问令牌。</p>
            <p className="text-sm mt-1">
              <a 
                href="https://github.com/settings/tokens/new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                点击这里生成新的令牌
              </a>
            </p>
          </div>
          
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">GitHub 个人访问令牌</label>
          <input
            type="password"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="输入您的个人访问令牌"
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowTokenInput(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg py-2 px-4 mr-2"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => token && setShowTokenInput(false)}
              disabled={!token}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              确认
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={createRepo}>
          <div className="mb-4">
            <label htmlFor="repoName" className="block text-sm font-medium text-gray-700 mb-1">仓库名称 *</label>
            <input
              type="text"
              id="repoName"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="my041111-project"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="my041111 的项目描述（可选）"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                私有仓库
              </label>
            </div>
          </div>
          
          {token && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                使用已保存的访问令牌
              </div>
              <button
                type="button"
                onClick={() => {
                  setToken('');
                  setShowTokenInput(true);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                更改令牌
              </button>
            </div>
          )}
          
          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <p>{success}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !repoName}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-6 ${(loading || !repoName) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '创建中...' : '创建仓库'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}