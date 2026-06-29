const NEWSLETTER_KEY = "psld_newsletter_signups";
const SUBMISSIONS_KEY = "psld_blog_submissions";

function getPageDepth() {
  return window.location.pathname.includes("/pages/") ? "../" : "";
}

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  return page === "" ? "index.html" : page;
}

function saveList(key, entry) {
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push(entry);
  localStorage.setItem(key, JSON.stringify(list));
}

function renderHeader() {
  const mount = document.querySelector("[data-site-header]");
  if (!mount) return;

  const root = getPageDepth();
  const current = getCurrentPage();
  const navItems = [
    ["index.html#start", "Start Here"],
    ["index.html#topics", "Topics"],
    ["index.html#resources", "Resources"],
    ["index.html#blog", "Blog"],
    ["index.html#faq", "FAQ"],
    ["pages/about.html", "About"],
    ["pages/contact.html", "Contact"]
  ];

  mount.innerHTML = `
    <header class="site-header">
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="${root}index.html" class="brand-mark">
          <img src="${root}assets/main-logo-transparent-220.png" alt="Pro Se Legal Desk logo" width="220" height="195" decoding="async" />
          <span>Pro Se Legal Desk</span>
        </a>
        <div class="nav-links">
          ${navItems.map(([href, label]) => {
            const active = href.endsWith(current) || href.includes(current + "#");
            return `<a href="${root}${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
          }).join("")}
        </div>
      </nav>
    </header>`;
}

function renderFooter() {
  const mount = document.querySelector("[data-site-footer]");
  if (!mount) return;

  const root = getPageDepth();
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div>
            <img class="footer-logo" src="${root}assets/main-logo-transparent-220.png" alt="Pro Se Legal Desk logo" width="220" height="195" loading="lazy" decoding="async" />
            <p><strong>Pro Se Legal Desk</strong></p>
            <p>Information for people learning how to navigate civil court procedure.</p>
          </div>
          <section class="footer-newsletter" aria-labelledby="newsletter-heading">
            <h2 id="newsletter-heading">Subscribe to Updates</h2>
            <p>To receive updates, enter your email address and select the topic that interests you.</p>
            <form data-newsletter-form>
              <label for="newsletter-email">Email address</label>
              <div class="newsletter-row">
                <input id="newsletter-email" name="email" type="email" autocomplete="email" required />
                <select name="topic" aria-label="Newsletter topic">
                  <option>General updates</option>
                  <option>Pre-filing</option>
                  <option>Writing complaints</option>
                  <option>Filing and court access</option>
                  <option>Response deadlines</option>
                  <option>Motion practice</option>
                </select>
                <button class="btn" type="submit">Submit</button>
              </div>
              <p class="form-message" data-newsletter-message aria-live="polite"></p>
            </form>
          </section>
        </div>
        <div class="footer-links">
          <a href="${root}pages/accessibility.html">Accessibility</a>
          <a href="${root}pages/about.html">About</a>
          <a href="${root}pages/contact.html">Contact us</a>
          <a href="${root}pages/submit.html">Submit a story or blog</a>
          <a href="${root}pages/terms.html">Terms of use</a>
          <a href="${root}pages/privacy.html">Privacy</a>
        </div>
        <p class="small">&copy; 2026 Pro Se Legal Desk. All rights reserved.</p>
      </div>
    </footer>`;
}

function initNewsletterForm() {
  const form = document.querySelector("[data-newsletter-form]");
  const message = document.querySelector("[data-newsletter-message]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const topic = String(data.get("topic") || "General updates").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      message.textContent = "Please enter a valid email address.";
      message.className = "form-message error";
      return;
    }

    saveList(NEWSLETTER_KEY, {
      createdAt: new Date().toISOString(),
      email,
      topic,
      source: getCurrentPage()
    });
    form.reset();
    message.textContent = "Thank you. You are subscribed to updates.";
    message.className = "form-message success";
  });
}

function initSubmissionForm() {
  const form = document.querySelector("[data-submission-form]");
  const message = document.querySelector("[data-submission-message]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const honeypot = String(data.get("company_website") || "").trim();
    const email = String(data.get("email") || "").trim();
    const title = String(data.get("title") || "").trim();
    const file = data.get("submission_file");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (honeypot) return;

    if (!title || !emailPattern.test(email)) {
      message.textContent = "Please add a title and a valid email address.";
      message.className = "form-message error";
      return;
    }

    if (!file || !file.name) {
      message.textContent = "Please attach a DOC, DOCX, or PDF file.";
      message.className = "form-message error";
      return;
    }

    if (!allowedTypes.includes(file.type) && !/\.(doc|docx|pdf)$/i.test(file.name)) {
      message.textContent = "Please upload a DOC, DOCX, or PDF file.";
      message.className = "form-message error";
      return;
    }

    saveList(SUBMISSIONS_KEY, {
      createdAt: new Date().toISOString(),
      name: String(data.get("name") || "").trim(),
      email,
      title,
      topic: String(data.get("topic") || "").trim(),
      summary: String(data.get("summary") || "").trim(),
      fileName: file.name,
      source: "submit"
    });
    form.reset();
    message.textContent = "Thank you. Your submission was received for review. You will be contacted if there are questions or next steps.";
    message.className = "form-message success";
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const message = document.querySelector("[data-contact-message]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const body = String(data.get("message") || "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email) || body.length < 10) {
      message.textContent = "Please enter a valid email address and a message.";
      message.className = "form-message error";
      return;
    }

    saveList("psld_contact_messages", {
      createdAt: new Date().toISOString(),
      name: String(data.get("name") || "").trim(),
      email,
      topic: String(data.get("topic") || "").trim(),
      message: body
    });
    form.reset();
    message.textContent = "Thank you. Your message was received.";
    message.className = "form-message success";
  });
}

function initCookieBanner() {
  const accepted = localStorage.getItem("psld_cookie_notice");
  if (accepted) return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <p><strong>Cookie notice:</strong> This site uses basic browser storage for form confirmations and preferences. It does not currently use advertising or analytics cookies.</p>
    <button class="btn" type="button">Accept</button>`;
  document.body.appendChild(banner);
  banner.querySelector("button").addEventListener("click", () => {
    localStorage.setItem("psld_cookie_notice", "accepted");
    banner.classList.add("hidden");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initNewsletterForm();
  initContactForm();
  initSubmissionForm();
  initCookieBanner();
});
