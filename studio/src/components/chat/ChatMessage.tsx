
"use client";

import { User, ThumbsUp, ThumbsDown, FileText, Bot, Download } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DPISageLogo } from '@/components/DPISageLogo';

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
}

export default function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isAssistant = message.sender === 'assistant';
  
  // Check if this is a strategy note
  const isStrategyNote = message.answer && (
    message.answer.includes('**Strategy Note:') || 
    message.answer.includes('**Executive Summary**') ||
    message.answer.includes('[Download this strategy note as PDF]') ||
    message.answer.includes('# Strategy Note') ||
    message.answer.includes('## Executive Summary') ||
    message.answer.includes('### Executive Summary') ||
    message.answer.includes('**Problem Statement') ||
    message.answer.includes('**Implementation') ||
    message.answer.includes('**Proposed Strategy') ||
    (message.answer.includes('Strategy') && message.answer.includes('Implementation') && message.answer.length > 1000)
  );
  
  const handleDownloadStrategyNote = () => {
    if (!message.answer) return;
    
    // Extract title from the strategy note with multiple patterns
    let title = 'DPI Strategy Note';
    
    // Try different title patterns
    const titlePatterns = [
      /\*\*Strategy Note: (.*?)\*\*/,
      /# Strategy Note[:\s]*(.+)/,
      /## (.+?Strategy.+?)(?:\n|$)/,
      /### (.+?Strategy.+?)(?:\n|$)/,
      /\*\*(.+?Strategy.+?)\*\*/,
      /# (.+?)(?:\n|$)/
    ];
    
    for (const pattern of titlePatterns) {
      const match = message.answer.match(pattern);
      if (match && match[1]) {
        title = match[1].trim();
        break;
      }
    }
    
    // Convert markdown to plain text for download
    const plainText = message.answer
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[Download this strategy note as PDF\]/g, '') // Remove download prompt
      .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
      .trim();
    
    // Create blob and download
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_strategy_note.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (message.error) {
      return <p className="text-red-500">{message.error}</p>;
    }
    if (isAssistant) {
      return (
        <div className="space-y-4">
          {message.answer && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 underline" {...props} />,
              }}
            >
              {message.answer}
            </ReactMarkdown>
          )}
          {message.suggestedDPIs && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Suggested DPIs:</h4>
              <ul className="space-y-2">
                {message.suggestedDPIs.map((dpi, index) => (
                  <li key={index}>
                    <strong className='text-primary'>{dpi.name}:</strong> {dpi.relevance}
                  </li>
                ))}
              </ul>
              {message.reasoning && (
                <p className="mt-2 text-sm text-gray-600">
                  {message.reasoning}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return <p>{message.text}</p>;
  };

  return (
    <div className={`flex items-start space-x-5 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant && (
        <Avatar className="h-12 w-12">
          <AvatarFallback><DPISageLogo size={40} /></AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-3xl ${isAssistant ? '' : 'text-right'}`}>
        <Card className={`rounded-2xl text-left ${isAssistant ? 'bg-white' : 'text-white'}`} style={isAssistant ? {} : {background: 'linear-gradient(135deg, #4285F4, #1a73e8)'}}>
          <CardContent className="p-6">
            {renderContent()}
          </CardContent>
          {isAssistant && !message.error && (
            <CardFooter className="p-4 border-t flex justify-between items-center">
              {message.sources && message.sources.length > 0 && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <p className="text-base text-muted-foreground">
                    Sources: {message.sources.map((source, i) => {
                      try {
                        const url = new URL(source);
                        return (
                          <a key={i} href={source} target="_blank" rel="noopener noreferrer" className="underline">
                            {url.hostname}
                          </a>
                        );
                      } catch (error) {
                        return (
                          <span key={i} className="underline">
                            {source}
                          </span>
                        );
                      }
                    }).reduce((prev, curr) => <>{prev}, {curr}</>)}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
                {isStrategyNote && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadStrategyNote}
                    className="h-8 px-3 text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFeedback(message.id, 'up')} disabled={!!message.feedback}>
                  <ThumbsUp className={`h-4 w-4 ${message.feedback === 'up' ? 'text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFeedback(message.id, 'down')} disabled={!!message.feedback}>
                  <ThumbsDown className={`h-4 w-4 ${message.feedback === 'down' ? 'text-primary' : ''}`} />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      {!isAssistant && (
        <Avatar className="h-12 w-12">
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
