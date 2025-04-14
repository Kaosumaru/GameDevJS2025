import { JSX } from 'react';

export const HorizontalContainer = ({
  children,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        height: '100%',
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
