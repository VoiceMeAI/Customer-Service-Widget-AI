import { ChatWidget } from "@/components/chat-widget"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Demo page content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Customer Support Chat Widget</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A modern, embeddable chat widget with AI-powered responses, human escalation, file uploads, and session
            persistence. Click the chat bubble in the bottom right to try it out.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <FeatureCard
            title="AI-Powered Sentiment Response Analysis"
            description="Get instant answers from our AI assistant with sentiment analysis and suggested actions."
          />
          <FeatureCard
            title="Human Escalation Requests"
            description="Seamlessly connect with a human support agent when you need personalized assistance."
          />
          <FeatureCard
            title="File Attachments"
            description="Share images and documents directly in the chat with progress tracking."
          />
          <FeatureCard
            title="Session Persistence"
            description="Your conversation is automatically saved and restored when you return."
          />
          <FeatureCard
            title="Real-time Updates"
            description="See typing indicators and message status updates in real-time."
          />
          <FeatureCard
            title="Fully Responsive"
            description="Works beautifully on desktop, tablet, and mobile devices."
          />
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
