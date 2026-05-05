import confetti from "canvas-confetti";
import gsap from "gsap";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const normalStages = [
  {
    image: "/images/step-1.jpg",
    text: "هلووو سما",
    button: "هلووو",
  },
  {
    image: "/images/step-2.jpg",
    text: "سما عندي الك سؤال",
    button: "ايش هو؟",
  },
  {
    image: "/images/step-3.jpg",
    text: "بس خجلان اسألك اياه😥",
    button: "اسألينييي",
  },
  {
    image: "/images/step-4.jpg",
    text: "بتحبي زكريا ولا لاااا؟",
    button: "ها؟🤭",
  },
  {
    image: "/images/step-5.jpg",
    text: "شو هااا 😠 بتحبي زكريا ولا لاا؟",
    button: "اندااري🤗",
  },
];

const crackStage = {
  image: "/images/step-6.jpg",
  text: "اذا بتحبي زكريا اكسري القلب 🥺",
  button: "اندااري🤗",
};

const surpriseStage = {
  image: "/images/surprise-step.jpg",
  text: "كل عام وكل سنه وانتي معاي وبحبك اليوم وبكرة والي بعده وطول العمر 🤍💕👨‍❤️‍💋‍👨",
  button: "بعشقكك وبحبك يا عسل 🥺🤍",
};

const finalCard = {
  title: "اغنيتنا المفضلة 🎵",
  image: "/images/final-card.jpg",
  audio: "/audio/eid-song.mp3.mp3",
};

/** أربع صور في `public/hearts/` — 3 ضغطات، ثم الثالثة تعرض الرابعة بعد 3 ثوانٍ */
const crackStageHeartBackgrounds = [
  "/hearts/heart-1.png",
  "/hearts/heart-2.png",
  "/hearts/heart-3.png",
  "/hearts/heart-4.png",
];

function Typewriter({ text, activeKey }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, [text, activeKey]);

  return <p className="message content-part">{shown}</p>;
}

function HeartFireworks({ active, fullscreen }) {
  const { particles, sparks } = useMemo(() => {
    const count = fullscreen ? 56 : 32;
    const particlesInner = Array.from({ length: count }).map((_, i) => ({
      id: `fw-${i}`,
      left: `${8 + Math.random() * 84}%`,
      top: `${10 + Math.random() * 75}%`,
      delay: Math.random() * 5,
      dur: 1.4 + Math.random() * 1.8,
      dx: (Math.random() - 0.45) * 140,
      dy: -30 - Math.random() * 120,
      size: 10 + Math.random() * 16,
    }));
    const sparkCount = fullscreen ? 22 : 12;
    const sparksInner = Array.from({ length: sparkCount }).map((_, i) => ({
      id: `spark-${i}`,
      left: `${5 + Math.random() * 90}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: Math.random() * 3,
      rotate: Math.random() * 360,
    }));
    return { particles: particlesInner, sparks: sparksInner };
  }, [fullscreen]);

  if (!active) return null;

  return (
    <div className={`heart-fireworks${fullscreen ? " heart-fireworks--fullscreen" : ""}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="firework-heart"
          style={{
            left: p.left,
            top: p.top,
            "--fw-delay": `${p.delay}s`,
            "--fw-dur": `${p.dur}s`,
            "--fw-dx": `${p.dx}px`,
            "--fw-dy": `${p.dy}px`,
            fontSize: `${p.size}px`,
          }}
        >
          ❤
        </span>
      ))}
      {sparks.map((s) => (
        <span
          key={s.id}
          className="firework-spark"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: `${s.delay}s`,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function MusicNotesFireworks({ active }) {
  const notes = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: `note-${i}`,
        left: `${6 + Math.random() * 88}%`,
        top: `${14 + Math.random() * 70}%`,
        delay: Math.random() * 2.8,
        dur: 2 + Math.random() * 2.2,
        dx: (Math.random() - 0.5) * 110,
        dy: -28 - Math.random() * 100,
        size: 14 + Math.random() * 18,
        glyph: i % 3 === 0 ? "🎵" : i % 3 === 1 ? "♪" : "♫",
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="music-fireworks" aria-hidden="true">
      {notes.map((n) => (
        <span
          key={n.id}
          className="firework-note"
          style={{
            left: n.left,
            top: n.top,
            "--fw-delay": `${n.delay}s`,
            "--fw-dur": `${n.dur}s`,
            "--fw-dx": `${n.dx}px`,
            "--fw-dy": `${n.dy}px`,
            fontSize: `${n.size}px`,
          }}
        >
          {n.glyph}
        </span>
      ))}
    </div>
  );
}

function HeartsExplosion({ trigger, anchor }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: `${trigger}-${i}`,
        x: (Math.random() - 0.5) * 220,
        y: (Math.random() - 0.55) * 220,
        delay: Math.random() * 0.15,
        size: 12 + Math.random() * 18,
      })),
    [trigger]
  );

  if (!trigger) return null;

  const left = anchor?.x ?? 0;
  const top = anchor?.y ?? 0;

  return (
    <div
      className="explosion-layer"
      style={{ left: `${left}px`, top: `${top}px` }}
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="small-heart"
          style={{
            "--x": `${h.x}px`,
            "--y": `${h.y}px`,
            "--delay": `${h.delay}s`,
            "--size": `${h.size}px`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}

function SurpriseCanvas({ active }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!active || !hostRef.current) return;

    let timeoutId = 0;
    let cancelled = false;
    const canvas = hostRef.current;
    const fire =
      typeof confetti.create === "function"
        ? confetti.create(canvas, {
            resize: true,
            useWorker: true,
          })
        : confetti;

    const colors = ["#ff9ec5", "#ff4794", "#c9a0ff", "#ffe4f0", "#ffffff", "#ffd6ef"];

    const burst = () => {
      fire({
        particleCount: 95,
        spread: 86,
        startVelocity: 38,
        origin: { x: 0.5, y: 0.62 },
        colors,
        gravity: 0.62,
        scalar: 1.05,
        ticks: 260,
      });
      fire({
        particleCount: 42,
        spread: 140,
        startVelocity: 22,
        origin: { x: 0.2, y: 0.72 },
        colors,
        angle: 60,
      });
      fire({
        particleCount: 42,
        spread: 140,
        startVelocity: 22,
        origin: { x: 0.8, y: 0.72 },
        colors,
        angle: 120,
      });
    };

    burst();

    const sparkLoop = () => {
      if (cancelled) return;
      fire({
        particleCount: 9 + Math.floor(Math.random() * 8),
        spread: 360,
        startVelocity: 16 + Math.random() * 12,
        origin: { x: Math.random() * 0.85 + 0.075, y: Math.random() * 0.45 },
        colors,
        gravity: 0.75,
        scalar: 0.75 + Math.random() * 0.45,
        ticks: 180,
      });
      timeoutId = window.setTimeout(sparkLoop, 520 + Math.random() * 520);
    };
    timeoutId = window.setTimeout(sparkLoop, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={hostRef} className="surprise-confetti-canvas" aria-hidden="true" />;
}

export default function App() {
  const [stage, setStage] = useState(0);
  const [explosionKey, setExplosionKey] = useState(0);
  const [crackClicks, setCrackClicks] = useState(0);
  const [surpriseEntry, setSurpriseEntry] = useState(false);
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timeline, setTimeline] = useState(0);
  const [transitionPhase, setTransitionPhase] = useState("in");
  const [audioError, setAudioError] = useState("");
  const [explosionAnchor, setExplosionAnchor] = useState({ x: 0, y: 0 });
  const rootRef = useRef(null);
  const audioRef = useRef(null);
  const crackBtnRef = useRef(null);

  const isNormalFlow = stage < normalStages.length;
  const isCrackStage = stage === normalStages.length;
  const isSurpriseStage = stage === normalStages.length + 1;

  const currentData = isNormalFlow
    ? normalStages[stage]
    : isCrackStage
    ? crackStage
    : isSurpriseStage
    ? surpriseStage
    : normalStages[normalStages.length - 1];

  const typewriterKey = stage;

  const switchScreen = (goNext) => {
    setTransitionPhase("out");
    setTimeout(() => {
      goNext();
      setTransitionPhase("in");
    }, 320);
  };

  const setAnchorFromEl = (el) => {
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    const r = el.getBoundingClientRect();
    setExplosionAnchor({
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
    });
  };

  const triggerExplosion = (goNext, sourceEl) => {
    setAnchorFromEl(sourceEl);
    setTransitionPhase("out");
    setExplosionKey((k) => k + 1);
    setTimeout(() => {
      goNext();
      setTransitionPhase("in");
    }, 500);
  };

  const onNormalClick = (e) => {
    triggerExplosion(() => {
      setStage((s) => s + 1);
    }, e.currentTarget);
  };

  const onCrackHeartClick = () => {
    if (crackClicks >= 3) return;
    const next = crackClicks + 1;
    setCrackClicks(next);
  };

  useEffect(() => {
    if (!isCrackStage || crackClicks !== 3) return;
    const moveNextTimer = window.setTimeout(() => {
      triggerExplosion(
        () => {
          setStage((s) => s + 1);
          setSurpriseEntry(true);
        },
        crackBtnRef.current
      );
    }, 500);
    return () => {
      window.clearTimeout(moveNextTimer);
    };
  }, [isCrackStage, crackClicks]);

  const onSurpriseButtonClick = () => {
    switchScreen(() => setShowFinalCard(true));
  };

  const onPlay = async () => {
    if (!audioRef.current) return;
    setAudioError("");
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch (error) {
      setPlaying(false);
      setAudioError("ملف الصوت غير موجود أو نوعه غير مدعوم. أضيفي الملف local بصيغة mp3.");
      console.error(error);
    }
  };

  const onPause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlaying(false);
  };

  const onAudioBack = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const onAudioNext = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      duration || audioRef.current.currentTime + 10,
      audioRef.current.currentTime + 10
    );
  };

  const onSeek = (event) => {
    if (!audioRef.current) return;
    const nextTime = Number(event.target.value);
    audioRef.current.currentTime = nextTime;
    setTimeline(nextTime);
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setShowFinalCard(false);
    setStage(0);
    setCrackClicks(0);
    setSurpriseEntry(false);
    setTimeline(0);
    setDuration(0);
    setTransitionPhase("in");
    setAudioError("");
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncDuration = () => setDuration(audio.duration || 0);
    const syncTime = () => setTimeline(audio.currentTime || 0);
    const onEnded = () => setPlaying(false);
    const onAudioError = () =>
      setAudioError("تعذر تشغيل الصوت. تأكدي من وجود `public/audio/eid-song.mp3`.");

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onAudioError);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onAudioError);
    };
  }, [showFinalCard]);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".js-beat-btn", {
        scale: 1.06,
        duration: 0.72,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.05,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="page" ref={rootRef}>
      {isSurpriseStage && !showFinalCard ? (
        <>
          <HeartFireworks active fullscreen />
          <SurpriseCanvas active />
        </>
      ) : null}

      {showFinalCard && playing ? (
        <>
          <HeartFireworks active fullscreen />
          <MusicNotesFireworks active />
        </>
      ) : null}

      <div className="floating-bg" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={`bg-shape shape-${i % 3}`}>
            {i % 3 === 0 ? "❤" : i % 3 === 1 ? "✿" : "❀"}
          </span>
        ))}
      </div>

      <motion.section
        className={`card ${surpriseEntry ? "surprise-enter surprise-screen" : ""} ${
          isSurpriseStage ? "surprise-active surprise-card" : ""
        } transition-${transitionPhase}`}
        animate={isSurpriseStage ? { y: [0, -7, 0] } : { y: 0 }}
        transition={
          isSurpriseStage
            ? { duration: 3.75, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.35 }
        }
      >
        {!showFinalCard ? (
          <>
            <img src={currentData.image} alt="صورة رومانسية" className="hero-image content-part" />
            <Typewriter text={currentData.text} activeKey={typewriterKey} />

            {isNormalFlow && (
              <button type="button" className="pulse-btn content-part js-beat-btn" onClick={onNormalClick}>
                {currentData.button}
              </button>
            )}

            {isCrackStage && (
              <motion.button
                ref={crackBtnRef}
                type="button"
                className="content-part crack-tap-btn js-beat-btn"
                style={{
                  "--crack-heart-url":
                    `url("${crackStageHeartBackgrounds[Math.min(crackClicks, 3)]}")`,
                }}
                onClick={onCrackHeartClick}
                disabled={crackClicks >= 3}
                whileTap={{ scale: 0.94 }}
                animate={{
                  boxShadow:
                    crackClicks === 0
                      ? "0 12px 28px rgba(255,79,144,0.35)"
                      : crackClicks === 1
                        ? "0 12px 34px rgba(255,120,180,0.55)"
                        : crackClicks === 2
                          ? "0 14px 40px rgba(200,120,255,0.45)"
                          : "0 16px 44px rgba(255,90,160,0.65)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                          </motion.button>
            )}

            {isSurpriseStage && (
              <motion.div
                className="surprise-actions"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.06 }}
              >
                <motion.button
                  type="button"
                  className="pulse-btn surprise-btn content-part shimmer-btn js-beat-btn"
                  onClick={onSurpriseButtonClick}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {surpriseStage.button}
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="final-box">
            <div className="corner-heart">❤</div>
            <h2>{finalCard.title}</h2>
            <img src={finalCard.image} alt="صورة عيد" className="final-image" />
            <audio ref={audioRef} preload="metadata">
              <source src={finalCard.audio} type="audio/mpeg" />
            </audio>
            <input
              className="track-line"
              type="range"
              min="0"
              max={duration || 0}
              value={timeline}
              onChange={onSeek}
            />
            <div className="controls">
              <button type="button" className="js-beat-btn" onClick={onAudioBack}>
                ⏮
              </button>
              <button type="button" className="js-beat-btn" onClick={playing ? onPause : onPlay}>
                {playing ? "⏸" : "▶"}
              </button>
              <button type="button" className="js-beat-btn" onClick={onAudioNext}>
                ⏭
              </button>
            </div>
            {audioError && <p className="audio-error">{audioError}</p>}
            <button type="button" className="restart-btn js-beat-btn" onClick={restart}>
              العودة للبداية
            </button>
          </div>
        )}
      </motion.section>

      <HeartsExplosion trigger={explosionKey} anchor={explosionAnchor} />
    </main>
  );
}
