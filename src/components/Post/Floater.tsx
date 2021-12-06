import { FC, useState, CSSProperties } from 'react';
import { usePopper } from 'react-popper';

const CustomFloater: FC<{
  referenceElement: HTMLElement | null;
  styles?: CSSProperties;
}> = ({ referenceElement, children, styles: customStyles }) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    modifiers: [],
  });

  return (
    <div
      ref={node => setPopperElement(node)}
      style={{
        ...styles.popper,
        ...customStyles,
        minWidth: '12ch',
        zIndex: 999,
        padding: '1rem',
      }}
      {...attributes.popper}
    >
      {children}
    </div>
  );
};

export default CustomFloater;
