// src/components/AutoSave.jsx

import React, { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-toastify";
import { useConfig } from "./ConfigContext";

function AutoSave() {
	const { config } = useConfig();
	const timeoutRef = useRef(null);

	useEffect(() => {
		const setupAutoSave = async () => {
			try {
				const settings = await invoke("load_settings_command");
				if (settings.auto_save_enabled) {
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current);
					}
					timeoutRef.current = setTimeout(
						autoSave,
						settings.auto_save_interval * 60 * 1000
					);
				}
			} catch (error) {
				console.error("Failed to setup auto-save:", error);
			}
		};

		setupAutoSave();

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [config]);

	const autoSave = async () => {
		try {
			await invoke("auto_save_config", { config });
			toast.success("Configuration auto-saved successfully", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		} catch (error) {
			console.error("Auto-save failed:", error);
			toast.error("Failed to auto-save configuration", {
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark",
			});
		} finally {
			const settings = await invoke("load_settings_command");
			if (settings.auto_save_enabled) {
				timeoutRef.current = setTimeout(
					autoSave,
					settings.auto_save_interval * 60 * 1000
				);
			}
		}
	};

	return null;
}

export default AutoSave;
