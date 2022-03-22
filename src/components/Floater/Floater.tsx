import { FC, useState, CSSProperties } from 'react';
import { usePopper } from 'react-popper';

export const Floater: FC<{
  referenceElement: HTMLElement | null;
  styles?: CSSProperties;
}> = ({ referenceElement, children, styles: customStyles }) => {
  //Should we have something like floater or maybe just use a simply div with position absolute

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
