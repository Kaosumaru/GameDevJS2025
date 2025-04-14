export const HorizontalContainer = (props: { children: React.ReactNode; style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        height: '100%',
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};
