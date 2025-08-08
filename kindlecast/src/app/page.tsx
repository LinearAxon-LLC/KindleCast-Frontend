'use client'

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FadeInSection, SlideIn, StaggerContainer, StaggerItem, Pressable } from "@/components/ui/animated"
import { Send, FileText, Globe, Video, Headphones, Eye, Zap, Check, Star, X, Smartphone, Monitor, ArrowRight, Shield, Clock, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <FadeInSection>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <Text variant="title3" className="font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                KindleCast
              </Text>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">How it works</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</a>
              <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                Send to My Kindle
              </Button>
            </div>
          </FadeInSection>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header - Descriptive value prop */}
          <FadeInSection delay={0.2}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              Save Your Eyes.<br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
                Read Anything on Kindle.
              </span>
            </h1>
          </FadeInSection>

          {/* Subheader - How it works + addressing objections */}
          <FadeInSection delay={0.4}>
            <p className="text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
              KindleCast instantly sends any article, newsletter, or document to your Kindle, perfectly formatted.
              No more screen glare, no more distractions.
            </p>
          </FadeInSection>

          {/* Primary CTA */}
          <FadeInSection delay={0.6}>
            <div className="flex flex-col items-center space-y-4">
              <Pressable>
                <Button size="xl" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-12 py-4 text-lg font-semibold shadow-lg">
                  <Send className="w-5 h-5 mr-2" />
                  Send to My Kindle
                </Button>
              </Pressable>
              <p className="text-sm text-gray-500">
                Free for 3 conversions • No credit card required
              </p>
            </div>
          </FadeInSection>

          {/* Animated Visual Transformation */}
          <FadeInSection delay={0.8}>
            <div className="mt-16 relative">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-8 shadow-inner">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-20 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mb-4 mx-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-red-100 opacity-50"></div>
                      <div className="relative">
                        <Monitor className="w-8 h-8 text-gray-600" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="w-2 h-2 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Cluttered Screen</p>
                  </div>
                  <div className="text-brand-primary">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-600">Clean Kindle Reading</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <p className="text-sm text-gray-500 mb-6">Trusted by readers who value their eyesight</p>
            <div className="flex justify-center items-center space-x-2 text-gray-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">4.9/5 from 2,847+ users</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              &ldquo;Finally, I can read long articles without eye strain!&rdquo; — Sarah M., Digital Marketer
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stop Straining Your Eyes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform any digital content into a comfortable Kindle reading experience
              </p>
            </div>
          </FadeInSection>

          {/* Feature 1: Instant Conversion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <SlideIn direction="left">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Convert Any Content in Seconds
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Paste any URL, upload documents, or drag &amp; drop files. Our AI instantly extracts and formats the content into a clean, readable Kindle PDF.
                  No more squinting at tiny mobile screens or dealing with cluttered web layouts.
                </p>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">Works with articles, blog posts, research papers, and more</span>
                </div>
              </div>
            </SlideIn>
            <SlideIn direction="right">
              <div className="bg-gradient-to-br from-brand-accent/20 to-brand-tertiary/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">Average conversion time: <strong className="text-gray-900">3.2 seconds</strong></p>
              </div>
            </SlideIn>
          </div>

          {/* Feature 2: Perfect Formatting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <SlideIn direction="left" className="lg:order-2">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Kindle-Optimized Formatting
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Every PDF is automatically formatted for optimal Kindle reading. Perfect font sizes, proper margins, and clean layouts that work beautifully on all Kindle devices.
                  No more zooming, scrolling, or reformatting issues.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Automatic font sizing for all Kindle models</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Removes ads, sidebars, and distracting elements</span>
                  </div>
                </div>
              </div>
            </SlideIn>
            <SlideIn direction="right" className="lg:order-1">
              <div className="bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary to-brand-tertiary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">Compatible with <strong className="text-gray-900">all Kindle devices</strong></p>
              </div>
            </SlideIn>
          </div>

          {/* Feature 3: Eye Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideIn direction="left">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Save Your Eyes from Screen Fatigue
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Stop straining your eyes on bright screens. Kindle&apos;s e-ink display is designed for comfortable, long-form reading without blue light or glare.
                  Read for hours without headaches or eye fatigue.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">No blue light emission</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Paper-like reading experience</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Weeks of battery life</span>
                  </div>
                </div>
              </div>
            </SlideIn>
            <SlideIn direction="right">
              <div className="bg-gradient-to-br from-brand-tertiary/20 to-brand-accent/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-tertiary to-brand-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">Reduce eye strain by <strong className="text-gray-900">up to 87%</strong></p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to comfortable reading
              </p>
            </div>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Paste or Upload</h3>
                <p className="text-gray-600">
                  Copy any URL, upload a document, or paste text directly into KindleCast
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Formats</h3>
                <p className="text-gray-600">
                  Our AI extracts the content and formats it perfectly for Kindle reading
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Read Comfortably</h3>
                <p className="text-gray-600">
                  Download your Kindle-ready PDF and enjoy strain-free reading
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Stop Straining Your Eyes Today
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join 2,847+ readers who&apos;ve already made the switch to comfortable, eye-friendly reading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Pressable>
                <Button size="xl" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-12 py-4 text-lg font-semibold shadow-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Converting Free
                </Button>
              </Pressable>
              <p className="text-sm text-gray-500">No credit card required • 3 free conversions</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">KindleCast</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Transform any digital content into comfortable, eye-friendly Kindle reading experiences with ScreenCast.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-gray-900">How it works</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 ScreenCast. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Made for readers who value their eyesight
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
