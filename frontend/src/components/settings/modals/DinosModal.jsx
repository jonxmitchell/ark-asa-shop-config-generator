// src/components/settings/modals/DinosModal.jsx

import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

function DinosModal({ kitName, dinos, onSave, onClose }) {
	const [editedDinos, setEditedDinos] = useState(dinos);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchField, setSearchField] = useState("Blueprint");
	const [filteredDinos, setFilteredDinos] = useState(dinos);

	useEffect(() => {
		const filtered = editedDinos.filter((dino) =>
			dino[searchField]
				.toString()
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		);
		setFilteredDinos(filtered);
	}, [searchTerm, searchField, editedDinos]);

	const handleDinoChange = (index, field, value) => {
		const newDinos = [...editedDinos];
		newDinos[index] = { ...newDinos[index], [field]: value };
		setEditedDinos(newDinos);
	};

	const addDino = () => {
		setEditedDinos([
			...editedDinos,
			{ Level: 1, Blueprint: "", Neutered: false },
		]);
	};

	const removeDino = (index) => {
		setEditedDinos(editedDinos.filter((_, i) => i !== index));
	};

	return (
		<div className="text-white">
			<h3 className="text-2xl font-semibold mb-4">Edit Dinos for {kitName}</h3>
			<div className="flex space-x-2 mb-4">
				<input
					type="text"
					placeholder="Search dinos..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-grow px-3 py-2 text-sm text-white bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					autoComplete="off"
				/>
				<select
					value={searchField}
					onChange={(e) => setSearchField(e.target.value)}
					className="px-3 py-2 text-sm text-white bg-light-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
					<option value="Blueprint">Blueprint</option>
					<option value="Level">Level</option>
				</select>
			</div>
			<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
				<AnimatePresence initial={false}>
					{filteredDinos.map((dino, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ type: "tween", duration: 0.2 }}
							className="bg-light-black rounded-lg overflow-hidden">
							<div className="p-4">
								<div className="grid grid-cols-2 gap-4 mb-4">
									<div>
										<label
											htmlFor={`dino-level-${index}`}
											className="block text-sm font-medium text-gray-300 mb-1">
											Level
										</label>
										<input
											id={`dino-level-${index}`}
											type="number"
											value={dino.Level}
											onChange={(e) =>
												handleDinoChange(
													index,
													"Level",
													parseInt(e.target.value)
												)
											}
											className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
											autoComplete="off"
										/>
									</div>
									<div>
										<label
											htmlFor={`dino-blueprint-${index}`}
											className="block text-sm font-medium text-gray-300 mb-1">
											Blueprint
										</label>
										<input
											id={`dino-blueprint-${index}`}
											type="text"
											value={dino.Blueprint}
											onChange={(e) =>
												handleDinoChange(index, "Blueprint", e.target.value)
											}
											className="w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
											autoComplete="off"
										/>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<input
											type="checkbox"
											id={`dino-neutered-${index}`}
											checked={dino.Neutered || false}
											onChange={(e) =>
												handleDinoChange(index, "Neutered", e.target.checked)
											}
											className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 mr-2"
										/>
										<label
											htmlFor={`dino-neutered-${index}`}
											className="text-sm font-medium text-gray-300">
											Neutered
										</label>
									</div>
									<button
										onClick={() => removeDino(index)}
										className="text-red-500 hover:text-red-700">
										<TrashIcon className="h-5 w-5" />
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<div className="mt-6 flex justify-between">
				<button
					onClick={addDino}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
					Add Dino
				</button>
				<div className="space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
						Cancel
					</button>
					<button
						onClick={() => {
							onSave(editedDinos);
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

export default DinosModal;
