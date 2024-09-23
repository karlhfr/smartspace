'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin, ClipboardList, BarChart, Star, Users, Smartphone, TrendingUp, Globe, Calendar } from 'lucide-react'

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

export default function InTheTradePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-primary/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
              >
                Join the Smart Space Fitter Network
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto max-w-[700px] text-gray-500 md:text-xl"
              >
                Expand your business, streamline your workflow, and connect with customers looking for quality stair storage solutions.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex space-x-4"
              >
                <Button size="lg" asChild>
                  <Link href="/fitter-registration">Register as a Fitter</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Why Join Smart Space?
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-6 lg:grid-cols-3">
              <FadeInWhenVisible>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <MapPin className="h-10 w-10 mb-2 text-primary" />
                      <CardTitle>Targeted Customer Reach</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Our intelligent mapping system connects you with customers in your service area, ensuring you receive relevant job opportunities based on your specified radius.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <ClipboardList className="h-10 w-10 mb-2 text-primary" />
                      <CardTitle>Streamlined Survey Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Receive and manage survey requests effortlessly. Our system allows you to quickly respond to inquiries and schedule site visits, increasing your conversion rates.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <BarChart className="h-10 w-10 mb-2 text-primary" />
                      <CardTitle>Efficient Quote Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Convert surveys into professional quotes with ease. Track your quotes, manage revisions, and close deals faster with our integrated quoting system.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/30 to-secondary/10">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Boost Your Online Presence
              </h2>
            </FadeInWhenVisible>
            <div className="grid gap-8 lg:grid-cols-2">
              <FadeInWhenVisible>
                <div className="flex items-start space-x-4">
                  <Star className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Showcase Your Expertise</h3>
                    <p className="text-gray-600">
                      Create a compelling public profile that highlights your skills, experience, and past projects. Let potential customers see why you're the best choice for their stair storage needs.
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <div className="flex items-start space-x-4">
                  <Users className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Build Your Reputation</h3>
                    <p className="text-gray-600">
                      Collect and display customer reviews and ratings. Positive feedback helps you stand out in the Smart Space directory and attracts more high-quality leads.
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Increase Your Visibility</h3>
                    <p className="text-gray-600">
                      Benefit from our SEO-optimized platform to increase your visibility in local searches. Reach more potential customers actively looking for stair storage solutions in your area.
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
              <FadeInWhenVisible>
                <div className="flex items-start space-x-4">
                  <Globe className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expand Your Network</h3>
                    <p className="text-gray-600">
                      Connect with other professionals in the industry, share knowledge, and potentially collaborate on larger projects. Grow your business through our community of skilled fitters.
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <FadeInWhenVisible>
                <div>
                  <Smartphone className="h-24 w-24 mb-6 text-primary-foreground" />
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                    Smart Space Fitter App
                  </h2>
                  <p className="text-xl mb-6">
                    Manage your business on the go with our powerful mobile app. Stay connected and responsive to customer needs, anytime, anywhere.
                  </p>
                </div>
              </FadeInWhenVisible>
              <div className="space-y-4">
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Real-time notifications for new leads</span>
                  </motion.div>
                </FadeInWhenVisible>
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Schedule and manage appointments</span>
                  </motion.div>
                </FadeInWhenVisible>
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Create and send quotes on-site</span>
                  </motion.div>
                </FadeInWhenVisible>
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Track project progress and payments</span>
                  </motion.div>
                </FadeInWhenVisible>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <FadeInWhenVisible>
              <div className="flex flex-col items-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Ready to Grow Your Business?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mb-8">
                  Join the Smart Space network today and unlock a world of opportunities:
                </p>
                <ul className="text-left text-lg space-y-2 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>Access to a growing customer base seeking quality stair storage solutions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>Streamlined workflow with our intuitive project management tools</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>Enhanced online presence and professional profile</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>Ongoing support and training to help you succeed</span>
                  </li>
                </ul>
                <Button size="lg" asChild>
                  <Link href="/fitter-registration">Register as a Fitter</Link>
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-secondary via-secondary/80 to-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <FadeInWhenVisible>
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                    Already a Smart Space Fitter?
                  </h2>
                  <p className="text-xl mb-6">
                    Log in to access your dashboard, manage your profile, and respond to customer inquiries.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/login">Fitter Login</Link>
                  </Button>
                </div>
              </FadeInWhenVisible>
              <div className="space-y-4">
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Calendar className="h-6 w-6 text-primary" />
                    <span>Manage your appointments and schedule</span>
                  </motion.div>
                </FadeInWhenVisible>
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ClipboardList className="h-6 w-6 text-primary" />
                    <span>Respond to survey requests and create quotes</span>
                  </motion.div>
                </FadeInWhenVisible>
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <BarChart className="h-6 w-6 text-primary" />
                    <span>Track your projects and earnings</span>
                  </motion.div>
                </FadeInWhenVisible>
                <FadeInWhenVisible>
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Star className="h-6 w-6 text-primary" />
                    <span>Manage your public profile and reviews</span>
                  </motion.div>
                </FadeInWhenVisible>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}