'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Snackbar,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 000-0000';
  const hours = process.env.NEXT_PUBLIC_SUPPORT_HOURS || 'Mon-Fri, 9am-5pm EST';
  const address = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '123 Tech Street, San Francisco, CA 94107';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactOptions = [
    {
      icon: Mail,
      title: 'Email',
      value: email,
      description: 'We\'ll respond within 24 hours',
      action: `mailto:${email}`,
      color: 'blue',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: phone,
      description: hours,
      action: `tel:${phone}`,
      color: 'green',
    },
    {
      icon: Clock,
      title: 'Support Hours',
      value: hours,
      description: 'Closed on weekends and holidays',
      color: 'orange',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: address,
      description: 'Visit us during business hours',
      color: 'purple',
    },
  ];

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Message sent successfully! We\'ll get back to you soon.',
          severity: 'success',
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

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
              label="Get in Touch"
              className="bg-linear-to-r from-purple-600 to-pink-500 text-white mb-6 px-4 py-1"
              icon={<MessageSquare className="w-4 h-4" />}
            />
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              We're Here to{' '}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Help
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Have questions or need assistance? Our dedicated team is ready to help you with anything from product inquiries to technical support.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Grid container spacing={8}>
          {/* Contact Information */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h4" className="font-bold mb-8">
                Contact Information
              </Typography>
              
              <div className="space-y-6 mb-8">
                {contactOptions.map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 bg-${option.color}-100 rounded-xl`}>
                            <option.icon className={`w-6 h-6 text-${option.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <Typography variant="h6" className="font-bold mb-1">
                              {option.title}
                            </Typography>
                            <Typography variant="body1" className="mb-2">
                              {option.value}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {option.description}
                            </Typography>
                            {option.action && (
                              <Button
                                variant="text"
                                className={`mt-3 text-${option.color}-600 hover:text-${option.color}-700`}
                                href={option.action}
                                startIcon={<Send className="w-4 h-4" />}
                              >
                                {option.title === 'Email' ? 'Send Email' : option.title === 'Phone' ? 'Call Now' : 'Get Directions'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Support Notice */}
              <Card className="rounded-2xl bg-linear-to-r from-blue-50 to-cyan-50 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Headphones className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Typography variant="h6" className="font-bold mb-2">
                        Need Quick Help?
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-3">
                        Check our FAQ page for instant answers to common questions about orders, shipping, returns, and more.
                      </Typography>
                      <Button
                        variant="text"
                        className="text-blue-600 hover:text-blue-700"
                        href="/support"
                        startIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Visit Support Center
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Alert severity="info" className="rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Typical Response Time</div>
                      <div className="text-sm">Email: Within 24 hours • Phone: During business hours</div>
                    </div>
                  </div>
                </Alert>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <Typography variant="h4" className="font-bold mb-2">
                    Send us a Message
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-8">
                    Fill out the form below and we'll get back to you as soon as possible
                  </Typography>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          error={!!errors.name}
                          helperText={errors.name}
                          required
                          disabled={loading}
                          className="bg-white"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          error={!!errors.email}
                          helperText={errors.email}
                          required
                          disabled={loading}
                          className="bg-white"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          required
                          disabled={loading}
                          className="bg-white"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Message"
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          error={!!errors.message}
                          helperText={errors.message}
                          required
                          multiline
                          rows={6}
                          disabled={loading}
                          className="bg-white"
                        />
                      </Grid>
                    </Grid>

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        variant="contained"
                        className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full py-3 rounded-xl text-lg font-bold"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send className="w-5 h-5" />}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                      
                      <Typography variant="caption" color="textSecondary" className="text-center block">
                        By submitting this form, you agree to our{' '}
                        <a href="/policies/privacy" className="text-purple-600 hover:underline">
                          Privacy Policy
                        </a>
                        . We'll never share your information.
                      </Typography>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Typography variant="h6" className="font-bold mb-4">
                  Frequently Asked Questions
                </Typography>
                
                <div className="space-y-3">
                  {[
                    {
                      question: 'What is your return policy?',
                      answer: '30-day return window for unused items in original packaging',
                    },
                    {
                      question: 'Do you ship internationally?',
                      answer: 'Yes, we ship to 50+ countries worldwide',
                    },
                    {
                      question: 'How can I track my order?',
                      answer: 'Tracking information is emailed once your order ships',
                    },
                  ].map((faq, index) => (
                    <Card key={index} className="rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-gray-100 rounded">
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <Typography variant="subtitle2" className="font-bold mb-1">
                              {faq.question}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {faq.answer}
                            </Typography>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button
                  fullWidth
                  variant="outlined"
                  className="mt-4 rounded-xl"
                  href="/support"
                  startIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View All FAQs
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          className="rounded-xl shadow-lg"
          icon={snackbar.severity === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}