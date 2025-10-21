
"use client";

import { ArrowRight, BookOpen, PlaySquare, FileText, Globe, Sparkles, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { DPISageLogo } from '@/components/DPISageLogo';
import { QuickActions } from '@/components/QuickActions';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const suggestedQuestions = [
    "Does DPI mean open source?",
    "How much does it cost to implement DPI?",
    "Where do I even start?",
    "How can DPI help with financial inclusion?",
    "What are some examples of successful DPIs?",
    "Give an example technical scope for a DPI implementation",
    "How do I get funding for DPI?",
    "How do I identify the right DPI in my country?",
    "Do I need all ministries' buy-in and a roadmap to start?",
    "We don't have digital ID, can we still do social benefits DPI?",
    "DPI x AI?",
    "Should I implement an API Gateway or X-road in my country?"
  ];
  
  const handleSuggestedQuestion = (question: string) => {
    if (user) {
      router.push(`/chat?q=${encodeURIComponent(question)}`);
    } else {
      router.push(`/auth?redirect=${encodeURIComponent(`/chat?q=${encodeURIComponent(question)}`)}`);
    }
  };

  const handleQuickAction = (action: string, data: any) => {
    if (user) {
      router.push(`/chat?q=${encodeURIComponent('Hi')}`);
    } else {
      router.push('/auth?redirect=/chat');
    }
  };

  return (
    <div className="min-h-screen text-[#333] font-sans relative overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.08), rgba(255, 255, 255, 0.95))'}}>
      {/* Global Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Flag Icons - blue theme */}
        <div className="absolute top-20 left-10 opacity-30 animate-pulse">
          <div className="w-8 h-6 rounded-sm shadow-lg" style={{background: 'linear-gradient(to right, #4285F4, #1a73e8)'}}></div>
        </div>
        <div className="absolute top-32 right-20 opacity-30 animate-pulse delay-1000">
          <div className="w-8 h-6 rounded-sm shadow-lg" style={{background: 'linear-gradient(to right, #1a73e8, #1557b0)'}}></div>
        </div>
        <div className="absolute bottom-32 left-20 opacity-30 animate-pulse delay-2000">
          <div className="w-8 h-6 rounded-sm shadow-lg" style={{background: 'linear-gradient(to right, #9bb3f7, #4285F4)'}}></div>
        </div>
        <div className="absolute bottom-20 right-32 opacity-30 animate-pulse delay-3000">
          <div className="w-8 h-6 rounded-sm shadow-lg" style={{background: 'linear-gradient(to right, #1557b0, #4285F4)'}}></div>
        </div>
        
        {/* Subtle dotted pattern - blue theme */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full" style={{backgroundColor: '#4285F4'}}></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full" style={{backgroundColor: '#1a73e8'}}></div>
          <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#1557b0'}}></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 rounded-full" style={{backgroundColor: '#9bb3f7'}}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full" style={{backgroundColor: '#4285F4'}}></div>
          <div className="absolute top-1/6 right-1/2 w-1 h-1 rounded-full" style={{backgroundColor: '#1a73e8'}}></div>
          <div className="absolute bottom-1/6 left-1/6 w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#1557b0'}}></div>
          <div className="absolute top-3/4 right-1/6 w-1 h-1 rounded-full" style={{backgroundColor: '#4285F4'}}></div>
        </div>
      </div>
      
      {/* Content with relative positioning */}
      <div className="relative z-10">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <DPISageLogo size={100} className="text-primary" />
                <h1 className="text-3xl font-bold whitespace-nowrap" style={{color: '#4285F4'}}>DPI Sage</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
                <a href="https://docs.cdpi.dev/references/home" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="text-base">
                  <FileText className="mr-2 h-4 w-4" />
                  Reusable resources
                  </Button>
                </a>
                <a href="https://docs.cdpi.dev/" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="text-base">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read more about DPI
                  </Button>
                </a>
                <a href="https://cdpi.dev/watch/" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="text-base">
                  <PlaySquare className="mr-2 h-4 w-4" />
                  Watch & learn
                  </Button>
                </a>
                {!loading && (
                  user ? (
                    <Button
                      onClick={async () => {
                        await signOut();
                        router.push('/');
                      }}
                      variant="outline"
                      className="text-base"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push('/auth')}
                      className="text-base"
                      style={{background: '#4285F4'}}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )
                )}
            </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <main className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-bold leading-relaxed">
                Building foundational digital rails for <span className="text-blue-600">inclusive economies</span> worldwide.
              </h1>
              <p className="text-lg lg:text-xl text-gray-600">
                We have distilled the wisdom of seasoned DPI builders into an AI-powered assistant to help countries design and implement effective Digital Public Infrastructure.
              </p>
              
              {/* Countries adopted by - Circular Flags */}
              <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">Lessons from:</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇮🇳
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇧🇷
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇸🇬
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇵🇭
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇳🇬
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇦🇷
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(26, 115, 232, 0.1))'}}>
                    🇨🇴
                  </div>
                  <span className="text-sm font-medium text-blue-600 ml-2">
                    +many more
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (Chat Widget) */}
            <div className="flex justify-center">
              <Card className="w-full max-w-lg shadow-2xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto rounded-full h-56 w-56 flex items-center justify-center mb-6" style={{background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(26, 115, 232, 0.2))' }}>
                    <DPISageLogo size={180} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3" style={{color: '#4285F4'}}>DPI Sage</h2>
                  <p className="text-muted-foreground mb-6 text-lg">Your AI assistant for DPI</p>
                  <Button
                    onClick={() => {
                      if (user) {
                        router.push('/chat');
                      } else {
                        router.push('/auth?redirect=/chat');
                      }
                    }}
                    className="w-full h-16 pl-8 pr-3 text-base rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden"
                    style={{
                      background: '#e3f2fd',
                      border: '2px solid #90caf9',
                      color: '#64748b'
                    }}
                  >
                    <span className="text-gray-600 text-lg">{user ? 'Ask anything' : 'Sign in to ask'}</span>
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1"
                      style={{
                        background: '#4285F4'
                      }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Suggested Questions - Two-Line Moving Carousel */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-8">Or try one of these questions:</h3>
            <div className="space-y-4">
              {/* First line */}
              <div className="relative overflow-hidden">
                <div className="flex animate-[scroll_30s_linear_infinite] gap-4">
                  {/* First half of questions */}
                  {suggestedQuestions.slice(0, 6).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="rounded-full bg-white/80 backdrop-blur-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 hover:shadow-lg"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1a73e8, #4285F4)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.color = '';
                      }}
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {suggestedQuestions.slice(0, 6).map((question, index) => (
                    <Button
                      key={`duplicate-${index}`}
                      variant="outline"
                      className="rounded-full bg-white/80 backdrop-blur-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 hover:shadow-lg"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1a73e8, #4285F4)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.color = '';
                      }}
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Second line - moving in reverse direction */}
              <div className="relative overflow-hidden">
                <div className="flex animate-[scroll-reverse_35s_linear_infinite] gap-4">
                  {/* Second half of questions */}
                  {suggestedQuestions.slice(6).map((question, index) => (
                    <Button
                      key={index + 6}
                      variant="outline"
                      className="rounded-full bg-white/80 backdrop-blur-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 hover:shadow-lg"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1a73e8, #4285F4)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.color = '';
                      }}
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {suggestedQuestions.slice(6).map((question, index) => (
                    <Button
                      key={`duplicate-${index + 6}`}
                      variant="outline"
                      className="rounded-full bg-white/80 backdrop-blur-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 hover:shadow-lg"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1a73e8, #4285F4)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.color = '';
                      }}
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Quick Actions</h2>
              </div>
              <p className="text-lg text-gray-600">Start your DPI journey with these helpful actions</p>
            </div>
            <QuickActions onActionTrigger={handleQuickAction} />
          </div>

        </main>

        {/* Footer (Optional) */}
        <footer className="text-center py-16 text-muted-foreground">
          <p className="text-base">Free to use, built by <a href="https://cdpi.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">Centre for Digital Public Infrastructure</a> ❤️</p>
        </footer>
      </div>
      </div>
    </div>
  );
}
