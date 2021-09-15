import { motion as m } from 'framer-motion';
import { FC } from 'react';

const Toggle: FC<{ className: string; toggleHandler: () => void }> = ({
  className,
  toggleHandler,
}) => {
  return (
    <m.div className={`${className} container-theme`} onClick={toggleHandler}>
      <m.div layout className="circle-theme"></m.div>
    </m.div>
  );
};

export default Toggle;
