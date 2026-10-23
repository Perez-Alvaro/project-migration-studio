
import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

type FadeDir = "up" | "down" | "left" | "right" | "none";

interface FadeInProps extends HTMLMotionProps<"div"> {
    direction?: FadeDir;
    delay?: number;
    duration?: number;
    distance?: number;
    staggerChildren?: number;
    children?: React.ReactNode;
    className?: string;
}

export const FadeIn = ({
    children,
    direction = "up",
    delay = 0,
    duration = 0.5,
    distance = 20,
    staggerChildren,
    ...props
}: FadeInProps) => {
    const directions = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: { x: 0, y: 0 },
    };

    const variants: Variants = {
        hidden: {
            opacity: 0,
            ...directions[direction],
        },
        show: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
                ...(staggerChildren && { staggerChildren }),
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const FadeInStagger = ({
    children,
    staggerChildren = 0.1,
    delay = 0,
    ...props
}: FadeInProps) => {
    return (
        <FadeIn
            direction="none"
            staggerChildren={staggerChildren}
            delay={delay}
            {...props}
        >
            {children}
        </FadeIn>
    );
};

export const FadeInStaggerItem = ({ children, ...props }: FadeInProps) => {
    const variants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <motion.div variants={variants} {...props}>
            {children}
        </motion.div>
    );
};
