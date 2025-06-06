interface LabelProps {
  children?: any;
  className?: string;
  htmlFor?: string;
}

export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label
      className={`text-sm font-medium leading-none ${className || ''}`}
      {...props}
    >
      {children}
    </label>
  );
};
