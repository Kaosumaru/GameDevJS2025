export const Dock = (props: { children: React.ReactNode; style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translate(-50%, 0)',
      }}
    >
      {props.children}
    </div>
  );
};
