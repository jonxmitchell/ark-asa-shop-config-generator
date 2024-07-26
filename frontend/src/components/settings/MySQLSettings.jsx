import React from "react";
import PasswordInput from "./PasswordInput";

function MySQLSettings({ config, onConfigUpdate }) {
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		onConfigUpdate({
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

	const isMySQL = config.Mysql?.UseMysql || false;

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
						className="ml-2 text-sm font-medium text-gray-300">
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
							value={config.Mysql[setting] || ""}
							onChange={handleChange}
							disabled={!isMySQL}
							autoComplete="off"
							className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
								!isMySQL && "opacity-50 cursor-not-allowed"
							}`}
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
						value={config.Mysql.MysqlPass || ""}
						onChange={handleChange}
						disabled={!isMySQL}
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
						value={config.Mysql.MysqlPort || 3306}
						onChange={handleChange}
						disabled={!isMySQL}
						autoComplete="off"
						className={`w-full px-3 py-2 text-sm text-white bg-mid-black rounded border border-gray-600 focus:ring-blue-500 focus:border-blue-500 ${
							!isMySQL && "opacity-50 cursor-not-allowed"
						}`}
					/>
				</div>
			</div>
		</div>
	);
}

export default MySQLSettings;
