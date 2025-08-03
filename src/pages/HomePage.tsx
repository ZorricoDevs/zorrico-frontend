import React, { useRef, useState } from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import {
  TrendingUp,
  Security,
  Speed,
  Assignment,
  AccountBalance,
  Timeline,
  Home,
  HomeWork,
  Construction,
  Business,
  SwapHoriz,
  TrendingUpSharp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { useInView as useIntersectionObserver } from 'react-intersection-observer';
import LoanApplicationPopup from '../components/UI/LoanApplicationPopup';
import '../styles/animations.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [openApplicationPopup, setOpenApplicationPopup] = useState(false);

  // Scroll progress for the scroll indicator - tracks entire document scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Remove all hero parallax effects that were causing issues

  // Animation variants - fixed for TypeScript compatibility
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Best Interest Rates',
      description:
        'Compare rates from 50+ banks and NBFCs to find the most competitive home loan rates in the market.',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Instant Approval',
      description:
        'Get pre-approved in minutes with our AI-powered eligibility engine and fast-track documentation.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Trusted',
      description:
        'Bank-grade security with end-to-end encryption. Your financial data is safe with us.',
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Minimal Documentation',
      description:
        'Digital KYC and document verification. Upload docs online and get instant verification.',
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: 'Expert Guidance',
      description:
        'Dedicated relationship managers to guide you through every step of your home loan journey.',
    },
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: 'End-to-End Support',
      description:
        'From application to disbursement, we provide complete assistance and track your loan progress.',
    },
  ];

  const loanTypes = [
    {
      title: 'Home Loan',
      description:
        'Traditional home loan for purchasing your dream home with competitive interest rates',
      rate: '7.35% onwards',
      icon: <Home sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Resale Home Loan',
      description: 'Finance for purchasing pre-owned residential properties with flexible terms',
      rate: '7.5% onwards',
      icon: <HomeWork sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Fresh Home Loan',
      description: 'New home loan for first-time buyers with special benefits and lower rates',
      rate: '7.4% onwards',
      icon: <TrendingUpSharp sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Under Construction Home Loan',
      description:
        'Stage-wise disbursement for homes under construction with flexible payment options',
      rate: '7.5% onwards',
      icon: <Construction sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Loan Against Property',
      description: 'Unlock the value of your property for business or personal financial needs',
      rate: '8.6% onwards',
      icon: <Business sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Balance Transfer & Top Up Home Loan',
      description: 'Transfer existing loan at better rates or get additional funds for your needs',
      rate: '7.5% onwards',
      icon: <SwapHoriz sx={{ fontSize: 32 }} />,
    },
  ];

  const stats = [
    { number: '₹150Cr+', label: 'Loans Disbursed' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '10+', label: 'Partner Banks' },
    { number: '4.8★', label: 'Customer Rating' },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Check Eligibility',
      description: 'Get instant eligibility in 2 minutes',
    },
    {
      step: '02',
      title: 'Compare Offers',
      description: 'Compare personalized loan offers',
    },
    {
      step: '03',
      title: 'Apply Online',
      description: 'Complete application in 10 minutes',
    },
    {
      step: '04',
      title: 'Get Approved',
      description: 'Receive approval in 24 hours',
    },
  ];

  // Custom hook for scroll-triggered animations - completely independent
  const AnimatedSection = ({ children, animation = fadeInUp, ...props }: any) => {
    const [ref, inView] = useIntersectionObserver({
      threshold: 0.1, // Lower threshold for better control
      triggerOnce: true,
      rootMargin: '-50px 0px', // Negative margin to prevent early triggering
    });

    return (
      <motion.div
        ref={ref}
        initial='hidden'
        animate={inView ? 'visible' : 'hidden'}
        variants={animation}
        style={{ isolation: 'isolate' }} // CSS isolation to prevent interference
        {...props}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Scroll Progress Indicator */}
      <motion.div
        className='scroll-indicator'
        style={{
          scaleX: scrollYProgress,
        }}
      />

      {/* Hero Section - no parallax, just static with internal animations */}
      <Box
        className='hero-section'
        sx={{
          minHeight: 'calc(100vh - 88px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 50%, #7B1FA2 100%)',
          overflow: 'hidden',
          paddingTop: '10px',
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />

        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
            zIndex: 0,
          }}
        />

        <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              alignItems: 'center',
              minHeight: {
                xs: 'calc(100vh - 100px)',
                sm: 'calc(100vh - 120px)',
                md: 'calc(100vh - 140px)',
              },
              gap: { xs: 4, sm: 6, lg: 8 },
              py: { xs: 4, sm: 6, md: 8 },
              textAlign: { xs: 'center', lg: 'left' },
            }}
          >
            {/* Left Content with animations */}
            <Box
              sx={{
                flex: 1,
                maxWidth: { xs: '100%', lg: '600px' },
                order: { xs: 1, lg: 1 },
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: { xs: 2, sm: 3 },
                    color: 'white',
                  }}
                >
                  Get Your Dream Home Loan at
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{
                      display: 'block',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Lowest Interest Rates
                  </motion.span>
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    mb: { xs: 3, sm: 4 },
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                  }}
                >
                  Compare home loans from 10+ banks and 50+ NBFCs. Get pre-approved Loan in 24 hours
                  at Lowest Interest & Return on Investment.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{
                  display: 'flex',
                  gap: 16,
                  flexWrap: 'wrap',
                  marginBottom: 32,
                  justifyContent: 'center',
                }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => navigate('/eligibility-checker')}
                    sx={{
                      minWidth: { xs: 160, sm: 180, md: 200 },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
                      color: '#000',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA726 0%, #FFD700 100%)',
                      },
                    }}
                  >
                    Check Eligibility
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant='outlined'
                    size='large'
                    onClick={() => navigate('/emi-calculator')}
                    sx={{
                      minWidth: { xs: 160, sm: 180, md: 200 },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      border: '2px solid white',
                      color: 'white',
                      fontWeight: 700,
                      '&:hover': {
                        backgroundColor: 'white',
                        color: '#304FFE',
                      },
                    }}
                  >
                    Calculate EMI
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => setOpenApplicationPopup(true)}
                    sx={{
                      minWidth: { xs: 160, sm: 180, md: 200 },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      color: 'white',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                      },
                    }}
                  >
                    Direct Apply
                  </Button>
                </motion.div>
              </motion.div>

              {/* Animated Quick Stats */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3, md: 4 }, // Responsive gap
                  flexWrap: 'wrap',
                  justifyContent: 'center', // Always center the stats
                  mt: { xs: 2, sm: 3 }, // Add top margin for better spacing
                }}
              >
                {[
                  { value: '7.35%*', label: 'Starting Rate' },
                  { value: '24hrs', label: 'Pre Approval Time' },
                  { value: '₹30 Lakh', label: 'Max Loan Amount' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                    style={{
                      textAlign: 'center',
                      minWidth: '80px', // Ensure consistent width
                      flex: '0 0 auto', // Prevent shrinking
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.5rem' },
                        fontWeight: 700,
                        color: 'white',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Right Visual with simple design */}
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                minHeight: 500,
              }}
            >
              {/* Simple floating card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 24,
                  padding: 48,
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  style={{ marginBottom: 24 }}
                >
                  <Home sx={{ fontSize: 80, color: 'white' }} />
                </motion.div>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Home Loan Solutions
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                  }}
                >
                  Trusted by 2L+ customers
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* All other sections - independent scroll animations */}
      {/* Animated Stats Section */}
      <AnimatedSection animation={staggerContainer}>
        <Box sx={{ py: 8, backgroundColor: 'var(--bg-secondary)' }}>
          <Container maxWidth='lg'>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 4,
                textAlign: 'center',
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  style={{ textAlign: 'center' }}
                >
                  <Typography
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: '#304FFE',
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Animated Features Section */}
      <AnimatedSection animation={staggerContainer}>
        <Box sx={{ py: 12, backgroundColor: 'var(--bg-primary)' }}>
          <Container maxWidth='lg'>
            <motion.div variants={fadeInUp} style={{ textAlign: 'center', marginBottom: 64 }}>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  mb: 2,
                  color: 'var(--text-primary)',
                }}
              >
                Why Choose Mittra?
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color: 'var(--text-secondary)',
                  maxWidth: 600,
                  margin: '0 auto',
                }}
              >
                India&apos;s most trusted home loan platform with cutting-edge technology and
                personalized service
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 4,
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 20px 60px rgba(48, 79, 254, 0.15)',
                  }}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: 24,
                    borderRadius: 16,
                    textAlign: 'center',
                    border: '1px solid rgba(48, 79, 254, 0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      color: '#304FFE',
                      marginBottom: 12,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Animated Loan Types Section */}
      <AnimatedSection animation={staggerContainer}>
        <Box sx={{ py: 12, backgroundColor: 'var(--bg-secondary)' }}>
          <Container maxWidth='lg'>
            <motion.div variants={fadeInUp} style={{ textAlign: 'center', marginBottom: 64 }}>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  mb: 2,
                  color: 'var(--text-primary)',
                }}
              >
                Home Loan Products
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color: 'var(--text-secondary)',
                  maxWidth: 600,
                  margin: '0 auto',
                }}
              >
                Choose from our comprehensive range of home loan products designed for every need
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 4,
              }}
            >
              {loanTypes.map((loan, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{
                    y: -10,
                    boxShadow: '0 25px 80px rgba(48, 79, 254, 0.2)',
                  }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      borderRadius: 3,
                      background: 'var(--bg-primary)',
                      border: '1px solid rgba(48, 79, 254, 0.1)',
                      height: '100%',
                    }}
                  >
                    <CardContent>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        style={{
                          color: '#304FFE',
                          marginBottom: 16,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {loan.icon}
                      </motion.div>
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {loan.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'var(--text-secondary)',
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {loan.description}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#304FFE',
                          mb: 3,
                        }}
                      >
                        {loan.rate}
                      </Typography>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => setOpenApplicationPopup(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)',
                            fontWeight: 700,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5C6FFF 0%, #304FFE 100%)',
                            },
                          }}
                        >
                          Apply Now
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Animated Process Section */}
      <AnimatedSection animation={staggerContainer}>
        <Box sx={{ py: 12, backgroundColor: 'var(--bg-primary)' }}>
          <Container maxWidth='lg'>
            <motion.div variants={fadeInUp} style={{ textAlign: 'center', marginBottom: 64 }}>
              <Typography
                sx={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  mb: 2,
                  color: 'var(--text-primary)',
                }}
              >
                Simple 4-Step Process
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color: 'var(--text-secondary)',
                  maxWidth: 600,
                  margin: '0 auto',
                }}
              >
                Get your home loan approved in just 4 simple steps with our streamlined process
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 4,
              }}
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', position: 'relative' }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 32px rgba(48, 79, 254, 0.3)',
                    }}
                  >
                    {step.step}
                  </motion.div>
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {step.description}
                  </Typography>

                  {/* Animated connecting line */}
                  {index < processSteps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                      viewport={{ once: true, margin: '0px' }}
                      className='process-connector'
                      style={{
                        position: 'absolute',
                        top: 40,
                        right: -16,
                        width: 32,
                        height: 2,
                        background: 'linear-gradient(90deg, #304FFE 0%, #5C6FFF 100%)',
                        transformOrigin: 'left',
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Animated CTA Section */}
      <AnimatedSection animation={staggerContainer}>
        <Box
          sx={{
            py: 12,
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
            }}
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(circle, rgba(48, 79, 254, 0.05) 0%, transparent 70%)',
              zIndex: 0,
            }}
          />

          <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div variants={fadeInUp} style={{ textAlign: 'center' }}>
              <Typography
                variant='h3'
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: 'var(--text-primary)',
                }}
              >
                Ready to Get Your Home Loan?
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  mb: 4,
                  color: 'var(--text-secondary)',
                  maxWidth: 600,
                  margin: '0 auto 32px',
                }}
              >
                Join thousands of satisfied customers who have found their perfect home loan through
                Mittra
              </Typography>

              <motion.div
                variants={staggerContainer}
                style={{
                  display: 'flex',
                  gap: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => navigate('/eligibility-checker')}
                    sx={{
                      minWidth: 250,
                      background: 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      py: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5C6FFF 0%, #304FFE 100%)',
                      },
                    }}
                  >
                    Check Eligibility Now
                  </Button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => navigate('/emi-calculator')}
                    sx={{
                      minWidth: 250,
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      py: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA726 0%, #FFD700 100%)',
                      },
                    }}
                  >
                    Calculate EMI
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Loan Application Popup */}
      <LoanApplicationPopup
        open={openApplicationPopup}
        onClose={() => setOpenApplicationPopup(false)}
        showEligibilitySummary={false}
      />
    </Box>
  );
};

export default HomePage;
