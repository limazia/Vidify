import { useState } from 'react'
import { RefreshCw, Paperclip, Image, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const suggestedPrompts = [
  { icon: '📝', text: 'Write a to-do list for a personal project or task' },
  { icon: '📧', text: 'Generate an email to reply to a job offer' },
  { icon: '📚', text: 'Summarize this article or text for me in one paragraph' },
  { icon: '🤖', text: 'How does AI work in a technical capacity' },
]

export default function Component() {
  const [prompts, setPrompts] = useState(suggestedPrompts)
  const [input, setInput] = useState('')

  const refreshPrompts = () => {
    // In a real application, this would fetch new prompts from an API
    setPrompts([...prompts].sort(() => Math.random() - 0.5))
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">
        Hi there, <span className="text-purple-600">John</span>
      </h1>
      <h2 className="text-2xl font-semibold mb-6 text-purple-800">
        What would you like to know?
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Use one of the most common prompts below or use your own to begin
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {prompts.map((prompt, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start space-x-3">
              <span className="text-2xl">{prompt.icon}</span>
              <p className="text-sm">{prompt.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        className="mb-6 text-purple-600 border-purple-600 hover:bg-purple-50"
        onClick={refreshPrompts}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Prompts
      </Button>
      <div className="relative">
        <Input
          type="text"
          placeholder="Ask whatever you want..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="pr-24 py-6 rounded-xl"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <Image className="w-5 h-5" />
          </Button>
          <Button size="icon" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}