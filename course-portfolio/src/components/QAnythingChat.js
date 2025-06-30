'use client';

import { useState, useEffect, useRef } from 'react';

export default function QAnythingChat() {
  const [messages, setMessages] = useState([
    { type: 'bot', content: '你好！我是QAnything知识库助手。请问有什么可以帮助你？', references: [] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef(null);
  const messageEndRef = useRef(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // 添加用户消息到聊天历史
    const userMessage = { type: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    
    // 清空输入框并设置加载状态
    setInputValue('');
    setIsLoading(true);
    
    // 添加"正在思考"的临时消息
    const thinkingMessageId = Date.now();
    setMessages(prev => [...prev, { 
      id: thinkingMessageId,
      type: 'bot', 
      content: '...', 
      isThinking: true,
      references: []
    }]);
    
    try {
      // 准备聊天历史记录 - 不包括"正在思考"的消息
      const chatHistory = messages
        .filter(msg => !msg.isThinking)
        .map(msg => ({
          type: msg.type,
          content: msg.content
        }));
      
      // 调用API获取回答
      const response = await fetch('/api/qanything', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          chatHistory: chatHistory,
          stream: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      
      // 处理流式响应
      if (response.headers.get('Content-Type')?.includes('text/event-stream')) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialData = '';
        
        // 更新临时消息为首个流式响应
        let isFirstChunk = true;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // 解码数据并处理SSE格式
          const chunk = decoder.decode(value);
          partialData += chunk;
          
          // 处理可能的多行数据
          const lines = partialData.split('\n\n');
          partialData = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                
                // 检查是否有错误
                if (eventData.error) {
                  throw new Error(eventData.error);
                }
                
                if (isFirstChunk) {
                  // 更新"正在思考"消息
                  setMessages(prev => prev.map(msg => 
                    msg.id === thinkingMessageId 
                      ? { ...msg, content: eventData.answer, isThinking: false, references: eventData.references || [] } 
                      : msg
                  ));
                  isFirstChunk = false;
                } else {
                  // 更新最新的机器人消息
                  setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1
                      ? { ...msg, content: eventData.answer, references: eventData.references || [] }
                      : msg
                  ));
                }
                
                // 如果收到完成信号，结束加载状态
                if (eventData.done) {
                  setIsLoading(false);
                }
              } catch (e) {
                console.error('解析SSE数据失败:', e);
                
                // 更新为错误消息
                setMessages(prev => prev.map(msg => 
                  msg.id === thinkingMessageId 
                    ? { 
                        ...msg, 
                        content: `抱歉，我遇到了一些问题: ${e.message}。请稍后再试或尝试其他问题。`,
                        isThinking: false,
                        isError: true,
                        references: []
                      } 
                    : msg
                ));
                
                setIsLoading(false);
              }
            }
          }
        }
      } else {
        // 处理非流式响应
        const data = await response.json();
        
        // 检查是否有错误
        if (data.error) {
          throw new Error(data.error);
        }
        
        // 更新"正在思考"消息
        setMessages(prev => prev.map(msg => 
          msg.id === thinkingMessageId 
            ? { ...msg, content: data.answer, isThinking: false, references: data.references || [] } 
            : msg
        ));
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('与QAnything通信时发生错误:', error);
      
      // 更新为错误消息
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMessageId 
          ? { 
              ...msg, 
              content: `抱歉，我遇到了一些问题: ${error.message}。请稍后再试或尝试其他问题。`,
              isThinking: false,
              isError: true,
              references: []
            } 
          : msg
      ));
      
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清除聊天历史
  const handleClearChat = () => {
    setMessages([
      { type: 'bot', content: '你好！我是QAnything知识库助手。请问有什么可以帮助你？', references: [] }
    ]);
  };

  // 渲染引用来源
  const renderReferences = (references) => {
    if (!references || references.length === 0) return null;
    
    return (
      <div className="references">
        <div className="text-xs text-gray-500 mb-1">来源引用:</div>
        {references.map((ref, index) => (
          <div key={index} className="reference-item">
            <div className="reference-title">{ref.title}</div>
            <div className="reference-content">{ref.content}</div>
            <div className="reference-score">相关度: {Math.round(ref.score * 100)}%</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>QAnything 知识库问答</span>
        <button 
          onClick={handleClearChat}
          className="clear-chat-btn"
          title="清除聊天记录"
        >
          ↺
        </button>
      </div>
      
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.type}-message ${message.isThinking ? 'thinking' : ''} ${message.isError ? 'error-message' : ''}`}
          >
            {message.content}
            {message.type === 'bot' && renderReferences(message.references)}
            {index === messages.length - 1 && <div ref={messageEndRef} />}
          </div>
        ))}
      </div>
      
      <div className="chat-input-area">
        <input
          type="text"
          className="user-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="在这里输入你的问题..."
          disabled={isLoading}
        />
        <button 
          className="send-btn"
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 
            <span className="loading-spinner"></span> : 
            <span className="send-icon">➤</span>
          }
        </button>
      </div>
    </div>
  );
}