
"use strict";

// ===== 1. Sample job listings =====
// These are demonstration listings, NOT verified vacancies.

const jobs = [
  {
    id: 1,
    title: "IT Support Attachment",
    company: "Sample Technology Company",
    type: "Attachment",
    location: "Nairobi",
    description: "Gain practical experience in computer support, troubleshooting and networking.",
    skills: "IT computer networking troubleshooting",
    applyUrl: "https://www.google.com/search?q=Kenya+IT+support+attachment"
  },
  {
    id: 2,
    title: "Junior Web Developer Intern",
    company: "Example Digital Agency",
    type: "Internship",
    location: "Nairobi / Remote",
    description: "Learn web development while working with HTML, CSS and JavaScript.",
    skills: "HTML CSS JavaScript frontend web",
    applyUrl: "https://www.google.com/search?q=Kenya+web+developer+internship"
  },
  {
    id: 3,
    title: "Part-Time Graphic Designer",
    company: "Sample Creative Studio",
    type: "Part-time",
    location: "Thika",
    description: "Create posters, social media graphics and simple marketing designs.",
    skills: "graphic design logo posters Photoshop Canva",
    applyUrl: "https://www.google.com/search?q=Thika+part+time+graphic+designer"
  },
  {
    id: 4,
    title: "Graduate Trainee - ICT",
    company: "Example Business Solutions",
    type: "Entry-level",
    location: "Kiambu",
    description: "An example listing for candidates beginning their ICT careers.",
    skills: "ICT computer science support",
    applyUrl: "https://www.google.com/search?q=Kenya+ICT+graduate+trainee"
  },
  {
    id: 5,
    title: "Computer Repair Attachment",
    company: "Sample Computer Services",
    type: "Attachment",
    location: "Thika",
    description: "Practise hardware diagnosis, software installation and computer maintenance.",
    skills: "computer repair hardware software maintenance",
    applyUrl: "https://www.google.com/search?q=Thika+computer+repair+attachment"
  },
  {
    id: 6,
    title: "Digital Marketing Intern",
    company: "Example Media Company",
    type: "Internship",
    location: "Remote",
    description: "Learn content creation, social media management and online marketing.",
    skills: "marketing social media content writing",
    applyUrl: "https://www.google.com/search?q=Kenya+digital+marketing+internship"
  }
];

// ===== 2. Get HTML elements =====

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const jobList = document.getElementById("jobList");
const resultsCount = document.getElementById("resultsCount");
const emptyMessage = document.getElementById("emptyMessage");
const savedToggle = document.getElementById("savedToggle");
const year = document.getElementById("year");

let showingSavedOnly = false;

// ===== 3. Load saved jobs safely =====

function loadSavedJobs() {
  try {
    const stored = JSON.parse(
      localStorage.getItem("kaziConnectSavedJobs") || "[]"
    );

    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.filter(
      id => Number.isInteger(id) &&
        jobs.some(job => job.id === id)
    );
  } catch (error) {
    return [];
  }
}

let savedJobs = loadSavedJobs();

function storeSavedJobs() {
  try {
    localStorage.setItem(
      "kaziConnectSavedJobs",
      JSON.stringify(savedJobs)
    );
  } catch (error) {
    alert("Your browser could not save changes. Check browser storage settings.");
  }
}

// ===== 4. Create a job card =====

function createJobCard(job) {
  const card = document.createElement("article");
  card.className = "job-card";

  const badge = document.createElement("span");
  badge.className = "job-type";
  badge.textContent = job.type;

  const title = document.createElement("h3");
  title.textContent = job.title;

  const company = document.createElement("p");
  company.className = "company";
  company.textContent = job.company;

  const location = document.createElement("p");
  location.className = "job-location";
  location.textContent = "📍 " + job.location;

  const description = document.createElement("p");
  description.className = "job-description";
  description.textContent = job.description;

  const notice = document.createElement("p");
  notice.className = "sample-notice";
  notice.textContent = "DEMO LISTING — NOT A VERIFIED VACANCY";

  const bottom = document.createElement("div");
  bottom.className = "job-bottom";

  const applyLink = document.createElement("a");
  applyLink.href = job.applyUrl;
  applyLink.target = "_blank";
  applyLink.rel = "noopener noreferrer";
  applyLink.textContent = "Find opportunities ↗";

  const saveButton = document.createElement("button");
  saveButton.type = "button";

  const isSaved = savedJobs.includes(job.id);
  saveButton.className = isSaved ? "save-job saved" : "save-job";
  saveButton.textContent = isSaved ? "♥ Saved" : "♡ Save";
  saveButton.setAttribute(
    "aria-label",
    (isSaved ? "Remove saved job: " : "Save job: ") + job.title
  );

  saveButton.addEventListener("click", function () {
    if (savedJobs.includes(job.id)) {
      savedJobs = savedJobs.filter(id => id !== job.id);
    } else {
      savedJobs.push(job.id);
    }

    storeSavedJobs();
    renderJobs();
  });

  bottom.append(applyLink, saveButton);
  card.append(
    badge,
    title,
    company,
    location,
    description,
    notice,
    bottom
  );

  return card;
}

// ===== 5. Search and filter jobs =====

function renderJobs() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;

  const filteredJobs = jobs.filter(function (job) {
    const searchableText = [
      job.title,
      job.company,
      job.location,
      job.description,
      job.skills,
      job.type
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);

    const matchesType =
      selectedType === "all" || job.type === selectedType;

    const matchesSaved =
      !showingSavedOnly || savedJobs.includes(job.id);

    return matchesSearch && matchesType && matchesSaved;
  });

  jobList.replaceChildren();

  filteredJobs.forEach(function (job) {
    jobList.appendChild(createJobCard(job));
  });

  resultsCount.textContent =
    filteredJobs.length +
    (filteredJobs.length === 1 ? " opportunity shown" : " opportunities shown");

  emptyMessage.hidden = filteredJobs.length !== 0;

  savedToggle.textContent = showingSavedOnly
    ? "Show all jobs"
    : "Saved jobs (" + savedJobs.length + ")";
}

// ===== 6. Connect the search form =====

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  renderJobs();

  document.getElementById("jobs").scrollIntoView({
    behavior: "smooth"
  });
});

// Update results as the user types or changes the filter.
searchInput.addEventListener("input", renderJobs);
typeFilter.addEventListener("change", renderJobs);

// ===== 7. Category buttons =====

document.querySelectorAll(".category").forEach(function (button) {
  button.addEventListener("click", function () {
    typeFilter.value = button.dataset.type;
    showingSavedOnly = false;
    renderJobs();

    document.getElementById("jobs").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ===== 8. Show saved jobs =====

savedToggle.addEventListener("click", function () {
  showingSavedOnly = !showingSavedOnly;
  renderJobs();
});

// ===== 9. Set the current year =====

year.textContent = new Date().getFullYear();

// ===== 10. Display initial jobs =====

renderJobs();