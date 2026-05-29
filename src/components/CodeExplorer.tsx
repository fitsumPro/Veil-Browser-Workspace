/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Copy, Check, Download, Folder, FolderOpen, FileCode, CheckCircle2, AlertCircle,
  ChevronRight, ChevronDown, Settings, BookOpen, Terminal, Sliders, Layers, FileJson, GitFork, Play
} from "lucide-react";
import { CodeFile } from "../types";

interface CodeExplorerProps {
  files: CodeFile[];
}

interface TreeNode {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: TreeNode[];
  file?: CodeFile;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(files[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [buildStatus, setBuildStatus] = useState<"idle" | "success" | "error">("idle");

  // Track folder expand/collapse state (keyed by folder path)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "src/engine": true,
    "src/ui": true,
    "src/privacy": true,
    "src/config": true,
    "src/utils": true,
    "wix": true,
    ".github": true,
    ".github/workflows": true
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([selectedFile.content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleTriggerSimulatedBuild = () => {
    setIsBuilding(true);
    setBuildStatus("idle");
    setBuildLogs(["[Cargo] Initializing MSVC toolchain...", "[Cargo] Resolving dependency graph schema vcpkg.json..."]);

    const steps = [
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling gtk4 v0.7.3 bindings..."]),
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling libadwaita v0.5.3 bindings..."]),
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling webkit2gtk v2.0.1 (WebKit6 integration)..."]),
      () => setBuildLogs(prev => [...prev, "[Cargo] Compiling local modules: engine, privacy, config, ui, utils"]),
      () => {
        setBuildLogs(prev => [...prev, "[Cargo] Output: target/release/veil.exe (Size: 22.4 MB stripped)", "✓ Compilation Successful!"]);
        setBuildStatus("success");
        setIsBuilding(false);
      }
    ];

    steps.forEach((step, idx) => {
      setTimeout(step, (idx + 1) * 600);
    });
  };

  // Dynamically compile the flat files into a hierarchical TreeNode structure
  const fileTree = useMemo(() => {
    const root: TreeNode = { name: "veil-browser", path: "", type: "folder", children: [] };

    files.forEach(file => {
      const parts = file.path.split("/");
      let current = root;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const partPath = parts.slice(0, index + 1).join("/");

        if (!isLast) {
          let folder = current.children?.find(child => child.name === part && child.type === "folder");
          if (!folder) {
            folder = { name: part, path: partPath, type: "folder", children: [] };
            current.children?.push(folder);
          }
          current = folder;
        } else {
          current.children?.push({
            name: part,
            path: partPath,
            type: "file",
            file: file
          });
        }
      });
    });

    const sortNodes = (node: TreeNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "folder" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(sortNodes);
      }
    };

    sortNodes(root);
    return root;
  }, [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Helper to determine custom file icons based on properties
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".rs")) return <FileCode size={14} className="text-orange-400 shrink-0" />;
    if (fileName.endsWith(".toml")) return <Sliders size={14} className="text-purple-400 shrink-0" />;
    if (fileName.endsWith(".json")) return <FileJson size={14} className="text-yellow-400 shrink-0" />;
    if (fileName.endsWith(".yml")) return <GitFork size={14} className="text-emerald-400 shrink-0" />;
    if (fileName.endsWith(".ps1") || fileName.endsWith(".bat")) return <Terminal size={14} className="text-sky-400 shrink-0" />;
    if (fileName.endsWith(".wxs")) return <Layers size={14} className="text-fuchsia-400 shrink-0" />;
    if (fileName.endsWith(".md")) return <BookOpen size={14} className="text-blue-400 shrink-0" />;
    return <FileCode size={14} className="text-gray-400 shrink-0" />;
  };

  // Recursive formatter for file nodes
  const renderTreeNodes = (nodes: TreeNode[], depth: number = 0) => {
    return nodes.map((node) => {
      if (node.type === "folder") {
        const isOpen = !!expandedFolders[node.path];
        return (
          <div key={node.path} className="select-none text-left">
            <div
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-1.5 py-1 px-2 hover:bg-purple-950/15 rounded text-xs text-gray-300 hover:text-white cursor-pointer select-none transition-colors"
              style={{ paddingLeft: `${depth * 10}px` }}
            >
              {isOpen ? <ChevronDown size={12} className="text-gray-500 shrink-0" /> : <ChevronRight size={12} className="text-gray-500 shrink-0" />}
              {isOpen ? <FolderOpen size={14} className="text-purple-400 shrink-0" /> : <Folder size={14} className="text-purple-500 shrink-0" />}
              <span className="font-semibold font-mono tracking-wide">{node.name}</span>
            </div>
            {isOpen && node.children && (
              <div className="relative">
                {/* Visual guideline line */}
                <div 
                  className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-purple-900/15"
                  style={{ left: `${(depth * 10) + 12}px` }}
                />
                {renderTreeNodes(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        const isSelected = selectedFile.path === node.file?.path;
        return (
          <div
            key={node.path}
            onClick={() => node.file && setSelectedFile(node.file)}
            className={`flex items-center gap-1.5 py-1.5 px-2 rounded text-xs cursor-pointer select-none transition-colors text-left ${
              isSelected
                ? "bg-[#251e2f] text-purple-300 border-l border-purple-500 font-medium"
                : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/10"
            }`}
            style={{ paddingLeft: `${(depth * 10) + 12}px` }}
          >
            {getFileIcon(node.name)}
            <span className="font-mono font-medium truncate">{node.name}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6 h-full text-sm">
      
      {/* Sidebar - Collapsible Tree Explorer */}
      <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
        <div className="bg-[#18181f] border border-purple-900/10 p-4 rounded-xl shadow-lg flex flex-col min-h-0 flex-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-3 border-b border-purple-900/10 pb-1.5 text-left">
            VEIL COMPILERS WORKSPACE
          </span>
          
          <div className="space-y-0.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {fileTree.children && renderTreeNodes(fileTree.children, 0)}
          </div>
        </div>

        {/* Cargo Build Dashboard widget */}
        <div className="bg-[#18181f] border border-purple-900/10 p-4 rounded-xl shadow-lg shrink-0 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block mb-1 text-left">MOCK CARGO COMPILER</span>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 text-left">
              Trigger a local compilation run evaluating Veil's Rust structures and headers compatibility.
            </p>
          </div>

          <div className="space-y-3">
            {buildStatus !== "idle" && (
              <div className="p-2.5 rounded-lg flex items-center gap-2 text-xs font-mono font-medium border leading-normal bg-purple-950/10 text-left">
                {buildStatus === "success" ? (
                  <>
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={15} />
                    <span className="text-emerald-300 leading-tight">target/release/veil.exe successfully compiled (22.4MB)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-red-400 shrink-0" size={15} />
                    <span className="text-red-300 leading-tight">Build failed with diagnostic conflicts</span>
                  </>
                )}
              </div>
            )}

            {buildLogs.length > 0 && (
              <div className="bg-[#0b0c10] border border-purple-950/40 font-mono text-[9.5px] text-purple-400 p-2 rounded-lg h-24 overflow-y-auto space-y-0.5 shadow-inner text-left">
                {buildLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("✓") || log.includes("Successful") ? "text-emerald-400 font-bold" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleTriggerSimulatedBuild}
              disabled={isBuilding}
              className={`w-full font-mono font-bold text-[11px] py-2 rounded-lg transition-all border ${
                isBuilding 
                  ? "bg-purple-950/20 text-purple-500 border-purple-950/10 cursor-not-allowed" 
                  : "bg-purple-900 hover:bg-purple-800 text-white border-purple-800 hover:shadow-lg hover:shadow-purple-950/10 cursor-pointer"
              }`}
            >
              {isBuilding ? "Compiling source structures..." : "Run Simulated cargo build"}
            </button>
          </div>
        </div>

      </div>

      {/* Code Viewer Viewbox */}
      <div className="bg-[#18181f] border border-purple-900/10 rounded-xl overflow-hidden flex flex-col shadow-lg min-h-0">
        <div className="bg-[#121216] px-4 py-3 border-b border-purple-900/10 flex items-center justify-between">
          <div className="text-left">
            <h4 className="font-bold text-gray-200">{selectedFile.name}</h4>
            <p className="text-xs text-gray-500 font-mono leading-none mt-1">{selectedFile.path} · {selectedFile.language.toUpperCase()} file syntax</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900 border border-purple-800 hover:bg-purple-800 rounded-lg text-xs font-mono font-bold text-white transition-colors hover:shadow-md cursor-pointer"
              title="Download this file to your machine"
            >
              <Download size={13} />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e24] border border-purple-950 hover:bg-purple-950/20 rounded-lg text-xs font-mono font-bold text-gray-300 hover:text-purple-300 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400 font-bold" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Block</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code description header banner */}
        <div className="bg-[#211a2d]/30 border-b border-purple-900/10 px-4 py-2 text-xs text-purple-300 leading-relaxed font-sans italic text-left">
          {selectedFile.description}
        </div>

        {/* Source formatting */}
        <div className="flex-1 overflow-auto p-4 bg-[#0d0d11]">
          <pre className="font-mono text-xs text-gray-300 leading-relaxed text-left selection:bg-purple-900 select-all whitespace-pre">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
