// src/components/settings/modals/CommandsModal.jsx

import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

function CommandsModal({ kitName, commands, onSave, onClose }) {
	const [editedCommands, setEditedCommands] = useState(commands || []);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchField, setSearchField] = useState("Command");
	const [filteredCommands, setFilteredCommands] = useState([]);

	useEffect(() => {
		if (editedCommands && Array.isArray(editedCommands)) {
			const filtered = editedCommands.filter((command) => {
				const searchValue = (command[searchField] || "")
					.toString()
					.toLowerCase();
				return searchValue.includes((searchTerm || "").toLowerCase());
			});
			setFilteredCommands(filtered);
		}
	}, [searchTerm, searchField, editedCommands]);

	const handleCommandChange = (index, field, value) => {
		const newCommands = [...editedCommands];
		newCommands[index] = { ...newCommands[index], [field]: value ?? "" };
		setEditedCommands(newCommands);
	};

	const addCommand = () => {
		setEditedCommands([
			...editedCommands,
			{ Command: "", DisplayAs: "", ExecuteAsAdmin: false },
		]);
	};

	const removeCommand = (index) => {
		setEditedCommands(editedCommands.filter((_, i) => i !== index));
	};

	return (
		<div className="text-white">
			<h3 className="text-2xl font-semibold mb-4">
				Edit Commands for {kitName}
			</h3>
			<div className="flex space-x-2 mb-4">
				<input
					type="text"
					placeholder="Search commands..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-grow px-3 py-2 text-sm text-white bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					autoComplete="off"
				/>
				<select
					value={searchField}
					onChange={(e) => setSearchField(e.target.value)}
					className="px-3 py-2 text-sm text-white bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
					<option value="Command">Command</option>
					<option value="DisplayAs">Display As</option>
				</select>
			</div>
			<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
				<AnimatePresence initial={false}>
					{filteredCommands.map((command, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ type: "tween", duration: 0.2 }}
							className="bg-light-black rounded-lg overflow-visible relative z-10">
							<div className="p-4">
								<div className="space-y-4 mb-4">
									<div>
										<label
											htmlFor={`command-${index}`}
											className="block text-sm font-medium text-gray-300 mb-1">
											Command
										</label>
										<input
											id={`command-${index}`}
											type="text"
											value={command.Command || ""}
											onChange={(e) =>
												handleCommandChange(index, "Command", e.target.value)
											}
											className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
											autoComplete="off"
										/>
									</div>
									<div>
										<label
											htmlFor={`display-as-${index}`}
											className="block text-sm font-medium text-gray-300 mb-1">
											Display As
										</label>
										<input
											id={`display-as-${index}`}
											type="text"
											value={command.DisplayAs || ""}
											onChange={(e) =>
												handleCommandChange(index, "DisplayAs", e.target.value)
											}
											className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
											autoComplete="off"
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<input
												id={`execute-as-admin-${index}`}
												type="checkbox"
												checked={command.ExecuteAsAdmin || false}
												onChange={(e) =>
													handleCommandChange(
														index,
														"ExecuteAsAdmin",
														e.target.checked
													)
												}
												className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
											/>
											<label
												htmlFor={`execute-as-admin-${index}`}
												className="ml-2 text-sm font-medium text-gray-300">
												Execute As Admin
											</label>
										</div>
										<button
											onClick={() => removeCommand(index)}
											className="text-red-500 hover:text-red-700">
											<TrashIcon className="h-5 w-5" />
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<div className="mt-6 flex justify-between">
				<button
					onClick={addCommand}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
					Add Command
				</button>
				<div className="space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
						Cancel
					</button>
					<button
						onClick={() => {
							onSave(editedCommands);
							onClose();
						}}
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}

export default CommandsModal;
