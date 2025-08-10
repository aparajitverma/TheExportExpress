import React from "react";
import { motion } from "framer-motion";
import {
  TextRevealAnimation,
  StaggeredTextReveal,
  CharacterReveal,
  LineReveal,
} from "./TextRevealAnimation";

interface TypographyProps {
  children: React.ReactNode;
  variant?:
    | "hero"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body-hero"
    | "body-large"
    | "body-normal"
    | "body-small"
    | "caption"
    | "label"
    | "label-large";
  gradient?:
    | "primary"
    | "secondary"
    | "accent"
    | "hero"
    | "success"
    | "warning"
    | "error"
    | "rainbow"
    | "static"
    | "none";
  shadow?: "sm" | "md" | "lg" | "xl" | "glow" | "none";
  animation?:
    | "reveal"
    | "fade-in"
    | "slide-up"
    | "scale-in"
    | "shimmer"
    | "glow-pulse"
    | "none";
  animationDelay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body-normal",
  gradient = "none",
  shadow = "none",
  animation = "none",
  animationDelay = 0,
  className = "",
  as,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "hero":
        return "heading-hero";
      case "h1":
        return "heading-1";
      case "h2":
        return "heading-2";
      case "h3":
        return "heading-3";
      case "h4":
        return "heading-4";
      case "h5":
        return "heading-5";
      case "h6":
        return "heading-6";
      case "body-hero":
        return "body-hero";
      case "body-large":
        return "body-large";
      case "body-normal":
        return "body-normal";
      case "body-small":
        return "body-small";
      case "caption":
        return "caption";
      case "label":
        return "label";
      case "label-large":
        return "label-large";
      default:
        return "body-normal";
    }
  };

  const getGradientClasses = () => {
    if (gradient === "none") return "";
    return `text-gradient-${gradient}`;
  };

  const getShadowClasses = () => {
    if (shadow === "none") return "";
    return `text-shadow-${shadow}`;
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case "fade-in":
        return `text-fade-in ${
          animationDelay > 0
            ? `text-fade-in-delay-${Math.min(
                Math.ceil(animationDelay / 0.2),
                5
              )}`
            : ""
        }`;
      case "slide-up":
        return `text-slide-up ${
          animationDelay > 0
            ? `text-slide-up-delay-${Math.min(
                Math.ceil(animationDelay / 0.2),
                4
              )}`
            : ""
        }`;
      case "scale-in":
        return `text-scale-in ${
          animationDelay > 0
            ? `text-scale-in-delay-${Math.min(
                Math.ceil(animationDelay / 0.2),
                3
              )}`
            : ""
        }`;
      case "shimmer":
        return "text-shimmer";
      case "glow-pulse":
        return "text-glow-pulse";
      case "reveal":
        return "text-reveal";
      default:
        return "";
    }
  };

  const combinedClasses = [
    getVariantClasses(),
    getGradientClasses(),
    getShadowClasses(),
    getAnimationClasses(),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Component = as || getDefaultElement(variant);

  if (animation === "reveal") {
    return (
      <TextRevealAnimation className={combinedClasses} delay={animationDelay}>
        <Component className={combinedClasses}>{children}</Component>
      </TextRevealAnimation>
    );
  }

  return <Component className={combinedClasses}>{children}</Component>;
};

const getDefaultElement = (variant: string): keyof JSX.IntrinsicElements => {
  switch (variant) {
    case "hero":
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "caption":
    case "label":
    case "label-large":
      return "span";
    default:
      return "p";
  }
};

interface GradientTextProps {
  children: React.ReactNode;
  gradient?:
    | "primary"
    | "secondary"
    | "accent"
    | "hero"
    | "success"
    | "warning"
    | "error"
    | "rainbow";
  className?: string;
  animated?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = "primary",
  className = "",
  animated = true,
}) => {
  const gradientClass = animated
    ? `text-gradient-${gradient}`
    : "text-gradient-static";

  return <span className={`${gradientClass} ${className}`}>{children}</span>;
};

interface AnimatedHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?:
    | "primary"
    | "secondary"
    | "accent"
    | "hero"
    | "success"
    | "warning"
    | "error"
    | "rainbow"
    | "none";
  animation?:
    | "reveal"
    | "staggered"
    | "character"
    | "fade-in"
    | "slide-up"
    | "scale-in";
  className?: string;
  delay?: number;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  children,
  level = 1,
  gradient = "primary",
  animation = "reveal",
  className = "",
  delay = 0,
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const variantClass = level === 1 ? "heading-1" : `heading-${level}`;
  const gradientClass = gradient !== "none" ? `text-gradient-${gradient}` : "";
  const combinedClasses =
    `${variantClass} ${gradientClass} ${className}`.trim();

  const text = typeof children === "string" ? children : "";

  switch (animation) {
    case "staggered":
      return (
        <HeadingTag className={combinedClasses}>
          <StaggeredTextReveal
            text={text}
            wordDelay={0.1}
            revealDuration={0.8}
            trigger="viewport"
          />
        </HeadingTag>
      );

    case "character":
      return (
        <HeadingTag className={combinedClasses}>
          <CharacterReveal
            text={text}
            charDelay={0.05}
            revealDuration={0.6}
            trigger="viewport"
          />
        </HeadingTag>
      );

    case "reveal":
      return (
        <HeadingTag className={combinedClasses}>
          <TextRevealAnimation delay={delay}>{children}</TextRevealAnimation>
        </HeadingTag>
      );

    case "fade-in":
      return (
        <HeadingTag
          className={`${combinedClasses} text-fade-in`}
          style={{ animationDelay: `${delay}s` }}
        >
          {children}
        </HeadingTag>
      );

    case "slide-up":
      return (
        <HeadingTag
          className={`${combinedClasses} text-slide-up`}
          style={{ animationDelay: `${delay}s` }}
        >
          {children}
        </HeadingTag>
      );

    case "scale-in":
      return (
        <HeadingTag
          className={`${combinedClasses} text-scale-in`}
          style={{ animationDelay: `${delay}s` }}
        >
          {children}
        </HeadingTag>
      );

    default:
      return <HeadingTag className={combinedClasses}>{children}</HeadingTag>;
  }
};

interface ResponsiveTextProps {
  children: React.ReactNode;
  desktopSize?: string;
  tabletSize?: string;
  mobileSize?: string;
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  desktopSize = "text-base",
  tabletSize,
  mobileSize,
  className = "",
}) => {
  const tabletClass = tabletSize ? `md:${tabletSize}` : "";
  const mobileClass = mobileSize ? `sm:${mobileSize}` : "";
  const combinedClasses =
    `${mobileClass} ${tabletClass} ${desktopSize} ${className}`.trim();

  return <span className={combinedClasses}>{children}</span>;
};

interface TypographyShowcaseProps {
  className?: string;
}

export const TypographyShowcase: React.FC<TypographyShowcaseProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Typography */}
      <div className="space-y-4">
        <Typography variant="h2" gradient="primary">
          Typography Showcase
        </Typography>

        <AnimatedHeading level={1} gradient="hero" animation="reveal">
          Hero Heading with Gradient
        </AnimatedHeading>

        <Typography
          variant="body-large"
          animation="fade-in"
          animationDelay={0.5}
        >
          This is a large body text that demonstrates the enhanced typography
          system with smooth animations and responsive scaling.
        </Typography>
      </div>

      {/* Heading Hierarchy */}
      <div className="space-y-4">
        <Typography variant="h3" gradient="accent">
          Heading Hierarchy
        </Typography>

        <AnimatedHeading level={1} animation="staggered">
          Heading Level 1 - Staggered Animation
        </AnimatedHeading>

        <AnimatedHeading level={2} gradient="secondary" animation="character">
          Heading Level 2 - Character Reveal
        </AnimatedHeading>

        <Typography variant="h3" gradient="success" animation="slide-up">
          Heading Level 3 - Slide Up Animation
        </Typography>

        <Typography variant="h4" shadow="md" animation="scale-in">
          Heading Level 4 - Scale In with Shadow
        </Typography>
      </div>

      {/* Body Text Variations */}
      <div className="space-y-4">
        <Typography variant="h3" gradient="warning">
          Body Text Variations
        </Typography>

        <Typography variant="body-hero" animation="shimmer">
          Hero body text with shimmer effect for important introductory content.
        </Typography>

        <Typography variant="body-large" shadow="sm">
          Large body text with subtle shadow for enhanced readability and visual
          hierarchy.
        </Typography>

        <Typography variant="body-normal">
          Normal body text that serves as the foundation for most content
          throughout the application.
        </Typography>

        <Typography variant="body-small" className="text-gray-600">
          Small body text used for secondary information, captions, and
          supporting details.
        </Typography>
      </div>

      {/* Gradient Text Examples */}
      <div className="space-y-4">
        <Typography variant="h3" gradient="error">
          Gradient Text Effects
        </Typography>

        <div className="space-y-2">
          <GradientText gradient="primary">Primary Gradient Text</GradientText>
          <br />
          <GradientText gradient="secondary">
            Secondary Gradient Text
          </GradientText>
          <br />
          <GradientText gradient="accent">Accent Gradient Text</GradientText>
          <br />
          <GradientText gradient="hero">Hero Gradient Text</GradientText>
          <br />
          <GradientText gradient="rainbow">Rainbow Gradient Text</GradientText>
        </div>
      </div>

      {/* Responsive Typography */}
      <div className="space-y-4">
        <Typography variant="h3" gradient="success">
          Responsive Typography
        </Typography>

        <ResponsiveText
          mobileSize="text-sm"
          tabletSize="text-base"
          desktopSize="text-lg"
        >
          This text scales responsively: small on mobile, base on tablet, and
          large on desktop.
        </ResponsiveText>
      </div>

      {/* Labels and Captions */}
      <div className="space-y-4">
        <Typography variant="h3" gradient="primary">
          Labels and Captions
        </Typography>

        <div className="space-y-2">
          <Typography variant="label-large" className="text-gray-700">
            Large Label
          </Typography>
          <Typography variant="label" className="text-gray-600">
            Standard Label
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            Caption Text
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Typography;
