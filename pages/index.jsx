import { useEffect, useState } from "react";
import Head from "next/head";
import Background3D from "../components/Background3D";
import Spotlight from "../components/Spotlight";
import TiltCard from "../components/TiltCard";
import UploadZone from "../components/UploadZone";
import LengthSelector from "../components/LengthSelector";
import Loader from "../components/Loader";
import SummaryPanel from "../components/SummaryPanel";
import StepIndicator from "../components/StepIndicator";
import DocStats from "../components/DocStats";
import AskPanel from "../components/AskPanel";
import HistoryDrawer from "../components/HistoryDrawer";
import { IconAlert, IconCheck, IconGithub, IconHistory, IconLinkedin, IconSparkle } from "../components/Icons";
import { addHistoryEntry, clearHistory, getHistory, removeHistoryEntry } from "../lib/history";

const STATUS = {
  IDLE: "idle",
  EXTRACTING: "extracting",
  OCR: "ocr",
  OCR_FALLBACK: "ocr-fallback",
  SUMMARIZING: "summarizing",
  SUGGESTING: "suggesting",
  DONE: "done",
  ERROR: "error",
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [progress, setProgress] = useState(null);
  const [detail, setDetail] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const isBusy = ![STATUS.IDLE, STATUS.DONE, STATUS.ERROR].includes(status);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    const canSummarize = Boolean(extractedText) && !result && !isBusy;
    function onKeyDown(e) {
      const isEnterCombo = (e.metaKey || e.ctrlKey) && e.key === "Enter";
      if (isEnterCombo && canSummarize) {
        e.preventDefault();
        handleSummarize();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedText, result, isBusy]);

  const reset = () => {
    setFile(null);
    setStatus(STATUS.IDLE);
    setProgress(null);
    setDetail("");
    setExtractedText("");
    setResult(null);
    setError("");
  };

  const handleLoadHistory = (entry) => {
    setFile(null);
    setStatus(STATUS.DONE);
    setProgress(null);
    setDetail("");
    setExtractedText(entry.extractedText || "");
    setLength(entry.length || "medium");
    setResult({
      summary: entry.summary,
      keyPoints: entry.keyPoints || [],
      suggestions: entry.suggestions || [],
      wasClipped: entry.wasClipped,
    });
    setError("");
    setHistoryOpen(false);
  };

  const handleRemoveHistory = (id) => setHistory(removeHistoryEntry(id));
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleFileAccepted = async (f) => {
    setFile(f);
    setError("");
    setResult(null);
    setExtractedText("");

    try {
      let text = "";

      if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) {
        const { extractPdfText } = await import("../lib/extractPdf");
        setStatus(STATUS.EXTRACTING);
        const res = await extractPdfText(f, (p) => {
          if (p.phase === "ocr-fallback") {
            setStatus(STATUS.OCR_FALLBACK);
            setDetail(`Page ${p.page} of ${p.total} needs OCR…`);
          } else {
            setStatus(STATUS.EXTRACTING);
            setDetail(`Reading page ${p.page} of ${p.total}`);
          }
        });
        text = res.text;
      } else {
        const { runOcr } = await import("../lib/runOcr");
        setStatus(STATUS.OCR);
        text = await runOcr(f, (pct) => {
          setProgress(pct);
          setDetail(`${pct}% recognized`);
        });
      }

      if (!text || text.trim().length < 5) {
        throw new Error("Could not extract any readable text from this file. Try a clearer scan or a text-based PDF.");
      }

      setExtractedText(text);
      setStatus(STATUS.IDLE);
      setProgress(null);
      setDetail("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to read this file.");
      setStatus(STATUS.ERROR);
      setProgress(null);
    }
  };

  const handleSummarize = async () => {
    setError("");
    setResult(null);
    try {
      setStatus(STATUS.SUMMARIZING);
      setDetail("Summarizing and finding improvements at the same time…");

      // Summary and suggestions are independent — run them concurrently
      // instead of one after another to roughly halve the wait.
      const [sumRes, sugRes] = await Promise.all([
        fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: extractedText, length }),
        }),
        fetch("/api/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: extractedText }),
        }),
      ]);

      const sumData = await sumRes.json();
      if (!sumRes.ok) throw new Error(sumData.error || "Summarization failed.");
      const sugData = await sugRes.json();

      const finalResult = {
        summary: sumData.summary,
        keyPoints: sumData.keyPoints || [],
        wasClipped: sumData.wasClipped,
        suggestions: sugRes.ok ? sugData.suggestions || [] : [],
      };
      setResult(finalResult);
      setStatus(STATUS.DONE);
      setDetail("");

      setHistory(
        addHistoryEntry({
          fileName: file?.name || "Document",
          length,
          timestamp: Date.now(),
          extractedText,
          ...finalResult,
        })
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while summarizing.");
      setStatus(STATUS.ERROR);
    }
  };

  const currentStep = (() => {
    if (status === STATUS.DONE) return 4;
    if (status === STATUS.SUMMARIZING || status === STATUS.SUGGESTING) return 3;
    if (extractedText || status === STATUS.EXTRACTING || status === STATUS.OCR || status === STATUS.OCR_FALLBACK) return 2;
    return 1;
  })();

  return (
    <>
      <Head>
        <title>Sift — Document Summary Assistant</title>
      </Head>

      <Background3D />
      <Spotlight />

      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 font-display text-sm font-bold text-accent">
            S
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-white">Sift</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-white/45 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulseGlow" />
            Gemini-powered
          </div>
          <button
            onClick={() => setHistoryOpen(true)}
            className="relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-white/60 transition-colors hover:border-white/25 hover:text-white"
          >
            <IconHistory className="h-3.5 w-3.5" />
            History
            {history.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-ink">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <HistoryDrawer
        open={historyOpen}
        entries={history}
        onClose={() => setHistoryOpen(false)}
        onLoad={handleLoadHistory}
        onRemove={handleRemoveHistory}
        onClear={handleClearHistory}
      />

      <main className="relative z-10 mx-auto min-h-screen max-w-2xl px-4 pb-20 pt-4 sm:px-6">
        <header className="animate-fadeUp mb-10 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
            Document Summary Assistant
          </div>
          <h1 className="font-display text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Turn any document into a
            <br className="hidden sm:block" /> <span className="text-gradient">clear, structured summary</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-[15px] leading-relaxed text-white/50">
            Upload a PDF or a photo of a document. Sift extracts the text, then gives you
            a summary, key points, and specific ways to improve it.
          </p>
        </header>

        <StepIndicator current={currentStep} />

        <div className="space-y-6">
          <div className="animate-fadeUp delay-1">
            <TiltCard>
              <UploadZone onFileAccepted={handleFileAccepted} disabled={isBusy} />
            </TiltCard>
          </div>

          {(status === STATUS.EXTRACTING || status === STATUS.OCR || status === STATUS.OCR_FALLBACK) && (
            <div className="animate-fadeUp">
              <Loader status={status} progress={progress} detail={detail} />
            </div>
          )}

          {error && (
            <div className="animate-fadeUp flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-500/[0.07] px-4 py-3.5 text-sm text-red-200">
              <IconAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <span className="flex-1 leading-snug">{error}</span>
              <div className="flex flex-shrink-0 gap-2">
                {file && (
                  <button
                    onClick={extractedText ? handleSummarize : () => handleFileAccepted(file)}
                    className="rounded-full bg-red-400/15 px-3 py-1 text-xs font-medium transition-colors hover:bg-red-400/25"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={reset}
                  className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-medium transition-colors hover:bg-red-400/20"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {extractedText && !result && !isBusy && status !== STATUS.ERROR && (
            <TiltCard className="animate-fadeUp">
              <div className="glass-strong panel-corner space-y-6 rounded-xl p-6 sm:p-7">
                <div className="flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-wide text-accent2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  <span>Text extracted successfully</span>
                </div>

                <DocStats text={extractedText} />

                <div>
                  <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Summary length
                  </p>
                  <LengthSelector value={length} onChange={setLength} disabled={isBusy} />
                </div>

                <details className="group text-sm text-white/45">
                  <summary className="flex cursor-pointer select-none items-center gap-1.5 font-medium transition-colors hover:text-white/75">
                    <span className="inline-block transition-transform group-open:rotate-90">›</span>
                    Preview extracted text
                    <span className="font-mono font-normal text-white/30">
                      · {extractedText.length.toLocaleString()} chars
                    </span>
                  </summary>
                  <pre className="scrollbar-thin mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-white/[0.06] bg-black/30 p-3.5 font-mono text-xs leading-relaxed text-white/55">
                    {extractedText.slice(0, 2000)}
                    {extractedText.length > 2000 ? "…" : ""}
                  </pre>
                </details>

                <button
                  onClick={handleSummarize}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 font-display text-[15px] font-semibold text-ink shadow-glow transition-transform hover:scale-[1.005] active:scale-[0.99]"
                >
                  <IconSparkle className="h-4 w-4" />
                  Generate Summary
                  <span className="ml-1 hidden rounded border border-ink/20 bg-ink/10 px-1.5 py-0.5 font-mono text-[10px] font-normal opacity-70 sm:inline">
                    ⌘⏎
                  </span>
                </button>
              </div>
            </TiltCard>
          )}

          {(status === STATUS.SUMMARIZING || status === STATUS.SUGGESTING) && (
            <div className="animate-fadeUp">
              <Loader status={status} detail={detail} />
            </div>
          )}

          {result && status === STATUS.DONE && (
            <div className="animate-fadeUp space-y-6">
              <SummaryPanel {...result} />
              {extractedText && <AskPanel text={extractedText} />}
              <button
                onClick={reset}
                className="w-full rounded-lg border border-white/10 bg-white/[0.02] py-3 font-display font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
              >
                Summarize another document
              </button>
            </div>
          )}
        </div>

        <footer className="mt-20 flex flex-col items-center gap-5 border-t border-white/[0.06] pt-8 text-center">
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/pula-jyothireddy-5b3a01337/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-mono text-[11.5px] font-medium text-white/70 shadow-crisp transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-white hover:shadow-glow"
            >
              <IconLinkedin className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
              LinkedIn
            </a>
            <a
              href="https://github.com/Jyothireddy-pula"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-mono text-[11.5px] font-medium text-white/70 shadow-crisp transition-all hover:-translate-y-0.5 hover:border-accent2/50 hover:bg-accent2/10 hover:text-white hover:shadow-glow2"
            >
              <IconGithub className="h-4 w-4 text-accent2 transition-transform group-hover:scale-110" />
              GitHub
            </a>
          </div>
          <div className="font-mono text-[11px] text-white/30">
            <p>Built with Next.js · pdf.js · Tesseract.js · Gemini</p>
            <p className="text-white/20">Documents are processed in your browser — nothing is stored.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
