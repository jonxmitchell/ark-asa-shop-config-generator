// src/components/settings/PasswordInput.jsx

import React, { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";

const PasswordInput = ({ value, onChange, disabled, showTooltips }) => {
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
		<>
			<div className="relative flex items-center">
				<div
					ref={inputRef}
					contentEditable={!disabled}
					onInput={handleInput}
					data-autocomplete="off"
					className={`w-full min-h-[38px] px-3 py-2 pr-10 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
						disabled ? "opacity-50 cursor-not-allowed" : "focus:outline-none"
					}`}
					style={{
						WebkitTextSecurity: showPassword ? "none" : "disc",
						wordBreak: "break-all",
					}}
					data-tooltip-id="password-input-tooltip"
				/>
				<button
					type="button"
					className="absolute right-0 pr-3 flex items-center h-full"
					onClick={() => setShowPassword(!showPassword)}
					disabled={disabled}
					data-tooltip-id="password-toggle-tooltip">
					{showPassword ? (
						<EyeSlashIcon className="h-5 w-5 text-gray-400" />
					) : (
						<EyeIcon className="h-5 w-5 text-gray-400" />
					)}
				</button>
			</div>
			{showTooltips && (
				<>
					<Tooltip
						id="password-input-tooltip"
						place="top"
						content="Enter your password"
					/>
					<Tooltip
						id="password-toggle-tooltip"
						place="top"
						content="Toggle password visibility"
					/>
				</>
			)}
		</>
	);
};

export default PasswordInput;
