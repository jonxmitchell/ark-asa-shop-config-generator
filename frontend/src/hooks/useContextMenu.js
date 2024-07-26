// src/hooks/useContextMenu.js

import { useEffect } from "react";
import { writeText, readText } from "@tauri-apps/api/clipboard";
import { showMenu } from "tauri-plugin-context-menu";

export function useContextMenu() {
	useEffect(() => {
		const handleContextMenu = async (e) => {
			e.preventDefault();

			await showMenu({
				pos: { x: e.clientX, y: e.clientY },
				theme: "dark",
				items: [
					{
						label: "Cut",
						event: async () => {
							const selection = document.getSelection();
							if (selection) {
								await writeText(selection.toString());
								document.execCommand("delete");
							}
						},
					},
					{
						label: "Copy",
						event: async () => {
							const selection = document.getSelection();
							if (selection) {
								await writeText(selection.toString());
							}
						},
					},
					{
						label: "Paste",
						event: async () => {
							const text = await readText();
							if (text) {
								document.execCommand("insertText", false, text);
							}
						},
					},
					{
						label: "Select All",
						event: () => {
							document.execCommand("selectAll");
						},
					},
				],
			});
		};

		document.addEventListener("contextmenu", handleContextMenu);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
		};
	}, []);
}
