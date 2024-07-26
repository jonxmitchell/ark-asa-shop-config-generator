import React from "react";
import ConfigForm from "./ConfigForm";
import JsonEditor from "./JsonEditor";

function ConfigTabs({
	activeTab,
	setActiveTab,
	config,
	onConfigUpdate,
	activeSidebarItem,
}) {
	return (
		<div className="h-full flex flex-col">
			<div className="bg-mid-black pt-4 px-6 pb-4">
				<ul className="flex flex-wrap text-sm font-medium" role="tablist">
					<li className="mr-2" role="presentation">
						<button
							className={`inline-block p-4 rounded-t-lg transition-colors ${
								activeTab === "generator"
									? "text-accent-blue border-b-2 border-accent-blue"
									: "text-gray-400 hover:text-gray-300 border-b-2 border-transparent"
							}`}
							onClick={() => setActiveTab("generator")}>
							Generator
						</button>
					</li>
					<li className="mr-2" role="presentation">
						<button
							className={`inline-block p-4 rounded-t-lg transition-colors ${
								activeTab === "rawJson"
									? "text-accent-blue border-b-2 border-accent-blue"
									: "text-gray-400 hover:text-gray-300 border-b-2 border-transparent"
							}`}
							onClick={() => setActiveTab("rawJson")}>
							Raw JSON
						</button>
					</li>
				</ul>
			</div>
			<div className="flex-grow overflow-hidden bg-mid-black">
				{activeTab === "generator" ? (
					<div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray">
						<ConfigForm
							config={config}
							onConfigUpdate={onConfigUpdate}
							activeSidebarItem={activeSidebarItem}
						/>
					</div>
				) : (
					<div className="h-full">
						<JsonEditor config={config} />
					</div>
				)}
			</div>
		</div>
	);
}

export default ConfigTabs;
