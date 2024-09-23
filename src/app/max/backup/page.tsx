'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Maximize2, Shield, Zap, Wrench, Palette, Box, Check, Lock, PaintBucket, Star, MapPin, Ruler, ClipboardCheck, Truck, Clock, Users, Award, ThumbsUp } from 'lucide-react'

const FadeInWhenVisible = ({ children }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

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
      transition={{ duration: 0.5 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  )
}

const ParallaxSection = ({ children }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  )
}

export default function MaxProductPage() {
  const [surveyOption, setSurveyOption] = useState<'smartspace' | 'fitter' | null>(null)
  const router = useRouter()

  const handleSurveyOption = (option: 'smartspace' | 'fitter') => {
    setSurveyOption(option)
    if (option === 'smartspace') {
      router.push('/survey-request?smartspace=true')
    } else {
      router.push('/select-fitter')
    }
  }

  useEffect(() => {
    document.body.style.scrollBehavior = 'smooth'
    return () => {
      document.body.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/max/max.jpeg"
              alt="4 Max Under-Stair Storage Solution"
              layout="fill"
              objectFit="cover"
              className="opacity-80"
            />
          </div>
          <div className="relative z-10 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none mb-6"
            >
              4 Max Under-Stair Storage Solution
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl max-w-2xl mx-auto mb-12"
            >
              Transform your under-stair space into a stylish, functional storage haven with our bespoke 4 Max solution.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button size="lg" onClick={() => handleSurveyOption('smartspace')} className="bg-white text-primary hover:bg-white/90 text-lg">
                Book Free Survey
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleSurveyOption('fitter')} className="bg-transparent border-white text-white hover:bg-white/20 text-lg">
                Find a Fitter
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-24 bg-background">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Key Features
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Maximize2, title: "Bespoke Design", description: "Tailored to your unique space" },
                { icon: Shield, title: "Premium Materials", description: "Built to last with high-quality components" },
                { icon: Zap, title: "Custom Pivot System", description: "Smooth operation for years to come" }
              ].map((feature, index) => (
                <FadeInWhenVisible key={index}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                    <CardHeader>
                      <feature.icon className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-secondary/30">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                See 4 Max in Action
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/max/1.jpeg"
                  alt="4 Max Under-Stair Storage in action"
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        <section className="w-full py-24 bg-background">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Advanced Features
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Box, title: "Soft-Close Drawer", description: "Smooth and quiet operation for daily use" },
                { icon: Wrench, title: "Gas Struts & Custom Lock", description: "Effortless lifting and secure closure" },
                { icon: Zap, title: "Motion Sensor Lighting", description: "Automatic illumination for convenience" },
                { icon: Palette, title: "Customisable Finishes", description: "Match your interior design perfectly" }
              ].map((feature, index) => (
                <FadeInWhenVisible key={index}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                    <CardHeader>
                      <feature.icon className="h-10 w-10 mb-4 text-primary" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-secondary/30">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Customisation & Options
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-12 lg:grid-cols-2">
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                  <CardHeader>
                    <PaintBucket className="h-20 w-20 text-primary mx-auto" />
                    <CardTitle className="text-3xl text-center">Choose Your Colour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-xl text-muted-foreground mb-6">
                      Customise your 4 Max to match your home's aesthetic. Choose from a wide range of colours and finishes.
                    </p>
                    <Image
                      src="/max/2.jpeg"
                      alt="4 Max colour options"
                      width={500}
                      height={375}
                      className="rounded-2xl object-cover shadow-lg mx-auto"
                    />
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                  <CardHeader>
                    <Box className="h-20 w-20 text-primary mx-auto" />
                    <CardTitle className="text-3xl text-center">Optional Pull-Out Drawer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-xl text-muted-foreground mb-6">
                      Enhance your storage capabilities with our optional pull-out drawer, perfect for organising smaller items.
                    </p>
                    <Image
                      src="/max/3.jpeg"
                      alt="4 Max pull-out drawer"
                      width={500}
                      height={375}
                      className="rounded-2xl object-cover shadow-lg mx-auto"
                    />
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-background">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Safety, Security, and Professional Installation
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Lock, title: "Safety & Security", description: "Our 4 Max solution is designed with your safety in mind. Featuring secure locking mechanisms and child-safe designs." },
                { icon: Wrench, title: "Professional Installation", description: "We recommend professional installation by our skilled tradespeople to ensure perfect fit and functionality of your 4 Max solution." },
                { icon: Star, title: "Premium Quality", description: "Experience luxury and functionality with our 4 Max solution. High-end materials and craftsmanship at a competitive price point." }
              ].map((item, index) => (
                <FadeInWhenVisible key={index}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="flex-grow">
                      <item.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                      <CardTitle className="text-2xl text-center">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-center">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-secondary/30">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Our Recommended Fitters
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: MapPin, title: "UK-Wide Coverage", description: "Our extensive directory of recommended fitters covers all regions of the UK, ensuring you can find a skilled professional near you." },
                { icon: Users, title: "Vetted Professionals", description: "All our recommended fitters are thoroughly vetted and trained to ensure the highest quality installation of your 4 Max solution." },
                { icon: ThumbsUp, title: "Easy Booking", description: "Our user-friendly platform makes it simple to find, compare, and book fitters in your area, streamlining your 4 Max installation process." }
              ].map((item, index) => (
                <FadeInWhenVisible key={index}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                    <CardHeader>
                      <item.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                      <CardTitle className="text-2xl text-center">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-center">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-background">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Simple Order Process
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Ruler, title: "Measure", description: "Provide initial measurements of your under-stair space" },
                { icon: ClipboardCheck, title: "Survey & Quote", description: "We survey your stairs to ensure compatibility and provide a detailed quote" },
                { icon: Truck, title: "Delivery", description: "Your 4 Max is delivered in a ready-to-assemble form" },
                { icon: Clock, title: "Quick Installation", description: "Professional installation completed in less than a day" }
              ].map((step, index) => (
                <FadeInWhenVisible key={index}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                    <CardHeader>
                      <step.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                      <CardTitle className="text-2xl text-center">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-center">{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-secondary/30">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto text-center">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">
                Why Choose 4 Max?
              </h2>
              <p className="text-2xl text-muted-foreground mb-12">
                Unparalleled quality, customisation, and convenience for your under-stair storage needs
              </p>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
              {[
                { icon: Award, title: "25-Year Warranty", description: "Long-term peace of mind guaranteed" },
                { icon: Users, title: "Expert Installation", description: "Professional setup by skilled tradespeople" },
                { icon: Box, title: "Versatile Storage", description: "Maximise your space efficiently" },
                { icon: Zap, title: "Future-Proof Design", description: "Adaptable to your changing needs" }
              ].map((item, index) => (
                <FadeInWhenVisible key={index}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="flex-grow">
                      <item.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                      <CardTitle className="flex items-center justify-center text-xl">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
            <FadeInWhenVisible>
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Smart Space Survey</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <p className="mb-4 text-white">Free professional survey</p>
                    <p className="mb-4 text-white">Installation from £350</p>
                    <Button size="lg" onClick={() => handleSurveyOption('smartspace')} className="w-full mt-auto bg-white text-primary hover:bg-white/90">
                      Book Free Survey
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Find a Fitter</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <p className="mb-4">Find recommended fitters in your area</p>
                    <p className="mb-4">View detailed fitter profiles</p>
                    <Button size="lg" variant="outline" onClick={() => handleSurveyOption('fitter')} className="w-full mt-auto">
                      Find Local Fitters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>
    </div>
  )
}