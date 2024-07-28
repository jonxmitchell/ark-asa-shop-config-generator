// src/components/SearchableDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function SearchableDropdown({ options, onSelect, placeholder, value }) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState(value || "");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const containerRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		setInputValue(value || "");
	}, [value]);

	useEffect(() => {
		setFilteredOptions(
			options.filter(
				(option) =>
					option.Name.toLowerCase().includes(inputValue.toLowerCase()) ||
					option.Blueprint.toLowerCase().includes(inputValue.toLowerCase())
			)
		);
	}, [inputValue, options]);

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onSelect({ Blueprint: newValue });
		setIsOpen(true);
	};

	const handleOptionSelect = (option) => {
		setInputValue(option.Blueprint);
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
				className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
			/>
			{isOpen && filteredOptions.length > 0 && <DropdownContent />}
		</div>
	);
}

export default SearchableDropdown;
