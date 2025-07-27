import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Home, AccountBalance, Security, TrendingUp } from '@mui/icons-material';

const FinanceLoader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #304FFE 100%)',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Floating background icons - full screen positioned */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          opacity: 0.15,
          zIndex: 1
        }}
      >
        <AccountBalance sx={{
          fontSize: { xs: 48, sm: 64, md: 80 },
          color: 'white'
        }} />
      </motion.div>

      <motion.div
        animate={{
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          opacity: 0.15,
          zIndex: 1
        }}
      >
        <Security sx={{
          fontSize: { xs: 40, sm: 56, md: 72 },
          color: 'white'
        }} />
      </motion.div>

      <motion.div
        animate={{
          y: [-25, 25, -25],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          opacity: 0.15,
          zIndex: 1
        }}
      >
        <TrendingUp sx={{
          fontSize: { xs: 44, sm: 60, md: 76 },
          color: 'white'
        }} />
      </motion.div>

      <motion.div
        animate={{
          y: [-18, 18, -18],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '10%',
          opacity: 0.15,
          zIndex: 1
        }}
      >
        <Home sx={{
          fontSize: { xs: 42, sm: 58, md: 74 },
          color: 'white'
        }} />
      </motion.div>      {/* Main content container - centered in full screen */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          textAlign: 'center',
          zIndex: 2,
          maxWidth: '500px',
          width: '90%',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 2, sm: 3 },
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: { xs: '15px', sm: '18px' },
            padding: { xs: '15px', sm: '20px' },
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Home sx={{
            fontSize: { xs: 36, sm: 48, md: 56 },
            color: 'white',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
          }} />
        </Box>

        <motion.div
          animate={{
            textShadow: [
              "0 0 8px rgba(255,255,255,0.6)",
              "0 0 20px rgba(255,255,255,0.9)",
              "0 0 8px rgba(255,255,255,0.6)"
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: { xs: 1, sm: 2 },
              letterSpacing: '0.5px',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
              textAlign: 'center'
            }}
          >
            Home Loan Mittra
          </Typography>
        </motion.div>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 400,
            letterSpacing: '0.5px',
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
            textAlign: 'center'
          }}
        >
          MAKING HOME LOANS EFFORTLESS
        </Typography>
      </motion.div>

      {/* Progress indicator - component sized */}
      <Box sx={{
        position: 'relative',
        display: 'inline-flex',
        mb: { xs: 2, sm: 3 },
        zIndex: 2
      }}>
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: 'white',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
              }
            }}
          />
        </motion.div>
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
              letterSpacing: '1px'
            }}
          >
            LOADING
          </Typography>
        </Box>
      </Box>

      {/* Loading text with dots - compact */}
      <Box sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
        mb: { xs: 2, sm: 3 },
        zIndex: 2
      }}>
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            mr: 1,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 400,
            letterSpacing: '0.25px'
          }}
        >
          Preparing your experience
        </Typography>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
            style={{
              width: 6,
              height: 6,
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 6px rgba(255,255,255,0.4)'
            }}
          />
        ))}
      </Box>

      {/* Simple bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          textAlign: 'center',
          zIndex: 2,
          marginTop: '1rem'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontStyle: 'italic',
            fontSize: { xs: '0.75rem', sm: '0.825rem' },
            fontWeight: 300
          }}
        >
          Your trusted partner in home financing
        </Typography>
      </motion.div>
    </Box>
  );
};

export default FinanceLoader;
