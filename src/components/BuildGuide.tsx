/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FolderHeart, Terminal, Layers, Info, CheckSquare, Hammer, Link, Package } from "lucide-react";

export const BuildGuide: React.FC = () => {
  return (
    <div className="space-y-6 text-sm text-gray-300 max-w-4xl mx-auto text-left leading-relaxed pb-8">
      
      {/* SECTION 1: Introduction Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-[#18181f] border border-purple-900/20 p-5 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1.5 font-mono">
          <Hammer className="text-purple-400" /> Windows MSVC Toolkit compilation guide
        </h3>
        <p className="text-xs text-gray-400 leading-normal">
          Building high-performance desktop browsers using WebKit and GTK4 on Windows requires managing complex native dynamic-linking binaries. For stability and optimal system integrations, Veil strictly uses <span className="text-purple-300 font-semibold font-mono">MSVC (Microsoft Visual C++)</span>-compiled DLL systems rather than MinGW wrappers.
        </p>
      </div>

      {/* SECTION 2: Step-by-Step Toolchain setup */}
      <div className="space-y-4">
        <h4 className="font-mono font-bold text-sm text-purple-300 border-b border-purple-900/10 pb-1 flex items-center gap-2">
          <Layers size={15} /> 1. Toolchain Setup (Prerequisites)
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#18181f] p-4 rounded-xl border border-purple-950/40">
            <span className="font-bold text-xs font-mono text-purple-400 block mb-1">A. Visual Studio 2022</span>
            <p className="text-xs text-gray-400">
              Install VS 2022 Community/Professional. Select the <strong className="text-gray-300 font-semibold">"Desktop development with C++"</strong> workload, ensuring the MSVC v143 buildtools and Windows SDK 10/11 suites are configured.
            </p>
          </div>
          <div className="bg-[#18181f] p-4 rounded-xl border border-purple-950/40">
            <span className="font-bold text-xs font-mono text-purple-400 block mb-1">B. Install Vcpkg C++</span>
            <p className="text-xs text-gray-400">
              Clone Microsoft's package manager:
              <code className="block bg-[#090b0e] p-1.5 rounded mt-2.5 text-[10px] font-mono text-purple-300 break-all">
                git clone https://github.com/microsoft/vcpkg.git
              </code>
            </p>
          </div>
          <div className="bg-[#18181f] p-4 rounded-xl border border-purple-950/40">
            <span className="font-bold text-xs font-mono text-purple-400 block mb-1">C. Rust Compiler Tool</span>
            <p className="text-xs text-gray-400">
              Instantiate standard compilation profiles pointing to the native MSVC compiler backend:
              <code className="block bg-[#090b0e] p-1.5 rounded mt-2.5 text-[10px] font-mono text-purple-300 break-all">
                rustup default stable-x86_64-pc-windows-msvc
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Building Dependencies via vcpkg */}
      <div className="space-y-3">
        <h4 className="font-mono font-bold text-sm text-purple-300 border-b border-purple-900/10 pb-1 flex items-center gap-2">
          <Package size={15} /> 2. Compiling GTK4 and WebKitGTK with Vcpkg
        </h4>
        
        <p className="text-xs text-gray-400">
          Veil requires the GTK4 toolkit and Libadwaita modules, combined with WebKit's Cairo Windows build. Run compilation using the following vcpkg manifest:
        </p>

        <div className="bg-[#090b0e] border border-purple-950/60 p-4 rounded-xl mt-2 font-mono text-xs whitespace-pre">
          <div className="text-purple-400"># Compiles GTK4 + WinCairo WebKit modules for target system directly:</div>
          <div className="text-gray-300">vcpkg install --triplet=x86_64-pc-windows-msvc</div>
          <div className="text-purple-400 mt-3"># Register DLL search paths to let cargo search bindings:</div>
          <div className="text-gray-300">set VCPKG_ROOT=C:\path\to\vcpkg</div>
          <div className="text-gray-300">set PATH=%VCPKG_ROOT%\installed\x86_64-pc-windows-msvc\bin;%PATH%</div>
        </div>
      </div>

      {/* SECTION 4: Compiling Rust Codebase */}
      <div className="space-y-3">
        <h4 className="font-mono font-bold text-sm text-purple-300 border-b border-purple-900/10 pb-1 flex items-center gap-2">
          <Terminal size={15} /> 3. Build & Strip the Rust Binary executable
        </h4>
        
        <p className="text-xs text-gray-400">
          Utilize Cargo workspace profile commands to generate stripped, optimal release binaries:
        </p>

        <div className="bg-[#090b0e] border border-purple-950/60 p-4 rounded-xl mt-2 font-mono text-xs">
          <div className="text-purple-400"># Compiles binary, optimizes layout, and strips metadata</div>
          <div className="text-white">cargo build --release</div>
          <div className="text-gray-500 mt-2">// Result: target/release/veil.exe</div>
        </div>

        <div className="bg-purple-950/20 border border-purple-800/20 p-3.5 rounded-xl text-xs text-purple-300 flex items-start gap-2.5 mt-1">
          <Info className="shrink-0 text-purple-400" size={16} />
          <div className="leading-tight">
            <span className="font-bold">Pro Optimization Note:</span> Under Cargo configuration flags, `strip = true` and `panic = "abort"` are activated in <code className="bg-[#090b0e] px-1 py-0.5 rounded text-purple-300">Cargo.toml</code>. This reduces the engine memory allocations overhead and decreases final startup execution time below 30ms.
          </div>
        </div>
      </div>

      {/* SECTION 5: WiX Toolset deployment pipelines */}
      <div className="space-y-3">
        <h4 className="font-mono font-bold text-sm text-purple-300 border-b border-purple-900/10 pb-1 flex items-center gap-2">
          <Link size={15} /> 4. Create the Windows MSI Installer Setup (.msi)
        </h4>
        
        <p className="text-xs text-gray-400">
          Install the <strong className="text-gray-300 font-semibold">WiX Toolset v3.11+ / v4</strong> compiler, then execute these commands compiling the dynamically generated `.wxs` installer schema:
        </p>

        <div className="bg-[#090b0e] border border-purple-950/60 p-4 rounded-xl mt-2 font-mono text-xs whitespace-pre">
          <div className="text-purple-400"># Step A: Compile XML markup into binary objects</div>
          <div className="text-gray-300">candle wix/veil.wxs -out wix/veil.wixobj</div>
          <div className="text-purple-400 mt-3"># Step B: Link and pack DLL files, resources and shortcuts</div>
          <div className="text-gray-300">light wix/veil.wixobj -out target/release/veil-setup.msi</div>
        </div>
      </div>

      {/* SECTION 6: Known limits and workarounds */}
      <div className="bg-amber-950/15 border border-amber-900/25 p-4 rounded-2xl">
        <h4 className="font-mono font-bold text-xs text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <FolderHeart size={14} /> GSTREAMER & DRM Engine Gaps & Limitations
        </h4>
        <ul className="list-disc pl-5 text-xs text-gray-400 space-y-1.5">
          <li><strong>GStreamer Media Pipeline:</strong> WebKit Windows relies on GStreamer for video playback. Runtimes must package basic GStreamer codecs or stream formats to support YouTube/Vimeo. Encourage users to allow downloading of the native codecs pack.</li>
          <li><strong>DRM/Widevine:</strong> Neither WebKitGTK nor Servo support Widevine out-of-the-box on Windows due to licensing constraints. Video streams on Netflix or Spotify are gracefully fallbacked to desktop browser prompt warning dialogs.</li>
          <li><strong>Memory Footprint:</strong> WinCairo uses less RAM than Chromium, but forcing hardware graphics can increase initial memory bounds on older cards. Standardize hardware rasterization flags to mitigate frame lag.</li>
        </ul>
      </div>

    </div>
  );
};
