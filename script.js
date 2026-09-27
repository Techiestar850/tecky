// ============================================================
// script.js — reads data.yml and fills in index.html
// You should not need to edit this file. Edit data.yml instead.
// ============================================================

// Fallback copy of data.yml, used only if the browser can't fetch
// the file directly (this happens when index.html is opened with
// a plain double-click instead of through a local/web server).
// Keep this in sync with data.yml if you want the fallback to be
// accurate too — otherwise just run a local server (see the
// "How to view this" note at the bottom of this file).
const FALLBACK_YAML = `
site:
  name: "Dave Akimara"
  title: "Freelance Data Annotation & AI Training Specialist"
  tagline: "Transcription · Academic Writing · Copywriting"
  photo_url: ""
  available: true

about: >
  Detail-driven freelance professional specializing in data annotation, AI training
  data support, transcription, academic writing, and copywriting. Over a year of
  freelance experience delivering accurate work on tight deadlines, with a track record
  of following detailed guidelines exactly and staying consistent across large volumes
  of tasks. Currently balancing freelance work with dental studies at the University of
  Nairobi — a discipline that demands the same precision, patience, and zero tolerance
  for careless error that every client project needs. Comfortable working solo or as
  part of a distributed team, and quick to pick up new tools and quality standards.

skills:
  - name: "Data annotation & labeling"
    detail: "Image, text, and audio annotation with CVAT — bounding boxes, segmentation, classification"
  - name: "AI training data support"
    detail: "Prompt/response evaluation, data quality review, guideline-based labeling"
  - name: "Transcription"
    detail: "Verbatim and clean transcripts from audio or video, fast turnaround"
  - name: "Academic writing"
    detail: "Research papers, essays, and literature reviews, properly referenced"
  - name: "Copywriting"
    detail: "Web copy, product descriptions, and persuasive content"

experience:
  - role: "Freelance Data Annotation & AI Training Contributor"
    org: "Self-employed — remote freelance platforms"
    period: "2025 – Present (1 year)"
    points:
      - "Delivered data annotation and labeling work for AI training pipelines, meeting strict accuracy and guideline requirements"
      - "Completed transcription assignments with fast turnaround and consistent accuracy"
      - "Produced academic writing and copywriting projects for clients across multiple platforms"
      - "Reviewed datasets for quality and flagged inconsistencies before submission"

education:
  - qualification: "Bachelor of Dental Surgery (BDS) — in progress"
    school: "University of Nairobi"
    period: "Add your start year – Present"
    detail: "Clinical training builds precision and structured documentation habits that carry directly into detailed, guideline-driven freelance work"

projects:
  - title: "Data annotation sample"
    link: ""
    detail: "Add a short description: the annotation task, the tool used, and the outcome"
  - title: "Transcription sample"
    link: ""
    detail: "Add a short description: audio type, length, and turnaround time"

certifications:
  - title: "Add certification name"
    issuer: "Add issuing organization"
    link: ""

tools:
  - "Microsoft Word"
  - "CVAT (Computer Vision Annotation Tool)"

contact:
  email_primary: ""
  email_secondary: ""
  whatsapp: ""
  location: "Nairobi, Kenya"
`;

const ACCENTS = ["var(--teal)", "var(--amber)", "var(--coral)", "var(--indigo)", "var(--slate)"];

async function loadData() {
  try {
    const res = await fetch("data.yml", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed: " + res.status);
    const text = await res.text();
    return jsyaml.load(text);
  } catch (err) {
    document.getElementById("load-error").style.display = "block";
    return jsyaml.load(FALLBACK_YAML);
  }
}

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.text) node.textContent = opts.text;
  if (opts.html) node.innerHTML = opts.html;
  return node;
}

function linkOrPlaceholder(container, href, label) {
  const a = document.createElement("a");
  if (href && href.trim()) {
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
  } else {
    a.href = "#";
    a.className = "empty";
    a.textContent = "Add a link in data.yml";
    a.addEventListener("click", (e) => e.preventDefault());
  }
  container.appendChild(a);
}

function render(data) {
  // Header
  document.title = `${data.site.name} — Portfolio`;
  document.getElementById("name").textContent = data.site.name;
  document.getElementById("role-title").textContent = data.site.title;
  document.getElementById("tagline").textContent = data.site.tagline || "";

  if (data.site.available) {
    const badge = document.getElementById("badge");
    badge.style.display = "inline-block";
    badge.textContent = "Available for freelance work";
  }

  const photoBox = document.getElementById("photo-box");
  if (data.site.photo_url && data.site.photo_url.trim()) {
    photoBox.innerHTML = "";
    const img = el("img");
    img.src = data.site.photo_url;
    img.alt = data.site.name;
    photoBox.appendChild(img);
  }

  // About
  document.getElementById("about-text").textContent = (data.about || "").trim();

  // Skills
  const skillsList = document.getElementById("skills-list");
  (data.skills || []).forEach((s, i) => {
    const li = el("li");
    li.style.setProperty("--c", ACCENTS[i % ACCENTS.length]);
    li.appendChild(el("span", { className: "s-name", text: s.name }));
    li.appendChild(el("span", { className: "s-detail", text: s.detail }));
    skillsList.appendChild(li);
  });

  // Experience
  const expList = document.getElementById("experience-list");
  (data.experience || []).forEach((e) => {
    const entry = el("div", { className: "entry" });
    entry.appendChild(el("div", { className: "period mono", text: e.period }));
    entry.appendChild(el("p", { className: "role", text: e.role }));
    entry.appendChild(el("p", { className: "org", text: e.org }));
    if (e.points && e.points.length) {
      const ul = el("ul");
      e.points.forEach((pt) => ul.appendChild(el("li", { text: pt })));
      entry.appendChild(ul);
    }
    expList.appendChild(entry);
  });

  // Education
  const eduList = document.getElementById("education-list");
  (data.education || []).forEach((ed) => {
    const entry = el("div", { className: "entry" });
    entry.appendChild(el("div", { className: "period mono", text: ed.period }));
    entry.appendChild(el("p", { className: "role", text: ed.qualification }));
    entry.appendChild(el("p", { className: "org", text: ed.school }));
    if (ed.detail) entry.appendChild(el("p", { className: "detail", text: ed.detail }));
    eduList.appendChild(entry);
  });

  // Projects
  const projList = document.getElementById("projects-list");
  (data.projects || []).forEach((p) => {
    const proj = el("div", { className: "proj" });
    proj.appendChild(el("p", { className: "p-title", text: p.title }));
    linkOrPlaceholder(proj, p.link, "View sample →");
    if (p.detail) proj.appendChild(el("p", { className: "p-detail", text: p.detail }));
    projList.appendChild(proj);
  });

  // Certifications
  const certList = document.getElementById("certifications-list");
  const certs = data.certifications || [];
  if (certs.length === 0 || (certs.length === 1 && !certs[0].issuer && !certs[0].title)) {
    certList.appendChild(el("li", { className: "muted", text: "Add your certifications in data.yml" }));
  } else {
    certs.forEach((c) => {
      const li = el("li");
      li.textContent = c.issuer ? `${c.title} — ${c.issuer}` : c.title;
      certList.appendChild(li);
    });
  }

  // Tools
  const toolsList = document.getElementById("tools-list");
  (data.tools || []).forEach((t) => {
    toolsList.appendChild(el("span", { className: "tool-pill mono", text: t }));
  });

  // Contact
  const card = document.getElementById("contact-card");
  const rows = [
    ["Email", data.contact.email_primary, `mailto:${data.contact.email_primary}`],
    ["Alt. email", data.contact.email_secondary, `mailto:${data.contact.email_secondary}`],
    ["WhatsApp", data.contact.whatsapp, `https://wa.me/${(data.contact.whatsapp || "").replace(/[^\d]/g, "")}`],
    ["Location", data.contact.location, null],
  ];
  rows.forEach(([label, value, href]) => {
    if (!value) return;
    const row = el("div", { className: "contact-row" });
    row.appendChild(el("span", { className: "k", text: label }));
    if (href) {
      const a = el("a", { text: value });
      a.href = href;
      row.appendChild(a);
    } else {
      row.appendChild(el("span", { text: value }));
    }
    card.appendChild(row);
  });
  if (!card.children.length) {
    card.appendChild(el("p", { className: "muted", text: "Add your email, WhatsApp number, and location in data.yml" }));
  }
}

loadData().then(render);

// How to view this with data.yml actually loading (not the fallback):
// Option A — VS Code: install "Live Server", right-click index.html, "Open with Live Server".
// Option B — Terminal: run `python3 -m http.server` in this folder, then open
//            http://localhost:8000 in your browser.
// Option C — Upload all three files to GitHub Pages or Netlify.
// Opening index.html by double-click will still work, just using the built-in
// fallback copy above instead of reading data.yml live.
