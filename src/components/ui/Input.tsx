import { InputProps } from "@/src/types/InputTypes";

export const Input = ({
  type,
  placeholder,
  label,
  icon,
  id,
  error,
  register,
}: InputProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative">
          <input
            id={id}
            className={`peer w-full bg-transparent text-white placeholder:text-transparent outline-none py-3 ${icon ? "pl-10" : "pl-0"} border-b-2 ${error ? "border-b-red-500" : "border-b-green-500"} border-b-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
            type={type}
            placeholder={placeholder ?? " "}
            {...register}
          />

          <label
            htmlFor={id}
            className={`pointer-events-none absolute ${icon ? "left-10" : "left-0"} top-3 text-white transition-all duration-200 transform origin-left
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                        peer-focus:-translate-y-5 peer-focus:scale-75`}
          >
            {label}
          </label>
          <div
            className="
    relative
    after:absolute
    after:bottom-0
    after:left-0
    after:h-[2px]
    after:w-full
    after:bg-gradient-to-r
    after:from-[#284B27]
    after:via-[#20B11B]
    after:to-[#1DCC17]
    after:bg-[length:200%_100%]
    after:bg-left
    hover:after:bg-right
    after:transition-all
    after:duration-700
  "
          ></div>
          {icon && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-2">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};
