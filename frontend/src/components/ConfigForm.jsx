// src/components/ConfigForm.jsx

import React from "react";
import MySQLSettings from "./settings/MySQLSettings";
import GeneralSettings from "./settings/GeneralSettings";
import KitsSettings from "./settings/KitsSettings";

function ConfigForm({ config, onConfigUpdate, activeSidebarItem }) {
	const renderSettingsComponent = () => {
		switch (activeSidebarItem) {
			case "General":
				return (
					<GeneralSettings config={config} onConfigUpdate={onConfigUpdate} />
				);
			case "MySQL":
				return (
					<MySQLSettings config={config} onConfigUpdate={onConfigUpdate} />
				);
			case "Kits":
				return <KitsSettings config={config} onConfigUpdate={onConfigUpdate} />;
			// Add cases for other sidebar items here
			default:
				return <p>Select a setting from the sidebar</p>;
		}
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">{activeSidebarItem}</h2>
			{renderSettingsComponent()}
		</div>
	);
}

export default ConfigForm;
