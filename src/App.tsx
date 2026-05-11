import { useMemo, useState } from 'react'
import './App.css'

type AssetType = 'image' | 'figma'

type ProjectAsset = {
  id: string
  title: string
  type: AssetType
  url: string
  caption: string
}

type Project = {
  id: string
  name: string
  role: string
  period: string
  summary: string
  stack: string[]
  milestones: string[]
  assets: ProjectAsset[]
}

const projects: Project[] = [
  {
    id: 'meridian',
    name: 'Meridian Commerce',
    role: 'Lead Product Engineer',
    period: '2025-2026',
    summary:
      'Rebuilt checkout and account journeys for a cross-border retail platform with localized pricing and shipping.',
    stack: ['React', 'TypeScript', 'GraphQL', 'Cloudflare Workers'],
    milestones: [
      'Cut checkout drop-off by 21% after streamlining the address + payment flow.',
      'Introduced edge-cached inventory snapshots for under-100ms product detail loads.',
      'Shipped design tokens and component documentation used by 4 product squads.',
    ],
    assets: [
      {
        id: 'meridian-home',
        title: 'Homepage Refresh',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
        caption: 'Landing and category architecture focused on conversion quality.',
      },
      {
        id: 'meridian-figma',
        title: 'Checkout Flow in Figma',
        type: 'figma',
        url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/2QqzHE4c8U8A6kD5fMU6mu/Sample-File',
        caption:
          'Interactive wireframes for tax, shipping, and payment state transitions.',
      },
    ],
  },
  {
    id: 'atlas',
    name: 'Atlas Studio',
    role: 'Frontend Architect',
    period: '2024-2025',
    summary:
      'Designed a multi-tenant analytics studio with modular dashboard layouts and advanced permissions.',
    stack: ['React', 'D3', 'TanStack Query', 'PostgreSQL'],
    milestones: [
      'Built widget rendering system with drag-drop persistence and history snapshots.',
      'Reduced API payload sizes by 38% through chart-specific data contracts.',
      'Implemented workspace-level themes for enterprise white-label deployments.',
    ],
    assets: [
      {
        id: 'atlas-board',
        title: 'Dashboard Composer',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
        caption: 'Composable dashboard grid with metrics, alerts, and team notes.',
      },
      {
        id: 'atlas-mobile',
        title: 'Mobile Analytics',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1400&q=80',
        caption: 'Companion experience for on-the-go monitoring and quick approvals.',
      },
    ],
  },
  {
    id: 'northstar',
    name: 'Northstar Health',
    role: 'Senior UI Engineer',
    period: '2023-2024',
    summary:
      'Created an appointment and care-plan portal with accessibility-first interaction patterns.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Playwright'],
    milestones: [
      'Passed WCAG AA audits across patient intake and appointment booking.',
      'Delivered clinician tools that reduced booking conflicts by 17%.',
      'Set up visual regression testing for 120+ critical UI states.',
    ],
    assets: [
      {
        id: 'northstar-booking',
        title: 'Booking Experience',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
        caption: 'Guided scheduling with eligibility and provider preference logic.',
      },
      {
        id: 'northstar-figma',
        title: 'Care Plan Prototype',
        type: 'figma',
        url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/2QqzHE4c8U8A6kD5fMU6mu/Sample-File',
        caption: 'Journey map and component specs for clinician and patient views.',
      },
    ],
  },
]

function App() {
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id)
  const [activeAssetId, setActiveAssetId] = useState(projects[0].assets[0].id)

  const activeProject = useMemo(() => {
    return projects.find((project) => project.id === activeProjectId) ?? projects[0]
  }, [activeProjectId])

  const activeAsset = useMemo(() => {
    const selected = activeProject.assets.find((asset) => asset.id === activeAssetId)
    return selected ?? activeProject.assets[0]
  }, [activeAssetId, activeProject])

  const openProject = (project: Project) => {
    setActiveProjectId(project.id)
    setActiveAssetId(project.assets[0].id)
  }

  return (
    <div className="xcode-shell">
      <header className="top-chrome">
        <div className="window-controls" aria-hidden="true">
          <span className="dot close"></span>
          <span className="dot minimize"></span>
          <span className="dot maximize"></span>
        </div>
        <p className="workspace-title">Ryan Lewis Portfolio.xcodeproj</p>
        <div className="toolbar-actions">
          <button type="button">Run</button>
          <button type="button">Share</button>
        </div>
      </header>

      <div className="workspace-grid">
        <aside className="project-panel" aria-label="Project navigator">
          <div className="panel-header">
            <h2>Projects</h2>
            <span>{projects.length} items</span>
          </div>

          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className={project.id === activeProject.id ? 'project-item active' : 'project-item'}
                  onClick={() => openProject(project)}
                >
                  <span className="project-name">{project.name}</span>
                  <span className="project-meta">{project.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="editor-panel" aria-label="Main editor">
          <div className="editor-tabs">
            <button type="button" className="tab active">
              {activeProject.name}.md
            </button>
            <button type="button" className="tab">
              Notes.txt
            </button>
          </div>

          <article className="editor-content">
            <p className="eyebrow">{activeProject.period}</p>
            <h1>{activeProject.name}</h1>
            <p>{activeProject.summary}</p>

            <div className="tag-row">
              {activeProject.stack.map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>

            <h3>Impact</h3>
            <ul>
              {activeProject.milestones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </main>

        <aside className="preview-panel" aria-label="Preview panel">
          <div className="preview-tabs" role="tablist" aria-label="Project assets">
            {activeProject.assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className={asset.id === activeAsset.id ? 'preview-tab active' : 'preview-tab'}
                onClick={() => setActiveAssetId(asset.id)}
              >
                {asset.title}
              </button>
            ))}
          </div>

          <div className="preview-frame">
            {activeAsset.type === 'image' ? (
              <img src={activeAsset.url} alt={activeAsset.title} />
            ) : (
              <iframe
                src={activeAsset.url}
                title={activeAsset.title}
                loading="lazy"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <p className="preview-caption">{activeAsset.caption}</p>
        </aside>
      </div>
    </div>
  )
}

export default App
