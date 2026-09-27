/* ============================================================
   PORTFOLIO SCRIPT
   Loads portfolio-data.yml and fills the page with its content.

   NOTE: Because this reads a local .yml file, most browsers will
   only allow it when the three files are served from a web server
   (e.g. GitHub Pages, Netlify, or "Live Server" in VS Code) rather
   than opened directly by double-clicking index.html. If you open
   the file directly and see the fallback error message below, this
   is why — see the instructions under "How to view it" for the fix.
   ============================================================ */

async function loadPortfolio() {
  try {
    const response = await fetch("portfolio-data.yml");
    if (!response.ok) throw new Error("Could not fetch portfolio-data.yml");
    const yamlText = await response.text();
    const data = jsyaml.load(yamlText);
    renderPortfolio(data);
  } catch (err) {
    console.error("Failed to load portfolio data:", err);
    document.getElementById("name").textContent = "Could not load portfolio data.";
    document.getElementById("title").textContent =
      "Please view this page through a local server (see the note in script.js) rather than opening index.html directly.";
  }
}

function renderPortfolio(data) {
  // ---- Profile ----
  document.getElementById("name").textContent = data.profile?.name || "";
  document.getElementById("title").textContent = data.profile?.title || "";

  const photoFrame = document.getElementById("photo-frame");
  if (data.profile?.photo_url) {
    photoFrame.innerHTML = `<img src="${escapeAttr(data.profile.photo_url)}" alt="${escapeAttr(data.profile.name || "Profile photo")}" />`;
  }

  // ---- About ----
  document.getElementById("about-text").textContent = (data.about || "").trim();

  // ---- Skills ----
  const skillsList = document.getElementById("skills-list");
  (data.skills || []).forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  // ---- Experience ----
  const experienceList = document.getElementById("experience-list");
  (data.experience || []).forEach(job => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="entry-title">${escapeHtml(job.role || "")}</div>
      <div class="entry-meta">${escapeHtml(job.period || "")}</div>
      <div class="entry-desc">${escapeHtml(job.description || "")}</div>
    `;
    experienceList.appendChild(div);
  });

  // ---- Education ----
  const educationList = document.getElementById("education-list");
  (data.education || []).forEach(edu => {
    const div = document.createElement("div");
    div.className = "entry";
    const metaParts = [edu.program, edu.period].filter(Boolean).join(" — ");
    div.innerHTML = `
      <div class="entry-title">${escapeHtml(edu.institution || "")}</div>
      <div class="entry-meta">${escapeHtml(metaParts)}</div>
    `;
    educationList.appendChild(div);
  });

  // ---- Projects ----
  const projectsList = document.getElementById("projects-list");
  (data.projects || []).forEach(project => {
    const div = document.createElement("div");
    div.className = "entry";
    const linkHtml = project.link
      ? `<a class="project-link" href="${escapeAttr(project.link)}" target="_blank" rel="noopener noreferrer">View sample &rarr;</a>`
      : `<span class="project-link" style="color:#999;">(add link in portfolio-data.yml)</span>`;
    div.innerHTML = `
      <div class="entry-title">${escapeHtml(project.title || "")}</div>
      <div class="entry-desc">${escapeHtml(project.description || "")}</div>
      ${linkHtml}
    `;
    projectsList.appendChild(div);
  });

  // ---- Tools ----
  const toolsList = document.getElementById("tools-list");
  (data.tools || []).forEach(tool => {
    const li = document.createElement("li");
    li.textContent = tool;
    toolsList.appendChild(li);
  });

  // ---- Contact ----
  const contactList = document.getElementById("contact-list");
  const contact = data.contact || {};
  const contactRows = [];

  if (contact.email_primary) {
    contactRows.push({ label: "Email:", value: contact.email_primary, href: `mailto:${contact.email_primary}` });
  }
  if (contact.email_secondary) {
    contactRows.push({ label: "Alt. Email:", value: contact.email_secondary, href: `mailto:${contact.email_secondary}` });
  }
  if (contact.whatsapp) {
    const digits = contact.whatsapp.replace(/[^\d+]/g, "");
    contactRows.push({ label: "WhatsApp:", value: contact.whatsapp, href: `https://wa.me/${digits.replace("+", "")}` });
  }

  contactRows.forEach(row => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="label">${escapeHtml(row.label)}</span><a href="${escapeAttr(row.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.value)}</a>`;
    contactList.appendChild(li);
  });

  if (contactRows.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Add your email(s) and WhatsApp number in portfolio-data.yml";
    contactList.appendChild(li);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", loadPortfolio);

/* ---- small helpers to keep inserted text/links safe ---- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}
