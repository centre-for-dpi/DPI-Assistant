"use client";

import { useState } from 'react';
import { Upload, Mail, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuickActionsProps {
  onActionTrigger?: (action: string, data?: any) => void;
  conversationContext?: string;
}

export function QuickActions({ onActionTrigger, conversationContext }: QuickActionsProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailSubject, setEmailSubject] = useState('DPI Strategy Ideas and Learnings');
  const [strategyNoteTitle, setStrategyNoteTitle] = useState('');
  
  // Check if we're on the home page or chat page
  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/';

  const quickActions = [
    {
      id: 'upload-strategy',
      title: 'Analyze Strategy Document',
      description: 'Upload a national strategy or policy document to identify DPI quick wins and long-term projects',
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'draft-email',
      title: 'Discuss with your team',
      description: 'Create an email summarizing ideas and learnings from our conversation',
      icon: Mail,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'create-strategy-note',
      title: 'Generate Strategy Note',
      description: 'Create a concise strategy note based on our discussion',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = (e) => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  const handleActionSubmit = async (actionId: string) => {
    let data = {};
    
    switch (actionId) {
      case 'upload-strategy':
        if (!uploadedFile) {
          alert('Please upload a file first');
          return;
        }
        try {
          // For text-based files (PDF text will need to be extracted on backend)
          let fileContent = '';
          if (uploadedFile.type === 'text/plain' || uploadedFile.type === 'text/markdown') {
            fileContent = await readFileContent(uploadedFile);
          }
          data = { file: uploadedFile, fileContent };
        } catch (error) {
          console.error('Error reading file:', error);
          alert('Error reading file. Please try again.');
          return;
        }
        break;
      case 'draft-email':
        if (!emailRecipients) {
          alert('Please enter recipient email addresses');
          return;
        }
        data = { recipients: emailRecipients, subject: emailSubject };
        break;
      case 'create-strategy-note':
        if (!strategyNoteTitle) {
          alert('Please enter a title for the strategy note');
          return;
        }
        data = { title: strategyNoteTitle };
        break;
    }

    onActionTrigger?.(actionId, data);
    setActiveDialog(null);
    // Reset form state
    setUploadedFile(null);
    setEmailRecipients('');
    setStrategyNoteTitle('');
  };

  return (
    <div className="w-full">
      {!isHomePage && (
        <p className="text-sm text-gray-600 mb-3">
          Turn insights into action:
        </p>
      )}
      
      <div className={isHomePage ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-3"}>
        {quickActions.map((action) => (
          <Card
            key={action.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${isHomePage ? 'hover:scale-105' : 'hover:bg-gray-50'}`}
            onClick={() => {
              if (isHomePage) {
                // On home page, just trigger the action to navigate to chat
                onActionTrigger?.(action.id, {});
              } else {
                // In chat, open the dialog
                setActiveDialog(action.id);
              }
            }}
          >
            <CardContent className={isHomePage ? "p-6" : "p-4"}>
              <div className={isHomePage ? "space-y-4" : "flex items-center gap-3"}>
                <div className={`${isHomePage ? 'w-12 h-12' : 'w-10 h-10'} rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className={`${isHomePage ? 'h-6 w-6' : 'h-5 w-5'} text-white`} />
                </div>
                <div className={isHomePage ? "" : "flex-1"}>
                  <h4 className={`font-semibold ${isHomePage ? 'text-base mb-2' : 'text-sm'}`}>{action.title}</h4>
                  {isHomePage && <p className="text-sm text-gray-600">{action.description}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Strategy Dialog */}
      <Dialog open={activeDialog === 'upload-strategy'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Strategy Document</DialogTitle>
            <DialogDescription>
              Upload a national strategy or policy document. I'll analyze it to identify DPI quick wins and long-term projects that align with your goals.
              <br /><br />
              <span className="text-sm">Supported formats: PDF, Word (.doc, .docx), Text (.txt), Markdown (.md). PDFs with embedded images will be processed to extract relevant information.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="strategy-file">Select Document</Label>
              <Input
                id="strategy-file"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="mt-2"
              />
              {uploadedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {uploadedFile.name}
                </p>
              )}
            </div>
            <Button
              onClick={() => handleActionSubmit('upload-strategy')}
              className="w-full"
              disabled={!uploadedFile}
            >
              Analyze Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Draft Email Dialog */}
      <Dialog open={activeDialog === 'draft-email'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draft Team Email</DialogTitle>
            <DialogDescription>
              I'll create an email summarizing the key ideas and learnings from our conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email-recipients">Recipients (comma-separated)</Label>
              <Input
                id="email-recipients"
                type="email"
                placeholder="team@example.com, stakeholder@example.com"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button
              onClick={() => handleActionSubmit('draft-email')}
              className="w-full"
              disabled={!emailRecipients}
            >
              Generate Email Draft
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Strategy Note Dialog */}
      <Dialog open={activeDialog === 'create-strategy-note'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Strategy Note</DialogTitle>
            <DialogDescription>
              I'll create a concise strategy note based on our conversation that you can download and share.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="note-title">Strategy Note Title</Label>
              <Input
                id="note-title"
                type="text"
                placeholder="DPI Implementation Strategy for [Country/Region]"
                value={strategyNoteTitle}
                onChange={(e) => setStrategyNoteTitle(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button
              onClick={() => handleActionSubmit('create-strategy-note')}
              className="w-full"
              disabled={!strategyNoteTitle}
            >
              Generate Strategy Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
