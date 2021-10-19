import { motion as m } from 'framer-motion';

const LoadingItem = ({
  delay = 0,
  origin = 0,
}: {
  delay?: number;
  origin?: number;
}) => {
  return (
    <m.div
      className="animation__item"
      style={{ originX: origin }}
      initial={{ scaleX: origin }}
      animate={{
        scaleX: origin === 0 ? 1 : 0,
      }}
      transition={{
        duration: 0.75,
        repeat: Infinity,
        delay: delay,
        repeatType: 'mirror',
        type: 'tween',
      }}
    ></m.div>
  );
};

const Loading = () => {
  return (
    <div className="animation__container">
      <LoadingItem origin={1} />
      <LoadingItem delay={0.75} />
      <LoadingItem delay={0.4} origin={1} />
      <LoadingItem delay={0.5} />
    </div>
  );
};

export default Loading;
