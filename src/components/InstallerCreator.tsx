/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, Download, Sliders, Settings, Code, FileCode, CheckSquare, Square } from "lucide-react";

export const InstallerCreator: React.FC = () => {
  const [productName, setProductName] = useState<string>("Veil Web Browser");
  const [version, setVersion] = useState<string>("0.1.0");
  const [manufacturer, setManufacturer] = useState<string>("Veil Core Team");
  const [upgradeCode, setUpgradeCode] = useState<string>("a6b83f0f-8c35-432a-b78f-582cb6ea0abc");
  const [includeDlls, setIncludeDlls] = useState<boolean>(true);
  const [registerProtocols, setRegisterProtocols] = useState<boolean>(true);
  const [desktopShortcut, setDesktopShortcut] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const generateWxs = (): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
    <!-- MSI Installer definition generated dynamically for Veil Browser -->
    <Product Id="*" Name="${productName}" Language="1033" Version="${version}.0" Manufacturer="${manufacturer}" UpgradeCode="${upgradeCode}">
        <Package InstallerVersion="500" Compressed="yes" InstallScope="perMachine" />
        <MajorUpgrade DowngradeErrorMessage="A newer version of [ProductName] is already installed." />
        <MediaTemplate EmbedCab="yes" />

        <!-- High-fidelity custom icons -->
        <Icon Id="VeilIcon" SourceFile="assets/veil.ico" />
        <Property Id="ARPPRODUCTICON" Value="VeilIcon" />

        <Directory Id="TARGETDIR" Name="SourceDir">
            <Directory Id="ProgramFiles64Folder">
                <Directory Id="INSTALLFOLDER" Name="${productName.replace(/\s+/g, '')}">
                    <Component Id="MainExecutable" Guid="ca9b310d-27bf-4e6f-998f-00ec26bba11a">
                        <File Id="VeilEXE" Source="target\\release\\veil.exe" KeyPath="yes" />
                        ${registerProtocols ? `
                        <!-- Register browser shell handles and protocol associations natively -->
                        <ProgId Id="VeilHTML" Description="Veil Document" Icon="VeilIcon">
                            <Extension Id="html" ContentType="text/html">
                                <Verb Id="open" Command="Open with Veil" TargetFile="VeilEXE" Argument="&quot;%1&quot;" />
                            </Extension>
                        </ProgId>` : '<!-- Shell registration excluded -->'}
                    </Component>
                    ${includeDlls ? `
                    <!-- Glib, GTK4, Cairo rendering dynamic linking libraries -->
                    <Component Id="GtkLibraries" Guid="db91b8d2-432d-4bfb-bdf7-920ac34bf99c">
                        <File Id="GlibDll" Source="bin\\glib-2.0-0.dll" />
                        <File Id="Gtk4Dll" Source="bin\\gtk-4-0.dll" />
                        <File Id="WebKitDll" Source="bin\\webkit2gtk-4.1-0.dll" />
                        <File Id="CairoDll" Source="bin\\libcairo-2.dll" />
                    </Component>` : ''}
                </Directory>
            </Directory>
            
            <Directory Id="ProgramMenuFolder">
                <Directory Id="ApplicationProgramsFolder" Name="${productName.replace(/\s+/g, '')}"/>
            </Directory>
            ${desktopShortcut ? `
            <Directory Id="DesktopFolder" Name="Desktop" />` : ''}
        </Directory>

        <DirectoryRef Id="ApplicationProgramsFolder">
            <Component Id="ApplicationShortcut" Guid="f7dbd2ae-4c81-4202-9ca9-bef4ca88fa39">
                <Shortcut Id="ApplicationStartMenuShortcut" Name="${productName}" Description="Browse unseen. Load instantly." Target="[INSTALLFOLDER]veil.exe" Icon="VeilIcon" />
                <RemoveFolder Id="CleanUpShortCut" On="uninstall" />
                <RegistryValue Root="HKCU" Key="Software\\${productName.replace(/\s+/g, '')}" Name="installed" Type="integer" Value="1" KeyPath="yes" />
            </Component>
        </DirectoryRef>

        <Feature Id="ProductFeature" Title="Veil Core Engine" Level="1">
            <ComponentRef Id="MainExecutable" />
            ${includeDlls ? '<ComponentRef Id="GtkLibraries" />' : ''}
            <ComponentRef Id="ApplicationShortcut" />
        </Feature>
    </Product>
</Wix>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWxs());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWxs = () => {
    const element = document.createElement("a");
    const file = new Blob([generateWxs()], { type: "text/xml;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "veil.wxs";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const code = generateWxs();

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6 text-sm h-full">
      
      {/* Configuration Inputs Panel */}
      <div className="bg-[#18181f] border border-purple-900/15 p-5 rounded-xl shadow-lg flex flex-col gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-purple-300 uppercase block mb-1">WiX BUNDLE COMPILER SPEC</span>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Modify installer parameters below. Veil compiles a production-ready `.wxs` markup for the WiX toolchain.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 flex-1">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-mono text-purple-400 font-bold">Product Name</label>
            <input 
              type="text" 
              className="bg-[#101014] border border-purple-950 px-3 py-1.5 rounded-lg text-xs md:text-sm text-gray-200 outline-none focus:border-purple-500 font-medium"
              value={productName} 
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-mono text-purple-400 font-bold">Version Prefix</label>
              <input 
                type="text" 
                className="bg-[#101014] border border-purple-950 px-3 py-1.5 rounded-lg text-xs md:text-sm text-gray-200 outline-none focus:border-purple-500 font-mono"
                value={version} 
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-mono text-purple-400 font-bold">Manufacturer</label>
              <input 
                type="text" 
                className="bg-[#101014] border border-purple-950 px-3 py-1.5 rounded-lg text-xs md:text-sm text-gray-200 outline-none focus:border-purple-500 font-medium"
                value={manufacturer} 
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-mono text-purple-400 font-bold">Windows Upgrade UUID GUID</label>
            <input 
              type="text" 
              className="bg-[#101014] border border-purple-950 px-3 py-1.5 rounded-lg text-[11px] text-gray-400 outline-none focus:border-purple-500 font-mono"
              value={upgradeCode} 
              onChange={(e) => setUpgradeCode(e.target.value)}
            />
          </div>

          {/* Core Feature Checklist */}
          <div className="border-t border-purple-900/10 pt-4 mt-2 space-y-3.5">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Installer features</span>
            
            <div 
              onClick={() => setIncludeDlls(!includeDlls)}
              className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-300 hover:text-white"
            >
              {includeDlls ? (
                <CheckSquare size={16} className="text-purple-400 fill-purple-400/10" />
              ) : (
                <Square size={16} className="text-gray-600" />
              )}
              <div className="text-left leading-tight">
                <div className="font-semibold text-xs text-gray-200">Bundle GTK4 & Cairo DLLs (&lt;150MB)</div>
                <div className="text-[10px] text-gray-500">Packages glib, pango, cairo, and WebKit modules with the exe</div>
              </div>
            </div>

            <div 
              onClick={() => setRegisterProtocols(!registerProtocols)}
              className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-300 hover:text-white"
            >
              {registerProtocols ? (
                <CheckSquare size={16} className="text-purple-400 fill-purple-400/10" />
              ) : (
                <Square size={16} className="text-gray-600" />
              )}
              <div className="text-left leading-tight">
                <div className="font-semibold text-xs text-gray-200">Register HTTP/HTTPS Protocols</div>
                <div className="text-[10px] text-gray-500">Allows Veil to act as the default web browser in Windows settings</div>
              </div>
            </div>

            <div 
              onClick={() => setDesktopShortcut(!desktopShortcut)}
              className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-300 hover:text-white"
            >
              {desktopShortcut ? (
                <CheckSquare size={16} className="text-purple-400 fill-purple-400/10" />
              ) : (
                <Square size={16} className="text-gray-600" />
              )}
              <div className="text-left leading-tight">
                <div className="font-semibold text-xs text-gray-200">Create Desktop Icon shortcut</div>
                <div className="text-[10px] text-gray-500">Places customizable launch icons directly on Desktop Folder</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Compiler output panel */}
      <div className="bg-[#18181f] border border-purple-900/15 rounded-xl overflow-hidden flex flex-col shadow-lg">
        <div className="bg-[#121216] px-4 py-3 border-b border-purple-900/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode size={15} className="text-[#a855f7]" />
            <div className="text-xs font-mono font-bold text-gray-200">generated source: <span className="text-purple-400 font-semibold">wix/veil.wxs</span></div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadWxs}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900 border border-purple-800 hover:bg-purple-800 rounded-lg text-xs font-mono font-bold text-white transition-colors hover:shadow-md"
              title="Download veil.wxs file directly"
            >
              <Download size={13} />
              <span>Download .wxs File</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e24] border border-purple-950 hover:bg-purple-950/20 rounded-lg text-xs font-mono font-bold text-gray-300 hover:text-purple-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy XML Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live editing block containing compiled XML code from states */}
        <div className="flex-1 overflow-auto p-4 bg-[#0d0d11]">
          <pre className="font-mono text-xs text-purple-300/90 leading-relaxed text-left selection:bg-purple-900 select-all whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
