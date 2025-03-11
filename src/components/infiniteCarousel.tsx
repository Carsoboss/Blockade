/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import type { AnimationControls, MotionValue } from "framer-motion";
import { animate, motion, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";
import questions from "../data/questions";
import { Logo } from "./icons"; // Import the SVG logo component

interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
}

const CarouselButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <motion.button
      className="whitespace-nowrap rounded-md bg-gray-800 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
      onClick={() => onClick(label)}
    >
      {label}
    </motion.button>
  );
};

interface InfiniteCarouselProps {
  onClick: (label: string) => void;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({ onClick }) => {
  const questionsLayer1 = [...questions];
  const questionsLayer2 = [...questions];
  const questionsLayer3 = [...questions].reverse();

  const FAST_DURATION = 500;
  const SLOW_DURATION = 800;

  const [duration, setDuration] = useState<number>(FAST_DURATION);
  const [ref, bounds] = useMeasure();

  const xTranslation1: MotionValue<number> = useMotionValue(0);
  const xTranslation2: MotionValue<number> = useMotionValue(0);
  const xTranslation3: MotionValue<number> = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);

  useEffect(() => {
    const animateRow = (
      xTranslation: MotionValue<number>,
      duration: number,
    ) => {
      let controls: AnimationControls | undefined;
      const finalPosition: number = -bounds.width / 2 - 8;

      if (mustFinish) {
        controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
          ease: "linear",
          duration: duration * (1 - xTranslation.get() / finalPosition),
          onComplete: () => {
            setMustFinish(false);
            setRerender(!rerender);
          },
        }) as unknown as AnimationControls;
      } else {
        controls = animate(xTranslation, [0, finalPosition], {
          ease: "linear",
          duration: duration,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }) as unknown as AnimationControls;
      }

      return controls;
    };

    const controls1 = animateRow(xTranslation1, duration * 2.4);
    const controls2 = animateRow(xTranslation2, duration * 2); // Slightly slower
    const controls3 = animateRow(xTranslation3, duration * 2.2); // Slightly slower

    return () => {
      controls1?.stop();
      controls2?.stop();
      controls3?.stop();
    };
  }, [
    rerender,
    xTranslation1,
    xTranslation2,
    xTranslation3,
    duration,
    bounds.width,
    mustFinish,
  ]);

  const handleButtonClick = (label: string) => {
    setDuration(SLOW_DURATION); // Slow down on button click
    onClick(label); // Call the onClick prop with the label
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 overflow-x-hidden">
      <Logo className="mb-8 h-24 w-24" />
      {[questionsLayer1, questionsLayer2, questionsLayer3].map(
        (layerQuestions, rowIndex) => (
          <motion.div
            key={rowIndex}
            className={`flex gap-4 ${
              rowIndex % 2 === 0 ? "translate-x-8" : ""
            }`}
            style={{
              x: [xTranslation1, xTranslation2, xTranslation3][rowIndex],
            }}
            ref={ref as unknown as React.RefObject<HTMLDivElement>}
            onHoverStart={() => {
              setMustFinish(true);
              setDuration(SLOW_DURATION);
            }}
            onHoverEnd={() => {
              setMustFinish(true);
              setDuration(FAST_DURATION);
            }}
          >
            {[...layerQuestions, ...layerQuestions].map((question, idx) => (
              <CarouselButton
                label={question}
                key={idx + rowIndex * layerQuestions.length}
                onClick={handleButtonClick}
              />
            ))}
          </motion.div>
        ),
      )}
    </div>
  );
};

export default InfiniteCarousel;
