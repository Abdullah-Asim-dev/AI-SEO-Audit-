"use client";

import { useState, useEffect } from "react";
import { 
  Globe, 
  AlertTriangle, 
  FileText, 
  Bot, 
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Link2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Star,
  MessageSquare,
  HelpCircle,
  ThumbsUp
} from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface ScrapedData {
  title: string;
  meta_description: string;
  h1_tags: string[];
  h2_count: number;
  total_images: number;
  missing_alt_count: number;
  missing_alt_list: string[];
  broken_links_count: number;
  broken_links_list: { url: string; status: number | string }[];
}

interface AuditResponse {
  website_data: ScrapedData;
  ai_analysis: string;
}

interface UserReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  // New Advanced System Trackers
  const [loadingLog, setLoadingLog] = useState<string>("Executing multi-tier server data crawlers logs pipeline...");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (loading) {
      const logsTimeline = [
        "Initializing secure client handshake instance...",
        "Crawling target server configuration parameters...",
        "Extracting deep DOM elements and text properties...",
        "Analyzing structural image alternate strings...",
        "Invoking AI Assistant diagnostic verification system...",
        "Finalizing telemetry audit matrix computations..."
      ];
      let currentIndex = 0;
      setLoadingLog(logsTimeline[0]);
      
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % logsTimeline.length;
        setLoadingLog(logsTimeline[currentIndex]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

  // Review System States
  const [reviews, setReviews] = useState<UserReview[]>([
    { name: "Alex Mercer", rating: 5, comment: "Lightning fast audit system! The DeepSeek/Qwen breakdown helped me isolate missing alt attributes within minutes.", date: "Just now" },
    { name: "Sarah K.", rating: 5, comment: "Clean single page workflow. No annoying mandatory logins, straight to technical parameters diagnostics.", date: "2 hours ago" }
  ]);
  const [revName, setRevName] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revRating, setRevRating] = useState(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAuditData(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${backendUrl}/api/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Engine encountered an optimization failure processing domain parameters.");
      }
      setAuditData(data);
    } catch (err: any) {
      setError(err.message || "Failed to establish a valid secure routing frame handshake.");
    } finally {
      setLoading(false);
    }
  };

   const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    // JavaScript/TypeScript me `.strip()` ki jagah `.trim()` use hota hai
    if (!revName.trim() || !revComment.trim()) return;
    
    const newRev: UserReview = {
      name: revName,
      rating: revRating,
      comment: revComment,
      date: "Seconds ago"
    };
    setReviews([newRev, ...reviews]);
    setRevName("");
    setRevComment("");
    setRevRating(5);
  };
  const extractScore = (text: string | undefined): number => {
    if (!text) return 75;
    const match = text.match(/Score:\s*(\d+)|(\d+)\s*\/\s*100/i);
    if (match) {
      return parseInt(match[1] || match[2], 10);
    }
    return 80;
  };

  const copyToClipboard = () => {
    if (!auditData) return;
    navigator.clipboard.writeText(auditData.ai_analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsTextFile = () => {
    if (!auditData) return;
    const element = document.createElement("a");
    const file = new Blob([`SEO Audit Report for ${url}\n\n${auditData.ai_analysis}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "seo-audit-report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const score = auditData ? extractScore(auditData.ai_analysis) : 0;
  const chartData = [{ name: "Score", value: score, fill: score > 79 ? "#10B981" : score > 49 ? "#F59E0B" : "#EF4444" }];

  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Background Graphic Grid Flares */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 z-10">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs font-medium tracking-wide animate-pulse">
            <ShieldCheck size={14} />
            <span>Enterprise Grade AI Pipeline Active</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
            AI SEO Audit <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Engine</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-medium">
            Analyze production URL instances, process content parameters instantly, and fetch structured mitigation diagnostics powered by Groq LPU processing grids.
          </p>
        </div>

        {/* URL Input Form */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto shadow-2xl mb-12 group hover:border-slate-700/80 transition-all duration-300">
          <form onSubmit={handleAudit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Globe size={18} />
              </div>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter live website URL instance (e.g., https://site.com)"
                className="w-full pl-12 pr-4 py-4 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-slate-600 transition-all text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold py-4 px-8 rounded-2xl transition shadow-lg flex items-center justify-center space-x-2 text-sm select-none"
            >
              {loading ? (
                <> <RefreshCw size={16} className="animate-spin" /> <span>Crawling Assets...</span> </>
              ) : (
                <> <span>Run SEO Pulse</span> <ArrowRight size={16} /> </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Advanced Dynamic Progress Log Visuals */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-5 max-w-md mx-auto">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-4 border-teal-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-teal-400 font-semibold text-xs tracking-widest uppercase animate-pulse">Processing Pipeline</p>
              <p className="text-slate-400 font-medium text-sm transition-all duration-300">{loadingLog}</p>
            </div>
          </div>
        )}
        {/* Dashboard Audit Content Section */}
        {auditData && !loading && (
          <div className="space-y-10 animate-fade-in">
            {/* Top Score Summary Flex Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Radial Bar Chart Score Card */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Calculated Audit Score</h3>
                <div className="w-48 h-48 relative flex items-center justify-center">
   <ResponsiveContainer width="100%" height="100%">
  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={chartData} startAngle={90} endAngle={-270}>
    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
    {/* 🚀 Fixed: clockWise prop ko remove kar diya hai taake type error bilkul khatam ho jaye */}
    <RadialBar background dataKey="value" cornerRadius={10} />
  </RadialBarChart>
</ResponsiveContainer>


                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black text-white">{score}</span>
                    <span className="text-xs text-slate-500 font-bold tracking-wider">/ 100 PTS</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mt-2 px-6">Composite matrix weight tracking active.</p>
              </div>

              {/* Core Parameters Scraped Raw Information Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-blue-400"><FileText size={20} /></div>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Meta Page Title</h4>
                    <p className="text-sm font-semibold text-white truncate">{auditData.website_data.title}</p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 text-purple-400"><MessageSquare size={20} /></div>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Description String</h4>
                    <p className="text-sm font-semibold text-white line-clamp-2">{auditData.website_data.meta_description}</p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-emerald-400"><ImageIcon size={20} /></div>
                  <div className="space-y-1">
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Images Alt Optimization</h4>
                    <p className="text-lg font-bold text-white">
                      {auditData.website_data.total_images - auditData.website_data.missing_alt_count} <span className="text-xs text-slate-500 font-normal">/ {auditData.website_data.total_images} optimized</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 text-orange-400"><Link2 size={20} /></div>
                  <div className="space-y-1">
                    <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Broken Redirection Elements</h4>
                    <p className="text-lg font-bold text-white">
                      {auditData.website_data.broken_links_count || 0} <span className="text-xs text-slate-500 font-normal">dead reference items</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Explicit Headings Tags Checklist Panel */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase text-slate-400">Structural Heading Hierarchy Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 tracking-wider"><h1> Tags Discovered</h1></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${auditData.website_data.h1_tags.length === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {auditData.website_data.h1_tags.length} Found
                    </span>
                  </div>
                  {auditData.website_data.h1_tags.length > 0 ? (
                    <ul className="space-y-1 text-xs text-white font-medium list-disc list-inside">
                      {auditData.website_data.h1_tags.map((tag, i) => <li key={i} className="truncate">{tag}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle size={12} /> H1 structure is completely missing on this DOM node.</p>
                  )}
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 tracking-wider"><h2> Tags Quantity Counter</h2></span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">
                      {auditData.website_data.h2_count} Total Nodes
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Crawler registered <span className="text-white font-bold">{auditData.website_data.h2_count} individual subheadings</span> throughout the current render pass layout matrix.
                  </p>
                </div>
              </div>
            </div>
            {/* AI Assistant Expert Recommendations Output Terminal Block */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400"><Bot size={18} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">AI Assistant Deep Diagnostics</h3>
                    <p className="text-xs text-slate-500">Cognitive contextual validation synthesis framework response logs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button onClick={copyToClipboard} className="p-2 bg-slate-950 border border-slate-800 rounded-xl hover:text-white transition text-xs flex items-center space-x-1.5 text-slate-400 font-medium">
                    {copied ? <><Check size={14} className="text-teal-400" /> <span className="text-teal-400">Copied</span></> : <><Copy size={14} /> <span>Copy Logs</span></>}
                  </button>
                  <button onClick={exportAsTextFile} className="p-2 bg-slate-950 border border-slate-800 rounded-xl hover:text-white transition text-xs flex items-center space-x-1.5 text-slate-400 font-medium">
                    <Download size={14} /> <span>Export Report</span>
                  </button>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-slate-950/40 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {auditData.ai_analysis}
              </div>
            </div>
          </div>
        )
        }

        {/* Simple End-User Experience Reviews Feature */}
        <div className="mt-24 border-t border-slate-900 pt-16 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><HelpCircle size={18} /></div>
            <h3 className="text-lg font-bold text-white tracking-wide">Developer Validation Feed</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Reviews Form Container */}
            <form onSubmit={handleAddReview} className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Engine Performance Logs</h4>
              <div>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="Your Identification handle Name"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 text-white placeholder-slate-600 font-medium"
                />
              </div>
              <div>
                <textarea
                  required
                  rows={3}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="Engine experience logs, architectural parameters notation feedback context..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 text-white placeholder-slate-600 font-medium resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRevRating(star)} className="focus:outline-none">
                      <Star size={14} className={star <= revRating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                    </button>
                  ))}
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-5 rounded-xl transition shadow flex items-center space-x-1.5">
                  <ThumbsUp size={12} /> <span>Submit Log</span>
                </button>
              </div>
            </form>

            {/* Render Output Feed */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map((rev, index) => (
                <div key={index} className="p-4 bg-slate-900/20 border border-slate-900/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">{rev.name}</span>
                    <span className="text-[10px] text-slate-600 font-medium">{rev.date}</span>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-400 text-xs leading-normal">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}