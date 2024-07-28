// src/hooks/useArkData.js
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export function useArkData() {
	const [arkData, setArkData] = useState({ Dinos: {}, Items: {} });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function loadArkData() {
			try {
				const data = await invoke("read_ark_data");
				setArkData(data);
			} catch (err) {
				console.error("Failed to load ark data:", err);
				setError(err);
			} finally {
				setLoading(false);
			}
		}

		loadArkData();
	}, []);

	return { arkData, loading, error };
}
