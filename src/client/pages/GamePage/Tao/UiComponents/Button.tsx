import { JSX } from 'react';

export const Button = (
  props: JSX.IntrinsicElements['button'] & {
    children?: React.ReactNode;
  }
) => {
  return (
    <button
      {...props}
      style={{
        minWidth: '10rem',
        backgroundColor: 'lightblue',
        color: 'green',
        borderColor: 'skyblue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '1rem',
        fontSize: '2rem',
        padding: '1rem',
        fontFamily: 'Verdana',
      }}
    >
      {props.children}
    </button>
  );
};
