export const Dock = ({ children }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        position: 'absolute',
        overflow: 'hidden',
        bottom: '1rem',
        left: '50%',
        transform: 'translate(-50%, 0)',
      }}
    >
      {children}
    </div>
  );
};
