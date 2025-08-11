
"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowUp, Loader, User, Code, Settings, Briefcase, Flag, Handshake, Bot, Sparkles, HelpCircle, FileText, BarChart, MessageSquare, Wand2, ChevronDown, Zap, Target, Map, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ChatMessage from '@/components/chat/ChatMessage';
import { DPISageLogo } from '@/components/DPISageLogo';
import { QuickActions } from '@/components/QuickActions';
interface ChatResponse {
  id: string;
  sender: "assistant";
  answer?: string;
  sources?: string[];
  suggestedDPIs?: Array<{ name: string; relevance: string }>;
  reasoning?: string;
  error?: string;
  timestamp: number;
}
import type { Message } from '@/types/chat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState('Default');
  const [showPersonaDialog, setShowPersonaDialog] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showDisclaimerDialog, setShowDisclaimerDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const initialQueryRef = useRef(searchParams.get('q'));
  const actionRef = useRef(searchParams.get('action'));

  const personas = [
    {
      id: 'Default',
      name: 'Default Persona',
      icon: User,
      description: 'General purpose assistant for all DPI questions'
    },
    {
      id: 'Technical',
      name: 'Technical',
      icon: Code,
      description: 'Focused on technical implementation and architecture'
    },
    {
      id: 'Program Manager',
      name: 'Program Manager',
      icon: Settings,
      description: 'Strategic planning and project management guidance'
    },
    {
      id: 'Country Bureaucrat',
      name: 'Country Bureaucrat',
      icon: Briefcase,
      description: 'Greenlight projects adapting policy/ regulatory frameworks'
    },
    {
      id: 'Country Leader',
      name: 'Country Leader',
      icon: Flag,
      description: 'Set high level vision and steer strategy'
    },
    {
      id: 'Development Partner',
      name: 'Development Partner',
      icon: Handshake,
      description: 'Fund, advise, and build partnerships'
    }
  ];

  const currentPersona = personas.find(p => p.id === persona) || personas[0];

  useEffect(() => {
    if (initialQueryRef.current) {
      sendMessage(initialQueryRef.current);
      initialQueryRef.current = null; // Ensure it only runs once
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const sendMessage = async (messageText: string, attachedFile?: File, fileContent?: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: messageText,
      timestamp: Date.now(),
    };
    
    // Add user message immediately and set loading state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Pass the new message list to the API, including the user message we just added
      const chatHistoryForApi = [...messages, userMessage].map(m => ({
        sender: m.sender,
        text: m.text || m.answer || '',
      }));

      const response = await fetch('https://us-central1-dpi-sage-2607.cloudfunctions.net/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          chatHistoryArray: chatHistoryForApi,
          persona: persona,
          attachedFileName: attachedFile?.name,
          attachedFileContent: fileContent,
          action: actionRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const responseData: ChatResponse = await response.json();
      const assistantMessage: Message = {
        ...responseData,
      };
      setMessages(prev => [...prev, assistantMessage]);
      // Clear action after use
      actionRef.current = null;
    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        error: `An error occurred: ${error.message}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, feedback: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback } : m));
    
    try {
      await fetch('https://us-central1-dpi-sage-2607.cloudfunctions.net/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          feedback,
        }),
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input, uploadedFile || undefined);
    setInput('');
    setUploadedFile(null);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleQuickAction = async (action: string, data: any) => {
    // Only proceed if we have messages in the conversation
    if (messages.length === 0 && action !== 'upload-strategy') {
      alert('Please start a conversation first before using this action.');
      return;
    }
    
    // Handle file upload for strategy analysis
    if (action === 'upload-strategy' && data.file) {
      setUploadedFile(data.file);
      const message = `I've uploaded a strategy document "${data.file.name}". Please analyze it to identify DPI quick wins and long-term projects.`;
      // Pass file content if available
      sendMessage(message, data.file, data.fileContent);
    } else if (action === 'draft-email') {
      const message = `Please draft an email to ${data.recipients} with subject "${data.subject}" summarizing our conversation's key ideas and learnings.`;
      sendMessage(message);
    } else if (action === 'create-strategy-note') {
      // Check if there's enough conversation content
      const conversationLength = messages.length;
      const conversationText = messages.map(m => m.text || m.answer || '').join(' ');
      
      if (conversationLength < 3 || conversationText.length < 200) {
        alert('I need more context from our conversation to create a meaningful strategy note. Please have a more detailed discussion about your DPI needs, challenges, and goals first.');
        return;
      }
      
      const message = `Please create a strategy note titled "${data.title}" based on our conversation.`;
      sendMessage(message);
    }
    setShowQuickActions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 20%, #dbeafe 40%, #bfdbfe 60%, #93c5fd 80%, #7dd3fc 100%)'}}>
        <div className="flex-1 flex flex-col">
          <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/')}
            >
              <DPISageLogo size={48} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DPI Sage</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-9 px-3 bg-white hover:bg-gray-50 border-gray-200 flex items-center gap-2"
                onClick={() => setShowPersonaDialog(true)}
              >
                <currentPersona.icon className="h-4 w-4" />
                {currentPersona.name}
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                className="h-9 px-3 bg-white hover:bg-gray-50 border-gray-200"
                onClick={() => {
                  setMessages([]);
                  setInput('');
                  setShowQuickActions(false);
                }}
              >
                New Chat
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-gray-100"
                onClick={() => setShowDisclaimerDialog(true)}
              >
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </header>

        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-full max-w-3xl space-y-8">
                <div className="text-center mb-12">
                  <DPISageLogo size={96} className="text-blue-600 mx-auto mb-6" />
                  <h1 className="text-5xl font-bold mb-3 text-gray-900">DPI Sage</h1>
                  <p className="text-lg text-gray-600">Your intelligent guide to Digital Public Infrastructure</p>
                </div>
                
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      className="w-full min-h-[56px] max-h-32 pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-2xl resize-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoading}
                      rows={1}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      disabled={isLoading || !input.trim()}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </div>
                </form>

                <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg mx-auto">
                  <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 text-center shadow-sm">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-800 leading-tight">Draft a sample schema</h3>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 text-center shadow-sm">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-800 leading-tight">Identify DPI wins from national strategy</h3>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 text-center shadow-sm">
                    <Map className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-800 leading-tight">Identify use cases</h3>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 text-center shadow-sm">
                    <BarChart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-800 leading-tight">Implementation roadmap</h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map(msg => (
                  <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <Card className="flex-1">
                      <CardContent className="p-4">
                        <Loader className="h-5 w-5 animate-spin" />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </main>



        {messages.length > 0 && (
          <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto space-y-3">
              {showQuickActions && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuickActions(false)}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                  <QuickActions 
                    onActionTrigger={handleQuickAction} 
                    conversationContext={messages.map(m => m.text || m.answer || '').join('\n')}
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                >
                  <Zap className="h-5 w-5" />
                </Button>
                
                <form onSubmit={handleSubmit} className="flex-1">
                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Message DPI Sage..."
                      className="w-full min-h-[56px] max-h-32 pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-2xl resize-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoading}
                      rows={1}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      disabled={isLoading || !input.trim()}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </footer>
        )}
        </div>
      </div>

      {/* Persona Selection Dialog */}
      <Dialog open={showPersonaDialog} onOpenChange={setShowPersonaDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Persona</DialogTitle>
            <DialogDescription>
              Choose a persona to customize how DPI Sage responds to your questions
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {personas.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPersona(p.id);
                    setShowPersonaDialog(false);
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    persona === p.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{p.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimerDialog} onOpenChange={setShowDisclaimerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Important Disclaimers & Contact Information</DialogTitle>
            <DialogDescription className="text-left space-y-4 mt-4">
              <div className="space-y-3">
                <p className="text-sm">• This conversation is not recorded or stored anywhere</p>
                <p className="text-sm">• These are only initial responses from an AI-based assistant designed to bridge information asymmetry and shorten time to action. This is in no way a complete replacement for human advice. Please cross-check any advice/recommendations with the Centre for DPI team.</p>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3">Reach out to CDPI regional teams:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Manuel</strong> - Latin America and the Caribbean team: <a href="mailto:manuel@cdpi.dev" className="text-blue-600 hover:underline">manuel@cdpi.dev</a></p>
                    <p><strong>Lina</strong> - African team: <a href="mailto:lina@cdpi.dev" className="text-blue-600 hover:underline">lina@cdpi.dev</a></p>
                    <p><strong>Vineet</strong> - Asia team: <a href="mailto:vineet@cdpi.dev" className="text-blue-600 hover:underline">vineet@cdpi.dev</a></p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </TooltipProvider>
  );
}


export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPage />
    </Suspense>
  )
}
