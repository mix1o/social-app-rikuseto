import { motion as m } from 'framer-motion';
import { FC } from 'react';

const Toggle: FC<{ className: string; toggleHandler: () => void }> = ({
  className,
  toggleHandler,
}) => {
  return (
    <m.button
      className={`${className} container-theme`}
      onClick={toggleHandler}
    >
      <m.div layout className="circle-theme"></m.div>
    </m.button>
  );
};

export default Toggle;
