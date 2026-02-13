import { useState, useEffect, useCallback } from "react";

const CHARACTERS = {
  luminne: { emoji: "🦄", name: "ルミネ", animal: "ペガサス", role: "ボーカル", color: "#A8D8EA" },
  leon:    { emoji: "🦁", name: "レオン", animal: "ライオン", role: "ギター",   color: "#FFB347" },
  liz:     { emoji: "🐰", name: "リズ",   animal: "うさぎ",   role: "タンバリン", color: "#E8D5F5" },
  bruno:   { emoji: "🐻", name: "ブルーノ", animal: "くま",   role: "ドラム",   color: "#8B7355" },
  melody:  { emoji: "🦄", name: "メロディ", animal: "ユニコーン", role: "キーボード", color: "#FFB5D0" },
  echo:    { emoji: "🐸", name: "エコー", animal: "かえる",   role: "DJ",      color: "#B5EAD7" },
  sheep:   { emoji: "🐑", name: "ひつじさん", animal: "ひつじ", role: "コーラス", color: "#F5F0E8" },
};
const BAND = Object.values(CHARACTERS);

const PHASES = [
  { id:1, name:"じゅんび期", subtitle:"おトイレと なかよし！", guide:"bruno", color:"#FFB5D0", duration:"1〜2週間",
    message:"ブルーノが ドラムで おうえんするよ！🥁 ゆっくり はじめよう",
    goals:["トイレに座ることに慣れる","絵本やお話でトイレを知る","おまるに座る練習（服着たままOK）"],
    tips:["無理強いは絶対NG！楽しい雰囲気で","トイレの絵本を一緒に読もう","パパ・ママのトイレを見せてあげよう"] },
  { id:2, name:"チャレンジ期", subtitle:"すわって みよう！", guide:"leon", color:"#FFD93D", duration:"2〜4週間",
    message:"レオンみたいに カッコよく チャレンジ！🎸🔥",
    goals:["起床後・食後にトイレに座る習慣","おむつを外してトイレに座る","成功体験を1日1回以上"],
    tips:["タイミングは起床直後がベスト","2〜3分座ってダメなら切り上げよう","成功したら大げさに褒めよう！"] },
  { id:3, name:"こえかけ期", subtitle:"トイレ いく？", guide:"liz", color:"#A0E7E5", duration:"2〜4週間",
    message:"リズが タンバリンで リズムを つくるよ♪ トイレいこ！🐰🎵",
    goals:["1〜2時間おきに声かけ","パンツ（トレパン）に移行","日中のおむつ卒業を目指す"],
    tips:["失敗しても絶対に叱らない","「出なくてもOK」を伝えよう","外出時はおむつでもOK"] },
  { id:4, name:"じぶんで期", subtitle:"じぶんで いえるよ！", guide:"melody", color:"#E8D5F5", duration:"2〜6週間",
    message:"メロディが キラキラ メロディを おくるよ✨ サラちゃん すごい！",
    goals:["自分から「トイレ」と言える","日中ほぼパンツで過ごせる","外出先でもトイレができる"],
    tips:["自分で言えたら最大限に褒めよう","お出かけ前にトイレの声かけを","夜はおむつでも全然OK"] },
  { id:5, name:"そつぎょう！", subtitle:"トイトレ マスター！", guide:"luminne", color:"#C3B1E1", duration:"",
    message:"ルミネが うたう おいわいソング🎤🌈 ディズニーへ GO！🏰",
    goals:["日中はほぼ自立してトイレ","おねしょは別問題、焦らない","サラちゃん、よくがんばったね！"],
    tips:["たまの失敗は当たり前","夜のおむつは焦らなくてOK","自信を持たせてあげよう！"] },
];

const SUCCESS_MSGS = [
  { char:"bruno", msg:"ドンドン！ブルーノ うれしい！🥁🐻" },
  { char:"leon", msg:"ロックだぜ サラちゃん！🎸🦁" },
  { char:"liz", msg:"すごい！リズも ぴょんぴょん！🐰✨" },
  { char:"melody", msg:"キラキラ〜♪ メロディも おどっちゃう！🎹" },
  { char:"echo", msg:"ケロケロ！エコーの DJビート！🐸🎧" },
  { char:"luminne", msg:"ルミネが おそらから うたうよ🎤🌈" },
  { char:"sheep", msg:"もこもこ〜 おめでとう！🐑💕" },
];
const TRY_MSGS = [
  { char:"bruno", msg:"ブルーノが まってるよ！つぎ がんばろう🐻" },
  { char:"leon", msg:"レオンは しってるよ、つぎは できる！🦁" },
  { char:"liz", msg:"リズも いっしょに がんばるね🐰" },
  { char:"melody", msg:"だいじょうぶ♪ メロディが ついてるよ🎹" },
  { char:"echo", msg:"ケロ〜 チャレンジが いちばん だいじ！🐸" },
];

const STICKERS = [
  {emoji:"🐻",label:"ブルーノ"},{emoji:"🦁",label:"レオン"},
  {emoji:"🐰",label:"リズ"},{emoji:"🐸",label:"エコー"},
  {emoji:"🐑",label:"ひつじ"},{emoji:"🦋",label:"ちょうちょ"},
  {emoji:"🌸",label:"さくら"},{emoji:"🎵",label:"おんぷ"},
  {emoji:"🌈",label:"にじ"},{emoji:"⭐",label:"ほし"},
  {emoji:"🎀",label:"リボン"},{emoji:"🏰",label:"おしろ"},
];

const DISNEY = new Date("2025-04-29T00:00:00");
const getDays = () => Math.max(0, Math.ceil((DISNEY - new Date()) / 864e5));
const today = () => new Date().toISOString().slice(0,10);
const INIT = { currentPhase:1, logs:[], totalSuccess:0, totalAttempts:0, stickers:[], startDate:today() };

export default function App() {
  const [st, setSt] = useState(INIT);
  const [view, setView] = useState("home");
  const [celeb, setCeleb] = useState(null);
  const [tryMsg, setTryMsg] = useState(null);
  const [stickerPop, setStickerPop] = useState(null);
  const [detailPhase, setDetailPhase] = useState(null);
  const [days, setDays] = useState(getDays());

  useEffect(() => { const t=setInterval(()=>setDays(getDays()),6e4); return()=>clearInterval(t); },[]);

  const phase = PHASES.find(p=>p.id===st.currentPhase);
  const guide = CHARACTERS[phase.guide];
  const td = today();
  const tLogs = st.logs.filter(l=>l.date===td);
  const tSuccess = tLogs.filter(l=>l.success).length;

  const log = useCallback((success)=>{
    const entry = { date:td, time:new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"}), success, phase:st.currentPhase };
    const ns = { ...st, logs:[...st.logs,entry], totalSuccess:st.totalSuccess+(success?1:0), totalAttempts:st.totalAttempts+1 };
    if(success){
      setCeleb(SUCCESS_MSGS[Math.floor(Math.random()*SUCCESS_MSGS.length)]);
      setTimeout(()=>setCeleb(null),3000);
      if(ns.totalSuccess%3===0 && ns.totalSuccess>0){
        const avail=STICKERS.filter(s=>!st.stickers.includes(s.emoji));
        if(avail.length>0){
          const earned=avail[Math.floor(Math.random()*avail.length)];
          ns.stickers=[...st.stickers,earned.emoji];
          setTimeout(()=>{setStickerPop(earned);setTimeout(()=>setStickerPop(null),3000);},2800);
        }
      }
    } else {
      setTryMsg(TRY_MSGS[Math.floor(Math.random()*TRY_MSGS.length)]);
      setTimeout(()=>setTryMsg(null),2500);
    }
    setSt(ns);
  },[st,td]);

  const last7 = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().slice(0,10);
    const dl=st.logs.filter(l=>l.date===ds);
    return { label:d.toLocaleDateString("ja-JP",{weekday:"short",day:"numeric"}), s:dl.filter(l=>l.success).length, f:dl.filter(l=>!l.success).length };
  });
  const mx = Math.max(...last7.map(d=>d.s+d.f),5);

  return (
    <div style={{fontFamily:"'Zen Maru Gothic',sans-serif",maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"#FAFBFE",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fc{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes pop{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes wig{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}
        @keyframes su{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-180px) rotate(720deg);opacity:0}}
        @keyframes sp{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes cf{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes bw{0%{transform:translateX(-6px)}50%{transform:translateX(6px)}100%{transform:translateX(-6px)}}
        @keyframes pu{0%,100%{box-shadow:0 0 0 0 rgba(255,107,157,.3)}50%{box-shadow:0 0 0 10px rgba(255,107,157,0)}}
        button:active{transform:scale(.96)!important}
      `}</style>

      {/* ═══ CELEBRATION ═══ */}
      {celeb&&<div style={{position:"fixed",inset:0,background:"rgba(255,255,255,.93)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
        <div style={{textAlign:"center",position:"relative",width:280,height:260,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          {Array.from({length:14}).map((_,i)=><span key={i} style={{position:"absolute",fontSize:`${18+Math.random()*18}px`,left:`${5+Math.random()*90}%`,top:`${10+Math.random()*70}%`,animation:`conf ${1+Math.random()*1.5}s ease-out forwards`,animationDelay:`${Math.random()*.5}s`}}>{["🎉","⭐","✨","🌟","💫","🎊","🎵"][i%7]}</span>)}
          <div style={{display:"flex",gap:4,marginBottom:12,animation:"bw 2s ease-in-out infinite"}}>
            {BAND.map((c,i)=><span key={i} style={{fontSize:26,animation:`fc 1.5s ease-in-out ${i*.12}s infinite`}}>{c.emoji}</span>)}
          </div>
          <div style={{fontSize:30,fontWeight:900,color:"#FF6B9D",zIndex:1}}>すごーい！！</div>
          <div style={{fontSize:15,fontWeight:700,color:"#FFB347",marginTop:6,zIndex:1}}>{celeb.msg}</div>
        </div>
      </div>}

      {/* ═══ TRY MSG ═══ */}
      {tryMsg&&<div style={{position:"fixed",inset:0,background:"rgba(255,255,255,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,animation:"pop .3s ease-out"}}>
        <div style={{textAlign:"center"}}>
          <span style={{fontSize:48}}>{CHARACTERS[tryMsg.char]?.emoji||"💪"}</span>
          <div style={{fontSize:15,fontWeight:700,color:"#FFB347",marginTop:8}}>{tryMsg.msg}</div>
        </div>
      </div>}

      {/* ═══ STICKER POPUP ═══ */}
      {stickerPop&&<div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#FFF",borderRadius:20,padding:"24px 32px",boxShadow:"0 8px 36px rgba(255,107,157,.22)",zIndex:1001,textAlign:"center",animation:"pop .5s ease-out"}}>
        <div style={{fontSize:52,animation:"pop .5s ease-out"}}>{stickerPop.emoji}</div>
        <div style={{fontSize:15,fontWeight:700,color:"#FF6B9D",marginTop:8}}>{stickerPop.label}シール GET！</div>
        <div style={{fontSize:11,color:"#999",marginTop:4}}>🎵 The Sleepy Forest からの プレゼント</div>
      </div>}

      {/* ═══ HEADER ═══ */}
      <div style={{padding:"16px 16px 12px",borderRadius:"0 0 22px 22px",position:"relative",overflow:"hidden",background:`linear-gradient(135deg,#1a1a3e 0%,#2d2b55 50%,${phase.color}22 100%)`}}>
        {Array.from({length:5}).map((_,i)=><span key={i} style={{position:"absolute",fontSize:8,color:"#FFD700",left:`${12+i*18}%`,top:`${20+Math.sin(i)*25}%`,animation:`sp ${2+i*.3}s ease-in-out ${i*.4}s infinite`,opacity:.5}}>✦</span>)}
        <div style={{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
          <div style={{display:"flex",flexDirection:"column",gap:1,alignItems:"center",padding:"5px 3px",borderRadius:10,background:"rgba(255,255,255,.08)"}}>
            {BAND.slice(0,4).map((c,i)=><span key={i} style={{fontSize:16,animation:`fc 2s ease-in-out ${i*.2}s infinite`}}>{c.emoji}</span>)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:900,color:"#FFF"}}>🌙 サラちゃんのトイトレ</div>
            <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,.55)",marginTop:1}}>〜The Sleepy Forest の なかまたちと いっしょ〜</div>
            <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.75)",marginTop:3}}>{guide.emoji} フェーズ{st.currentPhase}：{phase.name}<span style={{opacity:.6,marginLeft:4}}>（{guide.name}がガイド）</span></div>
          </div>
        </div>
      </div>

      {/* ═══ DISNEY COUNTDOWN ═══ */}
      <div style={{margin:"0 12px",marginTop:-6}}>
        <div style={{background:"linear-gradient(135deg,#FFF8F0,#FFF0F8)",borderRadius:14,padding:"10px 12px",boxShadow:"0 2px 14px rgba(155,109,183,.06)",border:"1px solid rgba(255,180,208,.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:22,animation:"cf 3s ease-in-out infinite"}}>🏰</span>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#9B6DB7"}}>ディズニーランドまで</div>
              <div style={{fontSize:24,fontWeight:900,color:"#FF6B9D",lineHeight:1}}>あと <span style={{fontSize:30}}>{days}</span> にち！</div>
            </div>
          </div>
          <div style={{fontSize:10,color:"#B0A0C0",marginTop:2}}>4月29日 🎉 トイトレ できたら いこうね！</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:6}}>
            <div style={{display:"flex",gap:1,animation:"bw 4s ease-in-out infinite"}}>{BAND.map((c,i)=><span key={i} style={{fontSize:12}}>{c.emoji}</span>)}</div>
            <div style={{flex:1,height:4,background:"#EEE",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(100,((st.currentPhase-1)/4)*100)}%`,background:"linear-gradient(90deg,#FFB5D0,#C3B1E1,#FFD700)",borderRadius:4,transition:"width .8s ease"}}/>
            </div>
            <span style={{fontSize:16}}>🏰</span>
          </div>
        </div>
      </div>

      {/* ═══ NAV ═══ */}
      <div style={{display:"flex",justifyContent:"center",gap:3,padding:"8px 8px 0"}}>
        {[{id:"home",icon:"🏠",label:"ホーム"},{id:"log",icon:"📝",label:"きろく"},{id:"chart",icon:"📊",label:"グラフ"},{id:"plan",icon:"📋",label:"プラン"},{id:"stickers",icon:"🎀",label:"シール"}].map(t=>(
          <button key={t.id} onClick={()=>{setView(t.id);setDetailPhase(null);}} style={{border:"none",borderRadius:11,padding:"6px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:1,cursor:"pointer",transition:"all .2s ease",fontFamily:"'Zen Maru Gothic',sans-serif",background:view===t.id?"#FFF":"transparent",color:view===t.id?"#FF6B9D":"#999",boxShadow:view===t.id?"0 2px 10px rgba(255,107,157,.12)":"none",transform:view===t.id?"translateY(-2px)":"none"}}>
            <span style={{fontSize:17}}>{t.icon}</span><span style={{fontSize:9,fontWeight:700}}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{padding:"10px 12px 24px"}}>

        {view==="home"&&<div style={{animation:"su .4s ease-out"}}>
          {/* Guide */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:14,marginBottom:10,background:`linear-gradient(135deg,${phase.color}18,${phase.color}08)`,borderLeft:`4px solid ${phase.color}`}}>
            <span style={{fontSize:30,animation:"wig 2s ease-in-out infinite"}}>{guide.emoji}</span>
            <div>
              <div style={{fontSize:10,color:"#999",fontWeight:600}}>{guide.name}（{guide.animal}・{guide.role}）より</div>
              <div style={{fontSize:12,fontWeight:700,color:"#555",lineHeight:1.6}}>{phase.message}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={card}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}><span style={{fontSize:18}}>📅</span><span style={{fontSize:14,fontWeight:900,color:"#444"}}>きょうのきろく</span></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
              {[{v:tSuccess,l:"せいこう",c:"#FF6B9D"},{v:tLogs.length,l:"チャレンジ",c:"#FFB347"},{v:st.stickers.length,l:"シール",c:"#B5EAD7"}].map((s,i)=>(
                <div key={i} style={{textAlign:"center",flex:1}}>
                  <div style={{fontSize:30,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#999",fontWeight:700}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={card}>
            <div style={{fontSize:14,fontWeight:700,color:"#666",marginBottom:12,textAlign:"center"}}>トイレ どうだった？</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>log(true)} style={{flex:1,padding:"14px 8px",border:"none",borderRadius:16,background:"linear-gradient(135deg,#FFE0EC,#FFF0F5)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"'Zen Maru Gothic',sans-serif",color:"#FF6B9D"}}>
                <span style={{fontSize:34}}>🎉</span><span style={{fontSize:13,fontWeight:900}}>できた！</span>
                <div style={{display:"flex",gap:2,marginTop:3}}>{[CHARACTERS.luminne,CHARACTERS.leon,CHARACTERS.liz].map((c,i)=><span key={i} style={{fontSize:11}}>{c.emoji}</span>)}</div>
              </button>
              <button onClick={()=>log(false)} style={{flex:1,padding:"14px 8px",border:"none",borderRadius:16,background:"linear-gradient(135deg,#FFF3E0,#FFFDE7)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"'Zen Maru Gothic',sans-serif",color:"#FFB347"}}>
                <span style={{fontSize:34}}>💪</span><span style={{fontSize:13,fontWeight:900}}>がんばった！</span>
                <div style={{display:"flex",gap:2,marginTop:3}}>{[CHARACTERS.bruno,CHARACTERS.melody,CHARACTERS.echo].map((c,i)=><span key={i} style={{fontSize:11}}>{c.emoji}</span>)}</div>
              </button>
            </div>
          </div>

          {/* Roadmap */}
          <div style={card}>
            <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:10}}>🌙 Sleepy Forest ロードマップ</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"0 4px",marginBottom:6}}>
              {PHASES.map(p=>{const g=CHARACTERS[p.guide];return(
                <div key={p.id} style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:p.id<=st.currentPhase?p.color:"#E8E8E8",transform:p.id===st.currentPhase?"scale(1.2)":"scale(1)",boxShadow:p.id===st.currentPhase?`0 0 10px ${p.color}55`:"none",animation:p.id===st.currentPhase?"pu 2s infinite":"none",transition:"all .3s ease"}}>
                  <span style={{fontSize:14}}>{g.emoji}</span>
                </div>
              );})}
            </div>
            <div style={{height:4,background:"#F0F0F0",borderRadius:4,margin:"0 22px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${((st.currentPhase-1)/4)*100}%`,background:"linear-gradient(90deg,#FFB5D0,#FFD93D,#A0E7E5,#E8D5F5,#C3B1E1)",borderRadius:4,transition:"width .5s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px",marginTop:4}}>
              {PHASES.map(p=><div key={p.id} style={{fontSize:8,color:"#BBB",textAlign:"center",width:36}}>{CHARACTERS[p.guide].name}</div>)}
            </div>
          </div>

          {/* Tips */}
          <div style={{...card,background:`linear-gradient(135deg,#FFF,${phase.color}08)`}}>
            <div style={{fontSize:13,fontWeight:700,color:"#FF6B9D",marginBottom:8}}>{guide.emoji} {guide.name}の {phase.name}アドバイス</div>
            {phase.tips.map((t,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:5}}><span style={{fontSize:11}}>{BAND[i%BAND.length].emoji}</span><span style={{fontSize:11,color:"#555",lineHeight:1.6}}>{t}</span></div>)}
          </div>
        </div>}

        {view==="log"&&<div style={{animation:"su .4s ease-out"}}>
          <div style={secT}>📝 きょうのログ</div>
          {tLogs.length===0?(
            <div style={{textAlign:"center",padding:28}}>
              <div style={{display:"flex",gap:3,justifyContent:"center",marginBottom:8}}>{BAND.map((c,i)=><span key={i} style={{fontSize:20,opacity:.35,animation:`fc 3s ease-in-out ${i*.25}s infinite`}}>{c.emoji}</span>)}</div>
              <div style={{fontSize:12,color:"#BBB"}}>まだ きろくがないよ</div>
              <div style={{fontSize:10,color:"#DDD",marginTop:3}}>バンドのみんなが まってるよ🌙</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[...tLogs].reverse().map((l,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#FFF",padding:"10px 12px",borderRadius:12,borderLeft:`4px solid ${l.success?"#B5EAD7":"#FFD93D"}`,boxShadow:"0 1px 6px rgba(0,0,0,.02)",animation:`su .3s ease-out ${i*.04}s both`}}>
                  <span style={{fontSize:20}}>{l.success?"🎉":"💪"}</span>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#444"}}>{l.success?"できた！":"がんばった！"}</div><div style={{fontSize:10,color:"#999"}}>{l.time}</div></div>
                  <span style={{fontSize:16}}>{BAND[i%BAND.length].emoji}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{...card,marginTop:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#FF6B9D",marginBottom:10}}>📈 トータルきろく</div>
            <div style={{display:"flex",gap:8}}>
              {[{v:st.totalSuccess,l:"せいこう",bg:"#FFF5F8",c:"#FF6B9D"},{v:st.totalAttempts,l:"チャレンジ",bg:"#FFF8E7",c:"#FFB347"},{v:st.totalAttempts>0?Math.round(st.totalSuccess/st.totalAttempts*100)+"%":"0%",l:"せいこう率",bg:"#F0FFF4",c:"#6BCB77"}].map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center",padding:8,borderRadius:10,background:s.bg}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:9,color:"#999",fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {view==="chart"&&<div style={{animation:"su .4s ease-out"}}>
          <div style={secT}>📊 1しゅうかんの グラフ</div>
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",height:140,gap:5,paddingBottom:4}}>
              {last7.map((d,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"flex-end"}}>
                  <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"stretch",justifyContent:"flex-end",flex:1}}>
                    {d.f>0&&<div style={{width:"100%",height:`${(d.f/mx)*100}%`,background:"#FFD93D",borderRadius:"5px 5px 0 0",minHeight:5,transition:"height .5s ease"}}/>}
                    {d.s>0&&<div style={{width:"100%",height:`${(d.s/mx)*100}%`,background:"linear-gradient(180deg,#FF6B9D,#FFB5D0)",borderRadius:d.f>0?"0":"5px 5px 0 0",minHeight:5,transition:"height .5s ease"}}/>}
                  </div>
                  <span style={{fontSize:10,marginTop:2}}>{BAND[i%BAND.length].emoji}</span>
                  <div style={{fontSize:8,color:"#999",fontWeight:600}}>{d.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:12}}>
              {[{c:"#FF6B9D",l:"せいこう"},{c:"#FFD93D",l:"がんばった"}].map((l,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#888"}}><div style={{width:10,height:10,borderRadius:3,background:l.c}}/>{l.l}</div>)}
            </div>
          </div>
        </div>}

        {view==="plan"&&<div style={{animation:"su .4s ease-out"}}>
          <div style={secT}>📋 トイトレ 5ステップ</div>
          {detailPhase?<div>
            <button onClick={()=>setDetailPhase(null)} style={{border:"none",background:"none",fontSize:12,fontWeight:700,color:"#FF6B9D",cursor:"pointer",marginBottom:10,fontFamily:"'Zen Maru Gothic',sans-serif"}}>← もどる</button>
            <div style={{...card,textAlign:"center",borderTop:`4px solid ${detailPhase.color}`}}>
              <span style={{fontSize:34}}>{CHARACTERS[detailPhase.guide].emoji}</span>
              <div style={{fontSize:17,fontWeight:900,color:"#444",marginTop:4}}>フェーズ{detailPhase.id}：{detailPhase.name}</div>
              <div style={{fontSize:12,color:"#888"}}>{detailPhase.subtitle}</div>
              <div style={{fontSize:11,color:"#FF6B9D",fontWeight:600,marginTop:2,marginBottom:12}}>
                ガイド：{CHARACTERS[detailPhase.guide].name}（{CHARACTERS[detailPhase.guide].animal}・{CHARACTERS[detailPhase.guide].role}）{detailPhase.duration&&` ｜ 目安：${detailPhase.duration}`}
              </div>
              <div style={{padding:"8px 12px",borderRadius:10,background:`${detailPhase.color}12`,fontSize:12,color:"#666",fontWeight:600,textAlign:"left",lineHeight:1.6,marginBottom:14}}>💬 {detailPhase.message}</div>
              {[{icon:"🎯",title:"もくひょう",items:detailPhase.goals},{icon:"💡",title:"アドバイス",items:detailPhase.tips}].map((sec,si)=>(
                <div key={si} style={{textAlign:"left",marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:900,color:"#666",marginBottom:6}}>{sec.icon} {sec.title}</div>
                  {sec.items.map((item,i)=><div key={i} style={{fontSize:11,color:"#555",lineHeight:1.8,display:"flex",gap:5}}><span>{BAND[(i+si*3)%BAND.length].emoji}</span> {item}</div>)}
                </div>
              ))}
              {detailPhase.id===st.currentPhase&&<div style={{padding:"5px 12px",background:`${detailPhase.color}30`,borderRadius:16,fontSize:11,fontWeight:700,color:"#666",display:"inline-block"}}>⬅ いまここ！</div>}
            </div>
          </div>:<>
            {PHASES.map((p,i)=>{const g=CHARACTERS[p.guide];return(
              <button key={p.id} onClick={()=>setDetailPhase(p)} style={{display:"flex",alignItems:"center",width:"100%",background:"#FFF",border:"none",borderRadius:13,padding:"11px 12px",marginBottom:6,cursor:"pointer",fontFamily:"'Zen Maru Gothic',sans-serif",boxShadow:"0 1px 6px rgba(0,0,0,.02)",borderLeft:`4px solid ${p.color}`,opacity:p.id>st.currentPhase?.5:1,animation:`su .3s ease-out ${i*.06}s both`,transition:"all .2s ease"}}>
                <div style={{width:40,height:40,borderRadius:10,background:`${p.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginRight:10}}>{p.id<st.currentPhase?"✅":g.emoji}</div>
                <div style={{textAlign:"left",flex:1}}>
                  <div style={{fontSize:12,fontWeight:900,color:"#444"}}>{p.name}</div>
                  <div style={{fontSize:10,color:"#999"}}>ガイド：{g.name}（{g.role}）</div>
                  {p.duration&&<div style={{fontSize:9,color:"#BBB"}}>目安：{p.duration}</div>}
                </div>
                {p.id===st.currentPhase&&<div style={{padding:"3px 7px",background:p.color,borderRadius:14,fontSize:9,fontWeight:700,color:"#FFF"}}>いま</div>}
                <span style={{color:"#CCC",fontSize:15,marginLeft:5}}>›</span>
              </button>
            );})}
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>st.currentPhase>1&&setSt({...st,currentPhase:st.currentPhase-1})} disabled={st.currentPhase<=1} style={{flex:1,padding:9,border:"2px solid #EEE",borderRadius:11,background:"#FFF",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Zen Maru Gothic',sans-serif",color:"#666"}}>← もどる</button>
              <button onClick={()=>st.currentPhase<5&&setSt({...st,currentPhase:st.currentPhase+1})} disabled={st.currentPhase>=5} style={{flex:1,padding:9,border:"none",borderRadius:11,background:st.currentPhase<5?"linear-gradient(135deg,#FF6B9D,#FFB347)":"#CCC",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Zen Maru Gothic',sans-serif",color:"#FFF"}}>つぎへ →</button>
            </div>
          </>}
        </div>}

        {view==="stickers"&&<div style={{animation:"su .4s ease-out"}}>
          <div style={secT}>🎀 ごほうびシール</div>
          <div style={{fontSize:11,color:"#999",textAlign:"center",marginBottom:4}}>🎵 The Sleepy Forest の なかまたちから プレゼント</div>
          <div style={{fontSize:10,color:"#BBB",textAlign:"center",marginBottom:14}}>せいこう3回ごとに シールが もらえるよ！</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
            {STICKERS.map((s,i)=>{const earned=st.stickers.includes(s.emoji);return(
              <div key={i} style={{aspectRatio:"1",borderRadius:13,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",background:earned?"#FFF":"#F5F5F5",boxShadow:earned?"0 3px 12px rgba(255,107,157,.1)":"none",transition:"all .3s ease"}}>
                <span style={{fontSize:28,filter:earned?"none":"grayscale(1) opacity(.1)",animation:earned?`pop .3s ease-out ${i*.04}s both`:"none"}}>{s.emoji}</span>
                {earned&&<div style={{fontSize:8,color:"#999",fontWeight:600,marginTop:1}}>{s.label}</div>}
                {!earned&&<span style={{fontSize:14,position:"absolute",color:"#DDD"}}>？</span>}
              </div>
            );})}
          </div>
          <div style={{textAlign:"center",marginTop:14,fontSize:12,fontWeight:700,color:"#FF6B9D"}}>{st.stickers.length} / {STICKERS.length} シール</div>

          <div style={{...card,marginTop:18,textAlign:"center",background:"linear-gradient(135deg,#FFF8E7,#FFF0F5)",border:"2px dashed #FFD93D"}}>
            <span style={{fontSize:34,animation:"cf 3s ease-in-out infinite"}}>🏰</span>
            <div style={{fontSize:13,fontWeight:900,color:"#9B6DB7",marginTop:4}}>スペシャルごほうび</div>
            <div style={{fontSize:18,fontWeight:900,color:"#FF6B9D",margin:"3px 0"}}>ディズニーランド！</div>
            <div style={{fontSize:11,color:"#999"}}>4月29日・トイトレ そつぎょうしたら いこうね！</div>
            <div style={{display:"flex",gap:2,justifyContent:"center",marginTop:8}}>{BAND.map((c,i)=><span key={i} style={{fontSize:16,animation:`fc 2s ease-in-out ${i*.18}s infinite`}}>{c.emoji}</span>)}</div>
            <div style={{fontSize:10,color:"#C0A0D0",marginTop:5}}>ルミネ・レオン・リズ・ブルーノ・メロディ・エコーが おうえんしてるよ！🌙</div>
          </div>

          <div style={{textAlign:"center",marginTop:28}}>
            <button onClick={()=>setSt(INIT)} style={{border:"2px solid #EEE",background:"#FFF",borderRadius:11,padding:"7px 18px",fontSize:11,fontWeight:700,color:"#999",cursor:"pointer",fontFamily:"'Zen Maru Gothic',sans-serif"}}>🔄 データをリセット</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

const card = {background:"#FFF",borderRadius:16,padding:14,boxShadow:"0 2px 14px rgba(0,0,0,.03)",marginBottom:10};
const secT = {fontSize:15,fontWeight:900,color:"#444",marginBottom:12,textAlign:"center"};
