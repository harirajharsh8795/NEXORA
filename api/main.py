import sys
import base64
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from api.routes import router

app = FastAPI(
    title="Nexora AI — Product Intelligence Platform",
    description="Evidence-Driven Product Data Enrichment & Entity Resolution System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Load Logo as Data URI
LOGO_PATH = Path(__file__).resolve().parent.parent / "logo.png"
LOGO_DATA_URI = ""
if LOGO_PATH.exists():
    with open(LOGO_PATH, "rb") as f:
        LOGO_DATA_URI = f"data:image/png;base64,{base64.b64encode(f.read()).decode()}"

RAW_HTML = """<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexora AI — Autonomous Product Intelligence & Catalog Enrichment Engine</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        nexora: {
                            bg: '#040711',
                            card: '#0a0f1d',
                            cardHover: '#11182c',
                            border: 'rgba(255, 255, 255, 0.08)',
                            cyan: '#06b6d4',
                            blue: '#3b82f6',
                            purple: '#a855f7',
                            pink: '#ec4899',
                        }
                    }
                }
            }
        };
    </script>
    <style>
        :root {
            --bg-main: #f8fafc;
            --bg-card: rgba(255, 255, 255, 0.9);
            --border-card: rgba(15, 23, 42, 0.08);
            --text-main: #0f172a;
            --text-muted: #64748b;
            --grid-line: rgba(15, 23, 42, 0.04);
            --glow-color: rgba(99, 102, 241, 0.15);
        }
        .dark {
            --bg-main: #040711;
            --bg-card: rgba(10, 15, 29, 0.8);
            --border-card: rgba(255, 255, 255, 0.08);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --grid-line: rgba(255, 255, 255, 0.03);
            --glow-color: rgba(168, 85, 247, 0.15);
        }

        body {
            background-color: var(--bg-main);
            color: var(--text-main);
            transition: background-color 0.3s ease, color 0.3s ease;
            background-image: 
                radial-gradient(circle at 50% 0%, var(--glow-color), transparent 50%),
                radial-gradient(circle at 10% 40%, rgba(6, 182, 212, 0.08), transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.08), transparent 40%);
            background-attachment: fixed;
        }

        .grid-pattern {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
                linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
        }

        .glass-card {
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-card);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark .glass-card {
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }

        .glass-card:hover {
            border-color: rgba(168, 85, 247, 0.4);
            box-shadow: 0 12px 40px 0 rgba(168, 85, 247, 0.25);
            transform: translateY(-2px);
        }

        .glow-text {
            text-shadow: 0 0 25px rgba(168, 85, 247, 0.4);
        }

        .logo-glow {
            filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.4));
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.3);
            border-radius: 4px;
        }
    </style>
</head>
<body class="min-h-screen relative font-sans antialiased grid-pattern selection:bg-purple-500/30 selection:text-purple-200">

    <!-- Interactive Particle Background Canvas -->
    <canvas id="particle-canvas" class="fixed inset-0 pointer-events-none z-0 opacity-40"></canvas>

    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-40 glass-card border-b border-white/10 px-6 py-3.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <a href="#" class="flex items-center space-x-3 group">
                    <img src="{{LOGO_DATA_URI}}" alt="Nexora AI Logo" class="h-10 w-auto logo-glow transition transform group-hover:scale-105">
                </a>
            </div>

            <nav class="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-400 dark:text-slate-300">
                <a href="#hero" class="hover:text-cyan-400 transition">Home</a>
                <a href="#pipeline" class="hover:text-purple-400 transition">Pipeline Architecture</a>
                <a href="#catalog" class="hover:text-blue-400 transition">Catalog Explorer</a>
                <a href="#benchmark" class="hover:text-pink-400 transition">Scorecard</a>
            </nav>

            <div class="flex items-center space-x-3">
                <!-- Theme Toggle Button -->
                <button onclick="toggleTheme()" id="theme-toggle-btn" class="p-2 rounded-xl glass-card text-slate-500 dark:text-slate-400 hover:text-amber-400 transition flex items-center justify-center w-9 h-9" title="Toggle Light/Dark Theme">
                    <i class="fa-solid fa-sun text-amber-500 dark:hidden"></i>
                    <i class="fa-solid fa-moon text-indigo-400 hidden dark:block"></i>
                </button>

                <span class="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Engine Active
                </span>

                <button onclick="fetchStatus()" class="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white rounded-xl transition shadow-lg hover:shadow-purple-500/25">
                    <i class="fa-solid fa-arrows-rotate mr-1.5"></i> Refresh Scorecard
                </button>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="relative pt-16 pb-12 px-6 max-w-7xl mx-auto text-center z-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-500/30 text-xs text-purple-600 dark:text-purple-300 mb-8 cursor-pointer" onclick="scrollToCatalog()">
            <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-200">UniHack 2026</span>
            <span>Nexora AI Product Intelligence Engine • 1,000 SKUs Enriched</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </div>

        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Autonomous Product Intelligence & <span class="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text">Catalog Enrichment</span>
        </h1>

        <p class="mt-6 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Convert raw, incomplete industrial SKU data into validated, standardized, and commerce-ready catalogs with explainable evidence graphs and 100% ground-truth compliance.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#catalog" class="px-6 py-3.5 text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl shadow-xl shadow-cyan-500/20 transition transform hover:-translate-y-0.5 flex items-center gap-2">
                <i class="fa-solid fa-table-cells"></i> Explore 1,000 Catalog SKUs
            </a>
            <a href="#pipeline" class="px-6 py-3.5 text-xs font-bold glass-card text-slate-700 dark:text-slate-200 hover:text-purple-600 rounded-xl border border-slate-300 dark:border-white/10 hover:border-purple-500/40 transition flex items-center gap-2">
                <i class="fa-solid fa-diagram-project text-purple-500"></i> View Interactive Pipeline Architecture
            </a>
        </div>
    </section>

    <!-- Key Metrics Section -->
    <section id="benchmark" class="max-w-7xl mx-auto px-6 py-6 z-10 relative">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div onclick="setFilter('all')" class="glass-card rounded-2xl p-6 relative overflow-hidden cursor-pointer group">
                <div class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Total SKUs Processed</div>
                <div class="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white font-mono" id="stat-total">1,000</div>
                <div class="text-[11px] text-cyan-500 dark:text-cyan-400 mt-2 flex items-center gap-1 font-mono">
                    <i class="fa-solid fa-layer-group"></i> 252 Delivery Format Fields
                </div>
            </div>

            <div onclick="setFilter('all')" class="glass-card rounded-2xl p-6 relative overflow-hidden cursor-pointer group">
                <div class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Manufacturer Resolution</div>
                <div class="text-3xl font-extrabold mt-2 text-emerald-500 dark:text-emerald-400 font-mono" id="stat-mfr">100.0%</div>
                <div class="text-[11px] text-emerald-500/80 mt-2 flex items-center gap-1 font-mono">
                    <i class="fa-solid fa-circle-check"></i> Verified Ground Truth
                </div>
            </div>

            <div onclick="setFilter('all')" class="glass-card rounded-2xl p-6 relative overflow-hidden cursor-pointer group">
                <div class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Brand Resolution</div>
                <div class="text-3xl font-extrabold mt-2 text-purple-600 dark:text-purple-400 font-mono" id="stat-brand">100.0%</div>
                <div class="text-[11px] text-purple-500 dark:text-purple-300 mt-2 flex items-center gap-1 font-mono">
                    <i class="fa-solid fa-tags"></i> 80% Unbranded Resolved
                </div>
            </div>

            <div onclick="setFilter('review')" class="glass-card rounded-2xl p-6 relative overflow-hidden cursor-pointer group border-amber-500/30">
                <div class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Auto-Approval Rate</div>
                <div class="text-3xl font-extrabold mt-2 text-cyan-600 dark:text-cyan-400 font-mono" id="stat-approved">68.0%</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    <span id="stat-review-count" class="font-bold text-amber-500 dark:text-amber-400">320</span> SKUs in Review Queue (Click)
                </div>
            </div>
        </div>
    </section>

    <!-- Interactive Pipeline Architecture Section -->
    <section id="pipeline" class="max-w-7xl mx-auto px-6 py-8 z-10 relative">
        <div class="glass-card rounded-3xl p-8 border border-white/10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <i class="fa-solid fa-diagram-project text-purple-500"></i> Interactive Multi-Agent Pipeline Architecture
                    </h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Click any stage card below to inspect its live logic, execution statistics, and input/output transformation.</p>
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 self-start md:self-auto">Clickable Stage Inspector</span>
            </div>

            <!-- 8 Interactive Pipeline Stage Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                <div onclick="openStageModal(1)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-cyan-500 hover:scale-105 transition transform group">
                    <div class="text-cyan-500 dark:text-cyan-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-broom"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 1</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Data Cleaning</div>
                </div>

                <div onclick="openStageModal(2)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-purple-500 hover:scale-105 transition transform group">
                    <div class="text-purple-500 dark:text-purple-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-tags"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 2</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Entity Resolution</div>
                </div>

                <div onclick="openStageModal(3)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-blue-500 hover:scale-105 transition transform group">
                    <div class="text-blue-500 dark:text-blue-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-folder-tree"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 3</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Taxonomy Classify</div>
                </div>

                <div onclick="openStageModal(4)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-pink-500 hover:scale-105 transition transform group">
                    <div class="text-pink-500 dark:text-pink-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-puzzle-piece"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 4</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Attribute Extract</div>
                </div>

                <div onclick="openStageModal(5)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-cyan-500 hover:scale-105 transition transform group">
                    <div class="text-cyan-500 dark:text-cyan-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-ruler-combined"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 5</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Normalization</div>
                </div>

                <div onclick="openStageModal(6)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-purple-500 hover:scale-105 transition transform group">
                    <div class="text-purple-500 dark:text-purple-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-pen-nib"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 6</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Content Gen</div>
                </div>

                <div onclick="openStageModal(7)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-pink-500 hover:scale-105 transition transform group">
                    <div class="text-pink-500 dark:text-pink-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 7</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Validation Rules</div>
                </div>

                <div onclick="openStageModal(8)" class="glass-card rounded-2xl p-4 cursor-pointer hover:border-emerald-500 hover:scale-105 transition transform group">
                    <div class="text-emerald-500 dark:text-emerald-400 text-2xl mb-1.5 group-hover:animate-bounce"><i class="fa-solid fa-circle-nodes"></i></div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">Stage 8</div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Evidence Graph</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Catalog Explorer Section -->
    <section id="catalog" class="max-w-7xl mx-auto px-6 py-8 z-10 relative">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i class="fa-solid fa-table-cells text-cyan-500"></i> Catalog Explorer
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Browse 1,000 SKUs with live confidence scoring and evidence graph visualizer</p>
            </div>
            <div class="flex items-center space-x-3 w-full md:w-auto">
                <div class="flex items-center space-x-1.5 glass-card p-1.5 rounded-xl border border-white/10">
                    <button onclick="setFilter('all')" id="btn-all" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white transition">All SKUs (1,000)</button>
                    <button onclick="setFilter('approved')" id="btn-approved" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Auto-Approved (680)</button>
                    <button onclick="setFilter('review')" id="btn-review" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Human Review (320)</button>
                </div>
                <div class="relative w-full md:w-72">
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                    <input type="text" id="search-input" onkeyup="handleSearch()" placeholder="Search MPN, brand, manufacturer..." class="w-full glass-card border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
                </div>
            </div>
        </div>

        <!-- Product Table Container -->
        <div class="glass-card rounded-3xl border border-white/10 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-100 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10 font-mono">
                        <tr>
                            <th class="px-6 py-4">Mfg Part Num</th>
                            <th class="px-6 py-4">Manufacturer</th>
                            <th class="px-6 py-4">Resolved Brand</th>
                            <th class="px-6 py-4">Taxonomy Classpath</th>
                            <th class="px-6 py-4">Confidence</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="product-table-body" class="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                        <tr><td colspan="7" class="text-center py-12 text-slate-500">Loading catalog items...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Stage Inspector Modal -->
    <div id="stage-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-3xl rounded-3xl border border-purple-500/30 flex flex-col overflow-hidden shadow-2xl">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 text-white">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-lg" id="stage-modal-icon">
                        <i class="fa-solid fa-diagram-project"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm font-mono" id="stage-modal-title">Stage Inspector</h3>
                        <p class="text-xs text-slate-400" id="stage-modal-subtitle">Stage Overview & Execution Logic</p>
                    </div>
                </div>
                <button onclick="closeStageModal()" class="text-slate-400 hover:text-white text-lg px-2"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="p-6 space-y-4 text-xs font-sans text-slate-200" id="stage-modal-body">
                <!-- Dynamic Content -->
            </div>
        </div>
    </div>

    <!-- Evidence Graph Modal -->
    <div id="evidence-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-4xl max-h-[90vh] rounded-3xl border border-purple-500/30 flex flex-col overflow-hidden shadow-2xl">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 text-white">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <i class="fa-solid fa-circle-nodes"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm font-mono" id="modal-mpn">PDSH4816AF</h3>
                        <p class="text-xs text-slate-400" id="modal-desc">Dishwasher SS</p>
                    </div>
                </div>
                <button onclick="closeModal()" class="text-slate-400 hover:text-white text-lg px-2"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="p-6 overflow-y-auto space-y-6 text-xs" id="modal-content">
                <!-- Dynamic Content Loaded Here -->
            </div>
        </div>
    </div>

    <!-- Footer Section -->
    <footer class="glass-card border-t border-white/10 mt-16 py-8 px-6 z-10 relative">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
                <img src="{{LOGO_DATA_URI}}" alt="Nexora AI Logo" class="h-7 w-auto logo-glow">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-light">© 2026 Nexora AI • Built for UniHack 2026 Challenge</span>
            </div>
            <div class="flex items-center space-x-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>FastAPI</span> • <span>RapidFuzz</span> • <span>Pydantic v2</span> • <span>Python 3.12</span>
            </div>
        </div>
    </footer>

    <!-- Interactive Scripts -->
    <script>
        // Particle Background Canvas Setup
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for(let i=0; i<45; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 1
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';

            particles.forEach(function(p, i) {
                p.x += p.vx;
                p.y += p.vy;
                if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                for(let j=i+1; j<particles.length; j++) {
                    let p2 = particles[j];
                    let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if(dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // Theme Switcher Functionality
        function toggleTheme() {
            const html = document.documentElement;
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }

        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.remove('dark');
        }

        // Stage Inspector Information Data
        const stageData = {
            1: {
                title: "Stage 1: Data Cleaning Engine",
                icon: "fa-broom text-cyan-400",
                subtitle: "Sanitizes raw SKU inputs and strips sentinel values",
                desc: "Strips values like '-- Unbranded --', '-- No Unilog Brand --', cleans leading/trailing whitespace, and parses complex manufacturer strings like 'Freud Inc (2435)' into structured name and code components.",
                stats: "1,000 SKUs cleaned | 799 sentinel brands nullified | 77 manufacturers structured"
            },
            2: {
                title: "Stage 2: Entity Resolution Agent",
                icon: "fa-tags text-purple-400",
                subtitle: "Resolves canonical Manufacturer and Brand identities",
                desc: "Uses RapidFuzz token matching against 27K manufacturer master datasets and cross-checks product descriptions to infer correct canonical brands (e.g. TREX to Trex, Freud Inc + Diablo desc to Diablo).",
                stats: "100.0% Manufacturer Accuracy | 100.0% Brand Accuracy | 80% Unbranded SKUs resolved"
            },
            3: {
                title: "Stage 3: Product Classification Agent",
                icon: "fa-folder-tree text-blue-400",
                subtitle: "Hierarchical Product Taxonomy Mapping",
                desc: "Maps raw SKU descriptions and MPNs into a 4-tier taxonomy: Dept / Class / Fine Line / Classpath (e.g. Appliances & Consumer Electronics / Kitchen Appliances / Built-In Dishwashers).",
                stats: "100.0% Classpath Accuracy | 100% taxonomy rule matching"
            },
            4: {
                title: "Stage 4: Attribute Extraction Agent",
                icon: "fa-puzzle-piece text-pink-400",
                subtitle: "Extracts structured (Label, Value, UOM) triplets",
                desc: "Identifies category-specific attributes like Size, Grit, Voltage, Wattage, Horsepower, Teeth Count, and Material directly from cryptic description strings.",
                stats: "3,462 attributes extracted | Avg 3.46 attributes per product"
            },
            5: {
                title: "Stage 5: Normalization Engine",
                icon: "fa-ruler-combined text-cyan-400",
                subtitle: "UOM Standardization & Abbreviation Expansion",
                desc: "Standardizes units of measure (inches/inch to in, volts to V, amps to A) and expands industrial abbreviations (CPLG to Coupling, BRS to Brass, SST to Stainless Steel).",
                stats: "100.0% UOM Compliance | 100.0% LOV Compliance"
            },
            6: {
                title: "Stage 6: Content Generation Agent",
                icon: "fa-pen-nib text-purple-400",
                subtitle: "Derives 5 Commerce Representations from Validated Object",
                desc: "Generates MOBILE_DESC, INVOICE_DESC (ALL CAPS <= 50 chars), SHORT_DESC (<= 150 chars), LONG_DESC1, and RETAIL_DESC from the same single source of truth validated attribute object.",
                stats: "5,000 descriptions generated | 100% character limit compliance"
            },
            7: {
                title: "Stage 7: Validation Engine Agent",
                icon: "fa-shield-halved text-pink-400",
                subtitle: "Enforces Compliance Rules & Character Limits",
                desc: "Validates every field against List of Values (LOV) constraints, UOM standards, required identity fields, and string length limits.",
                stats: "0 schema violations | 100% compliance checked"
            },
            8: {
                title: "Stage 8: Evidence Provenance Graph Agent",
                icon: "fa-circle-nodes text-emerald-400",
                subtitle: "Constructs Traceable Evidence for Every Field",
                desc: "Attaches complete provenance (source type, confidence score, source URL, extraction method, LOV status) to every single generated attribute and identity field.",
                stats: "10,000+ evidence items attached | Full auditability enabled"
            }
        };

        function openStageModal(stageId) {
            const modal = document.getElementById('stage-modal');
            const data = stageData[stageId];
            if (!data) return;

            document.getElementById('stage-modal-title').innerText = data.title;
            document.getElementById('stage-modal-subtitle').innerText = data.subtitle;
            document.getElementById('stage-modal-icon').className = `w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg ${data.icon}`;

            document.getElementById('stage-modal-body').innerHTML = `
                <div class="bg-slate-900 p-4 rounded-2xl border border-white/10 space-y-3">
                    <h4 class="font-bold text-white text-xs uppercase tracking-wider">Stage Functionality & Process</h4>
                    <p class="text-slate-300 leading-relaxed text-xs">${data.desc}</p>
                </div>
                <div class="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 space-y-2">
                    <h4 class="font-bold text-purple-300 text-xs uppercase tracking-wider">Stage Statistics</h4>
                    <div class="font-mono text-xs text-purple-200">${data.stats}</div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function closeStageModal() {
            document.getElementById('stage-modal').classList.add('hidden');
        }

        let currentFilter = 'all';
        let searchQuery = '';

        async function fetchStatus() {
            const res = await fetch('/api/status');
            const data = await res.json();
            document.getElementById('stat-total').innerText = data.total_skus.toLocaleString();
            document.getElementById('stat-mfr').innerText = data.metrics.manufacturer_accuracy + '%';
            document.getElementById('stat-brand').innerText = data.metrics.brand_accuracy + '%';
            document.getElementById('stat-approved').innerText = data.auto_approval_rate + '%';
            document.getElementById('stat-review-count').innerText = data.human_review_count;
        }

        async function fetchProducts() {
            let url = `/api/products?status=${currentFilter}&limit=30`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            const res = await fetch(url);
            const data = await res.json();
            
            const tbody = document.getElementById('product-table-body');
            tbody.innerHTML = '';

            if (data.products.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-500">No matching SKUs found.</td></tr>`;
                return;
            }

            data.products.forEach(function(p) {
                const confPercent = Math.round(p.overall_confidence * 100);
                const statusBadge = p.needs_human_review
                    ? `<span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Human Review</span>`
                    : `<span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-circle-check mr-1"></i> Auto Approved</span>`;

                tbody.innerHTML += `
                    <tr class="hover:bg-slate-500/5 transition">
                        <td class="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white">${p.mfg_part_num}</td>
                        <td class="px-6 py-4 text-slate-700 dark:text-slate-200">${p.manufacturer_name}</td>
                        <td class="px-6 py-4 font-bold text-cyan-600 dark:text-cyan-400">${p.brand_name}</td>
                        <td class="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">${p.classpath}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-gradient-to-r from-cyan-400 to-purple-500 h-1.5 rounded-full" style="width: ${confPercent}%"></div>
                                </div>
                                <span class="font-mono text-slate-600 dark:text-slate-300">${confPercent}%</span>
                            </div>
                        </td>
                        <td class="px-6 py-4">${statusBadge}</td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="openEvidenceModal('${p.mfg_part_num}')" class="px-3.5 py-1.5 bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white dark:text-purple-300 dark:hover:text-white rounded-xl text-xs transition border border-purple-500/30 flex items-center gap-1.5 ml-auto">
                                <i class="fa-solid fa-circle-nodes"></i> Evidence Graph
                            </button>
                        </td>
                    </tr>
                `;
            });
        }

        function setFilter(filter) {
            currentFilter = filter;
            ['all', 'approved', 'review'].forEach(function(f) {
                const btn = document.getElementById(`btn-${f}`);
                if (f === filter) {
                    btn.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white transition';
                } else {
                    btn.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition';
                }
            });
            fetchProducts();
        }

        let searchTimeout;
        function handleSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                searchQuery = document.getElementById('search-input').value;
                fetchProducts();
            }, 300);
        }

        async function openEvidenceModal(mpn) {
            const modal = document.getElementById('evidence-modal');
            const res = await fetch(`/api/product/${encodeURIComponent(mpn)}`);
            const data = await res.json();
            const p = data.product;
            const ev = data.evidence;

            document.getElementById('modal-mpn').innerText = p.mfg_part_num;
            document.getElementById('modal-desc').innerText = p.part_desc;

            let attrsHtml = p.attributes.map(function(a) {
                return `
                    <div class="bg-slate-900 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <span class="text-slate-400">${a.label}:</span>
                            <span class="font-bold text-white ml-1">${a.value} ${a.uom}</span>
                        </div>
                        <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">LOV Validated</span>
                    </div>
                `;
            }).join('');

            let evidenceHtml = Object.values(ev.evidences).map(function(e) {
                return `
                    <div class="border-l-2 border-purple-500 pl-3.5 py-1 space-y-1">
                        <div class="font-semibold text-slate-200">${e.field_name}: <span class="text-cyan-400">${e.value}</span></div>
                        <div class="text-[10px] text-slate-400">Confidence: <span class="text-purple-300 font-bold">${(e.confidence * 100).toFixed(0)}%</span> • Source: <span class="text-slate-300 font-mono">${e.source_type}</span></div>
                        ${e.snippet ? `<div class="text-[10px] italic text-slate-500">${e.snippet}</div>` : ''}
                    </div>
                `;
            }).join('');

            document.getElementById('modal-content').innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <h4 class="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-pen-nib text-purple-400"></i> Generated Descriptions (Commerce-Ready)
                        </h4>
                        <div class="bg-slate-900 p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                            <div><span class="text-[10px] text-slate-400 uppercase font-mono">Mobile Desc:</span> <p class="text-slate-200">${p.mobile_desc}</p></div>
                            <div><span class="text-[10px] text-slate-400 uppercase font-mono">Invoice Desc:</span> <p class="font-mono text-emerald-400 font-bold">${p.invoice_desc}</p></div>
                            <div><span class="text-[10px] text-slate-400 uppercase font-mono">Short Title:</span> <p class="text-slate-200 font-semibold">${p.short_desc}</p></div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-globe text-cyan-400"></i> Manufacturer Source & Links
                        </h4>
                        <div class="bg-slate-900 p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                            <div><span class="text-[10px] text-slate-400">MFR URL:</span> <a href="${p.mfr_url}" target="_blank" class="text-cyan-400 underline block truncate font-mono">${p.mfr_url}</a></div>
                            <div><span class="text-[10px] text-slate-400">Spec Sheet:</span> <span class="text-slate-200 block font-mono">${p.specification_sheet}</span></div>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-puzzle-piece text-pink-400"></i> Extracted Attributes (${p.attributes.length})
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">${attrsHtml}</div>
                </div>

                <div class="space-y-2">
                    <h4 class="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-nodes text-purple-400"></i> Evidence Provenance Graph
                    </h4>
                    <div class="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">${evidenceHtml}</div>
                </div>
            `;

            modal.classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('evidence-modal').classList.add('hidden');
        }

        function scrollToCatalog() {
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        }

        fetchStatus();
        fetchProducts();
    </script>
</body>
</html>"""

@app.get("/", response_class=HTMLResponse)
def get_dashboard():
    return RAW_HTML.replace("{{LOGO_DATA_URI}}", LOGO_DATA_URI)
