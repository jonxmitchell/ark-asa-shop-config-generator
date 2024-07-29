// src/components/SearchableDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function SearchableDropdown({
	options,
	onSelect,
	placeholder,
	value,
	className,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState(value || "");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const containerRef = useRef(null);
	const inputRef = useRef(null);

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

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onSelect(newValue);
		setIsOpen(true);
	};

	const handleOptionSelect = (option) => {
		const selectedValue =
			option.ClassName || option.Blueprint || option.Name || "";
		setInputValue(selectedValue);
		onSelect(option);
		setIsOpen(false);
	};

	const DropdownContent = () => {
		const rect = inputRef.current.getBoundingClientRect();
		return ReactDOM.createPortal(
			<div
				className="fixed z-50 bg-mid-black rounded-lg shadow-xl"
				style={{
					top: `${rect.bottom + window.scrollY + 5}px`,
					left: `${rect.left + window.scrollX}px`,
					width: `${rect.width}px`,
					maxHeight: "300px",
					overflowY: "auto",
				}}>
				<ul className="py-1">
					{filteredOptions.map((option) => (
						<li
							key={option.ID}
							onMouseDown={(e) => {
								e.preventDefault(); // Prevent input blur
								handleOptionSelect(option);
							}}
							className="px-3 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer">
							{option.Name}
						</li>
					))}
				</ul>
			</div>,
			document.body
		);
	};

	return (
		<div ref={containerRef} className="relative">
			<input
				ref={inputRef}
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setTimeout(() => setIsOpen(false), 200)}
				placeholder={placeholder}
				className={`w-full px-3 py-2 text-sm text-white rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${className}`}
			/>
			{isOpen && filteredOptions.length > 0 && <DropdownContent />}
		</div>
	);
}

export default SearchableDropdown;
