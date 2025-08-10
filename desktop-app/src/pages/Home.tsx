import React from 'react';
import { Box, Container, VStack, HStack, Spacer } from '@chakra-ui/react';
import { 
  HeroTitle, 
  SectionTitle, 
  SubsectionTitle, 
  BodyText, 
  LargeText,
  SmallText,
  Caption,
  Label,
  GradientText,
  TextReveal,
  AnimatedText,
  StaggeredText,
  ResponsiveText
} from '../components/typography';

/**
 * Home page component showcasing enhanced typography system
 * Requirements: 2.1, 2.2, 2.4, 7.2 - Enhanced typography with gradient effects and animations
 */
const Home: React.FC = () => {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Container maxW="7xl" py={16}>
        <VStack spacing={16} align="stretch">
          {/* Hero Section */}
          <Box textAlign="center" py={20}>
            <TextReveal delay={300}>
              <HeroTitle 
                gradient="primary" 
                animated={true}
                className="mb-6"
              >
                The Export Express
              </HeroTitle>
            </TextReveal>
            
            <AnimatedText animation="slideUp" delay={600}>
              <LargeText className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Transform your export business with AI-powered insights, 
                real-time market intelligence, and seamless global trade management.
              </LargeText>
            </AnimatedText>

            <AnimatedText animation="fadeIn" delay={900}>
              <HStack justify="center" spacing={4} flexWrap="wrap">
                <Box className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow cursor-pointer">
                  Get Started
                </Box>
                <Box className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  Learn More
                </Box>
              </HStack>
            </AnimatedText>
          </Box>

          {/* Features Section */}
          <Box py={16}>
            <TextReveal>
              <SectionTitle 
                gradient="secondary" 
                className="text-center mb-4"
              >
                Powerful Features
              </SectionTitle>
            </TextReveal>
            
            <AnimatedText animation="slideUp" delay={200}>
              <BodyText className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                Discover how our AI-powered platform revolutionizes export management 
                with cutting-edge technology and intelligent automation.
              </BodyText>
            </AnimatedText>

            <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "AI Market Intelligence",
                  description: "Real-time market analysis and price predictions powered by machine learning algorithms.",
                  gradient: "accent" as const
                },
                {
                  title: "Smart Order Management",
                  description: "Streamlined order processing with automated workflows and intelligent routing.",
                  gradient: "success" as const
                },
                {
                  title: "Global Trade Analytics",
                  description: "Comprehensive insights into trade patterns, opportunities, and market trends.",
                  gradient: "warning" as const
                }
              ].map((feature, index) => (
                <AnimatedText key={index} animation="scaleIn" delay={300 + index * 200}>
                  <Box className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <GradientText gradient={feature.gradient} className="text-2xl font-bold mb-4 block">
                      {feature.title}
                    </GradientText>
                    <BodyText className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </BodyText>
                  </Box>
                </AnimatedText>
              ))}
            </Box>
          </Box>

          {/* Statistics Section */}
          <Box py={16} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <Container maxW="6xl">
              <TextReveal>
                <SectionTitle 
                  gradient="primary" 
                  className="text-center mb-12"
                >
                  Trusted by Exporters Worldwide
                </SectionTitle>
              </TextReveal>

              <Box className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { number: "10,000+", label: "Active Exporters" },
                  { number: "₹2.8B+", label: "Trade Volume" },
                  { number: "150+", label: "Countries Served" },
                  { number: "99.9%", label: "Uptime" }
                ].map((stat, index) => (
                  <AnimatedText key={index} animation="slideUp" delay={200 + index * 100}>
                    <Box textAlign="center">
                      <GradientText 
                        gradient="primary" 
                        className="text-4xl font-bold block mb-2"
                      >
                        {stat.number}
                      </GradientText>
                      <Label className="text-gray-600 dark:text-gray-400 uppercase">
                        {stat.label}
                      </Label>
                    </Box>
                  </AnimatedText>
                ))}
              </Box>
            </Container>
          </Box>

          {/* Typography Showcase Section */}
          <Box py={16}>
            <TextReveal>
              <SectionTitle className="text-center mb-12">
                Typography System Showcase
              </SectionTitle>
            </TextReveal>

            <VStack spacing={8} align="stretch">
              {/* Gradient Text Examples */}
              <Box>
                <SubsectionTitle className="mb-4">Gradient Text Effects</SubsectionTitle>
                <VStack spacing={4} align="start">
                  <GradientText gradient="primary" className="text-3xl font-bold">
                    Primary Gradient Text
                  </GradientText>
                  <GradientText gradient="secondary" className="text-3xl font-bold">
                    Secondary Gradient Text
                  </GradientText>
                  <GradientText gradient="accent" className="text-3xl font-bold">
                    Accent Gradient Text
                  </GradientText>
                  <GradientText gradient="success" className="text-3xl font-bold">
                    Success Gradient Text
                  </GradientText>
                </VStack>
              </Box>

              {/* Responsive Typography */}
              <Box>
                <SubsectionTitle className="mb-4">Responsive Typography</SubsectionTitle>
                <ResponsiveText 
                  sizes={{
                    mobile: "2xl",
                    tablet: "4xl", 
                    desktop: "6xl"
                  }}
                  className="font-bold text-gray-800 dark:text-gray-200"
                >
                  This text scales responsively across devices
                </ResponsiveText>
              </Box>

              {/* Staggered Text Animation */}
              <Box>
                <SubsectionTitle className="mb-4">Staggered Text Animation</SubsectionTitle>
                <StaggeredText 
                  text="This text animates word by word with a staggered effect"
                  className="text-2xl font-semibold text-gray-700 dark:text-gray-300"
                  animation="slideUp"
                  staggerDelay={150}
                  splitBy="word"
                />
              </Box>

              {/* Typography Hierarchy */}
              <Box>
                <SubsectionTitle className="mb-4">Typography Hierarchy</SubsectionTitle>
                <VStack spacing={4} align="start">
                  <HeroTitle className="text-gray-800 dark:text-gray-200">
                    Hero Title (H1)
                  </HeroTitle>
                  <SectionTitle className="text-gray-800 dark:text-gray-200">
                    Section Title (H2)
                  </SectionTitle>
                  <SubsectionTitle className="text-gray-800 dark:text-gray-200">
                    Subsection Title (H3)
                  </SubsectionTitle>
                  <LargeText className="text-gray-600 dark:text-gray-400">
                    Large body text for important content and introductions.
                  </LargeText>
                  <BodyText className="text-gray-600 dark:text-gray-400">
                    Regular body text for standard content and descriptions.
                  </BodyText>
                  <SmallText className="text-gray-500 dark:text-gray-500">
                    Small text for secondary information and details.
                  </SmallText>
                  <Caption className="text-gray-400 dark:text-gray-600">
                    Caption Text
                  </Caption>
                  <Label className="text-gray-500 dark:text-gray-500">
                    Label Text
                  </Label>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;