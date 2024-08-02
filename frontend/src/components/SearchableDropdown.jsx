// src/components/SearchableDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

function SearchableDropdown({
	options,
	onSelect,
	placeholder,
	value,
	className,
	onDropdownToggle,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState(value || "");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const dropdownRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		setInputValue(value || "");
	}, [value]);

	useEffect(() => {
		if (Array.isArray(options)) {
			setFilteredOptions(
				options.filter((option) => {
					const optionName = option.Name || option.ClassName || "";
					const optionBlueprint = option.Blueprint || option.ClassName || "";
					return (
						optionName.toLowerCase().includes(inputValue.toLowerCase()) ||
						optionBlueprint.toLowerCase().includes(inputValue.toLowerCase())
					);
				})
			);
		} else {
			setFilteredOptions([]);
		}
	}, [inputValue, options]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				setIsOpen(false);
				onDropdownToggle && onDropdownToggle(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onDropdownToggle]);

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onSelect(newValue);
		setIsOpen(true);
		onDropdownToggle && onDropdownToggle(true);
	};

	const handleOptionSelect = (option) => {
		const selectedValue = option.Blueprint || option.Name || "";
		setInputValue(selectedValue);
		onSelect(option);
		setIsOpen(false);
		onDropdownToggle && onDropdownToggle(false);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
		onDropdownToggle && onDropdownToggle(!isOpen);
	};

	return (
		<div ref={containerRef} className="relative">
			<div className="relative">
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onFocus={() => {
						setIsOpen(true);
						onDropdownToggle && onDropdownToggle(true);
					}}
					placeholder={placeholder}
					className={`w-full px-3 py-2 pr-10 text-sm text-white rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${className}`}
				/>
				<button
					onClick={toggleDropdown}
					className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
					<ChevronDownIcon className="w-5 h-5" />
				</button>
			</div>
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute z-50 w-full mt-1 bg-mid-black border-2 border-blue-600 rounded-lg shadow-md"
					style={{
						maxHeight: "200px",
						overflowY: "auto",
						position: "absolute",
						top: "100%",
						left: 0,
					}}>
					<ul className="py-1 text-sm text-gray-200">
						{filteredOptions.map((option) => (
							<li
								key={option.ID || option.Blueprint}
								onClick={() => handleOptionSelect(option)}
								className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
								{option.Name || option.ClassName}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default SearchableDropdown;
