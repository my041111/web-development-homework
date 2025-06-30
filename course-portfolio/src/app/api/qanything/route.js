import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 备用模拟响应函数 - 仅在API调用失败时使用
function generateMockResponse(question) {
  // 简单的关键词匹配
  const keywords = {
    '什么是QAnything': {
      answer: 'QAnything是由网易有道开发的一个本地知识库问答系统，支持多种文件格式，允许离线安装和使用。它可以帮助用户快速准确地从本地文档中获取信息。',
      references: [
        {
          title: 'QAnything GitHub 文档',
          content: 'QAnything(Question and Answer based on Anything)是一个本地知识库问答系统，支持多种文件格式和数据库，允许离线安装和使用。',
          score: 0.95
        }
      ]
    },
    '支持哪些文件格式': {
      answer: 'QAnything目前支持多种文件格式，包括PDF、Word、PPT、Excel、Markdown、Email、TXT、图片(JPG、JPEG、PNG)、CSV以及网页链接(HTML)等。未来还将支持更多格式。',
      references: [
        {
          title: '支持的文件格式',
          content: '目前支持的格式包括: PDF(pdf), Word(docx), PPT(pptx), XLS(xlsx), Markdown(md), Email(eml), TXT(txt), 图片(jpg，jpeg，png), CSV(csv), 网页链接(html)等。',
          score: 0.92
        }
      ]
    },
    '如何安装': {
      answer: 'QAnything支持多种安装方式，包括Docker安装、本地安装和离线安装。最简单的方式是使用Docker，只需几行命令即可完成。详细安装步骤可以参考GitHub文档。',
      references: [
        {
          title: '安装指南',
          content: 'QAnything支持Docker安装、本地安装和离线安装。Docker安装是最简单的方式，只需几行命令即可完成。',
          score: 0.89
        },
        {
          title: 'Docker安装步骤',
          content: '使用Docker安装QAnything，首先需要安装Docker和Docker Compose，然后克隆仓库并运行启动脚本。',
          score: 0.85
        }
      ]
    },
    '系统要求': {
      answer: 'QAnything的系统要求取决于您使用的模型。基本要求包括：至少8GB内存（推荐16GB以上），支持CUDA的GPU（推荐至少8GB显存），以及足够的磁盘空间存储模型和索引。',
      references: [
        {
          title: '系统要求',
          content: 'QAnything的系统要求取决于使用的模型。基本要求包括：至少8GB内存（推荐16GB以上），支持CUDA的GPU（推荐至少8GB显存）。',
          score: 0.91
        }
      ]
    },
    '如何使用': {
      answer: '使用QAnything的基本流程是：1) 安装并启动服务；2) 上传文档到知识库；3) 等待索引构建完成；4) 通过Web界面或API进行提问。您可以通过Web界面上传文档，也可以使用API接口进行批量操作。',
      references: [
        {
          title: '使用指南',
          content: 'QAnything使用流程：安装并启动服务 -> 上传文档到知识库 -> 等待索引构建完成 -> 通过Web界面或API进行提问。',
          score: 0.94
        },
        {
          title: 'API使用方法',
          content: 'QAnything提供了丰富的API接口，可以通过API上传文档、管理知识库、进行问答等操作。',
          score: 0.87
        }
      ]
    },
    '支持哪些语言': {
      answer: 'QAnything支持多种语言的问答，包括中文、英文、日文、韩文等。系统会自动检测文档和问题的语言，并提供相应的回答。',
      references: [
        {
          title: '语言支持',
          content: 'QAnything支持多语言问答，包括但不限于中文、英文、日文、韩文等。',
          score: 0.90
        }
      ]
    },
    '有哪些特点': {
      answer: 'QAnything的主要特点包括：1) 支持多种文件格式；2) 提供精准的引用和来源；3) 支持私有化部署，保护数据安全；4) 支持多种语言；5) 提供Web界面和API接口；6) 支持文档OCR和图像理解；7) 可离线使用，不依赖外部服务。',
      references: [
        {
          title: 'QAnything特点',
          content: 'QAnything主要特点：支持多种文件格式、提供精准引用、支持私有化部署、多语言支持、Web界面和API接口、文档OCR和图像理解、离线使用。',
          score: 0.96
        }
      ]
    },
    '如何集成到我的应用': {
      answer: 'QAnything提供了完整的API接口，可以轻松集成到您的应用中。您可以使用RESTful API进行知识库管理、文档上传和问答交互。详细的API文档可以在GitHub仓库中找到。集成时需要注意身份验证和错误处理。',
      references: [
        {
          title: 'API集成指南',
          content: 'QAnything提供RESTful API接口，支持知识库管理、文档上传和问答交互，可以轻松集成到各种应用中。',
          score: 0.93
        },
        {
          title: 'API文档',
          content: '详细的API文档可以在GitHub仓库中找到，包括各种接口的使用方法、参数说明和返回值格式。',
          score: 0.88
        }
      ]
    },
    '开源许可': {
      answer: 'QAnything是一个开源项目，采用Apache 2.0许可证。这意味着您可以自由使用、修改和分发QAnything，包括商业用途。但需要遵守Apache 2.0许可证的条款，包括保留版权声明和免责声明。',
      references: [
        {
          title: '许可证信息',
          content: 'QAnything采用Apache 2.0许可证，允许自由使用、修改和分发，包括商业用途。',
          score: 0.92
        }
      ]
    }
  };

  // 进行模糊匹配
  for (const [key, response] of Object.entries(keywords)) {
    // 将问题和关键词都转为小写进行比较
    const lowerQuestion = question.toLowerCase();
    const lowerKey = key.toLowerCase();
    
    if (lowerQuestion.includes(lowerKey)) {
      return response;
    }
  }

  // 默认回复
  return {
    answer: `这是一个模拟回答。您的问题是: "${question}"。由于API调用失败，我们无法获取真实回答。这是一个本地生成的模拟响应，仅用于演示目的。\n\n您可以尝试问一些关于QAnything的问题，例如"什么是QAnything"、"支持哪些文件格式"、"如何安装"等。`,
    references: [
      {
        title: 'QAnything GitHub 仓库',
        content: '请访问 https://github.com/netease-youdao/QAnything 获取更多信息',
        score: 0.8
      }
    ]
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { question, chatHistory = [], stream = false } = body;
    
    if (!question) {
      return NextResponse.json(
        { error: '请提供问题' },
        { status: 400 }
      );
    }
    
    // 记录请求信息，便于调试
    console.log(`QAnything API请求: ${question} (stream=${stream})`);
    
    // 示例API密钥（不是真实密钥）
    const apiKey = "sk-example-api-key";
    
    try {
      // 由于这是一个演示，我们使用模拟响应
      console.log("使用模拟响应...");
      const mockResponse = generateMockResponse(question);
      
      if (stream) {
        // 流式响应处理
        const encoder = new TextEncoder();
        const customReadable = new ReadableStream({
          async start(controller) {
            try {
              // 模拟流式输出
              const answer = mockResponse.answer;
              const references = mockResponse.references;
              
              // 按字符缓慢发送响应
              let sentAnswer = '';
              for (let i = 0; i < answer.length; i += 5) {
                await new Promise(r => setTimeout(r, 50)); // 每50ms发送一批
                const chunk = answer.substring(i, i + 5);
                sentAnswer += chunk;
                
                // 发送SSE格式的数据
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  answer: sentAnswer,
                  references: references
                })}\n\n`));
              }
              
              // 发送完成信号
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                answer: sentAnswer,
                references: references,
                done: true
              })}\n\n`));
              
              controller.close();
            } catch (error) {
              console.error("流式响应处理错误:", error);
              controller.error(error);
            }
          }
        });
        
        return new Response(customReadable, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      } else {
        // 非流式响应
        return NextResponse.json(mockResponse);
      }
    } catch (apiError) {
      console.error("API调用失败:", apiError);
      
      // 使用模拟响应作为备份
      const mockResponse = generateMockResponse(question);
      
      // 根据请求类型返回响应
      if (stream) {
        const encoder = new TextEncoder();
        const customReadable = new ReadableStream({
          async start(controller) {
            try {
              const answer = mockResponse.answer;
              const references = mockResponse.references;
              
              let sentAnswer = '';
              for (let i = 0; i < answer.length; i += 5) {
                await new Promise(r => setTimeout(r, 50));
                const chunk = answer.substring(i, i + 5);
                sentAnswer += chunk;
                
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  answer: sentAnswer,
                  references: references
                })}\n\n`));
              }
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                answer: sentAnswer,
                references: references,
                done: true
              })}\n\n`));
              
              controller.close();
            } catch (error) {
              console.error("流式响应处理错误:", error);
              controller.error(error);
            }
          }
        });
        
        return new Response(customReadable, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      } else {
        return NextResponse.json(mockResponse);
      }
    }
  } catch (error) {
    console.error("请求处理错误:", error);
    return NextResponse.json(
      { error: '请求处理失败', message: error.message },
      { status: 500 }
    );
  }
}