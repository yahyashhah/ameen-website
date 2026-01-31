'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  CheckCircle, 
  Truck, 
  Headphones, 
  Shield, 
  Users, 
  Target,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  Globe
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from '@mui/material';

export default function AboutPage() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Storefront';
  
  const values = [
    {
      icon: CheckCircle,
      title: 'Authenticity Guaranteed',
      description: 'Only genuine products from authorized distributors with full manufacturer warranties',
      color: 'green',
    },
    {
      icon: Truck,
      title: 'Fast & Reliable Shipping',
      description: 'Same-day shipping on orders before 2 PM with real-time tracking updates',
      color: 'blue',
    },
    {
      icon: Headphones,
      title: '24/7 Expert Support',
      description: 'Dedicated support team available round the clock for technical assistance',
      color: 'purple',
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Bank-level security with SSL encryption and secure payment processing',
      color: 'orange',
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: '10+ years in tech product development',
    },
    {
      name: 'Sarah Chen',
      role: 'Product Curator',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Former product manager at leading tech brands',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Customer Experience',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      bio: '10,000+ customer support interactions',
    },
    {
      name: 'Emily Park',
      role: 'Operations Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Supply chain optimization specialist',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: Users },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '24h', label: 'Average Support Response', icon: Target },
    { value: '100%', label: 'Authentic Products', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-900 to-black">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Chip
              label="Our Story"
              className="bg-linear-to-r from-purple-600 to-pink-500 text-white mb-6 px-4 py-1"
              icon={<Sparkles className="w-4 h-4" />}
            />
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Redefining{' '}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tech Accessories
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We're a passionate team dedicated to curating premium tech accessories 
              that transform your workspace and enhance productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="contained"
                className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-8 py-3 rounded-xl text-lg"
                endIcon={<ArrowRight className="w-5 h-5" />}
                href="/products"
              >
                Shop Collection
              </Button>
              <Button
                variant="outlined"
                className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg"
                href="/contact"
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
                  alt="Modern workspace setup"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold">Global Reach</div>
                    <div className="text-sm text-gray-600">Shipping to 50+ countries</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Typography variant="h2" className="text-3xl font-bold mb-6">
                Our Mission
              </Typography>
              
              <Typography variant="body1" className="text-gray-600 mb-6 text-lg">
                We're a team of product enthusiasts dedicated to building better everyday setups. 
                Our catalog focuses on thoughtfully designed, durable accessories from trusted brands—tested for reliability in real workflows.
              </Typography>
              
              <Typography variant="body1" className="text-gray-600 mb-8 text-lg">
                From charging solutions to workspace essentials, everything is curated to help you do your best work. 
                We partner with leading manufacturers and authorized distributors to ensure authenticity and quality.
              </Typography>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">100% Authentic Products</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">30-Day Return Policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Free Shipping Over $50</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 bg-purple-100 rounded-xl mb-4">
                      <stat.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <Typography variant="h3" className="font-bold mb-2">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-3xl font-bold mb-4">
              Why Choose {brand}?
            </Typography>
            <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering exceptional value through our core principles
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div key={value.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 bg-${value.color}-100 rounded-xl mb-4`}>
                        <value.icon className={`w-6 h-6 text-${value.color}-600`} />
                      </div>
                      <Typography variant="h6" className="font-bold mb-2">
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-3xl font-bold mb-4">
              Meet Our Team
            </Typography>
            <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
              Passionate experts dedicated to enhancing your tech experience
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <Typography variant="h6" className="font-bold mb-1">
                      {member.name}
                    </Typography>
                    <Chip
                      label={member.role}
                      size="small"
                      className="mb-3 bg-purple-100 text-purple-700"
                    />
                    <Typography variant="body2" color="textSecondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl overflow-hidden">
            <div className="p-12 text-white text-center">
              <Typography variant="h2" className="text-3xl font-bold mb-4">
                Join Our Community
              </Typography>
              
              <Typography variant="body1" className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                New products arrive regularly. Subscribe to our newsletter to stay updated on the latest releases, 
                exclusive deals, and productivity tips.
              </Typography>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="contained"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-bold"
                  href="/products"
                >
                  Shop Now
                </Button>
                
                <Button
                  variant="outlined"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg font-bold"
                  href="/contact"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}