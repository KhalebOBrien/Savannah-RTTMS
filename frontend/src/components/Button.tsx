import LoadingWheel from './LoadingWheel';

interface Props {
  text: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  classes?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const Button = (props: Props): JSX.Element => {
  const { type, text, classes, isLoading, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg bg-green ${classes}`}
      type={type ?? `button`}
    >
      {isLoading && <LoadingWheel />}
      {text}
    </button>
  );
};

export default Button;
