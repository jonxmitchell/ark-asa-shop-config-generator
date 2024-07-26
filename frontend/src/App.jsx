import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ConfigTabs from "./components/ConfigTabs";
import { useContextMenu } from "./hooks/useContextMenu";
import { defaultConfig } from "./config/defaultConfig";

function App() {
	const [config, setConfig] = useState(defaultConfig);
	const [activeTab, setActiveTab] = useState("generator");
	const [activeSidebarItem, setActiveSidebarItem] = useState("MySQL");

	useContextMenu();

	const handleConfigUpdate = (newConfig) => {
		setConfig(newConfig);
	};

	return (
		<div autoComplete="off" data-form-type="other">
			<div className="flex h-screen bg-deep-black text-white p-4 overflow-hidden">
				<div className="flex w-full space-x-4 h-full">
					<div className="w-64 bg-mid-black rounded-xl shadow-lg flex flex-col overflow-hidden">
						<Sidebar
							activeItem={activeSidebarItem}
							setActiveItem={setActiveSidebarItem}
						/>
					</div>
					<div className="flex-1 bg-mid-black rounded-xl shadow-lg flex flex-col overflow-hidden">
						<ConfigTabs
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							config={config}
							onConfigUpdate={handleConfigUpdate}
							activeSidebarItem={activeSidebarItem}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
