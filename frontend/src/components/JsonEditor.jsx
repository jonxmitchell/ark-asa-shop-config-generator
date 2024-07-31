// src/components/JsonEditor.jsx

import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

function JsonEditor({ config }) {
	const editorRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const currentContainer = containerRef.current;
		const resizeObserver = new ResizeObserver(() => {
			if (editorRef.current) {
				editorRef.current.layout();
			}
		});

		if (currentContainer) {
			resizeObserver.observe(currentContainer);
		}

		return () => {
			if (currentContainer) {
				resizeObserver.unobserve(currentContainer);
			}
		};
	}, []);

	const handleEditorDidMount = (editor) => {
		editorRef.current = editor;

		editor.updateOptions({
			scrollbar: {
				vertical: "hidden",
				horizontal: "hidden",
				useShadows: true,
				verticalHasArrows: false,
				horizontalHasArrows: false,
				verticalScrollbarSize: 0,
				horizontalScrollbarSize: 0,
			},
		});
	};

	const jsonString = JSON.stringify(config, null, 2);

	return (
		<div
			ref={containerRef}
			className="h-full w-full bg-mid-black rounded-lg overflow-hidden">
			<div className="h-full overflow-hidden hover:overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
				<Editor
					height="95%"
					defaultLanguage="json"
					value={jsonString}
					theme="vs-dark"
					options={{
						readOnly: true,
						minimap: { enabled: false },
						fontSize: 13,
						scrollBeyondLastLine: false,
						renderLineHighlight: "20",
						lineNumbers: "on",
						roundedSelection: false,
						contextmenu: false,
						selectOnLineNumbers: true,
						automaticLayout: true,
					}}
					onMount={handleEditorDidMount}
				/>
			</div>
		</div>
	);
}

export default JsonEditor;
