// src/components/ConfigTabs.jsx

import React, { useState, useEffect, useRef } from "react";
import ConfigForm from "./ConfigForm";
import JsonEditor from "./JsonEditor";
import { useConfig } from "./ConfigContext"; // Import useConfig hook

function ConfigTabs({ activeTab, setActiveTab, activeSidebarItem }) {
	const [showShadow, setShowShadow] = useState(false);
	const contentRef = useRef(null);
	const { config } = useConfig(); // Use the useConfig hook to get the current config

	useEffect(() => {
		const handleScroll = () => {
			if (contentRef.current) {
				setShowShadow(contentRef.current.scrollTop > 0);
			}
		};

		const currentContentRef = contentRef.current;
		if (currentContentRef) {
			currentContentRef.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (currentContentRef) {
				currentContentRef.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	return (
		<div className="h-full flex flex-col">
			<div
				className={`sticky top-0 z-10 bg-mid-black pt-4 px-6 pb-4 ${
					showShadow ? "shadow-tabs" : ""
				} transition-shadow duration-300`}>
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
			<div className="flex-grow overflow-auto bg-mid-black" ref={contentRef}>
				{activeTab === "generator" ? (
					<div className="p-6">
						<ConfigForm activeSidebarItem={activeSidebarItem} />
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
