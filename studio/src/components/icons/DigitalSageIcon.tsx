"use client";

import { User, ThumbsUp, ThumbsDown, FileText, Bot } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types/chat';
import { DPISageLogo } from '@/components/DPISageLogo';

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
}

const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  const elements = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1">
          {listItems.map((item, index) => (
            <li key={`li-${index}`}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      listItems.push(trimmedLine.substring(2));
    } else {
      flushList();
      elements.push(
        <p key={`p-${i}`} className={line.trim() === '' ? 'h-4' : ''}>
          {line}
        </p>
      );
    }
  }

  flushList(); // Add any remaining list items

  return <div className="whitespace-pre-wrap">{elements}</div>;
};


export default function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isAssistant = message.sender === 'assistant';

  const renderContent = () => {
    if (message.error) {
      return <p className="text-red-500">{message.error}</p>;
    }
    if (isAssistant) {
      return (
        <div className="space-y-4">
          {message.answer && renderFormattedText(message.answer)}
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
              {message.reasoning && <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{message.reasoning}</p>}
            </div>
          )}
        </div>
      );
    }
    return <p>{message.text}</p>;
  };

  return (
    <div className={`flex items-start space-x-4 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant && (
        <Avatar>
          <AvatarFallback><DPISageLogo size={28} /></AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-2xl ${isAssistant ? '' : 'text-right'}`}>
        <Card className={`rounded-2xl text-left ${isAssistant ? 'bg-white' : 'bg-primary text-primary-foreground'}`}>
          <CardContent className="p-4">
            {renderContent()}
          </CardContent>
          {isAssistant && !message.error && (
            <CardFooter className="p-2 border-t flex justify-between items-center">
              {message.sources && message.sources.length > 0 && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">
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
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onFeedback(message.id, 'up')} disabled={!!message.feedback}>
                  <ThumbsUp className={`h-4 w-4 ${message.feedback === 'up' ? 'text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onFeedback(message.id, 'down')} disabled={!!message.feedback}>
                  <ThumbsDown className={`h-4 w-4 ${message.feedback === 'down' ? 'text-primary' : ''}`} />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      {!isAssistant && (
        <Avatar>
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}