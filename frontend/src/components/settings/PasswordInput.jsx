import React, { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const PasswordInput = ({ value, onChange, disabled }) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.textContent = value;
		}
	}, [value]);

	const handleInput = (e) => {
		const newValue = e.target.textContent;
		onChange({ target: { name: "MysqlPass", value: newValue } });
	};

	return (
		<div className="relative">
			<div
				ref={inputRef}
				contentEditable={!disabled}
				onInput={handleInput}
				className={`w-full px-3 py-2 pr-10 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
					disabled ? "opacity-50 cursor-not-allowed" : "focus:outline-none"
				}`}
				style={{
					WebkitTextSecurity: showPassword ? "none" : "disc",
					wordBreak: "break-all",
				}}
			/>
			<button
				type="button"
				className="absolute inset-y-0 right-0 pr-3 flex items-center"
				onClick={() => setShowPassword(!showPassword)}
				disabled={disabled}>
				{showPassword ? (
					<EyeSlashIcon className="h-5 w-5 text-gray-400" />
				) : (
					<EyeIcon className="h-5 w-5 text-gray-400" />
				)}
			</button>
		</div>
	);
};

export default PasswordInput;
