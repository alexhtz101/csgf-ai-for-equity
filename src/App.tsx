import { useState, useEffect, useCallback } from 'react'
import './App.css'

/* ============================================
   DATA
   ============================================ */

const workstreams = [
  {
    name: 'Analyze Data/Perform Spreadsheet Tasks',
    slug: 'analyze-data',
    videos: [
      { title: 'Deploy Claude in Excel to generate spreadsheet insights', src: 'https://www.loom.com/embed/28838121b873408181b62613e9745de0' },
      { title: 'Deploy ChatGPT in Excel to collaborate and generate insights', src: 'https://www.loom.com/embed/e378e423aae8444bab8afea8bc94b7e0' },
      { title: 'Use AI to triangulate data across a number of spreadsheet tabs (A side by side comparison of different models)', src: 'https://www.loom.com/embed/57e5467c5c8c48c8a86694ba2a303cf3' },
    ],
  },
  {
    name: 'Automate Recurring Workflows',
    slug: 'automate-workflows',
    videos: [
      { title: 'Leverage ChatGPT Codex to routinize recurring tasks', src: 'https://www.loom.com/embed/d3bb21a7539e4837a267c0150e1fe6d1' },
      { title: 'Leverage Claude Skills to routinize recurring tasks', src: 'https://www.loom.com/embed/c7254706d8bd4d5689edd1f5633949d0' },
    ],
  },
  {
    name: 'Build/Maintain Trackers',
    slug: 'build-maintain-trackers',
    videos: [
      { title: 'Automate HR onboarding tracker maintenance with App Script (code written with AI)', src: 'https://www.loom.com/embed/5025c3a308984f5d9916dee8c337b683' },
      { title: 'Build a no-code dashboard with Codex to monitor Intent to Return Survey Data (for ChatGPT users)', src: 'https://www.loom.com/embed/7f693b86cc14442c9787d12d41cf7a1b' },
      { title: 'Build a no-code dashboard with Claude Code to monitor Intent to Return Survey Data (for Claude users)', src: 'https://www.loom.com/embed/10e7bb0d8ffa4807b41ce26f3fe117ea' },
      { title: 'Maintain Google account license information with App Script code, written in Gemini', src: 'https://www.loom.com/embed/10441291189142ae82f9fb81a95caca2' },
    ],
  },
  {
    name: 'Codify Systems',
    slug: 'codify-systems',
    videos: [
      { title: 'Develop high quality, step by step Standard Operating Procedures with Scribe', src: 'https://www.loom.com/embed/0bf2b226dbf347469b9d53e3f646a430' },
    ],
  },
  {
    name: 'Generate High Quality Decks',
    slug: 'generate-decks',
    videos: [
      { title: 'Create on-brand decks with Gemini and Google slides', src: 'https://www.loom.com/embed/da23683b181b4dfd8b0c5dfa6194bbb0' },
      { title: 'Use AI to create polished decks (A side by side comparison of models — note that Gemini has made updates since this was recorded, see the Gemini video)', src: 'https://www.loom.com/embed/df2f8ac3897143f09c7376e5ed9799c0' },
    ],
  },
  {
    name: 'Recruit Students',
    slug: 'recruit-students',
    videos: [
      { title: 'Conduct a landscape scan and develop a competitive market analysis', src: 'https://www.loom.com/embed/eb5ad45ccead48cd83f616ff6aff3c58' },
      { title: "Generate messages aligned to school's unique value proposition", src: 'https://www.loom.com/embed/da540f9096664c63bd432f363b9276e8' },
      { title: 'Identify and plan for community events', src: 'https://www.loom.com/embed/5ef924774ce64765bb1d372924993825' },
      { title: 'Using comp analysis and UVP, develop an individualized drip campaign for prospective families', src: 'https://www.loom.com/embed/a0a19b81f5bd480484379e312a96751c' },
    ],
  },
]

/* ============================================
   WORKFLOW MAPPING OPTIONS
   ============================================ */

const taskComplexityOptions = [
  { value: '', label: 'Select complexity level...' },
  { value: 'simple', label: 'Simple: Fully routinized' },
  { value: 'moderate', label: 'Moderate: Mainly routinized, some decision points' },
  { value: 'complex', label: 'Complex: Significant judgment required' },
]

const taskPredictabilityOptions = [
  { value: '', label: 'Select predictability...' },
  { value: 'highly-predictable', label: 'Highly Predictable: Same patterns always' },
  { value: 'mostly-predictable', label: 'Mostly Predictable: Common patterns with occasional variations' },
  { value: 'variable', label: 'Variable: Frequent exceptions' },
]

const aiComplexityOptions = [
  { value: '', label: 'Select AI complexity...' },
  { value: 'simple', label: 'Simple: We have the tools and expertise now' },
  { value: 'moderate', label: 'Moderate: Requires some learning/setup' },
  { value: 'complex', label: 'Complex: Requires significant investment' },
]

const impactTypeOptions = [
  { value: '', label: 'Select impact type...' },
  { value: 'operational-efficiency', label: 'Operational Efficiency: Streamlines processes, reduces costs' },
  { value: 'decision-quality', label: 'Decision Quality: Better insights and choices' },
  { value: 'staff-experience', label: 'Staff Experience: Improves work satisfaction' },
  { value: 'student-family-experience', label: 'Student/Family Experience: Better service delivery' },
]

const impactMagnitudeOptions = [
  { value: '', label: 'Select impact magnitude...' },
  { value: 'low', label: 'Low: Minor improvement (<10%)' },
  { value: 'medium', label: 'Medium: Moderate improvement (10-20%)' },
  { value: 'high', label: 'High: Significant improvement (>20%)' },
]

const riskLevelOptions = [
  { value: '', label: 'Select risk level...' },
  { value: 'low', label: 'Low Risk: Minor consequences for errors' },
  { value: 'medium', label: 'Medium Risk: Moderate consequences' },
  { value: 'high', label: 'High Risk: Significant consequences' },
]

const stakeholderAcceptanceOptions = [
  { value: '', label: 'Select stakeholder acceptance...' },
  { value: 'high', label: 'High: Enthusiastic support expected' },
  { value: 'medium', label: 'Medium: Some resistance but generally supportive' },
  { value: 'low', label: 'Low: Significant resistance expected' },
]

const implementationStatusOptions = [
  { value: '', label: 'Select status...' },
  { value: 'not-considering', label: 'Not Considering' },
  { value: 'explore', label: 'Explore' },
  { value: 'pilot', label: 'Pilot' },
  { value: 'scale', label: 'Scale' },
]

const qualityTips = [
  {
    title: 'Adopt an enterprise platform and ensure your staff are using it.',
    body: 'One of the most significant quality control risks is data privacy. Enterprise platforms offer substantially stronger data security than individual or free accounts. They also provide access to the most capable, up-to-date models, which leads to a meaningful difference in output quality.',
  },
  {
    title: 'Set clear expectations about what data belongs in AI tools.',
    body: 'Staff should generally avoid entering personally identifiable information or anything that could conflict with FERPA compliance. Being explicit about these boundaries upfront prevents problems later.',
  },
  {
    title: 'Build quality norms by sharing effective AI use, including your own.',
    body: "No training program can cover every possible AI use case. What actually builds capacity is helping people see how colleagues are integrating AI meaningfully into their work. Leaders are encouraged to model their own use and create space for people to share what\u2019s working.",
  },
  {
    title: 'Remind people that their expertise is irreplaceable.',
    body: "AI can generate a thoughtful coaching script, but it doesn\u2019t know what motivates a specific teammate, what they\u2019re carrying into a meeting, or what context matters most in the moment. Personal judgment and knowledge of org context is critical.",
  },
  {
    title: 'Make it clear that staff own the final product.',
    body: "A simple standard: if you wouldn\u2019t put your name on it, it\u2019s not ready. This means people should always fact check, verify, review, and edit any AI-generated output.",
  },
  {
    title: 'Calibrate scrutiny.',
    body: "A quick internal data summary and a formal board presentation are not the same thing. AI can get a draft on the table fast, which is genuinely useful for lower-stakes work. But higher-stakes outputs \u2014 anything going to external audiences, leadership, or that carries significant organizational weight \u2014 require proportionally more human review and judgment. Developing a shared sense of which tasks are which is itself a valuable team conversation.",
  },
  {
    title: 'Watch for homogenization.',
    body: 'When a whole team starts routing work through AI, outputs can start to sound alike: same sentence structures, same framing, same vocabulary. For leadership communications especially, that sameness can erode voice and credibility over time. This is worth naming with the team.',
  },
]

/* ============================================
   HELPERS
   ============================================ */

function buildLoomSrc(baseSrc: string): string {
  const sep = baseSrc.includes('?') ? '&' : '?'
  return `${baseSrc}${sep}hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`
}

/* ============================================
   ICONS
   ============================================ */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 8 10 13 15 8" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="14" y1="8" x2="2" y2="8" />
      <polyline points="7 3 2 8 7 13" />
    </svg>
  )
}

/* ============================================
   LOGO
   ============================================ */

function Logo() {
  return (
    <a href="https://equity-ai.org" className="logo-link" target="_blank" rel="noopener noreferrer">
      <img src="/logo.jpg" alt="AI for Equity" className="logo-img" />
    </a>
  )
}

/* ============================================
   VIDEO CARD — description-first, click-to-play
   ============================================ */

function VideoCard({ video, index }: { video: { title: string; src: string }; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="vcard">
      <div className="vcard-content">
        <span className="vcard-number">{index + 1}</span>
        <h3 className="vcard-title">{video.title}</h3>
      </div>
      <div className="vcard-media">
        {isPlaying && video.src ? (
          <div className="vcard-embed">
            <iframe
              src={buildLoomSrc(video.src)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button className="vcard-overlay" onClick={() => setIsPlaying(true)} aria-label={`Play: ${video.title}`}>
            <div className="vcard-overlay-bg" />
            <div className="vcard-play-btn">
              <PlayIcon />
            </div>
            <span className="vcard-play-label">Watch video</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* ============================================
   WORKSTREAM SELECTOR (dropdown)
   ============================================ */

function WorkstreamSelector({ onSelect }: { onSelect: (slug: string) => void }) {
  return (
    <div className="ws-selector">
      <p className="ws-selector-intro">
        Select a workstream below to browse step-by-step video walkthroughs.
      </p>
      <div className="ws-selector-wrapper">
        <select
          className="ws-selector-dropdown"
          defaultValue=""
          onChange={(e) => { if (e.target.value) onSelect(e.target.value) }}
        >
          <option value="" disabled>Choose a workstream&hellip;</option>
          {workstreams.map((ws, i) => (
            <option key={ws.slug} value={ws.slug}>
              {i + 1}. {ws.name} ({ws.videos.length} {ws.videos.length === 1 ? 'video' : 'videos'})
            </option>
          ))}
        </select>
        <ChevronDown className="ws-selector-chevron" />
      </div>
    </div>
  )
}

/* ============================================
   WORKSTREAM DETAIL VIEW
   ============================================ */

function WorkstreamDetailView({
  workstream,
  index,
  onBack,
}: {
  workstream: typeof workstreams[0]
  index: number
  onBack: () => void
}) {
  return (
    <div className="ws-detail">
      <button className="ws-detail-back" onClick={onBack}>
        <ArrowLeftIcon />
        <span>All Workstreams</span>
      </button>

      <div className="ws-detail-header">
        <span className="ws-detail-icon">{index + 1}</span>
        <h2 className="ws-detail-name">{workstream.name}</h2>
        <span className="ws-detail-count">
          {workstream.videos.length} video{workstream.videos.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="ws-detail-list">
        {workstream.videos.map((video, i) => (
          <VideoCard key={i} video={video} index={i} />
        ))}
      </div>
    </div>
  )
}

/* ============================================
   TOP-LEVEL ACCORDION
   ============================================ */

function AccordionSection({
  number,
  title,
  description,
  children,
  isOpen,
  onToggle,
}: {
  number: string
  title: string
  description?: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={`accordion-section animate-in ${isOpen ? 'is-open' : ''}`}>
      <button className="accordion-trigger" onClick={onToggle}>
        <div className="accordion-number">{number}</div>
        <div className="accordion-title-group">
          <span className="accordion-title">{title}</span>
          {description && <span className="accordion-description">{description}</span>}
        </div>
        <ChevronDown className="accordion-chevron" />
      </button>
      <div className="accordion-body">
        <div className="accordion-body-inner">
          <div className="accordion-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   WORKFLOW MAPPING FORM
   ============================================ */

interface FormState {
  workflowName: string
  opportunityChallenge: string
  taskComplexity: string
  taskPredictability: string
  aiUseIdea: string
  aiComplexity: string
  impactType: string
  impactMagnitude: string
  riskLevel: string
  stakeholderAcceptance: string
  implementationStatus: string
}

const initialFormState: FormState = {
  workflowName: '',
  opportunityChallenge: '',
  taskComplexity: '',
  taskPredictability: '',
  aiUseIdea: '',
  aiComplexity: '',
  impactType: '',
  impactMagnitude: '',
  riskLevel: '',
  stakeholderAcceptance: '',
  implementationStatus: '',
}

function PrintIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function WorkflowMappingForm() {
  const [form, setForm] = useState<FormState>(initialFormState)

  const updateField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    setForm(initialFormState)
  }

  return (
    <div className="workflow-form">
      <p className="wf-intro">
        Use this tool to map a recurring workflow and assess whether it's a good candidate for AI. Fill out each section, then print or save as PDF.
      </p>

      {/* Starting Fields */}
      <div className="wf-section wf-section-start">
        <div className="wf-field">
          <label htmlFor="workflowName">Workflow Name</label>
          <input
            type="text"
            id="workflowName"
            placeholder="e.g., Onboarding, Chromebook Distribution, MAP Testing Set-Up"
            value={form.workflowName}
            onChange={(e) => updateField('workflowName', e.target.value)}
          />
        </div>
        <div className="wf-field">
          <label htmlFor="opportunityChallenge">Opportunity / Challenge</label>
          <textarea
            id="opportunityChallenge"
            placeholder="Where are there pain points, inefficiencies, or opportunities for improvement?"
            rows={3}
            value={form.opportunityChallenge}
            onChange={(e) => updateField('opportunityChallenge', e.target.value)}
          />
        </div>
      </div>

      {/* Step 1: Task Characteristics */}
      <div className="wf-section">
        <div className="wf-step-header">
          <span className="wf-step-number">1</span>
          <span className="wf-step-title">Task Characteristics</span>
        </div>
        <div className="wf-field-row">
          <div className="wf-field">
            <label htmlFor="taskComplexity">Task Complexity Level</label>
            <div className="wf-select-wrapper">
              <select
                id="taskComplexity"
                value={form.taskComplexity}
                onChange={(e) => updateField('taskComplexity', e.target.value)}
              >
                {taskComplexityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="wf-select-chevron" />
            </div>
          </div>
          <div className="wf-field">
            <label htmlFor="taskPredictability">Task Predictability</label>
            <div className="wf-select-wrapper">
              <select
                id="taskPredictability"
                value={form.taskPredictability}
                onChange={(e) => updateField('taskPredictability', e.target.value)}
              >
                {taskPredictabilityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="wf-select-chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: AI Opportunity */}
      <div className="wf-section">
        <div className="wf-step-header">
          <span className="wf-step-number">2</span>
          <span className="wf-step-title">AI Opportunity</span>
        </div>
        <div className="wf-field">
          <label htmlFor="aiUseIdea">Idea(s) for AI Use <span className="wf-optional">(optional)</span></label>
          <textarea
            id="aiUseIdea"
            placeholder="Leave blank if not considering AI. Otherwise, describe how AI could help with this workflow."
            rows={3}
            value={form.aiUseIdea}
            onChange={(e) => updateField('aiUseIdea', e.target.value)}
          />
        </div>
        <div className="wf-field">
          <label htmlFor="aiComplexity">Complexity of AI Use</label>
          <div className="wf-select-wrapper">
            <select
              id="aiComplexity"
              value={form.aiComplexity}
              onChange={(e) => updateField('aiComplexity', e.target.value)}
            >
              {aiComplexityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="wf-select-chevron" />
          </div>
        </div>
      </div>

      {/* Step 3: Business Impact */}
      <div className="wf-section">
        <div className="wf-step-header">
          <span className="wf-step-number">3</span>
          <span className="wf-step-title">Business Impact Consideration</span>
        </div>
        <div className="wf-field-row">
          <div className="wf-field">
            <label htmlFor="impactType">Impact Type</label>
            <div className="wf-select-wrapper">
              <select
                id="impactType"
                value={form.impactType}
                onChange={(e) => updateField('impactType', e.target.value)}
              >
                {impactTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="wf-select-chevron" />
            </div>
          </div>
          <div className="wf-field">
            <label htmlFor="impactMagnitude">Impact Magnitude</label>
            <div className="wf-select-wrapper">
              <select
                id="impactMagnitude"
                value={form.impactMagnitude}
                onChange={(e) => updateField('impactMagnitude', e.target.value)}
              >
                {impactMagnitudeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="wf-select-chevron" />
            </div>
          </div>
        </div>
        <div className="wf-field-row">
          <div className="wf-field">
            <label htmlFor="riskLevel">Risk Level</label>
            <div className="wf-select-wrapper">
              <select
                id="riskLevel"
                value={form.riskLevel}
                onChange={(e) => updateField('riskLevel', e.target.value)}
              >
                {riskLevelOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="wf-select-chevron" />
            </div>
          </div>
          <div className="wf-field">
            <label htmlFor="stakeholderAcceptance">Predicted Stakeholder Acceptance</label>
            <div className="wf-select-wrapper">
              <select
                id="stakeholderAcceptance"
                value={form.stakeholderAcceptance}
                onChange={(e) => updateField('stakeholderAcceptance', e.target.value)}
              >
                {stakeholderAcceptanceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="wf-select-chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Implementation Status */}
      <div className="wf-section">
        <div className="wf-step-header">
          <span className="wf-step-number">4</span>
          <span className="wf-step-title">AI Innovation Implementation Status</span>
        </div>
        <div className="wf-field">
          <label htmlFor="implementationStatus">Current Status</label>
          <div className="wf-select-wrapper">
            <select
              id="implementationStatus"
              value={form.implementationStatus}
              onChange={(e) => updateField('implementationStatus', e.target.value)}
            >
              {implementationStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="wf-select-chevron" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="wf-actions">
        <button className="wf-btn wf-btn-secondary" onClick={handleReset} type="button">
          Clear Form
        </button>
        <button className="wf-btn wf-btn-primary" onClick={handlePrint} type="button">
          <PrintIcon />
          Print / Save PDF
        </button>
      </div>
    </div>
  )
}

/* ============================================
   APP
   ============================================ */

function App() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [selectedWorkstream, setSelectedWorkstream] = useState<string | null>(null)

  const toggleSection = useCallback((num: string) => {
    setOpenSection(prev => prev === num ? null : num)
  }, [])

  const handleSelect = useCallback((slug: string) => {
    window.location.hash = `workstream/${slug}`
  }, [])

  const handleBack = useCallback(() => {
    window.location.hash = ''
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#workstream/')) {
        const slug = hash.replace('#workstream/', '')
        const found = workstreams.find(ws => ws.slug === slug)
        if (found) {
          setSelectedWorkstream(slug)
          return
        }
      }
      setSelectedWorkstream(null)
    }

    window.addEventListener('hashchange', onHashChange)
    onHashChange() // handle initial load with hash

    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const activeWorkstreamIndex = selectedWorkstream
    ? workstreams.findIndex(ws => ws.slug === selectedWorkstream)
    : -1
  const activeWorkstream = activeWorkstreamIndex >= 0 ? workstreams[activeWorkstreamIndex] : null

  return (
    <>
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <p className="header-tagline">
            We built this site with Claude Code. <a href="https://learn-coding-with-ai.vercel.app/courses.html" target="_blank" rel="noopener noreferrer">Learn Claude Code here →</a>
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-label">March 2026</div>
          <h1>
            Charter School Growth Fund<br />
            <em>COO/CFO Convening</em>
          </h1>
          <p className="hero-subtitle">
            Resources, case studies, and workflow videos for integrating AI into school operations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">

        {/* Section 1: Case Study */}
        <AccordionSection number="1" title="Case Study: Collegiate Academies" description="How Collegiate Academies built AI into daily operations" isOpen={openSection === '1'} onToggle={() => toggleSection('1')}>
          <div className="prose">
            <p>
              At Collegiate Academies, the operations team has moved beyond dabbling with AI and is actively integrating it into administrative workflows. Rather than waiting for top-down mandates, the team has identified <strong>high-value use cases</strong> where AI saves real time: the data team uses AI to <strong>accelerate dashboard development</strong>, bringing more coding work in-house; contract management runs through a <strong>Gemini integration</strong> that screens for expiring terms and reviews insurance documents; and staff across the 18-person operations team use AI as a <strong>writing aid for internal communications</strong>. On the instructional side, teachers use vertical software like Brisk and Course Mojo to support student feedback workflows, a sign of where operational adoption may be headed.
            </p>
            <p>
              What distinguishes Collegiate&rsquo;s approach is how leadership has made <strong>AI use feel normal rather than optional</strong>. The COO <strong>models transparency</strong> by using AI tools openly in front of the team and actively encouraging adoption with a straightforward message: &ldquo;I want to see you using it.&rdquo; Adoption is supported through <strong>10-minute, practical training sessions</strong>, demonstrating immediately applicable use cases, so staff can see time savings without a significant learning curve. The HR team, for example, now gets step-by-step IT guidance directly from Gemini rather than waiting on technical support for routine questions. This low-barrier entry point has helped make AI assistance feel like a <strong>natural part of the workday</strong>.
            </p>
            <p>
              The cultural norms the team has built around AI use are worth noting. There is no stigma attached to using AI for help, but <strong>accountability for final output stays with the individual</strong>. Staff are expected to <strong>read and edit everything</strong> before it goes out. Leadership has also made clear that <strong>inefficient habits aren&rsquo;t acceptable</strong>: if a task can be handled more effectively with AI, the expectation is that it will be. This combination of <strong>permission and accountability</strong> reflects a mindset that is less about any particular tool and more about building a team that takes seriously how it uses its time &mdash; a relevant frame for operations leaders in any school system thinking about where to start.
            </p>
          </div>
        </AccordionSection>

        {/* Section 2: Quality Control */}
        <AccordionSection number="2" title="Tips for Managing Quality Control" description="7 recommendations from COOs and CFOs on maintaining output quality" isOpen={openSection === '2'} onToggle={() => toggleSection('2')}>
          <div className="prose">
            <p className="intro-text">
              As you build your team&rsquo;s capacity to leverage AI, keep an equal eye on quality. AI brings real opportunities for productivity and creativity, but it also introduces risks around work quality that require active management. Below is a consolidated set of recommendations drawn from our conversations with COOs and CFOs.
            </p>
            <p className="explore-link">
              <a href="https://quality-control-framework.vercel.app/" target="_blank" rel="noopener noreferrer">Explore full guidance here →</a>
            </p>
            <ol className="tip-list">
              {qualityTips.map((tip, i) => (
                <li className="tip-item" key={i}>
                  <span className="tip-number">{i + 1}</span>
                  <span className="tip-title">{tip.title}</span>
                  <span className="tip-body">{tip.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </AccordionSection>

        {/* Section 3: Workflow Videos */}
        <AccordionSection number="3" title="AI Workflow Videos" description="16 walkthroughs across 6 operational workstreams" isOpen={openSection === '3'} onToggle={() => toggleSection('3')}>
          {activeWorkstream ? (
            <WorkstreamDetailView workstream={activeWorkstream} index={activeWorkstreamIndex} onBack={handleBack} />
          ) : (
            <WorkstreamSelector onSelect={handleSelect} />
          )}
        </AccordionSection>

        {/* Section 4: Workflow Mapping Tool */}
        <AccordionSection number="4" title="Map Your Own Workflow" description="Identify recurring workflows that are good candidates for AI" isOpen={openSection === '4'} onToggle={() => toggleSection('4')}>
          <WorkflowMappingForm />
        </AccordionSection>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-text">
            AI for Equity &middot; Charter School Growth Fund &middot; 2026
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
