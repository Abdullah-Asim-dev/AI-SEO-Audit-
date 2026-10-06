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
  MessageSquare,
} from "lucide-react";

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

const checks = [
  { title: "Technical SEO", text: "Finds broken links and other crawl problems that stop search engines from reaching your pages." },
  { title: "Meta titles and descriptions", text: "Reads your page title and meta description so you can see what searchers will see in results." },
  { title: "Heading structure", text: "Counts H1 and H2 tags and flags pages with a missing or duplicate H1." },
  { title: "Image alt text", text: "Lists images without alt attributes, which help accessibility and image search." },
];

const steps = [
  { title: "Enter your URL", text: "Paste the address of any public page." },
  { title: "We crawl the page", text: "The tool reads the title, description, headings, images and links." },
  { title: "AI reviews the results", text: "An AI model turns the raw data into a prioritized fix list." },
  { title: "Fix and re-test", text: "Copy or export the report, apply the changes, then run the audit again." },
];

const checklist = [
  "One clear H1 that describes the page",
  "Unique title tag, ideally under about 60 characters",
  "Meta description that matches the page content",
  "Logical H2 and H3 subheadings",
  "Descriptive alt text on meaningful images",
  "No broken internal or external links",
  "Canonical URL, sitemap and robots.txt in place",
  "Fast loading pages and a mobile-friendly layout",
];

const faqs = [
  { q: "What is an SEO audit tool?", a: "An SEO audit tool scans a web page and reports problems that can hold back its search rankings, such as missing titles, weak headings, broken links and images without alt text." },
  { q: "Is this SEO audit tool free?", a: "Yes. You can audit a public URL without creating an account." },
  { q: "What does the technical SEO audit cover?", a: "It checks the page title, meta description, H1 and H2 headings, image alt attributes and broken links, then adds AI-written recommendations." },
  { q: "How is the SEO score calculated?", a: "The score starts at 100 and loses points for a missing or overlong title, a missing meta description, a missing or duplicate H1, images without alt text and broken links. Treat it as a guide for what to fix first, not as a ranking guarantee." },
  { q: "Can I audit my whole website?", a: "The tool audits one URL at a time. Run it on your homepage and your most important pages." },
  { q: "Will fixing these issues improve my rankings?", a: "Fixing technical and on-page issues removes obstacles, but rankings also depend on content quality, links and competition." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const computeScore = (d: ScrapedData): number => {
  let s = 100;
  if (!d.title) s -= 20;
  else if (d.title.length > 60) s -= 5;
  if (!d.meta_description) s -= 15;
  if (d.h1_tags.length !== 1) s -= 15;
  if (d.h2_count === 0) s -= 5;
  if (d.total_images > 0) s -= Math.round((15 * d.missing_alt_count) / d.total_images);
  s -= Math.min(20, (d.broken_links_count || 0) * 4);
  return Math.max(0, s);
};

const normalizeUrl = (raw: string): string => {
  const v = raw.trim();
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const color = score > 79 ? "#10B981" : score > 49 ? "#F59E0B" : "#EF4444";
  return (
    <svg viewBox="0 0 180 180" className="w-48 h-48" role="img" aria-label={`SEO score ${score} out of 100`}>
      <circle cx="90" cy="90" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
      <circle
        cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 90 90)"
      />
      <text x="90" y="98" textAnchor="middle" fontSize="44" fontWeight="900" fill="#fff">{score}</text>
      <text x="90" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="#94a3b8">/ 100</text>
    </svg>
  );
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [auditedUrl, setAuditedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [loadingLog, setLoadingLog] = useState<string>("Starting the audit...");

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (loading) {
      const logs = [
        "Connecting to your website...",
        "Reading page title and meta description...",
        "Checking headings and page structure...",
        "Checking image alt text...",
        "Checking links for errors...",
        "Generating AI recommendations...",
      ];
      let i = 0;
      setLoadingLog(logs[0]);
      intervalId = setInterval(() => {
        i = (i + 1) % logs.length;
        setLoadingLog(logs[i]);
      }, 2500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAuditData(null);

    const target = normalizeUrl(url);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${backendUrl}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "The audit failed. Check the URL and try again.");
      }
      setAuditedUrl(target);
      setAuditData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not reach the audit server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!auditData) return;
    navigator.clipboard.writeText(auditData.ai_analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsTextFile = () => {
    if (!auditData) return;
    const a = document.createElement("a");
    const file = new Blob([`SEO Audit Report for ${auditedUrl}\n\n${auditData.ai_analysis}`], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "seo-audit-report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const wd = auditData?.website_data;
  const score = wd ? computeScore(wd) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 z-10">
        {/* Hero */}
        <header className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs font-medium tracking-wide">
            <ShieldCheck size={14} />
            <span>AI-Powered Technical SEO Website Analyzer</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Free SEO Audit Tool
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Enter any URL to run a technical SEO audit. Get an AI-written fix list, not just error codes. This website
            SEO checker reviews your title, meta description, headings, image alt text and broken links.
          </p>
          <p className="text-sm text-slate-400">No signup &middot; Results in seconds &middot; Copy or export your report</p>
        </header>

        {/* URL form */}
        <section aria-label="Run an SEO audit" className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto shadow-2xl mb-12">
          <form onSubmit={handleAudit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Globe size={18} />
              </div>
              <input
                type="text"
                inputMode="url"
                required
                aria-label="Website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL (e.g., https://example.com)"
                className="w-full pl-12 pr-4 py-4 bg-slate-950/80 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-slate-400 transition-all text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold py-4 px-8 rounded-2xl transition shadow-lg flex items-center justify-center space-x-2 text-sm select-none disabled:opacity-70"
            >
              {loading ? (
                <><RefreshCw size={16} className="animate-spin" /> <span>Auditing...</span></>
              ) : (
                <><span>Run SEO Audit</span> <ArrowRight size={16} /></>
              )}
            </button>
          </form>
          {error && (
            <div role="alert" className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm flex items-center space-x-2">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-5 max-w-md mx-auto" aria-live="polite">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-4 border-teal-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-teal-400 font-semibold text-sm">Audit in progress</p>
              <p className="text-slate-300 font-medium text-sm">{loadingLog}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {wd && auditData && !loading && (
          <section aria-label="SEO audit results" className="space-y-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-slate-300 font-bold text-sm mb-2">SEO audit score</h2>
                <ScoreRing score={score} />
                <p className="text-slate-400 text-xs mt-2 px-4">Calculated from the crawled page data. It is a guide, not a ranking guarantee.</p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-blue-400"><FileText size={20} /></div>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h3 className="text-slate-300 font-bold text-sm">Page title <span className="text-slate-500 font-normal">({wd.title?.length || 0} chars)</span></h3>
                    <p className="text-sm font-semibold text-white break-words">{wd.title || "Missing"}</p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 text-purple-400"><MessageSquare size={20} /></div>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h3 className="text-slate-300 font-bold text-sm">Meta description <span className="text-slate-500 font-normal">({wd.meta_description?.length || 0} chars)</span></h3>
                    <p className="text-sm font-semibold text-white line-clamp-3">{wd.meta_description || "Missing"}</p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-emerald-400"><ImageIcon size={20} /></div>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h3 className="text-slate-300 font-bold text-sm">Images with alt text</h3>
                    <p className="text-lg font-bold text-white">
                      {wd.total_images - wd.missing_alt_count} <span className="text-xs text-slate-400 font-normal">/ {wd.total_images} have alt text</span>
                    </p>
                    {wd.missing_alt_list?.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-amber-300 max-h-28 overflow-y-auto">
                        {wd.missing_alt_list.slice(0, 20).map((src, i) => <li key={i} className="truncate" title={src}>{src}</li>)}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 text-orange-400"><Link2 size={20} /></div>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h3 className="text-slate-300 font-bold text-sm">Broken links</h3>
                    <p className="text-lg font-bold text-white">
                      {wd.broken_links_count || 0} <span className="text-xs text-slate-400 font-normal">found</span>
                    </p>
                    {wd.broken_links_list?.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-rose-300 max-h-28 overflow-y-auto">
                        {wd.broken_links_list.slice(0, 20).map((l, i) => (
                          <li key={i} className="truncate" title={l.url}>{l.status}: {l.url}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-300">Heading structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">H1 tags found</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${wd.h1_tags.length === 1 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {wd.h1_tags.length} found
                    </span>
                  </div>
                  {wd.h1_tags.length > 0 ? (
                    <ul className="space-y-1 text-xs text-white font-medium list-disc list-inside">
                      {wd.h1_tags.map((tag, i) => <li key={i} className="truncate">{tag}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-rose-300 font-semibold flex items-center gap-1"><AlertTriangle size={12} /> This page has no H1 tag.</p>
                  )}
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">H2 tags found</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/10 text-indigo-300">{wd.h2_count} total</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    The crawler found <span className="text-white font-bold">{wd.h2_count} H2 subheadings</span> on this page.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400"><Bot size={18} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI SEO recommendations</h3>
                    <p className="text-xs text-slate-400">Prioritized fixes based on your page data</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button onClick={copyToClipboard} className="p-2 bg-slate-950 border border-slate-800 rounded-xl hover:text-white transition text-xs flex items-center space-x-1.5 text-slate-300 font-medium">
                    {copied ? <><Check size={14} className="text-teal-400" /> <span className="text-teal-400">Copied</span></> : <><Copy size={14} /> <span>Copy report</span></>}
                  </button>
                  <button onClick={exportAsTextFile} className="p-2 bg-slate-950 border border-slate-800 rounded-xl hover:text-white transition text-xs flex items-center space-x-1.5 text-slate-300 font-medium">
                    <Download size={14} /> <span>Export report</span>
                  </button>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-slate-950/40 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {auditData.ai_analysis}
              </div>
            </div>
          </section>
        )}

        {/* What it checks */}
        <section className="mt-24 max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What does this SEO audit tool check?</h2>
            <p className="text-slate-300 leading-relaxed">
              Our free SEO audit tool analyzes the on-page and technical factors search engines read first. Each check
              below is included in every audit.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((c) => (
              <div key={c.title} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h3 className="text-base font-bold text-white">{c.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How the SEO audit tool works</h2>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex-none w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Why use */}
        <section className="mt-20 max-w-4xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why use our free SEO audit tool?</h2>
          <p className="text-slate-300 leading-relaxed">
            You get a quick technical SEO audit without signing up. Instead of a long list of raw errors, the AI explains
            what each issue means and which fixes to make first, so you can improve a page in one sitting. It works as a
            website audit tool for site owners, freelancers and developers checking pages before and after a launch.
          </p>
        </section>

        {/* Checklist */}
        <section className="mt-20 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Technical SEO audit checklist</h2>
          <p className="text-slate-300 leading-relaxed">Use this checklist alongside the audit results to review any page.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
                <Check size={16} className="mt-0.5 flex-none text-teal-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-20 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h3 className="text-base font-bold text-white">{f.q}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} AI SEO Audit. Free technical SEO checker.</p>
      </footer>
    </div>
  );
}