// src/components/settings/MySQLSettings.jsx

import React from "react";
import PasswordInput from "./PasswordInput";
import { useConfig } from "../ConfigContext";
import { Tooltip } from "react-tooltip";

function MySQLSettings() {
	const { config, updateConfig, showTooltips } = useConfig();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		updateConfig({
			...config,
			Mysql: {
				...config.Mysql,
				[name]:
					type === "checkbox"
						? checked
						: type === "number"
						? parseInt(value, 10)
						: value,
			},
		});
	};

	// Ensure config and config.Mysql exist before accessing properties
	const mysqlConfig = config?.Mysql || {};
	const isMySQL = mysqlConfig.UseMysql || false;

	return (
		<div className="bg-light-black p-6 rounded-lg">
			<div className="space-y-4">
				<div className="flex items-center mb-4">
					<input
						type="checkbox"
						id="useMysql"
						name="UseMysql"
						checked={isMySQL}
						onChange={handleChange}
						className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
					/>
					<label
						htmlFor="useMysql"
						className="ml-2 text-sm font-medium text-gray-300"
						data-tooltip-id="tooltip-useMysql">
						Use MySQL
					</label>
				</div>
				{["MysqlHost", "MysqlUser", "MysqlDB"].map((setting) => (
					<div key={setting} className="space-y-2">
						<label
							htmlFor={setting}
							className="block text-sm font-medium text-gray-300">
							{setting}
						</label>
						<input
							type="text"
							id={setting}
							name={setting}
							value={mysqlConfig[setting] || ""}
							onChange={handleChange}
							disabled={!isMySQL}
							autoComplete="off"
							className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
								!isMySQL && "opacity-50 cursor-not-allowed"
							}`}
							data-tooltip-id={`tooltip-${setting}`}
						/>
					</div>
				))}
				<div className="space-y-2">
					<label
						htmlFor="MysqlPass"
						className="block text-sm font-medium text-gray-300">
						MysqlPass
					</label>
					<PasswordInput
						value={mysqlConfig.MysqlPass || ""}
						onChange={handleChange}
						disabled={!isMySQL}
						showTooltips={showTooltips}
						data-tooltip-id="tooltip-MysqlPass"
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="MysqlPort"
						className="block text-sm font-medium text-gray-300">
						MySQL Port
					</label>
					<input
						type="number"
						id="MysqlPort"
						name="MysqlPort"
						value={mysqlConfig.MysqlPort || 3306}
						onChange={handleChange}
						disabled={!isMySQL}
						autoComplete="off"
						className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
							!isMySQL && "opacity-50 cursor-not-allowed"
						}`}
						data-tooltip-id="tooltip-MysqlPort"
					/>
				</div>
			</div>
			{showTooltips && (
				<>
					<Tooltip
						id="tooltip-useMysql"
						place="top"
						content="Enable MySQL database integration"
						offset={5}
						float={true}
					/>
					<Tooltip
						id="tooltip-MysqlHost"
						place="top"
						content="Hostname or IP address of your MySQL server"
						offset={5}
						float={true}
					/>
					<Tooltip
						id="tooltip-MysqlUser"
						place="top"
						content="Username for MySQL authentication"
						offset={5}
						float={true}
					/>
					<Tooltip
						id="tooltip-MysqlDB"
						place="top"
						content="Name of the MySQL database to use"
						offset={5}
						float={true}
					/>
					<Tooltip
						id="tooltip-MysqlPass"
						place="top"
						content="Password for MySQL authentication"
						offset={5}
						float={true}
					/>
					<Tooltip
						id="tooltip-MysqlPort"
						place="top"
						content="Port number for MySQL server (default: 3306)"
						offset={5}
						float={true}
					/>
				</>
			)}
		</div>
	);
}

export default MySQLSettings;
