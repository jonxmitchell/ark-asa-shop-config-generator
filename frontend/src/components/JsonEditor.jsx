// src/components/JsonEditor.jsx
import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

function JsonEditor({ config }) {
	const editorRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			if (editorRef.current) {
				editorRef.current.layout();
			}
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				resizeObserver.unobserve(containerRef.current);
			}
		};
	}, []);

	const handleEditorDidMount = (editor, monaco) => {
		editorRef.current = editor;

		// Customize scrollbar
		editor.updateOptions({
			scrollbar: {
				vertical: "hidden",
				horizontal: "hidden",
				useShadows: false,
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
					height="100%"
					defaultLanguage="json"
					value={jsonString}
					theme="vs-dark"
					options={{
						readOnly: true,
						minimap: { enabled: false },
						fontSize: 14,
						scrollBeyondLastLine: false,
						renderLineHighlight: "all",
						lineNumbers: "on",
						roundedSelection: false,
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
