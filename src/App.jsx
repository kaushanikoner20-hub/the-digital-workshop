import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDot,
  Compass,
  GitBranch,
  Gamepad2,
  Home,
  Layers3,
  Mail,
  Menu,
  RotateCcw,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import WorkshopTour from './WorkshopTour'
import './App.css'

const rooms = [
  { path: '/', label: 'Welcome Studio', short: '01', icon: Home, note: 'The front door' },
  { path: '/about', label: 'About Corner', short: '02', icon: Compass, note: 'The person behind the work' },
  { path: '/tool-wall', label: 'Tool Wall', short: '03', icon: Wrench, note: 'The working toolkit' },
  { path: '/build-room', label: 'Build Room', short: '04', icon: BriefcaseBusiness, note: 'Projects in the making' },
  { path: '/decision-bench', label: 'Decision Bench', short: '05', icon: Layers3, note: 'Open a technical dilemma' },
  { path: '/achievement-gallery', label: 'Achievement Gallery', short: '06', icon: Sparkles, note: 'Receipts and milestones' },
  { path: '/contact-desk', label: 'Contact Desk', short: '07', icon: Mail, note: 'Leave a note' },
]

const projects = [
  { id: 'web-seance', name: 'Web Séance', repo: 'https://github.com/kaushanikoner20-hub/Web-Seance', summary: 'An evidence-grounded digital archaeology workstation for researching early-web captures.', purpose: 'It retrieves raw Wayback material and separates confirmed archival evidence from interpretation.', features: ['Internet Archive CDX search and raw capture retrieval', 'Forensic page dossiers with Evidence IDs and SHA-256 integrity data', 'Verified-only D3 connection graph with optional local historian'], tech: ['Python', 'Streamlit', 'D3.js', 'Wayback'], category: 'Research', image: 'https://github.com/kaushanikoner20-hub/Web-Seance/blob/main/docs/screenshots/S%C3%A9ance%20Chamber.png?raw=true', imageLabel: 'Repository screenshot · Séance Chamber', tone: 'apricot', status: 'Public repository · local demo documented' },
  { id: 'ssorg-dev', name: 'ssorg.dev', repo: 'https://github.com/kaushanikoner20-hub/ssorg.dev', summary: 'A local-first screenshot library that makes saved images searchable and queryable.', purpose: 'It keeps screenshot storage, OCR, and local AI organization close to the person who owns the files.', features: ['Multi-image upload with validation and SQLite metadata', 'Tesseract OCR plus local Gemma analysis', 'Keyword search across OCR, summaries, dates, entities, and terms'], tech: ['Python', 'Streamlit', 'SQLite', 'Ollama'], category: 'Research', image: '/ssorg-dev-screenshot.png', imageLabel: 'Supplied ssorg.dev screenshot · dashboard upload flow', tone: 'blue', status: 'Public repository · no hosted deployment verified' },
  { id: 'billbuddy-ai', name: 'BillBuddy AI', repo: 'https://github.com/kaushanikoner20-hub/BillBuddyAI', summary: 'A local-first receipt and invoice organizer for freelancers and small businesses.', purpose: 'It turns receipt and invoice files into reviewed, searchable expense records without a cloud AI service.', features: ['JPG, PNG, and PDF upload with OCR', 'Local Gemma suggestions for expense fields with validation', 'SQLite records, dashboard summaries, search, filters, and CSV export'], tech: ['React', 'FastAPI', 'Python', 'Ollama'], category: 'AI + utility', image: 'https://raw.githubusercontent.com/kaushanikoner20-hub/BillBuddyAI/main/docs/screenshots/Screenshot%202026-10-18%20171457.png', imageLabel: 'Repository screenshot · BillBuddy AI', tone: 'green', status: 'Public repository · CI run verified' },
  { id: 'habitbloom', name: 'HabitBloom', repo: 'https://github.com/kaushanikoner20-hub/HabitBloom', summary: 'A small browser habit tracker for building steady routines.', purpose: 'It keeps daily habits and progress visible without an install or server.', features: ['Daily habit checklist with completion toggles', 'Per-habit streak and best-streak tracking', 'Monthly calendar and current-week progress views'], tech: ['HTML', 'CSS', 'JavaScript', 'localStorage'], category: 'Productivity', image: '/habitbloom-screenshot.png', imageLabel: 'Supplied HabitBloom screenshot · today dashboard', tone: 'lavender', status: 'Public repository · open locally from index.html' },
  { id: 'trailbuddy', name: 'TrailBuddy', repo: 'https://github.com/kaushanikoner20-hub/TrailBuddy', summary: 'A local-first outdoor adventure generator that turns a mood and a time window into a sensory prompt.', purpose: 'It helps people spend time outdoors, then supports a phone-away completion flow.', features: ['Adventure generation from mood, duration, activity, and difficulty', 'Three.js closing scene with a non-WebGL fallback', 'Phone Away Mode with timer, progress, and optional reflection'], tech: ['React', 'Express', 'Ollama', 'Three.js'], category: 'AI + experience', image: '/trailbuddy-screenshot.png', imageLabel: 'Supplied TrailBuddy screenshot · activity selection', tone: 'apricot', status: 'Public repository · Stage 5 documented' },
  { id: 'taskify', name: 'Taskify', repo: 'https://github.com/kaushanikoner20-hub/taskify', summary: 'A full-stack task-management application with progress, assignments, calendar, and reports.', purpose: 'It gives users one place to manage tasks, track weekly progress, and coordinate batchmates or team members.', features: ['Registration, JWT login, profiles, and password changes', 'Task CRUD with daily and weekly progress tracking', 'Assignments, calendar, batchmates, and reports'], tech: ['JavaScript', 'Express', 'PostgreSQL', 'Docker'], category: 'Productivity', image: 'https://raw.githubusercontent.com/kaushanikoner20-hub/taskify/main/screenshots/dashboard.png', imageLabel: 'Repository screenshot · Taskify dashboard', tone: 'blue', status: 'Public repository · CI/CD run verified' },
  { id: 'linguabuddy', name: 'LinguaBuddy', repo: 'https://github.com/kaushanikoner20-hub/linguabuddy', summary: 'A no-login conversational practice partner for language learners.', purpose: 'It adapts conversation, corrections, vocabulary support, and review to a learner’s selected language, level, and scenario.', features: ['Multi-turn chat with target language, level, scenario, and history', 'Optional corrections, vocabulary suggestions, and adaptive difficulty', 'Session summaries and adaptive multiple-choice review'], tech: ['React', 'Express', 'Gemma 4', 'Tailwind CSS'], category: 'AI + learning', image: 'https://raw.githubusercontent.com/kaushanikoner20-hub/linguabuddy/main/docs/screenshots/03-practice-conversation.png', imageLabel: 'Repository screenshot · practice conversation', tone: 'lavender', status: 'Public repository · Stage 7 documented' },
]

const tools = [
  { group: 'Interface', items: ['React', 'Vite', 'JavaScript', 'CSS', 'Framer Motion'] },
  { group: 'Thinking', items: ['Product framing', 'System mapping', 'Technical writing', 'Interaction design'] },
  { group: 'Currently Exploring', items: ['AWS', 'Docker', 'Linux'] },
]

const scenarios = [
  {
    id: 'architecture',
    eyebrow: 'Scenario A · architecture dilemma',
    title: 'Where should sensitive AI document processing happen?',
    choices: [
      { label: 'Local-first', title: 'Keep the document on-device', body: 'The strongest privacy boundary, with more responsibility for device capability, model packaging, and update strategy.', consequence: 'Trade-off: privacy and control improve; convenience and consistency may narrow.' },
      { label: 'Cloud-first', title: 'Send it to a managed service', body: 'The fastest route to powerful infrastructure and shared model updates, provided the data boundary is acceptable and explicit.', consequence: 'Trade-off: capability and speed improve; governance and trust work become more important.' },
      { label: 'Hybrid', title: 'Split the work by sensitivity', body: 'Classify first, keep sensitive steps local, and use the cloud for tasks that do not cross the project’s agreed boundary.', consequence: 'Trade-off: flexibility increases; the system now needs a clear classification contract.' },
    ],
    followUp: 'What should be decided before implementation begins?',
    followChoices: ['Define the data boundary', 'Choose a model vendor', 'Polish the upload screen'],
  },
  {
    id: 'debugging',
    eyebrow: 'Scenario B · debugging dilemma',
    title: 'The backend says connected, but saved data is missing. What comes first?',
    choices: [
      { label: 'Trace the read path', title: 'Follow the request from UI to response', body: 'Start where the symptom is visible and verify the identifier, request, response shape, and rendering path before changing infrastructure.', consequence: 'Trade-off: fast signal and small scope; you may uncover a deeper data issue later.' },
      { label: 'Check the data store', title: 'Confirm records exist where expected', body: 'Inspect the stored record, environment, and query conditions so “connected” is not mistaken for “correctly queried”.', consequence: 'Trade-off: strong evidence about persistence; less immediate visibility into client assumptions.' },
      { label: 'Restart everything', title: 'Reset the environment', body: 'A restart can remove a transient issue, but it also erases the most useful evidence if used as the first move.', consequence: 'Trade-off: low effort; high risk of hiding the actual cause.' },
    ],
  },
  {
    id: 'product',
    eyebrow: 'Scenario C · product dilemma',
    title: 'A project has limited development time. Which feature gets the next slice?',
    choices: [
      { label: 'Core loop', title: 'Make the main promise work end-to-end', body: 'Prioritize the smallest path that lets a real person experience the product’s central value, even if the edges stay simple.', consequence: 'Trade-off: clearer learning now; fewer polish moments in the first pass.' },
      { label: 'Trust layer', title: 'Make the system explain itself', body: 'Invest in states, errors, and transparent feedback so people can understand what happened and what to do next.', consequence: 'Trade-off: confidence improves; visible feature count may stay smaller.' },
      { label: 'Delight layer', title: 'Make one memorable moment excellent', body: 'Polish a distinctive interaction that gives the product its character and creates a reason to remember it.', consequence: 'Trade-off: stronger identity; core coverage must remain protected.' },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
}

function App() {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const currentRoom = rooms.find((room) => room.path === location.pathname) ?? rooms[0]
  const pageMotion = reduceMotion ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } } : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }

  const go = (path) => { navigate(path); setMenuOpen(false) }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="wordmark" to="/" aria-label="The Digital Workshop home">
          <span className="mark" aria-hidden="true"><span>D</span><span>W</span><i /></span>
          <span><strong>The Digital</strong><em>Workshop</em></span>
        </Link>
        <div className="topbar-meta"><span className="status-dot" /> <span>Open for thoughtful problems</span></div>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <div className="workshop-frame">
        <aside className={`room-rail ${menuOpen ? 'is-open' : ''}`} aria-label="Workshop areas">
          <div className="rail-label">Navigation <span>7 areas</span></div>
          <nav>
            {rooms.map((room) => {
              const Icon = room.icon
              const active = room.path === location.pathname
              return <button key={room.path} className={`room-link ${active ? 'active' : ''}`} onClick={() => go(room.path)} aria-current={active ? 'page' : undefined}>
                <span className="room-number">{room.short}</span><Icon size={16} strokeWidth={1.8} /><span className="room-name">{room.label}</span><ChevronRight className="room-chevron" size={14} />
              </button>
            })}
          </nav>
          <div className="rail-footnote"><span className="mono">DW / 26</span><p>Built with care.<br />Facts marked when they need checking.</p></div>
        </aside>

        <main className="workbench">
          <div className="breadcrumb"><span className="mono">WORKSHOP /</span> {currentRoom.label.toUpperCase()} <span className="breadcrumb-rule" /></div>
          <AnimatePresence mode="wait"><motion.div key={location.pathname} {...pageMotion}><Routes>
            <Route path="/" element={<Welcome onNavigate={go} />} />
            <Route path="/about" element={<About />} />
            <Route path="/tool-wall" element={<ToolWall />} />
            <Route path="/build-room" element={<BuildRoom />} />
            <Route path="/decision-bench" element={<DecisionBench />} />
            <Route path="/achievement-gallery" element={<Achievements />} />
            <Route path="/contact-desk" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes></motion.div></AnimatePresence>
        </main>
      </div>
      <footer className="site-footer"><span>Ideas enter. Experiments happen. Things get built.</span><span className="mono">NO. 001 / DIGITAL WORKSHOP</span></footer>
    </div>
  )
}

function SectionIntro({ kicker, title, children, tone = 'apricot' }) {
  return <div className={`section-intro tone-${tone}`}><span className="kicker">{kicker}</span><h1>{title}</h1>{children && <p>{children}</p>}</div>
}

function Welcome({ onNavigate }) {
  const [tourOpen, setTourOpen] = useState(false)
  const tourTrigger = useRef(null)
  return <div className="page welcome-page">
    <div className="hero-layout">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="hero-copy page-heading-box tone-apricot">
        <span className="kicker">A personal developer portfolio / field notes</span>
        <h1>Ideas enter.<br /><span>Experiments happen.</span><br />Things get built.</h1>
        <p className="hero-deck">The Digital Workshop is a quiet place to look at the work, the tools, and the decisions behind the interface.</p>
        <button type="button" ref={tourTrigger} className="tour-launch" onClick={() => setTourOpen(true)} aria-haspopup="dialog"><span aria-hidden="true">🎯</span><span>Take the 60-Second Workshop Tour</span></button>
        <div className="hero-actions"><button className="button button-dark" onClick={() => onNavigate('/build-room')}>Explore the builds <ArrowUpRight size={17} /></button><button className="text-button" onClick={() => onNavigate('/about')}>Meet the maker <ChevronRight size={16} /></button></div>
      </motion.div>
      <motion.div className="hero-illustration" initial={{ opacity: 0, rotate: -4 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: .7, delay: .14 }} aria-label="Illustration of a workshop pinboard" role="img">
        <div className="pinboard-grid" /><div className="board-note note-a"><span className="mono">OBSERVATION 01</span><strong>Good systems leave<br />a trail of decisions.</strong></div><div className="board-note note-b"><span className="mono">MATERIAL</span><strong>Curiosity<br />+ constraints</strong></div><div className="orange-pin" /><div className="blue-tab">MAKE<br />ROOM</div><div className="scribble">↗</div>
      </motion.div>
    </div>
    <div className="home-lower">
      <div className="lower-intro"><span className="kicker">Pick a drawer</span><p>Every room has a different kind of evidence. Start anywhere.</p></div>
      <div className="room-teasers">{rooms.slice(1, 4).map((room) => { const Icon = room.icon; return <button key={room.path} className="teaser" onClick={() => onNavigate(room.path)}><span className="teaser-icon"><Icon size={18} /></span><span><small>{room.short} / {room.note}</small><strong>{room.label}</strong></span><ArrowUpRight size={16} /></button> })}</div>
      <button className="challenge-strip" onClick={() => onNavigate('/decision-bench')}><span className="challenge-mark"><CircleDot size={18} /></span><span><small>THE WAITING CHALLENGE</small><strong>What would you choose at the Decision Bench?</strong></span><span className="mono">OPEN →</span></button>
    </div>
    <AnimatePresence>{tourOpen && <WorkshopTour key="workshop-tour" onClose={() => setTourOpen(false)} projects={projects} scenarios={scenarios} returnFocusTo={tourTrigger} />}</AnimatePresence>
  </div>
}

function About() {
  const skillGroups = [
    { label: 'Comfortable / Confident', tone: 'green', items: ['HTML', 'CSS', 'JavaScript', 'SQL', 'MySQL', 'Git & GitHub'] },
    { label: 'Learning / Building Experience', tone: 'blue', items: ['Java', 'React', 'Python', 'REST APIs'] },
    { label: 'Currently Exploring', tone: 'lavender', items: ['AWS', 'Docker', 'Linux', 'Cloud Infrastructure', 'AI/ML'] },
  ]
  return <div className="page about-page"><SectionIntro kicker="02 / About Corner" title={<>Meet Kaushani —<br /><span>the person behind the builds.</span></>} tone="blue"><strong>Full-Stack Software Developer | Cloud &amp; AI Enthusiast</strong> based in West Bengal, India.</SectionIntro><div className="about-identity"><div className="profile-card paper-card"><span className="card-label">FIELD NOTE / KAUSHANI</span><div className="portrait-placeholder avatar-art"><img className="about-avatar-image" src="/kaushani-avatar.png" alt="Illustrated portrait of Kaushani, a young woman developer with long dark hair and glasses, working at a laptop." /></div><div className="identity-caption"><strong>Kaushani</strong><span>West Bengal, India</span></div><p className="small-note">GitHub: kaushanikoner20-hub<br />B.Tech in Computer Science &amp; Engineering<br />Dr. B. C. Roy Engineering College · Expected 2027</p></div><div className="about-notes"><article><span className="mono">01 — HELLO, I'M KAUSHANI</span><h2>Curious by nature. Persistent by practice.</h2><p>I'm a curious developer who loves turning ideas into real-world solutions. From building projects from scratch to tracking down tricky bugs, I enjoy every part of the development journey. I love creating attractive interfaces, exploring new technologies, and learning how things work behind the scenes.</p><p>I'm currently growing towards becoming a Cloud-AI Engineer and Forward Deployed Engineer (FDE), with an interest in building practical, impactful solutions that connect technology with real-world problems.</p></article><div className="about-split"><div><span className="mono">02 — THE THREAD</span><h2>From a curious mind<br />to a passionate developer.</h2><p>Constantly learning, building, and growing towards becoming a Cloud-AI Engineer and Full-Stack Developer who creates impactful solutions.</p></div><div className="personality-note"><span className="mono">THE WORKING MIX</span><div><b>Hardworking</b><b>Problem debugger</b><b>Enthusiastic</b></div></div></div></div></div><div className="interests-row"><div><span className="mono">SMALL THINGS THAT KEEP THE WORK HUMAN</span><div className="interest-list"><span>▣ Reading</span><span>✦ Design</span><span>⌁ Exploring technology</span><span>◒ Dance</span><span>♪ Singing</span></div></div><div className="quote-slip philosophy-slip">“If you want it, then snatch it anyhow.”<span>— personal philosophy</span></div></div><section className="about-skills"><div className="skills-heading"><span className="kicker">The current toolkit</span><h2>Learning in public,<br /><span>building with intent.</span></h2><p>No expert labels. Just a clear snapshot of what is comfortable, what is growing, and what is next.</p></div><div className="skill-groups">{skillGroups.map((group, index) => <div className={`skill-group skill-${group.tone}`} key={group.label}><span className="mono">0{index + 1}</span><h3>{group.label}</h3><div>{group.items.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div></section></div>
}

function ToolWall() {
  return <div className="page"><SectionIntro kicker="03 / Tool Wall" title={<>The tools are only<br /><span>half the craft.</span></>} tone="green">A living toolkit for making, testing, explaining, and revising. The list below is a working snapshot, not a claim of expertise.</SectionIntro><div className="tool-wall">{tools.map((group, index) => <motion.section key={group.group} className={`tool-group tool-group-${index}`} variants={fadeUp} initial="hidden" animate="show" transition={{ delay: index * .08 }}><div className="tool-group-head"><span className="mono">0{index + 1}</span><h2>{group.group}</h2></div><div className="tool-list">{group.items.map((item) => <span key={item} className={item.startsWith('[') ? 'placeholder-chip' : ''}>{item}</span>)}</div></motion.section>)}</div><div className="tool-footer"><span className="mono">WORKING PRINCIPLE</span><p>Choose the simplest tool that keeps the next decision visible.</p></div></div>
}

function BuildRoom() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const filters = useMemo(() => ['All', ...new Set(projects.map((project) => project.category))], [])
  const visibleProjects = filter === 'All' ? projects : projects.filter((project) => project.category === filter)
  const featured = filter === 'All' ? projects.slice(0, 2) : visibleProjects.slice(0, 2)
  const more = visibleProjects.filter((project) => !featured.some((item) => item.id === project.id))

  return <div className="page build-room-page"><SectionIntro kicker="04 / Build Room" title={<>Questions turned<br /><span>into working things.</span></>} tone="lavender">Every project in this room started with a question, an idea, or a problem worth exploring. Some are experiments, some are practical tools, and each one has taught me something new about building software.</SectionIntro><div className="build-room-tools"><span className="mono">FILTER THE SHELF</span><div className="project-filters" role="toolbar" aria-label="Filter projects by verified category">{filters.map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => { setFilter(item); setExpanded(null) }}>{item}</button>)}</div><span className="build-count">{visibleProjects.length} projects in view</span></div><section className="featured-projects"><div className="build-section-heading"><span className="kicker">Featured experiments</span><p>Two projects with especially rich evidence trails.</p></div><div className="featured-grid">{featured.map((project, index) => <ProjectFeature key={project.id} project={project} index={index} expanded={expanded === project.id} onToggle={() => setExpanded(expanded === project.id ? null : project.id)} />)}</div></section><section className="more-projects"><div className="build-section-heading"><span className="kicker">More from the workshop</span><p>Practical tools, learning experiments, and systems still teaching me something.</p></div><div className="compact-project-list">{more.map((project, index) => <ProjectCompact key={project.id} project={project} index={index} expanded={expanded === project.id} onToggle={() => setExpanded(expanded === project.id ? null : project.id)} />)}{more.length === 0 && <p className="empty-filter">The featured experiments are the only projects in this filter.</p>}</div></section></div>
}

function ProjectVisual({ project, compact = false }) {
  return project.image ? <div className={`project-visual ${compact ? 'compact-visual' : ''}`}><img src={project.image} alt={project.imageLabel} loading="lazy" /><span className="visual-caption">{project.imageLabel}</span></div> : <div className={`project-visual abstract-visual tone-${project.tone} ${compact ? 'compact-visual' : ''}`} aria-label={`${project.name} abstract project panel`}><span className="abstract-mark">{project.id === 'ssorg-dev' ? '⌕' : project.id === 'habitbloom' ? '✳' : '↗'}</span><span className="mono">NO SCREENSHOT VERIFIED</span><strong>{project.name}</strong></div>
}

function ProjectFeature({ project, index, expanded, onToggle }) {
  return <motion.article className={`feature-project feature-${index}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }}><ProjectVisual project={project} /><div className="feature-copy"><span className="mono">FEATURE 0{index + 1} / {project.category}</span><h2>{project.name}</h2><p>{project.summary}</p><div className="feature-tech">{project.tech.map((item) => <span key={item}>{item}</span>)}</div><div className="project-actions"><a href={project.repo} target="_blank" rel="noreferrer" className="button button-dark">Open repository <ArrowUpRight size={15} /></a><button type="button" className="text-button" aria-expanded={expanded} onClick={onToggle}>{expanded ? 'Close details' : 'Read the evidence'} <ChevronRight size={15} /></button></div>{expanded && <ProjectDetails project={project} />}</div></motion.article>
}

function ProjectCompact({ project, index, expanded, onToggle }) {
  return <motion.article className={`compact-project compact-tone-${project.tone}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .05 }}><ProjectVisual project={project} compact /><div className="compact-copy"><div className="compact-heading"><span className="mono">0{index + 3} / {project.category}</span><h2>{project.name}</h2></div><p>{project.summary}</p><div className="compact-meta">{project.tech.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>{expanded && <ProjectDetails project={project} />}<div className="compact-actions"><a href={project.repo} target="_blank" rel="noreferrer">GitHub repository <ArrowUpRight size={14} /></a><button type="button" onClick={onToggle}>{expanded ? 'Hide details' : 'Expand details'} <ChevronRight size={14} /></button></div></div></motion.article>
}

function ProjectDetails({ project }) {
  return <div className="project-details"><div><span className="mono">THE PURPOSE</span><p>{project.purpose}</p></div><div><span className="mono">VERIFIED FEATURES</span><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><span className="mono">STATUS</span><p>{project.status}</p></div></div>
}

function DecisionBench() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [choiceIndex, setChoiceIndex] = useState(null)
  const [followIndex, setFollowIndex] = useState(null)
  const scenario = scenarios[scenarioIndex]
  const answered = choiceIndex !== null
  const progress = Math.round(((scenarioIndex + (answered ? 1 : 0)) / scenarios.length) * 100)
  const reset = () => { setChoiceIndex(null); setFollowIndex(null) }
  const next = () => { setScenarioIndex((value) => (value + 1) % scenarios.length); reset() }
  return <div className="page decision-page"><SectionIntro kicker="05 / Decision Bench" title={<>Open a drawer.<br /><span>See the trade-off.</span></>} tone="lavender">These are realistic engineering choices, not personality tests. Pick a path, read its consequences, then try the alternative.</SectionIntro><div className="decision-progress"><span className="mono">BENCH PROGRESS</span><div className="progress-track"><i style={{ width: `${progress || 8}%` }} /></div><span className="mono">{scenarioIndex + 1} / {scenarios.length}</span></div><div className="bench"><div className="scenario-card"><span className="kicker">{scenario.eyebrow}</span><h2>{scenario.title}</h2>{scenario.project && <p className="project-link">{scenario.project}</p>}<div className="choice-list">{scenario.choices.map((choice, index) => <button key={choice.label} className={`choice ${choiceIndex === index ? 'selected' : ''}`} onClick={() => { setChoiceIndex(index); setFollowIndex(null) }}><span className="choice-letter">{String.fromCharCode(65 + index)}</span><span><strong>{choice.label}</strong><small>{choice.title}</small></span><ChevronRight size={17} /></button>)}</div></div><AnimatePresence mode="wait"><motion.div key={`${scenario.id}-${choiceIndex}`} className="decision-result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>{answered ? <><span className="mono">YOUR ROUTE / {String.fromCharCode(65 + choiceIndex)}</span><h2>{scenario.choices[choiceIndex].title}</h2><p>{scenario.choices[choiceIndex].body}</p><div className="tradeoff"><span>CONSEQUENCE</span><strong>{scenario.choices[choiceIndex].consequence}</strong></div>{scenario.followUp && <div className="follow-up"><span className="mono">FOLLOW-UP DECISION</span><p>{scenario.followUp}</p>{scenario.followChoices.map((item, index) => <button key={item} className={followIndex === index ? 'follow-selected' : ''} onClick={() => setFollowIndex(index)}>{item}{followIndex === index && <Check size={14} />}</button>)}</div>}<div className="result-actions"><button className="button button-dark" onClick={next}>Next dilemma <ArrowUpRight size={16} /></button><button className="text-button" onClick={reset}><RotateCcw size={15} /> Try another route</button></div></> : <div className="empty-result"><CircleDot size={27} /><span className="mono">WAITING FOR A CHOICE</span><p>Choose a route on the left. There is no “correct” answer, only a different set of responsibilities.</p></div>}</motion.div></AnimatePresence></div><div className="bench-footer"><button className="text-button" onClick={() => { setScenarioIndex(0); reset() }}><RotateCcw size={15} /> Restart the bench</button><span className="mono">DECISIONS STAY LOCAL TO THIS VISIT</span></div></div>
}

function Achievements() {
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null)
  const achievements = [
    { id: 'hacktoberfest-1', category: 'Open-source milestones', title: 'Hacktoberfest 2026 — Completionist', date: 'Completed: October 11, 2026', status: 'Completed', description: 'Completed participation milestone for Hacktoberfest 2026 — Completionist.', tone: 'apricot', icon: Award },
    { id: 'hacktoberfest-2', category: 'Open-source milestones', title: 'Hacktoberfest 2026 — Completionist++', date: 'Completed: October 18, 2026', status: 'Completed', description: 'Completed participation milestone for Hacktoberfest 2026 — Completionist++.', tone: 'lavender', icon: Award },
    { id: 'trailhead', category: 'Learning quests', title: 'Salesforce Trailhead — Trick or Trailhead Quest', date: '2,400 points', status: 'Completed', description: 'Completed the Salesforce Trailhead Trick or Trailhead Quest.', detail: '2,400 points · participation milestone, not a certification or Superbadge claim.', tone: 'blue', icon: Gamepad2 },
    { id: 'ai-week-3', category: 'AI experimentation', title: 'Open-Source AI Challenge — Week 3', date: 'Challenge: Slow and Steady', status: 'Participation', description: 'Participated in Week 3 of the Open-Source AI Challenge through ssorg.dev.', project: 'ssorg.dev', repo: 'https://github.com/kaushanikoner20-hub/ssorg.dev', tone: 'green', icon: Sparkles },
    { id: 'ai-week-4', category: 'AI experimentation', title: 'Open-Source AI Challenge — Week 4', date: 'Project: Web Séance', status: 'Participation', description: 'Participated in Week 4 of the Open-Source AI Challenge through Web Séance.', project: 'Web Séance', repo: 'https://github.com/kaushanikoner20-hub/Web-Seance', tone: 'apricot', icon: Sparkles },
  ]
  const categories = ['All', ...new Set(achievements.map((achievement) => achievement.category))]
  const visible = filter === 'All' ? achievements : achievements.filter((achievement) => achievement.category === filter)
  return <div className="page unlock-room"><div className="unlock-hero"><div className="unlock-column"><div className="unlock-copy"><SectionIntro kicker="06 / Achievement Gallery" title={<>THE UNLOCK<br /><span>ROOM</span></>} tone="apricot">Every challenge is a level. Every project is progress. Every bug fixed is a small victory.</SectionIntro></div><div className="unlock-filters" role="toolbar" aria-label="Filter achievements by category">{categories.map((category) => <button key={category} className={filter === category ? 'filter-active' : ''} onClick={() => { setFilter(category); setOpenId(null) }}>{category}</button>)}</div></div><div className="player-card"><div className="player-orbit"><Gamepad2 size={28} /><span>PLAYER PROFILE</span></div><div className="player-avatar">K</div><strong>KAUSHANI</strong><span className="mono">DEVELOPER • BUILDER • EXPLORER</span><div className="player-sparks"><i /><i /><i /></div></div></div><div className="unlock-divider"><span className="mono">COLLECTION / {visible.length} VERIFIED ENTRIES</span><span className="xp-line"><i /></span><span className="mono">NO RANKING · JUST PROGRESS</span></div><div className="achievement-grid">{visible.map((achievement, index) => <AchievementCard key={achievement.id} achievement={achievement} index={index} open={openId === achievement.id} onToggle={() => setOpenId(openId === achievement.id ? null : achievement.id)} />)}</div><p className="unlock-note">Portfolio visuals are original game-style badge art, not official Hacktoberfest or Salesforce artwork.</p></div>
}

function AchievementCard({ achievement, index, open, onToggle }) {
  const Icon = achievement.icon
  return <motion.article className={`achievement-card achievement-${achievement.tone} ${open ? 'is-open' : ''}`} initial={{ opacity: 0, y: 15, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .06, duration: .42 }}><button type="button" className="achievement-trigger" onClick={onToggle} aria-expanded={open}><span className="badge-art" aria-hidden="true"><Icon size={28} /><b>{String(index + 1).padStart(2, '0')}</b></span><span className="achievement-main"><span className="mono">{achievement.category}</span><strong>{achievement.title}</strong><small>{achievement.date}</small></span><span className="status-pill">{achievement.status}</span><ChevronRight className="achievement-arrow" size={17} /></button>{open && <div className="achievement-detail"><p>{achievement.description}</p>{achievement.detail && <span className="detail-note">{achievement.detail}</span>}{achievement.projects?.map((project) => <a key={project.name} href={project.repo} target="_blank" rel="noreferrer">Open {project.name} on GitHub <ArrowUpRight size={14} /></a>)}{achievement.repo && <a href={achievement.repo} target="_blank" rel="noreferrer">Open {achievement.project} on GitHub <ArrowUpRight size={14} /></a>}</div>}</motion.article>
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState({ name: '', email: '', subject: '', body: '' })
  const [formError, setFormError] = useState('')
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const email = 'kaushanikoner20@gmail.com'
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim()
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = email
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      fallback.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }
  const updateMessage = (event) => setMessage((current) => ({ ...current, [event.target.name]: event.target.value }))
  const sendMessage = async (event) => {
    event.preventDefault()
    const trimmed = Object.fromEntries(Object.entries(message).map(([key, value]) => [key, value.trim()]))
    setFormError('')
    setFormStatus({ type: '', message: '' })
    if (Object.values(trimmed).some((value) => !value)) {
      setFormError('Please complete every field before sending your message.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmed.email)) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (!formspreeEndpoint) {
      setFormStatus({ type: 'configuration', message: 'The contact form is not configured yet. Add a real VITE_FORMSPREE_ENDPOINT to enable delivery.' })
      return
    }
    setSubmitting(true)
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed.name, email: trimmed.email, subject: trimmed.subject, message: trimmed.body, _replyto: trimmed.email }),
      })
      if (!response.ok) throw new Error('Formspree rejected the submission.')
      setMessage({ name: '', email: '', subject: '', body: '' })
      setFormStatus({ type: 'success', message: 'Message sent successfully' })
    } catch {
      setFormStatus({ type: 'error', message: 'Your message could not be sent right now. Please try again later.' })
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="page contact-page"><SectionIntro kicker="07 / Contact Desk" title={<>Let's build<br /><span>something together.</span></>} tone="blue">Have an idea, a project, or an interesting problem to discuss? I'd love to hear from you.</SectionIntro><div className="contact-layout"><div className="contact-card contact-method contact-email"><span className="mono">EMAIL</span><div className="contact-method-head"><span className="contact-icon"><Mail size={22} /></span><div><span className="contact-method-label">Write to me</span><a className="contact-value" href={`mailto:${email}`}>{email}</a></div></div><button className="copy-contact" type="button" onClick={copyEmail} aria-live="polite">{copied ? 'Email copied' : 'Copy email'} <Check size={15} /></button></div><a className="contact-card contact-method contact-github" href="https://github.com/kaushanikoner20-hub" target="_blank" rel="noreferrer"><span className="mono">GITHUB</span><div className="contact-method-head"><span className="contact-icon"><GitBranch size={22} /></span><div><span className="contact-method-label">Find my work</span><span className="contact-value">kaushanikoner20-hub</span></div></div><span className="contact-open">Open GitHub profile <ArrowUpRight size={16} /></span></a></div><section className="message-panel" aria-labelledby="message-title"><div className="message-intro"><span className="kicker">A direct route</span><h2 id="message-title">Send Me a Message</h2><p>Complete the fields below to send your message directly through the configured Formspree endpoint. No email application will open.</p></div><form className="contact-form" onSubmit={sendMessage} noValidate><div className="form-field"><label htmlFor="contact-name">Your Name</label><input id="contact-name" name="name" type="text" value={message.name} onChange={updateMessage} autoComplete="name" placeholder="Your name" required /></div><div className="form-field"><label htmlFor="contact-email">Your Email Address</label><input id="contact-email" name="email" type="email" value={message.email} onChange={updateMessage} autoComplete="email" placeholder="you@example.com" required /></div><div className="form-field form-field-full"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" type="text" value={message.subject} onChange={updateMessage} placeholder="How can we work together?" required /></div><div className="form-field form-field-full"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="body" value={message.body} onChange={updateMessage} rows="7" placeholder="Write your message here..." required /></div>{formError && <p className="contact-form-error" role="alert">{formError}</p>}{formStatus.message && <p className={`contact-form-status status-${formStatus.type}`} role={formStatus.type === 'error' || formStatus.type === 'configuration' ? 'alert' : 'status'}>{formStatus.type === 'success' && <Check size={16} aria-hidden="true" />}{formStatus.message}</p>}<button className="button button-dark contact-submit" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send Message'} <ArrowUpRight size={16} /></button></form></section></div>
}

export default App