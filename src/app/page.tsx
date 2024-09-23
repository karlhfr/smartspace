'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Maximize2, Shield, Zap, Wrench, Palette, Box, Check, Lock, PaintBucket, Star, Clock, Users } from 'lucide-react'

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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground"
                >
                  Unlock Hidden Space Under Your Stairs
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                >
                  Choose between our Standard Install and 4 Max Solution to transform wasted space into stylish, functional storage.
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <a href="https://book.servicem8.com/request_service_online_booking?strVendorUUID=c5f97125-635d-4f5c-9697-204ec5586fdb#3ff7530b-4d0f-40f3-af36-21439dd23ffb" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto">Request a Quote</Button>
                  </a>
                  <Link href="/max" passHref>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore 4 Max Solution</Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <Image
                  src="/placeholder.svg"
                  alt="Standard Install Example"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover shadow-lg"
                />
                <Image
                  src="/placeholder.svg"
                  alt="4 Max Solution Example"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
                Why Choose Under-Stair Storage?
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <Maximize2 className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Maximize Space</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Transform unused areas into valuable storage, perfect for small homes or decluttering enthusiasts.</CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <PaintBucket className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Seamless Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Our solutions blend perfectly with your existing staircase, maintaining your home's aesthetic.</CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <Box className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Versatile Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>From shoes and cleaning supplies to seasonal items, find a place for everything.</CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
                Our Smart Space Solutions
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl">Standard Install</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Converts existing stairs to lift
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Reinforced stair structure
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Quick 1-2 hour installation
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Uses existing carpet
                      </li>
                      <li className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Group booking discounts available
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">Note: Mileage charges may apply based on your location.</p>
                    <a href="https://book.servicem8.com/request_service_online_booking?strVendorUUID=c5f97125-635d-4f5c-9697-204ec5586fdb#3ff7530b-4d0f-40f3-af36-21439dd23ffb" target="_blank" rel="noopener noreferrer">
                      <Button className="mt-4 w-full">Request a Quote</Button>
                    </a>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl">4 Max Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Custom pivot system for smooth operation
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Premium materials and finishes
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Optional pull-out drawer
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-primary" />
                        Motion sensor lighting
                      </li>
                    </ul>
                    <Link href="/max" passHref>
                      <Button className="mt-4 w-full">Learn More About 4 Max</Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
                Compare Our Solutions
              </h2>
            </FadeInWhenVisible>
            <div className="overflow-x-auto">
              <table className="w-full bg-background/50 backdrop-blur-sm border-collapse rounded-lg overflow-hidden">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="p-4 text-left font-bold">Feature</th>
                    <th className="p-4 text-center font-bold">Standard Install</th>
                    <th className="p-4 text-center font-bold">4 Max Solution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-background/80">
                    <td className="p-4 border-t">Installation Time</td>
                    <td className="p-4 border-t text-center">1-2 hours</td>
                    <td className="p-4 border-t text-center">Half to full day</td>
                  </tr>
                  <tr className="bg-background/60">
                    <td className="p-4 border-t">Storage Access</td>
                    <td className="p-4 border-t text-center">3-5 steps deep, compact access</td>
                    <td className="p-4 border-t text-center">4 steps wide, 5+ steps deep, full-width access</td>
                  </tr>
                  <tr className="bg-background/80">
                    <td className="p-4 border-t">Materials</td>
                    <td className="p-4 border-t text-center">Existing stairs (reinforced)</td>
                    <td className="p-4 border-t text-center">Premium custom materials</td>
                  </tr>
                  <tr className="bg-background/60">
                    <td className="p-4 border-t">Flooring</td>
                    <td className="p-4 border-t text-center">Uses existing carpet</td>
                    <td className="p-4 border-t text-center">Existing carpet, laminate, or painted options</td>
                  </tr>
                  <tr className="bg-background/80">
                    <td className="p-4 border-t">Price Range</td>
                    <td className="p-4 border-t text-center">Starting from £490*</td>
                    <td className="p-4 border-t text-center">Starting from £790</td>
                  </tr>
                  <tr className="bg-background/60">
                    <td className="p-4 border-t">Group Discounts</td>
                    <td className="p-4 border-t text-center">Available</td>
                    <td className="p-4 border-t text-center">Contact for details</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">* Mileage charges may apply for Standard Install based on your location.</p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="https://book.servicem8.com/request_service_online_booking?strVendorUUID=c5f97125-635d-4f5c-9697-204ec5586fdb#3ff7530b-4d0f-40f3-af36-21439dd23ffb" target="_blank" rel="noopener noreferrer">
                <Button>Request a Quote</Button>
              </a>
              <Link href="/max" passHref>
                <Button>Learn More About 4 Max</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
                Transform Your Space with 4 Max
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-6 md:grid-cols-2">
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Request a Smart Space Survey</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Let our experts assess your space and recommend the perfect 4 Max solution.</p>
                    <Link href="/survey-request?smartspace=true" passHref>
                      <Button className="w-full">Book a 4 Max Survey</Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Find a Recommended Fitter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Connect with skilled professionals in your area for 4 Max installation.</p>
                    <Link href="/select-fitter" passHref>
                      <Button className="w-full">Find a 4 Max Fitter</Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Ready to Maximize Your Space?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Don't let valuable space go to waste. Transform your under-stair area into a functional storage solution today!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="https://book.servicem8.com/request_service_online_booking?strVendorUUID=c5f97125-635d-4f5c-9697-204ec5586fdb#3ff7530b-4d0f-40f3-af36-21439dd23ffb" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    Request a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/max" passHref>
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto">
                    Explore 4 Max Solution
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>
    </div>
  )
}