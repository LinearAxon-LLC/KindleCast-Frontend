'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FadeInSection, SlideIn, StaggerContainer, StaggerItem, Pressable } from "@/components/ui/animated"
import { BookOpen, Headphones, Sparkles, Zap, Play, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-dark-50 dark:to-dark-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-100/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <FadeInSection>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <Text variant="title3" className="font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                KindleCast
              </Text>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">Features</Button>
              <Button variant="ghost" size="sm">Pricing</Button>
              <Button variant="ghost" size="sm">About</Button>
              <ThemeToggle />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </FadeInSection>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeInSection>
            <div className="inline-flex items-center space-x-2 bg-brand-accent/20 dark:bg-brand-primary/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <Text variant="caption" className="text-brand-primary font-medium">
                AI-Powered Audio Transformation
              </Text>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <Text variant="display" as="h1" className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Transform Your Books Into<br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
                Audio Experiences
              </span>
            </Text>
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <Text variant="body" className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              KindleCast converts your digital books into high-quality audiobooks using advanced AI voice technology.
              Listen to your favorite books anywhere, anytime.
            </Text>
          </FadeInSection>

          <FadeInSection delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Pressable>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Pressable>
              <Pressable>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                  <Headphones className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </Pressable>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <Text variant="title1" as="h2" className="mb-4">
                Why Choose KindleCast?
              </Text>
              <Text variant="body" className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the future of reading with our cutting-edge AI technology
              </Text>
            </div>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <Pressable>
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/60 dark:bg-dark-100/60 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <Text variant="title3" as="h3" className="mb-4">
                    Lightning Fast
                  </Text>
                  <Text variant="body" className="text-gray-600 dark:text-gray-300">
                    Convert your books to audio in minutes, not hours. Our advanced AI processes text at incredible speeds.
                  </Text>
                </Card>
              </Pressable>
            </StaggerItem>

            <StaggerItem>
              <Pressable>
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/60 dark:bg-dark-100/60 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary to-brand-tertiary rounded-xl flex items-center justify-center mb-6">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <Text variant="title3" as="h3" className="mb-4">
                    Natural Voices
                  </Text>
                  <Text variant="body" className="text-gray-600 dark:text-gray-300">
                    Choose from dozens of lifelike AI voices that sound natural and engaging, making every story come alive.
                  </Text>
                </Card>
              </Pressable>
            </StaggerItem>

            <StaggerItem>
              <Pressable>
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/60 dark:bg-dark-100/60 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-tertiary to-brand-accent rounded-xl flex items-center justify-center mb-6">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <Text variant="title3" as="h3" className="mb-4">
                    Premium Quality
                  </Text>
                  <Text variant="body" className="text-gray-600 dark:text-gray-300">
                    Studio-quality audio output with perfect pronunciation, natural pauses, and emotional inflection.
                  </Text>
                </Card>
              </Pressable>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 dark:from-brand-primary/5 dark:via-brand-secondary/5 dark:to-brand-tertiary/5">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <Text variant="title1" as="h2" className="mb-6">
              Ready to Transform Your Reading Experience?
            </Text>
            <Text variant="body" className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of readers who have already discovered the magic of AI-powered audiobooks.
            </Text>
            <Pressable>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg font-semibold shadow-lg">
                Start Your Free Trial
              </Button>
            </Pressable>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-dark-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-md flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <Text variant="body" className="font-semibold">
                KindleCast
              </Text>
            </div>
            <Text variant="caption" className="text-gray-500 dark:text-gray-400">
              © 2024 KindleCast. All rights reserved.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  );
}
