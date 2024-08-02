// src/components/settings/MessagesSettings.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useConfig } from "../ConfigContext";

function MessagesSettings() {
	const { config, updateConfig } = useConfig();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMessages, setFilteredMessages] = useState([]);

	const messagesConfig = config?.Messages || {};

	const filterMessages = useCallback(() => {
		return Object.entries(messagesConfig)
			.filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
			.sort((a, b) => a[0].localeCompare(b[0]));
	}, [messagesConfig, searchTerm]);

	useEffect(() => {
		setFilteredMessages(filterMessages());
	}, [filterMessages]);

	const handleChange = useCallback(
		(key, value) => {
			updateConfig((prevConfig) => ({
				...prevConfig,
				Messages: {
					...prevConfig.Messages,
					[key]: value,
				},
			}));
		},
		[updateConfig]
	);

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<input
				type="text"
				placeholder="Search messages..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full px-3 py-2 mb-4 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
			/>
			<div className="space-y-4">
				{filteredMessages.map(([key, value]) => (
					<motion.div key={key} layout className="space-y-2">
						<label
							htmlFor={key}
							className="block text-sm font-medium text-gray-300">
							{key}
						</label>
						<input
							id={key}
							type="text"
							value={value}
							onChange={(e) => handleChange(key, e.target.value)}
							className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
}

export default MessagesSettings;
