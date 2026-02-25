import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-lime-500/10 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-lime-400" />
            </div>
          )}
          
          <div 
            className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-lime-500 text-black ml-auto rounded-tr-sm' 
                : 'bg-gray-900 text-gray-100 mr-auto rounded-tl-sm border border-gray-800'
            }`}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={dracula}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>

          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      ))}
      
      {loading && (
        <div className="flex gap-4 justify-start animate-pulse">
           <div className="w-8 h-8 rounded-full bg-lime-500/10 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-lime-400" />
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl rounded-tl-sm border border-gray-800 w-24 h-10 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
