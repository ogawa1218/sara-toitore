import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

// ═══════════ SLEEPY FOREST BAND MEMBERS ═══════════
const CHARACTERS = {
  luminne:  { emoji: "🦄", name: "ルミネ", animal: "ペガサス", role: "ボーカル", color: "#A8D8EA" },
  leon:     { emoji: "🦁", name: "レオン", animal: "ライオン", role: "ギター",   color: "#FFB347" },
  liz:      { emoji: "🐰", name: "リズ",   animal: "うさぎ",   role: "タンバリン", color: "#E8D5F5" },
  bruno:    { emoji: "🐻", name: "ブルーノ", animal: "くま",   role: "ドラム",   color: "#8B7355" },
  melody:   { emoji: "🦄", name: "メロディ", animal: "ユニコーン", role: "キーボード", color: "#FFB5D0" },
  echo:     { emoji: "🐸", name: "エコー", animal: "かえる",   role: "DJ",      color: "#B5EAD7" },
  sheep:    { emoji: "🐑", name: "ひつじさん", animal: "ひつじ", role: "コーラス", color: "#F5F0E8" },
};

const BAND = [
  CHARACTERS.luminne, CHARACTERS.leon, CHARACTERS.liz,
  CHARACTERS.bruno, CHARACTERS.melody, CHARACTERS.echo, CHARACTERS.sheep,
];

// ═══════════ PHASES ═══════════
const PHASES = [
  {
    id: 1, name: "じゅんび期", subtitle: "おトイレと なかよし！",
    guide: "bruno", icon: "🚽", color: "#FFB5D0", duration: "1〜2週間",
    message: "ブルーノが ドラムで おうえんするよ！🥁 ゆっくり はじめよう",
    goals: ["トイレに座ることに慣れる", "絵本やお話でトイレを知る", "おまるに座る練習（服着たままでOK）"],
    tips: ["無理強いは絶対NG！楽しい雰囲気で", "トイレの絵本を一緒に読もう", "パパ・ママのトイレを見せてあげよう"],
  },
  {
    id: 2, name: "チャレンジ期", subtitle: "すわって みよう！",
    guide: "leon", icon: "⭐", color: "#FFD93D", duration: "2〜4週間",
    message: "レオンみたいに カッコよく チャレンジ！🎸🔥",
    goals: ["起床後・食後にトイレに座る習慣", "おむつを外してトイレに座る", "成功体験を1日1回以上"],
    tips: ["タイミングは起床直後がベスト", "2〜3分座ってダメなら切り上げよう", "成功したら大げさに褒めよう！"],
  },
  {
    id: 3, name: "こえかけ期", subtitle: "トイレ いく？",
    guide: "liz", icon: "🗣️", color: "#A0E7E5", duration: "2〜4週間",
    message: "リズが タンバリンで リズムを つくるよ♪ トイレいこ！🐰🎵",
    goals: ["1〜2時間おきに声かけ", "パンツ（トレパン）に移行", "日中のおむつ卒業を目指す"],
    tips: ["失敗しても絶対に叱らない", "「出なくてもOK」を伝えよう", "外出時はおむつでもOK"],
  },
  {
    id: 4, name: "じぶんで期", subtitle: "じぶんで いえるよ！",
    guide: "melody", icon: "🌟", color: "#E8D5F5", duration: "2〜6週間",
    message: "メロディが キラキラ メロディを おくるよ✨ サラちゃん すごい！",
    goals: ["自分から「トイレ」と言える", "日中ほぼパンツで過ごせる", "外出先でもトイレができる"],
    tips: ["自分で言えたら最大限に褒めよう", "お出かけ前にトイレの声かけを", "夜はおむつでも全然OK"],
  },
  {
    id: 5, name: "そつぎょう！", subtitle: "トイトレ マスター！",
    guide: "luminne", icon: "🎓", color: "#C3B1E1", duration: "",
    message: "ルミネが うたう おいわいソング🎤🌈 ディズニーへ GO！🏰",
    goals: ["日中はほぼ自立してトイレ", "おねしょは別問題、焦らない", "サラちゃん、よくがんばったね！"],
    tips: ["たまの失敗は当たり前", "夜のおむつは焦らなくてOK", "自信を持たせてあげよう！"],
  },
];

// ═══════════ ENCOURAGEMENT ═══════════
const SUCCESS_MSGS = [
  { char: "bruno",   msg: "ドンドン！ブルーノ うれしい！🥁🐻" },
  { char: "leon",    msg: "ロックだぜ サラちゃん！🎸🦁" },
  { char: "liz",     msg: "すごい！リズも ぴょんぴょん！🐰✨" },
  { char: "melody",  msg: "キラキラ〜♪ メロディも おどっちゃう！🎹" },
  { char: "echo",    msg: "ケロケロ！エコーの DJビート！🐸🎧" },
  { char: "luminne", msg: "ルミネが おそらから うたうよ🎤🌈" },
  { char: "sheep",   msg: "もこもこ〜 おめでとう！🐑💕" },
];

const TRY_MSGS = [
  { char: "bruno",   msg: "ブルーノが まってるよ！つぎ がんばろう🐻" },
  { char: "leon",    msg: "レオンは しってるよ、つぎは できる！🦁" },
  { char: "liz",     msg: "リズも いっしょに がんばるね🐰" },
  { char: "melody",  msg: "だいじょうぶ♪ メロディが ついてるよ🎹" },
  { char: "echo",    msg: "ケロ〜 チャレンジが いちばん だいじ！🐸" },
];

// ═══════════ STICKERS ═══════════
const STICKERS = [
  { emoji: "🐻", label: "ブルーノ" }, { emoji: "🦁", label: "レオン" },
  { emoji: "🐰", label: "リズ" },     { emoji: "🐸", label: "エコー" },
  { emoji: "🐑", label: "ひつじ" },   { emoji: "🦋", label: "ちょうちょ" },
  { emoji: "🌸", label: "さくら" },   { emoji: "🎵", label: "おんぷ" },
  { emoji: "🌈", label: "にじ" },     { emoji: "⭐", label: "ほし" },
  { emoji: "🎀", label: "リボン" },   { emoji: "🏰", label: "おしろ" },
];

const DISNEY_DATE = new Date("2025-04-29T00:00:00");

function getDaysUntilDisney() {
  const now = new Date();
  const diff = DISNEY_DATE - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ═══════════ LOCAL STORAGE HELPERS ═══════════
const STORAGE_KEY = "sara-toitore-v2";

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

const INIT_STATE = {
  currentPhase: 1,
  logs: [],
  totalSuccess: 0,
  totalAttempts: 0,
  stickers: [],
  startDate: new Date().toISOString().slice(0, 10),
};

// ═══════════ MAIN COMPONENT ═══════════
export default function ToitoreApp() {
  const [state, setState] = useState(INIT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState("home");
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState(null);
  const [newSticker, setNewSticker] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [showTryMsg, setShowTryMsg] = useState(null);
  const [daysLeft, setDaysLeft] = useState(76);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = loadState();
    if (saved) setState(saved);
    setDaysLeft(getDaysUntilDisney());
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  // Disney countdown
  useEffect(() => {
    const t = setInterval(() => setDaysLeft(getDaysUntilDisney()), 60000);
    return () => clearInterval(t);
  }, []);

  const phase = PHASES.find((p) => p.id === state.currentPhase);
  const guideChar = CHARACTERS[phase.guide];
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLogs = state.logs.filter((l) => l.date === todayStr);
  const todaySuccess = todayLogs.filter((l) => l.success).length;
  const todayAttempts = todayLogs.length;

  const logAttempt = useCallback(
    (success) => {
      const newLog = {
        date: todayStr,
        time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
        success,
        phase: state.currentPhase,
      };
      const ns = {
        ...state,
        logs: [...state.logs, newLog],
        totalSuccess: state.totalSuccess + (success ? 1 : 0),
        totalAttempts: state.totalAttempts + 1,
      };

      if (success) {
        const msg = SUCCESS_MSGS[Math.floor(Math.random() * SUCCESS_MSGS.length)];
        setCelebrationMsg(msg);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);

        if (ns.totalSuccess % 3 === 0 && ns.totalSuccess > 0) {
          const avail = STICKERS.filter((s) => !state.stickers.includes(s.emoji));
          if (avail.length > 0) {
            const earned = avail[Math.floor(Math.random() * avail.length)];
            ns.stickers = [...state.stickers, earned.emoji];
            setTimeout(() => {
              setNewSticker(earned);
              setTimeout(() => setNewSticker(null), 3000);
            }, 2500);
          }
        }
      } else {
        const msg = TRY_MSGS[Math.floor(Math.random() * TRY_MSGS.length)];
        setShowTryMsg(msg);
        setTimeout(() => setShowTryMsg(null), 2500);
      }
      setState(ns);
    },
    [state, todayStr]
  );

  const advancePhase = () => {
    if (state.currentPhase < 5) setState({ ...state, currentPhase: state.currentPhase + 1 });
  };
  const revertPhase = () => {
    if (state.currentPhase > 1) setState({ ...state, currentPhase: state.currentPhase - 1 });
  };
  const resetAll = () => {
    if (typeof window !== "undefined") {
      if (!window.confirm("データをリセットしますか？")) return;
    }
    setState(INIT_STATE);
    setView("home");
  };

  // Chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const dayLogs = state.logs.filter((l) => l.date === ds);
    return {
      date: ds,
      label: d.toLocaleDateString("ja-JP", { weekday: "short", day: "numeric" }),
      success: dayLogs.filter((l) => l.success).length,
      fail: dayLogs.filter((l) => !l.success).length,
    };
  });
  const maxBar = Math.max(...last7.map((d) => d.success + d.fail), 5);

  if (!hydrated) return null;

  return (
    <>
      <Head>
        <title>🌙 サラちゃんのトイトレ 〜The Sleepy Forest〜</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1a1a3e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌙</text></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
          font-family: 'Zen Maru Gothic', sans-serif;
          background: #FAFBFE; 
          -webkit-tap-highlight-color: transparent;
          overflow-x: hidden;
        }
        @keyframes floatChar { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes popIn { 0%{transform:scale(0)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-6deg)} 75%{transform:rotate(6deg)} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes confetti { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(-180px) rotate(720deg);opacity:0} }
        @keyframes sparkle { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes castleFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes bandWalk { 0%{transform:translateX(-6px)} 50%{transform:translateX(6px)} 100%{transform:translateX(-6px)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,157,0.3)} 50%{box-shadow:0 0 0 10px rgba(255,107,157,0)} }
        @keyframes btnPress { 0%{transform:scale(1)} 50%{transform:scale(0.95)} 100%{transform:scale(1)} }
        button:active { animation: btnPress 0.15s ease-out; }
      `}</style>

      <div style={S.wrapper}>

        {/* ══════ CELEBRATION ══════ */}
        {showCelebration && (
          <div style={S.overlay}>
            <div style={S.celebContent}>
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} style={{
                  position: "absolute",
                  fontSize: `${18 + Math.random() * 18}px`,
                  left: `${5 + Math.random() * 90}%`,
                  top: `${10 + Math.random() * 70}%`,
                  animation: `confetti ${1 + Math.random() * 1.5}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}>
                  {["🎉", "⭐", "✨", "🌟", "💫", "🎊", "🎵"][i % 7]}
                </span>
              ))}
              <div style={{
                display: "flex", gap: 4, marginBottom: 12,
                animation: "bandWalk 2s ease-in-out infinite",
              }}>
                {BAND.map((c, i) => (
                  <span key={i} style={{
                    fontSize: 26,
                    animation: `floatChar 1.5s ease-in-out ${i * 0.12}s infinite`,
                  }}>{c.emoji}</span>
                ))}
              </div>
              {celebrationMsg && (
                <>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#FF6B9D", zIndex: 1 }}>
                    すごーい！！
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFB347", marginTop: 6, zIndex: 1 }}>
                    {celebrationMsg.msg}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════ TRY MESSAGE ══════ */}
        {showTryMsg && (
          <div style={S.tryOverlay}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 48 }}>
                {CHARACTERS[showTryMsg.char]?.emoji || "💪"}
              </span>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FFB347", marginTop: 8 }}>
                {showTryMsg.msg}
              </div>
            </div>
          </div>
        )}

        {/* ══════ STICKER POPUP ══════ */}
        {newSticker && (
          <div style={S.stickerPopup}>
            <div style={{ fontSize: 52, animation: "popIn 0.5s ease-out" }}>{newSticker.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#FF6B9D", marginTop: 8 }}>
              {newSticker.label}シール GET！
            </div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
              🎵 The Sleepy Forest からの プレゼント
            </div>
          </div>
        )}

        {/* ══════════ HEADER ══════════ */}
        <div style={{
          ...S.header,
          background: `linear-gradient(135deg, #1a1a3e 0%, #2d2b55 50%, ${phase.color}22 100%)`,
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{
              position: "absolute", fontSize: 8, color: "#FFD700",
              left: `${12 + i * 18}%`, top: `${20 + Math.sin(i) * 25}%`,
              animation: `sparkle ${2 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`,
              opacity: 0.5,
            }}>✦</span>
          ))}
          <div style={S.headerInner}>
            <div style={S.headerBand}>
              {BAND.slice(0, 4).map((c, i) => (
                <span key={i} style={{
                  fontSize: 16, animation: `floatChar 2s ease-in-out ${i * 0.2}s infinite`,
                }}>{c.emoji}</span>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#FFF" }}>
                🌙 サラちゃんのトイトレ
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>
                〜The Sleepy Forest の なかまたちと いっしょ〜
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>
                {guideChar.emoji} フェーズ{state.currentPhase}：{phase.name}
                <span style={{ opacity: 0.6, marginLeft: 4 }}>
                  （{guideChar.name}がガイド）
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ DISNEY COUNTDOWN ══════════ */}
        <div style={{ margin: "0 12px", marginTop: -6 }}>
          <div style={S.disneyCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22, animation: "castleFloat 3s ease-in-out infinite" }}>🏰</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9B6DB7" }}>
                  ディズニーランドまで
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#FF6B9D", lineHeight: 1 }}>
                  あと <span style={{ fontSize: 30 }}>{daysLeft}</span> にち！
                </div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#B0A0C0", marginTop: 2 }}>
              4月29日 🎉 トイトレ できたら いこうね！
            </div>
            <div style={S.disneyMarch}>
              <div style={{ display: "flex", gap: 1, animation: "bandWalk 4s ease-in-out infinite" }}>
                {BAND.map((c, i) => (
                  <span key={i} style={{ fontSize: 12 }}>{c.emoji}</span>
                ))}
              </div>
              <div style={S.disneyTrack}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(100, ((state.currentPhase - 1) / 4) * 100)}%`,
                  background: "linear-gradient(90deg, #FFB5D0, #C3B1E1, #FFD700)",
                  borderRadius: 4, transition: "width 0.8s ease",
                }} />
              </div>
              <span style={{ fontSize: 16 }}>🏰</span>
            </div>
          </div>
        </div>

        {/* ══════════ NAV ══════════ */}
        <div style={S.nav}>
          {[
            { id: "home", icon: "🏠", label: "ホーム" },
            { id: "log", icon: "📝", label: "きろく" },
            { id: "chart", icon: "📊", label: "グラフ" },
            { id: "plan", icon: "📋", label: "プラン" },
            { id: "stickers", icon: "🎀", label: "シール" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id); setSelectedPhase(null); }}
              style={{
                ...S.navBtn,
                background: view === tab.id ? "#FFF" : "transparent",
                color: view === tab.id ? "#FF6B9D" : "#999",
                boxShadow: view === tab.id ? "0 2px 10px rgba(255,107,157,0.12)" : "none",
                transform: view === tab.id ? "translateY(-2px)" : "none",
              }}
            >
              <span style={{ fontSize: 17 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 700 }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div style={S.content}>

          {/* ──── HOME ──── */}
          {view === "home" && (
            <div style={{ animation: "slideUp 0.4s ease-out" }}>
              {/* Guide Message */}
              <div style={{
                ...S.guideMsg,
                background: `linear-gradient(135deg, ${phase.color}18, ${phase.color}08)`,
                borderLeft: `4px solid ${phase.color}`,
              }}>
                <span style={{ fontSize: 30, animation: "wiggle 2s ease-in-out infinite" }}>
                  {guideChar.emoji}
                </span>
                <div>
                  <div style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>
                    {guideChar.name}（{guideChar.animal}・{guideChar.role}）より
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#555", lineHeight: 1.6 }}>
                    {phase.message}
                  </div>
                </div>
              </div>

              {/* Today Stats */}
              <div style={S.card}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>📅</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#444" }}>きょうのきろく</span>
                </div>
                <div style={S.statsRow}>
                  {[
                    { val: todaySuccess, label: "せいこう", color: "#FF6B9D" },
                    { val: todayAttempts, label: "チャレンジ", color: "#FFB347" },
                    { val: state.stickers.length, label: "シール", color: "#B5EAD7" },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: "#999", fontWeight: 700 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={S.card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#666", marginBottom: 12, textAlign: "center" }}>
                  トイレ どうだった？
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => logAttempt(true)} style={S.successBtn}>
                    <span style={{ fontSize: 34 }}>🎉</span>
                    <span style={{ fontSize: 13, fontWeight: 900 }}>できた！</span>
                    <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                      <span style={{ fontSize: 11 }}>{CHARACTERS.luminne.emoji}</span>
                      <span style={{ fontSize: 11 }}>{CHARACTERS.leon.emoji}</span>
                      <span style={{ fontSize: 11 }}>{CHARACTERS.liz.emoji}</span>
                    </div>
                  </button>
                  <button onClick={() => logAttempt(false)} style={S.tryBtn}>
                    <span style={{ fontSize: 34 }}>💪</span>
                    <span style={{ fontSize: 13, fontWeight: 900 }}>がんばった！</span>
                    <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                      <span style={{ fontSize: 11 }}>{CHARACTERS.bruno.emoji}</span>
                      <span style={{ fontSize: 11 }}>{CHARACTERS.melody.emoji}</span>
                      <span style={{ fontSize: 11 }}>{CHARACTERS.echo.emoji}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Phase Roadmap */}
              <div style={S.card}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 10 }}>
                  🌙 Sleepy Forest ロードマップ
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", marginBottom: 6 }}>
                  {PHASES.map((p) => {
                    const g = CHARACTERS[p.guide];
                    return (
                      <div key={p.id} style={{
                        width: 36, height: 36, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: p.id <= state.currentPhase ? p.color : "#E8E8E8",
                        transform: p.id === state.currentPhase ? "scale(1.2)" : "scale(1)",
                        boxShadow: p.id === state.currentPhase ? `0 0 10px ${p.color}55` : "none",
                        animation: p.id === state.currentPhase ? "pulse 2s infinite" : "none",
                        transition: "all 0.3s ease",
                      }}>
                        <span style={{ fontSize: 14 }}>{g.emoji}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={S.phaseTrack}>
                  <div style={{
                    height: "100%",
                    width: `${((state.currentPhase - 1) / 4) * 100}%`,
                    background: "linear-gradient(90deg, #FFB5D0, #FFD93D, #A0E7E5, #E8D5F5, #C3B1E1)",
                    borderRadius: 4, transition: "width 0.5s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px", marginTop: 4 }}>
                  {PHASES.map((p) => {
                    const g = CHARACTERS[p.guide];
                    return (
                      <div key={p.id} style={{ fontSize: 8, color: "#BBB", textAlign: "center", width: 36 }}>
                        {g.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div style={{ ...S.card, background: `linear-gradient(135deg, #FFF, ${phase.color}08)` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FF6B9D", marginBottom: 8 }}>
                  {guideChar.emoji} {guideChar.name}の {phase.name}アドバイス
                </div>
                {phase.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 11 }}>{BAND[i % BAND.length].emoji}</span>
                    <span style={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── LOG ──── */}
          {view === "log" && (
            <div style={{ animation: "slideUp 0.4s ease-out" }}>
              <div style={S.secTitle}>📝 きょうのログ</div>
              {todayLogs.length === 0 ? (
                <div style={{ textAlign: "center", padding: 28 }}>
                  <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 8 }}>
                    {BAND.map((c, i) => (
                      <span key={i} style={{
                        fontSize: 20, opacity: 0.35,
                        animation: `floatChar 3s ease-in-out ${i * 0.25}s infinite`,
                      }}>{c.emoji}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#BBB" }}>まだ きろくがないよ</div>
                  <div style={{ fontSize: 10, color: "#DDD", marginTop: 3 }}>
                    バンドのみんなが まってるよ🌙
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...todayLogs].reverse().map((log, i) => {
                    const rc = BAND[i % BAND.length];
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: "#FFF", padding: "10px 12px", borderRadius: 12,
                        borderLeft: `4px solid ${log.success ? "#B5EAD7" : "#FFD93D"}`,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.02)",
                        animation: `slideUp 0.3s ease-out ${i * 0.04}s both`,
                      }}>
                        <span style={{ fontSize: 20 }}>{log.success ? "🎉" : "💪"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>
                            {log.success ? "できた！" : "がんばった！"}
                          </div>
                          <div style={{ fontSize: 10, color: "#999" }}>{log.time}</div>
                        </div>
                        <span style={{ fontSize: 16 }}>{rc.emoji}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ ...S.card, marginTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FF6B9D", marginBottom: 10 }}>
                  📈 トータルきろく
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { val: state.totalSuccess, label: "せいこう", bg: "#FFF5F8", color: "#FF6B9D" },
                    { val: state.totalAttempts, label: "チャレンジ", bg: "#FFF8E7", color: "#FFB347" },
                    {
                      val: state.totalAttempts > 0
                        ? Math.round((state.totalSuccess / state.totalAttempts) * 100) + "%"
                        : "0%",
                      label: "せいこう率", bg: "#F0FFF4", color: "#6BCB77",
                    },
                  ].map((s, i) => (
                    <div key={i} style={{
                      flex: 1, textAlign: "center", padding: 8,
                      borderRadius: 10, background: s.bg,
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 9, color: "#999", fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──── CHART ──── */}
          {view === "chart" && (
            <div style={{ animation: "slideUp 0.4s ease-out" }}>
              <div style={S.secTitle}>📊 1しゅうかんの グラフ</div>
              <div style={S.card}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                  height: 140, gap: 5, paddingBottom: 4,
                }}>
                  {last7.map((day, i) => (
                    <div key={i} style={{
                      flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", height: "100%", justifyContent: "flex-end",
                    }}>
                      <div style={{
                        width: "100%", display: "flex", flexDirection: "column",
                        alignItems: "stretch", justifyContent: "flex-end", flex: 1,
                      }}>
                        {day.fail > 0 && (
                          <div style={{
                            width: "100%", height: `${(day.fail / maxBar) * 100}%`,
                            background: "#FFD93D", borderRadius: "5px 5px 0 0",
                            minHeight: 5, transition: "height 0.5s ease",
                          }} />
                        )}
                        {day.success > 0 && (
                          <div style={{
                            width: "100%", height: `${(day.success / maxBar) * 100}%`,
                            background: "linear-gradient(180deg, #FF6B9D, #FFB5D0)",
                            borderRadius: day.fail > 0 ? "0" : "5px 5px 0 0",
                            minHeight: 5, transition: "height 0.5s ease",
                          }} />
                        )}
                      </div>
                      <span style={{ fontSize: 10, marginTop: 2 }}>{BAND[i % BAND.length].emoji}</span>
                      <div style={{ fontSize: 8, color: "#999", fontWeight: 600 }}>{day.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12 }}>
                  {[
                    { color: "#FF6B9D", label: "せいこう" },
                    { color: "#FFD93D", label: "がんばった" },
                  ].map((l, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#888" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──── PLAN ──── */}
          {view === "plan" && (
            <div style={{ animation: "slideUp 0.4s ease-out" }}>
              <div style={S.secTitle}>📋 トイトレ 5ステップ</div>

              {selectedPhase ? (
                <div>
                  <button onClick={() => setSelectedPhase(null)} style={S.backBtn}>
                    ← もどる
                  </button>
                  <div style={{
                    ...S.card, textAlign: "center",
                    borderTop: `4px solid ${selectedPhase.color}`,
                  }}>
                    <span style={{ fontSize: 34 }}>
                      {CHARACTERS[selectedPhase.guide].emoji}
                    </span>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#444", marginTop: 4 }}>
                      フェーズ{selectedPhase.id}：{selectedPhase.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>{selectedPhase.subtitle}</div>
                    <div style={{ fontSize: 11, color: "#FF6B9D", fontWeight: 600, marginTop: 2, marginBottom: 12 }}>
                      ガイド：{CHARACTERS[selectedPhase.guide].name}
                      （{CHARACTERS[selectedPhase.guide].animal}・{CHARACTERS[selectedPhase.guide].role}）
                      {selectedPhase.duration && ` ｜ 目安：${selectedPhase.duration}`}
                    </div>

                    <div style={{
                      padding: "8px 12px", borderRadius: 10,
                      background: `${selectedPhase.color}12`,
                      fontSize: 12, color: "#666", fontWeight: 600,
                      textAlign: "left", lineHeight: 1.6, marginBottom: 14,
                    }}>
                      💬 {selectedPhase.message}
                    </div>

                    {[
                      { icon: "🎯", title: "もくひょう", items: selectedPhase.goals },
                      { icon: "💡", title: "アドバイス", items: selectedPhase.tips },
                    ].map((sec, si) => (
                      <div key={si} style={{ textAlign: "left", marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#666", marginBottom: 6 }}>
                          {sec.icon} {sec.title}
                        </div>
                        {sec.items.map((item, i) => (
                          <div key={i} style={{
                            fontSize: 11, color: "#555", lineHeight: 1.8,
                            display: "flex", gap: 5,
                          }}>
                            <span>{BAND[i + si * 3].emoji}</span> {item}
                          </div>
                        ))}
                      </div>
                    ))}

                    {selectedPhase.id === state.currentPhase && (
                      <div style={{
                        padding: "5px 12px", background: `${selectedPhase.color}30`,
                        borderRadius: 16, fontSize: 11, fontWeight: 700,
                        color: "#666", display: "inline-block",
                      }}>⬅ いまここ！</div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {PHASES.map((p, i) => {
                    const g = CHARACTERS[p.guide];
                    return (
                      <button key={p.id} onClick={() => setSelectedPhase(p)} style={{
                        display: "flex", alignItems: "center", width: "100%",
                        background: "#FFF", border: "none", borderRadius: 13,
                        padding: "11px 12px", marginBottom: 6, cursor: "pointer",
                        fontFamily: "'Zen Maru Gothic', sans-serif",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.02)",
                        borderLeft: `4px solid ${p.color}`,
                        opacity: p.id > state.currentPhase ? 0.5 : 1,
                        animation: `slideUp 0.3s ease-out ${i * 0.06}s both`,
                        transition: "all 0.2s ease",
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: `${p.color}28`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, marginRight: 10,
                        }}>
                          {p.id < state.currentPhase ? "✅" : g.emoji}
                        </div>
                        <div style={{ textAlign: "left", flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 900, color: "#444" }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 10, color: "#999" }}>
                            ガイド：{g.name}（{g.role}）
                          </div>
                          {p.duration && (
                            <div style={{ fontSize: 9, color: "#BBB" }}>目安：{p.duration}</div>
                          )}
                        </div>
                        {p.id === state.currentPhase && (
                          <div style={{
                            padding: "3px 7px", background: p.color, borderRadius: 14,
                            fontSize: 9, fontWeight: 700, color: "#FFF",
                          }}>いま</div>
                        )}
                        <span style={{ color: "#CCC", fontSize: 15, marginLeft: 5 }}>›</span>
                      </button>
                    );
                  })}
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={revertPhase} disabled={state.currentPhase <= 1} style={S.ctrlBtn}>
                      ← もどる
                    </button>
                    <button onClick={advancePhase} disabled={state.currentPhase >= 5} style={{
                      ...S.ctrlBtn,
                      background: state.currentPhase < 5
                        ? "linear-gradient(135deg, #FF6B9D, #FFB347)" : "#CCC",
                      color: "#FFF", border: "none",
                    }}>つぎへ →</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ──── STICKERS ──── */}
          {view === "stickers" && (
            <div style={{ animation: "slideUp 0.4s ease-out" }}>
              <div style={S.secTitle}>🎀 ごほうびシール</div>
              <div style={{ fontSize: 11, color: "#999", textAlign: "center", marginBottom: 4 }}>
                🎵 The Sleepy Forest の なかまたちから プレゼント
              </div>
              <div style={{ fontSize: 10, color: "#BBB", textAlign: "center", marginBottom: 14 }}>
                せいこう3回ごとに シールが もらえるよ！
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7,
              }}>
                {STICKERS.map((s, i) => {
                  const earned = state.stickers.includes(s.emoji);
                  return (
                    <div key={i} style={{
                      aspectRatio: "1", borderRadius: 13,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      position: "relative",
                      background: earned ? "#FFF" : "#F5F5F5",
                      boxShadow: earned ? "0 3px 12px rgba(255,107,157,0.1)" : "none",
                      transition: "all 0.3s ease",
                    }}>
                      <span style={{
                        fontSize: 28,
                        filter: earned ? "none" : "grayscale(1) opacity(0.1)",
                        animation: earned ? `popIn 0.3s ease-out ${i * 0.04}s both` : "none",
                      }}>{s.emoji}</span>
                      {earned && (
                        <div style={{ fontSize: 8, color: "#999", fontWeight: 600, marginTop: 1 }}>
                          {s.label}
                        </div>
                      )}
                      {!earned && (
                        <span style={{
                          fontSize: 14, position: "absolute", color: "#DDD",
                        }}>？</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{
                textAlign: "center", marginTop: 14, fontSize: 12,
                fontWeight: 700, color: "#FF6B9D",
              }}>
                {state.stickers.length} / {STICKERS.length} シール
              </div>

              {/* Disney Goal */}
              <div style={{
                ...S.card, marginTop: 18, textAlign: "center",
                background: "linear-gradient(135deg, #FFF8E7, #FFF0F5)",
                border: "2px dashed #FFD93D",
              }}>
                <span style={{ fontSize: 34, animation: "castleFloat 3s ease-in-out infinite" }}>🏰</span>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#9B6DB7", marginTop: 4 }}>
                  スペシャルごほうび
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#FF6B9D", margin: "3px 0" }}>
                  ディズニーランド！
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>
                  4月29日・トイトレ そつぎょうしたら いこうね！
                </div>
                <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 8 }}>
                  {BAND.map((c, i) => (
                    <span key={i} style={{
                      fontSize: 16,
                      animation: `floatChar 2s ease-in-out ${i * 0.18}s infinite`,
                    }}>{c.emoji}</span>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#C0A0D0", marginTop: 5 }}>
                  ルミネ・レオン・リズ・ブルーノ・メロディ・エコーが おうえんしてるよ！🌙
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: 28 }}>
                <button onClick={resetAll} style={S.resetBtn}>🔄 データをリセット</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════ STYLES ═══════════
const S = {
  wrapper: {
    maxWidth: 420, margin: "0 auto", minHeight: "100vh",
    background: "#FAFBFE", position: "relative", overflow: "hidden",
  },
  header: {
    padding: "16px 16px 12px", borderRadius: "0 0 22px 22px",
    position: "relative", overflow: "hidden",
  },
  headerInner: {
    display: "flex", alignItems: "center", gap: 10,
    position: "relative", zIndex: 1,
  },
  headerBand: {
    display: "flex", flexDirection: "column", gap: 1,
    alignItems: "center", padding: "5px 3px", borderRadius: 10,
    background: "rgba(255,255,255,0.08)",
  },
  disneyCard: {
    background: "linear-gradient(135deg, #FFF8F0, #FFF0F8)",
    borderRadius: 14, padding: "10px 12px",
    boxShadow: "0 2px 14px rgba(155,109,183,0.06)",
    border: "1px solid rgba(255,180,208,0.15)",
  },
  disneyMarch: {
    display: "flex", alignItems: "center", gap: 5, marginTop: 6,
  },
  disneyTrack: {
    flex: 1, height: 4, background: "#EEE", borderRadius: 4, overflow: "hidden",
  },
  nav: {
    display: "flex", justifyContent: "center", gap: 3, padding: "8px 8px 0",
  },
  navBtn: {
    border: "none", borderRadius: 11, padding: "6px 10px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
    cursor: "pointer", transition: "all 0.2s ease",
    fontFamily: "'Zen Maru Gothic', sans-serif",
  },
  content: { padding: "10px 12px 24px" },
  card: {
    background: "#FFF", borderRadius: 16, padding: 14,
    boxShadow: "0 2px 14px rgba(0,0,0,0.03)", marginBottom: 10,
  },
  guideMsg: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 14, marginBottom: 10,
  },
  statsRow: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
  },
  successBtn: {
    flex: 1, padding: "14px 8px", border: "none", borderRadius: 16,
    background: "linear-gradient(135deg, #FFE0EC, #FFF0F5)",
    cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 3,
    fontFamily: "'Zen Maru Gothic', sans-serif", color: "#FF6B9D",
  },
  tryBtn: {
    flex: 1, padding: "14px 8px", border: "none", borderRadius: 16,
    background: "linear-gradient(135deg, #FFF3E0, #FFFDE7)",
    cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 3,
    fontFamily: "'Zen Maru Gothic', sans-serif", color: "#FFB347",
  },
  phaseTrack: {
    height: 4, background: "#F0F0F0", borderRadius: 4,
    margin: "0 22px", overflow: "hidden",
  },
  secTitle: {
    fontSize: 15, fontWeight: 900, color: "#444",
    marginBottom: 12, textAlign: "center",
  },
  backBtn: {
    border: "none", background: "none", fontSize: 12, fontWeight: 700,
    color: "#FF6B9D", cursor: "pointer", marginBottom: 10,
    fontFamily: "'Zen Maru Gothic', sans-serif",
  },
  ctrlBtn: {
    flex: 1, padding: 9, border: "2px solid #EEE", borderRadius: 11,
    background: "#FFF", fontSize: 11, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Zen Maru Gothic', sans-serif", color: "#666",
  },
  resetBtn: {
    border: "2px solid #EEE", background: "#FFF", borderRadius: 11,
    padding: "7px 18px", fontSize: 11, fontWeight: 700, color: "#999",
    cursor: "pointer", fontFamily: "'Zen Maru Gothic', sans-serif",
  },
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(255,255,255,0.93)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  celebContent: {
    textAlign: "center", position: "relative", width: 280, height: 260,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  tryOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(255,255,255,0.85)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    animation: "popIn 0.3s ease-out",
  },
  stickerPopup: {
    position: "fixed", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#FFF", borderRadius: 20, padding: "24px 32px",
    boxShadow: "0 8px 36px rgba(255,107,157,0.22)", zIndex: 1001,
    textAlign: "center", animation: "popIn 0.5s ease-out",
  },
};
