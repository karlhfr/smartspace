'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useAnimation, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Maximize2, Shield, Zap, Wrench, Palette, Box, Check, Lock, PaintBucket, Star, MapPin, Ruler, ClipboardCheck, Truck, Clock, Users, Award, ThumbsUp } from 'lucide-react'

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

const ParallaxSection = ({ children, offset = 50 }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, offset])
  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 }
  const ySpring = useSpring(y, springConfig)

  return (
    <motion.div style={{ y: ySpring }}>
      {children}
    </motion.div>
  )
}

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  )
}

export default function MaxProductPage() {
  const [surveyOption, setSurveyOption] = useState<'smartspace' | 'fitter' | null>(null)
  const router = useRouter()
  const heroRef = useRef(null)

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

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgressBar />
      <main className="flex-1">
        <motion.section 
          ref={heroRef}
          className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden"
          style={{ opacity }}
        >
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ scale }}
          >
            <Image
              src="/max/max.jpeg"
              alt="4 Max Under-Stair Storage Solution"
              layout="fill"
              objectFit="cover"
              className="opacity-80"
            />
          </motion.div>
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
        </motion.section>

        <ParallaxSection offset={-50}>
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
                  <FadeInWhenVisible key={index} delay={index * 0.1}>
                    <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                      <CardHeader>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <feature.icon className="h-12 w-12 mb-4 text-primary" />
                        </motion.div>
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
        </ParallaxSection>

        <section className="w-full py-24 bg-secondary/30">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                See 4 Max in Action
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <motion.div 
                className="aspect-video rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Image
                  src="/max/1.jpeg"
                  alt="4 Max Under-Stair Storage in action"
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </FadeInWhenVisible>
          </div>
        </section>

        <ParallaxSection offset={50}>
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
                  <FadeInWhenVisible key={index} delay={index * 0.1}>
                    <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                      <CardHeader>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <feature.icon className="h-10 w-10 mb-4 text-primary" />
                        </motion.div>
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
        </ParallaxSection>

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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PaintBucket className="h-20 w-20 text-primary mx-auto" />
                    </motion.div>
                    <CardTitle className="text-3xl text-center">Choose Your Colour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-xl text-muted-foreground mb-6">
                      Customise your 4 Max to match your home's aesthetic. Choose from a wide range of colours and finishes.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Image
                        src="/max/2.jpeg"
                        alt="4 Max colour options"
                        width={500}
                        height={375}
                        className="rounded-2xl object-cover shadow-lg mx-auto"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.2}>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Box className="h-20 w-20 text-primary mx-auto" />
                    </motion.div>
                    <CardTitle className="text-3xl text-center">Optional Pull-Out Drawer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-xl text-muted-foreground mb-6">
                      Enhance your storage capabilities with our optional pull-out drawer, perfect for organising smaller items.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Image
                        src="/max/3.jpeg"
                        alt="4 Max pull-out drawer"
                        width={500}
                        height={375}
                        className="rounded-2xl object-cover shadow-lg mx-auto"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <ParallaxSection offset={-50}>
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
                  <FadeInWhenVisible key={index} delay={index * 0.1}>
                    <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                      <CardHeader className="flex-grow">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <item.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                        </motion.div>
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
        </ParallaxSection>

        <section className="w-full py-24 bg-secondary/30">
          <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                Our Recommended Fitters
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {[
                { icon: MapPin, title: "UK-Wide Coverage", description: "Our extensive directory of recommended fitters covers all regions of the UK, ensuring you can find a skilled professional near you." },
                { icon: Users, title: "Vetted Professionals", description: "All our recommended fitters are thoroughly vetted and trained to ensure the highest quality installation of your 4 Max solution." },
                { icon: ThumbsUp, title: "Easy Booking", description: "Our user-friendly platform makes it simple to find, compare, and book fitters in your area, streamlining your 4 Max installation process." }
              ].map((item, index) => (
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <item.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                      </motion.div>
                      <CardTitle className="text-2xl text-center">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-center">{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
            <FadeInWhenVisible>
              <div className="text-center">
                <Button size="lg" variant="outline" onClick={() => router.push('/in-the-trade')} className="text-lg">
                  Fitters: Join Our Directory
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        <ParallaxSection offset={50}>
          <section className="w-full py-24 bg-background">
            <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
              <FadeInWhenVisible>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-16 text-center">
                  Simple Order Process
                </h2>
              </FadeInWhenVisible>
              <div className="flex flex-col gap-8 max-w-3xl mx-auto">
                {[
                  { icon: Ruler, title: "Measure", description: "Provide initial measurements of your under-stair space" },
                  { icon: ClipboardCheck, title: "Survey & Quote", description: "We survey your stairs to ensure compatibility and provide a detailed quote" },
                  { icon: Truck, title: "Delivery", description: "Your 4 Max is delivered in a ready-to-assemble form" },
                  { icon: Clock, title: "Quick Installation", description: "Professional installation completed in less than a day" }
                ].map((step, index) => (
                  <FadeInWhenVisible key={index} delay={index * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="h-8 w-0.5 bg-primary/30 ml-6" />
                    )}
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </section>
        </ParallaxSection>

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
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="flex-grow">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <item.icon className="h-12 w-12 mb-4 text-primary mx-auto" />
                      </motion.div>
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
              <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Card className="bg-primary text-primary-foreground h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Smart Space Survey</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                      <p className="mb-4 text-white text-lg">Free professional survey</p>
                      <p className="mb-4 text-white text-lg">Installation from £350</p>
                      <p className="mb-8 text-white text-lg">Expert measurements and advice</p>
                      <Button size="lg" onClick={() => handleSurveyOption('smartspace')} className="w-full mt-auto bg-white text-primary hover:bg-white/90 text-lg">
                        Book Free Survey
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-2xl">Find a Fitter</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                      <p className="mb-4 text-lg">Find recommended fitters in your area</p>
                      <p className="mb-4 text-lg">View detailed fitter profiles</p>
                      <p className="mb-8 text-lg">Professional installation service</p>
                      <Button size="lg" variant="outline" onClick={() => handleSurveyOption('fitter')} className="w-full mt-auto text-lg">
                        Find Local Fitters
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <div className="max-w-4xl mx-auto mb-16">
                <h3 className="text-3xl font-bold mb-4">4 Max Kit Pricing</h3>
                <p className="text-xl mb-6">4 Max kits start from £790</p>
                <p className="text-lg mb-8">
                  Installation available by Smart Space or professional tradespeople to ensure the perfect fit and functionality of your 4 Max solution.
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>
    </div>
  )
}