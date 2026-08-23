import { useScroll, useTransform, useSpring } from "framer-motion";

const BG_URL =
  "https://res.cloudinary.com/dd7vy0y6n/image/upload/v1755818346/retrato-de-jovenes-en-el-mercado-comunitario_4_o4bffv.jpg";

export const useLandingBackground = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const blur = useTransform(smooth, [0, 0.5, 1], [0, 8, 16]);
  const darkness = useTransform(smooth, [0, 1], [0.45, 0.65]);

  const backgroundColor = useTransform(
    darkness,
    (value) => `rgba(0, 0, 0, ${value})`
  );
  const backdropFilter = useTransform(blur, (value) => `blur(${value}px)`);

  return { BG_URL, backgroundColor, backdropFilter };
};