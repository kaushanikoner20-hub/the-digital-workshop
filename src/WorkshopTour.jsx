import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import './WorkshopTour.css'

/*
 * ─── UPDATE THIS BLOCK AFTER DEPLOYMENT ────────────────────────────────
 * Stop 4 reads from here. Nothing else in the tour needs to change.
 *   deployed : set to true ONLY once the site is really live on AWS Amplify Hosting.
 *   liveUrl  : the live Amplify URL (shown as a link when deployed is true).
 *   repoUrl  : the portfolio's own GitHub repository URL, once confirmed.
 *              Until then the tour links to the GitHub profile instead.
 */
const DEPLOYMENT = {
  deployed: false,
  liveUrl: '',
  repoUrl: '',
}
const GITHUB_PROFILE = 'https://github.com/kaushanikoner20-hub'

const STOPS = [
  { key: 'builder', short: 'Builder', kicker: 'Stop 1 · The person', title: 'Meet the Builder', tone: 'apricot' },
  { key: 'builds', short: 'Builds', kicker: 'Stop 2 · The work', title: 'Ideas turned into projects', tone: 'lavender' },
  { key: 'decisions', short: 'Decisions', kicker: 'Stop 3 · The thinking', title: 'Engineering is about decisions', tone: 'blue' },
  { key: 'cloud', short: 'Cloud', kicker: 'Stop 4 · The shipping', title: 'Built locally. Shipped to the cloud.', tone: 'green' },
]

const FOCUSABLE = 'a[href], button, [tabindex]:not([tabindex="-1"])'

function StopBuilder() {
  return <>
    <p className="tour-lead">I’m Kaushani — a B.Tech Computer Science &amp; Engineering student who enjoys building software, tracking down tricky bugs, and exploring new technology.</p>
    <dl className="tour-facts">
      <div><dt>Studying</dt><dd>B.Tech in Computer Science &amp; Engineering · Dr. B. C. Roy Engineering College · expected 2027</dd></div>
      <div><dt>Working style</dt><dd>Hardworking · Problem debugger · Enthusiastic</dd></div>
      <div><dt>Growing towards</dt><dd>Cloud-AI Engineering and Forward Deployed Engineering (FDE)</dd></div>
    </dl>
  </>
}

function StopBuilds({ projects, onLeave }) {
  const featured = projects.slice(0, 2)
  const others = projects.slice(2)
  return <>
    <p className="tour-lead">{projects.length} projects live in the Build Room. Two to start with:</p>
    <div className="tour-projects">
      {featured.map((project) => <article className={`tour-project tone-${project.tone}`} key={project.id}>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <div className="tour-chips">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
        <small className="mono">{project.status}</small>
        <a className="tour-inline-link" href={project.repo} target="_blank" rel="noopener noreferrer">GitHub repository <ArrowUpRight size={13} aria-hidden="true" /></a>
      </article>)}
    </div>
    <p className="tour-also"><span className="mono">Also in the Build Room</span>{others.map((project) => project.name).join(' · ')}</p>
    <Link className="tour-action" to="/build-room" onClick={onLeave}>Open the Build Room <ArrowUpRight size={15} aria-hidden="true" /></Link>
  </>
}

function StopDecisions({ scenarios, onLeave }) {
  const first = scenarios[0]
  return <>
    <p className="tour-lead">The Decision Bench holds {scenarios.length} realistic engineering scenarios. Pick a path, read the trade-off that comes with it, then try the alternative.</p>
    <div className="tour-scenario">
      <span className="mono">{first.eyebrow}</span>
      <strong>{first.title}</strong>
      <div className="tour-chips">{first.choices.map((choice) => <span key={choice.label}>{choice.label}</span>)}</div>
      <small className="mono">A preview — open the bench to make the call.</small>
    </div>
    <Link className="tour-action" to="/decision-bench" onClick={onLeave}>Open the Decision Bench <ArrowUpRight size={15} aria-hidden="true" /></Link>
  </>
}

function StopCloud() {
  const { deployed, liveUrl, repoUrl } = DEPLOYMENT
  return <>
    <p className={`tour-status ${deployed ? 'is-live' : 'is-planned'}`}>
      <span className="mono">{deployed ? 'Deployment status' : 'Planned deployment architecture'}</span>
      <strong>{deployed ? 'Live on AWS Amplify Hosting' : 'Not deployed yet — this is the plan, not a live result.'}</strong>
    </p>
    <ol className="tour-flow">
      <li><span className="mono">1 · Build locally</span><strong>React + Vite</strong><p>Checked with <code>npm run lint</code> and <code>npm run build</code>.</p></li>
      <li><span className="mono">2 · Static output</span><strong>The dist folder</strong><p>A frontend-only app: no custom backend or database.</p></li>
      <li><span className="mono">{deployed ? '3 · Hosted' : '3 · Planned host'}</span><strong>AWS Amplify Hosting</strong><p>Documented in the repo: build with <code>npm ci</code> and <code>npm run build</code>, publish <code>dist</code>, add a single-page-app rewrite to <code>index.html</code>.</p></li>
    </ol>
    <div className="tour-links">
      {deployed && liveUrl && <a className="tour-action" href={liveUrl} target="_blank" rel="noopener noreferrer">Open the live site <ArrowUpRight size={15} aria-hidden="true" /></a>}
      <a className="tour-action tour-action-quiet" href={repoUrl || GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">{repoUrl ? 'View the portfolio repository' : 'See my work on GitHub'} <ArrowUpRight size={15} aria-hidden="true" /></a>
    </div>
  </>
}

function WorkshopTour({ onClose, projects, scenarios, returnFocusTo }) {
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const dialogRef = useRef(null)
  const doneRef = useRef(null)
  const stop = STOPS[step]

  // Focus the dialog on open, lock page scroll, and give focus back on close.
  useEffect(() => {
    const trigger = returnFocusTo?.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      if (trigger && document.contains(trigger)) trigger.focus()
    }
  }, [returnFocusTo])

  useEffect(() => { if (done) doneRef.current?.focus() }, [done])

  const goNext = () => setStep((value) => Math.min(value + 1, STOPS.length - 1))
  const goPrevious = () => setStep((value) => Math.max(value - 1, 0))
  const handlePrimary = () => { if (step < STOPS.length - 1) goNext(); else setDone(true) }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); return }
    if (!done && event.key === 'ArrowRight') { event.preventDefault(); handlePrimary(); return }
    if (!done && event.key === 'ArrowLeft') { event.preventDefault(); goPrevious(); return }
    if (event.key !== 'Tab') return
    const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter((node) => node.offsetParent !== null)
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === dialogRef.current)) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus() }
  }

  const stepMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: 14 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -14 }, transition: { duration: .22, ease: [0.22, 1, 0.36, 1] } }
  const shellMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: { duration: .22, ease: [0.22, 1, 0.36, 1] } }

  return createPortal(
    <motion.div className="tour-backdrop" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div className="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tour-title" tabIndex={-1} ref={dialogRef} onKeyDown={handleKeyDown} {...shellMotion}>
        <div className="tour-head">
          <span className="mono tour-label">The 60-Second Workshop Tour</span>
          {!done && <span className="mono tour-count" aria-hidden="true">{step + 1}/{STOPS.length}</span>}
          <button type="button" className="tour-close" onClick={onClose} aria-label="Close tour"><X size={18} aria-hidden="true" /></button>
        </div>

        {!done && <ol className="tour-progress" aria-label="Tour progress">
          {STOPS.map((item, index) => <li key={item.key}>
            <button type="button" className={`${index === step ? 'is-current' : ''} ${index < step ? 'is-seen' : ''}`} onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined} aria-label={`Stop ${index + 1} of ${STOPS.length}: ${item.title}`}>
              <i aria-hidden="true" /><span className="mono" aria-hidden="true">{item.short}</span>
            </button>
          </li>)}
        </ol>}

        <div className="tour-body">
          {done ? <div className="tour-done">
            <span className="tour-done-mark" aria-hidden="true"><Check size={22} /></span>
            <h2 id="tour-title" tabIndex={-1} ref={doneRef}>That’s the workshop in a minute.</h2>
            <p>Thanks for taking the tour. Pick a room to go deeper:</p>
            <div className="tour-links">
              <Link className="tour-action" to="/build-room" onClick={onClose}>Build Room <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <Link className="tour-action" to="/decision-bench" onClick={onClose}>Decision Bench <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <Link className="tour-action tour-action-quiet" to="/contact-desk" onClick={onClose}>Contact Desk <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
          </div> : <>
            <p className="tour-sr" aria-live="polite">Stop {step + 1} of {STOPS.length}: {stop.title}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.section key={stop.key} className="tour-stop" aria-labelledby="tour-title" {...stepMotion}>
                <header className={`tour-stop-head tone-${stop.tone}`}>
                  <span className="kicker">{stop.kicker}</span>
                  <h2 id="tour-title">{stop.title}</h2>
                </header>
                <div className="tour-stop-body">
                  {step === 0 && <StopBuilder />}
                  {step === 1 && <StopBuilds projects={projects} onLeave={onClose} />}
                  {step === 2 && <StopDecisions scenarios={scenarios} onLeave={onClose} />}
                  {step === 3 && <StopCloud />}
                </div>
              </motion.section>
            </AnimatePresence>
          </>}
        </div>

        <div className="tour-foot">
          {done
            ? <button type="button" className="tour-btn tour-btn-primary" onClick={onClose}>Close</button>
            : <>
              <button type="button" className="tour-skip" onClick={onClose}>Skip tour</button>
              <span className="tour-spacer" />
              <button type="button" className="tour-btn" onClick={goPrevious} aria-disabled={step === 0}><ChevronLeft size={15} aria-hidden="true" /> Previous</button>
              <button type="button" className="tour-btn tour-btn-primary" onClick={handlePrimary}>{step === STOPS.length - 1 ? <>Finish Tour <Check size={15} aria-hidden="true" /></> : <>Next <ChevronRight size={15} aria-hidden="true" /></>}</button>
            </>}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export default WorkshopTour