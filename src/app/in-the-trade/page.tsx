'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, ClipboardList, BarChart, Star, Users, Smartphone, TrendingUp, Globe, Calendar, ArrowRight } from 'lucide-react'

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5, delay }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default function InTheTradePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="opacity-20"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              >
                Elevate Your Craft with Smart Space
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl"
              >
                Join our network of elite fitters and transform the way you do business in the stair storage industry.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="text-lg" asChild>
                  <Link href="/fitter-registration">Join the Network</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg" asChild>
                  <Link href="/login">Fitter Login</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Unlock Your Potential
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FadeInWhenVisible delay={0.1}>
                <Card className="bg-primary/5 border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <MapPin className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle className="text-2xl">Smart Matching</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base">
                      Our smart mapping system connects you with customers searching your area.
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.2}>
                <Card className="bg-primary/5 border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <ClipboardList className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle className="text-2xl">Effortless Management</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base">
                      Streamline your workflow with our intuitive tools for handling surveys, quotes, and project tracking.
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.3}>
                <Card className="bg-primary/5 border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <BarChart className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle className="text-2xl">Growth Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base">
                      Gain valuable insights into your business performance and identify opportunities for expansion.
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <FadeInWhenVisible>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                    Boost Your Online Presence
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Stand out in the digital landscape and attract more high-quality leads.
                  </p>
                </FadeInWhenVisible>
                <div className="space-y-4">
                  <FadeInWhenVisible delay={0.1}>
                    <div className="flex items-start space-x-3">
                      <Star className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Showcase Your Expertise</h3>
                        <p className="text-muted-foreground">Create a compelling profile that highlights your skills and past projects.</p>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.2}>
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Build Your Reputation</h3>
                        <p className="text-muted-foreground">Collect and display customer reviews to build trust and credibility.</p>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.3}>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Increase Visibility</h3>
                        <p className="text-muted-foreground">Benefit from our SEO-optimized platform to reach more potential customers.</p>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.4}>
                    <div className="flex items-start space-x-3">
                      <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Expand Your Network</h3>
                        <p className="text-muted-foreground">Connect with industry professionals and explore collaboration opportunities.</p>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                </div>
              </div>
              <FadeInWhenVisible delay={0.5}>
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/fitterprofile.png"
                    alt="Online Presence"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <FadeInWhenVisible>
                <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="Smart Space Fitter App"
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-lg px-3 py-1">Coming Soon</Badge>
                  </div>
                </div>
              </FadeInWhenVisible>
              <div>
                <FadeInWhenVisible delay={0.1}>
                  <Smartphone className="h-16 w-16 mb-6 text-primary" />
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                    Smart Space Fitter App
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Manage your business on the go with our powerful mobile app. Stay connected and responsive to customer needs, anytime, anywhere.
                  </p>
                </FadeInWhenVisible>
                <div className="space-y-4">
                  <FadeInWhenVisible delay={0.2}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <span>Real-time notifications for new leads</span>
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.3}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <span>Schedule and manage appointments</span>
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.4}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <span>Create and send quotes on-site</span>
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.5}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <span>Track project progress and payments</span>
                    </div>
                  </FadeInWhenVisible>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-primary/20 to-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Ready to Transform Your Business?
                </h2>
                <p className="mx-auto max-w-[700px] text-xl text-muted-foreground">
                  Join the Smart Space network today and unlock a world of opportunities.
                </p>
              </div>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Users, title: "Growing Customer Base", description: "Access a network of customers actively seeking quality stair storage solutions." },
                { icon: BarChart, title: "Streamlined Workflow", description: "Optimize your operations with our intuitive project management tools." },
                { icon: Globe, title: "Enhanced Online Presence", description: "Boost your visibility and attract more high-quality leads." },
                { icon: Star, title: "Ongoing Support", description: "Benefit from continuous training and support to help you succeed." }
              ].map((item, index) => (
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    <CardHeader>
                      <item.icon className="h-10 w-10 mb-2 text-primary" />
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
            <FadeInWhenVisible delay={0.5}>
              <div className="text-center mt-12">
                <Button size="lg" className="text-lg" asChild>
                  <Link href="/fitter-registration">
                    Join Smart Space Network <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <FadeInWhenVisible>
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                    Already a Smart Space Fitter?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Log in to access your dashboard, manage your profile, and respond to customer inquiries.
                  </p>
                  <Button size="lg" className="text-lg" asChild>
                    <Link href="/login">Fitter Login <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </FadeInWhenVisible>
              <div className="space-y-6">
                <FadeInWhenVisible delay={0.1}>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Manage Your Schedule</h3>
                      <p className="text-muted-foreground">Efficiently organize your appointments and workload.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>
                <FadeInWhenVisible delay={0.2}>
                  <div className="flex items-start space-x-3">
                    <ClipboardList className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Handle Requests and Quotes</h3>
                      <p className="text-muted-foreground">Respond to survey requests and create professional quotes.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>
                <FadeInWhenVisible delay={0.3}>
                  <div className="flex items-start space-x-3">
                    <BarChart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Track Your Success</h3>
                      <p className="text-muted-foreground">Monitor your projects, earnings, and performance metrics.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>
                <FadeInWhenVisible delay={0.4}>
                  <div className="flex items-start space-x-3">
                    <Star className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Enhance Your Profile</h3>
                      <p className="text-muted-foreground">Update your public profile and showcase your best work.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}