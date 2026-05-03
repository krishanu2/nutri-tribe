'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── The Tribe Quiz ─────────────────────────────────────────────────
   3 makhana trivia questions. Get 2+ right → unlock TRIBE20 discount.
   Appears 25s after page load (once per session).
   ────────────────────────────────────────────────────────────────── */

const QUESTIONS = [
  {
    q: 'Where does 90% of India\'s makhana come from?',
    opts: ['Rajasthan', 'Bihar', 'Kerala', 'Punjab'],
    ans: 1,
    fact: 'Bihar\'s lotus ponds, especially in Mithila, produce almost all of India\'s makhana.',
  },
  {
    q: 'What plant does makhana come from?',
    opts: ['Water chestnut', 'Lotus flower', 'Water lily', 'Bamboo'],
    ans: 1,
    fact: 'Makhana are the seeds of the Euryale ferox — a prickly lotus plant.',
  },
  {
    q: 'How much protein does makhana have per 100g?',
    opts: ['5g', '9g', '15g', '22g'],
    ans: 2,
    fact: '15g of protein per 100g — more than most nuts, less fat too.',
  },
];

type Step = 'closed' | 'intro' | 'quiz' | 'result' | 'done';

export default function JourneyTracker() {
  const [step, setStep]           = useState<Step>('closed');
  const [qi, setQi]               = useState(0);           // current question index
  const [answers, setAnswers]     = useState<number[]>([]); // chosen option per question
  const [chosen, setChosen]       = useState<number | null>(null);
  const [revealed, setRevealed]   = useState(false);

  /* show once per session after 25s */
  useEffect(() => {
    if (sessionStorage.getItem('nt-quiz-done')) return;
    const t = setTimeout(() => setStep('intro'), 25000);
    return () => clearTimeout(t);
  }, []);

  const score = answers.filter((a, i) => a === QUESTIONS[i].ans).length;
  const passed = score >= 2;
  const q = QUESTIONS[qi];

  const pickOption = (idx: number) => {
    if (revealed) return;
    setChosen(idx);
    setRevealed(true);
  };

  const nextQuestion = () => {
    setAnswers(prev => [...prev, chosen!]);
    if (qi < QUESTIONS.length - 1) {
      setQi(qi + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      setStep('result');
    }
  };

  const dismiss = () => {
    sessionStorage.setItem('nt-quiz-done', '1');
    setStep('done');
  };

  return (
    <AnimatePresence>
      {(step === 'intro' || step === 'quiz' || step === 'result') && (
        <motion.div
          className="fixed bottom-6 right-6 z-[9980] w-[340px] max-w-[calc(100vw-24px)]"
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #120601, #0a0200)',
              border: '1px solid rgba(243,162,19,0.22)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(243,162,19,0.06)',
            }}
          >
            {/* Top brand strip */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(243,162,19,0.1)' }}>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  {[0,45,90,135,180,225,270,315].map((a,i)=>(
                    <ellipse key={i} cx="10" cy="4" rx="2.5" ry="5" fill="#f3a213" opacity="0.6"
                      transform={`rotate(${a} 10 10)`} />
                  ))}
                  <circle cx="10" cy="10" r="2.8" fill="#f3a213" />
                </svg>
                <span className="font-body font-bold text-[10px] tracking-[0.28em] uppercase" style={{ color: '#f3a213' }}>
                  The Tribe Quiz
                </span>
              </div>
              <button onClick={dismiss} className="font-body text-[10px] tracking-widest uppercase"
                style={{ color: 'rgba(253,251,247,0.25)' }}>
                skip
              </button>
            </div>

            {/* ── INTRO ── */}
            {step === 'intro' && (
              <div className="px-5 py-5">
                <motion.div className="text-3xl mb-3 text-center"
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 0.8, delay: 0.3 }}>
                  🌾
                </motion.div>
                <h3 className="font-display font-bold text-lg text-center mb-2" style={{ color: '#fdfbf7' }}>
                  How well do you know<br />
                  <span style={{ color: '#f3a213', fontStyle: 'italic' }}>Makhana?</span>
                </h3>
                <p className="font-body text-xs text-center mb-5 leading-relaxed" style={{ color: 'rgba(253,251,247,0.45)' }}>
                  3 quick questions. Score 2+ and unlock<br />an exclusive discount for the Tribe.
                </p>
                <motion.button
                  onClick={() => setStep('quiz')}
                  className="w-full py-3 rounded-xl font-body font-bold text-sm tracking-wide"
                  style={{ background: '#f3a213', color: '#050100' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Take the Quiz →
                </motion.button>
              </div>
            )}

            {/* ── QUIZ ── */}
            {step === 'quiz' && (
              <div className="px-5 py-5">
                {/* Progress dots */}
                <div className="flex items-center gap-2 mb-4">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className="flex-1 h-0.5 rounded-full" style={{
                      background: i < qi ? '#f3a213' : i === qi ? 'rgba(243,162,19,0.6)' : 'rgba(255,255,255,0.08)'
                    }} />
                  ))}
                  <span className="font-body text-[9px] tracking-widest ml-1" style={{ color: 'rgba(243,162,19,0.5)' }}>
                    {qi+1}/3
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={qi}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.28 }}
                  >
                    <p className="font-body font-semibold text-sm mb-4 leading-snug" style={{ color: 'rgba(253,251,247,0.88)' }}>
                      {q.q}
                    </p>

                    <div className="flex flex-col gap-2 mb-4">
                      {q.opts.map((opt, i) => {
                        const isChosen  = chosen === i;
                        const isCorrect = i === q.ans;
                        let bg = 'rgba(255,255,255,0.04)';
                        let border = 'rgba(255,255,255,0.08)';
                        let textColor = 'rgba(253,251,247,0.7)';

                        if (revealed) {
                          if (isCorrect) {
                            bg = 'rgba(0,152,70,0.18)';
                            border = 'rgba(0,152,70,0.5)';
                            textColor = '#4caf50';
                          } else if (isChosen && !isCorrect) {
                            bg = 'rgba(180,40,20,0.15)';
                            border = 'rgba(200,60,40,0.4)';
                            textColor = 'rgba(255,100,80,0.8)';
                          }
                        } else if (isChosen) {
                          bg = 'rgba(243,162,19,0.12)';
                          border = 'rgba(243,162,19,0.4)';
                          textColor = '#f3a213';
                        }

                        return (
                          <motion.button key={i}
                            onClick={() => pickOption(i)}
                            className="text-left px-3.5 py-2.5 rounded-xl font-body text-xs font-medium transition-none"
                            style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                            whileHover={!revealed ? { scale: 1.02, background: 'rgba(243,162,19,0.1)' } : {}}
                            whileTap={!revealed ? { scale: 0.98 } : {}}
                          >
                            <span style={{ color: 'rgba(243,162,19,0.4)', marginRight: 8 }}>
                              {String.fromCharCode(65+i)}.
                            </span>
                            {opt}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Fact reveal */}
                    <AnimatePresence>
                      {revealed && (
                        <motion.div
                          className="rounded-xl px-3.5 py-2.5 mb-4"
                          style={{ background: 'rgba(243,162,19,0.07)', border: '1px solid rgba(243,162,19,0.15)' }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0 }}
                        >
                          <p className="font-body text-[10px] leading-relaxed" style={{ color: 'rgba(253,251,247,0.55)' }}>
                            💡 {q.fact}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {revealed && (
                      <motion.button
                        onClick={nextQuestion}
                        className="w-full py-2.5 rounded-xl font-body font-bold text-xs tracking-wide"
                        style={{ background: '#f3a213', color: '#050100' }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {qi < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results →'}
                      </motion.button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* ── RESULT ── */}
            {step === 'result' && (
              <div className="px-5 py-5">
                {/* Score ring */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(243,162,19,0.1)" strokeWidth="7" />
                      <motion.circle cx="40" cy="40" r="30" fill="none"
                        stroke={passed ? '#f3a213' : 'rgba(243,162,19,0.35)'} strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 30}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 3) }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display font-bold text-2xl" style={{ color: '#f3a213' }}>{score}/3</span>
                    </div>
                  </div>
                </div>

                {passed ? (
                  <>
                    <h3 className="font-display font-bold text-lg text-center mb-1" style={{ color: '#fdfbf7' }}>
                      You&apos;re Tribe Material! 🏆
                    </h3>
                    <p className="font-body text-xs text-center mb-4" style={{ color: 'rgba(253,251,247,0.45)' }}>
                      You know your makhana. Here&apos;s your reward:
                    </p>
                    <div className="rounded-xl px-4 py-3 mb-4 text-center"
                      style={{ background: 'rgba(243,162,19,0.08)', border: '1px dashed rgba(243,162,19,0.35)' }}>
                      <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(243,162,19,0.5)' }}>
                        Unlock Code
                      </p>
                      <motion.p className="font-display font-bold text-2xl tracking-[0.25em]" style={{ color: '#f3a213' }}
                        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
                        TRIBE20
                      </motion.p>
                      <p className="font-body text-[9px] mt-0.5" style={{ color: 'rgba(253,251,247,0.3)' }}>
                        20% off your first order
                      </p>
                    </div>
                    <a href="/products"
                      className="block w-full text-center py-3 rounded-xl font-body font-bold text-sm"
                      style={{ background: '#f3a213', color: '#050100' }}
                      onClick={dismiss}>
                      Shop Now →
                    </a>
                  </>
                ) : (
                  <>
                    <h3 className="font-display font-bold text-lg text-center mb-1" style={{ color: '#fdfbf7' }}>
                      Almost there! 🌾
                    </h3>
                    <p className="font-body text-xs text-center mb-4 leading-relaxed" style={{ color: 'rgba(253,251,247,0.45)' }}>
                      {score}/3 correct. Explore The Makhana page<br />and come back stronger!
                    </p>
                    <a href="/makhana"
                      className="block w-full text-center py-3 rounded-xl font-body font-bold text-sm mb-2"
                      style={{ background: '#f3a213', color: '#050100' }}
                      onClick={dismiss}>
                      Learn About Makhana →
                    </a>
                  </>
                )}
                <button onClick={dismiss}
                  className="w-full text-center py-2 font-body text-[10px] tracking-widest uppercase"
                  style={{ color: 'rgba(255,255,255,0.2)' }}>
                  close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
