import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<any> {
  name?: string;
  label?: string;
  isCompulsory?: boolean;
  type?: string;
  opts?: Array<string>;
}

const InputBox = ({
  name,
  label,
  isCompulsory,
  type,
  opts,
  ...otherProps
}: Props): JSX.Element => {
  return (
    <div className="mt-6 font-normal text-base w-full">
      <label className=" " htmlFor={name}>
        {label ?? name}
        {isCompulsory && <span className="text-orange-600"> *</span>}
      </label>

      {type !== 'select' && (
        <input
          className="flex h-12 border rounded-md border-gray focus:border-green w-full outline-none px-4 placeholder:text-gray placeholder:text-base bg-lightBlack"
          type={type ?? 'text'}
          id={name}
          name={name}
          {...otherProps}
        />
      )}

      {type == 'select' && (
        <select
          className="flex h-12 border rounded-lg border-black focus:outline-orange-600 w-full outline-none px-4 bg-lightBlack border-r-[16px] outline-gray outline-1"
          id={name}
          name={name}
          {...otherProps}
        >
          {/* <option className="text-white">Select one...</option> */}
          {opts &&
            opts.map((item) => {
              return (
                <option
                  key={item}
                  value={item.toLowerCase()}
                  selected={otherProps?.value == item ? true : false}
                >
                  {item}
                </option>
              );
            })}
        </select>
      )}
    </div>
  );
};

export default InputBox;
