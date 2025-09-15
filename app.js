// ---- Demo dataset ----
const COURSES = [
  { dept:"INFO", number:"320", title:"Business Application Development", credits:3, prereqs:"INFO 202", modality:"In-Person", max:35, instructor:"Nguyen" },
  { dept:"INFO", number:"350", title:"Data Communications", credits:3, prereqs:"INFO 202", modality:"Hybrid", max:30, instructor:"Patel" },
  { dept:"SCMA", number:"320", title:"Production and Operations Management", credits:3, prereqs:"None", modality:"In-Person", max:45, instructor:"Smith" },
  { dept:"MATH", number:"200", title:"Calculus I", credits:4, prereqs:"Placement", modality:"Online", max:120, instructor:"Allen" },
  { dept:"STAT", number:"210", title:"Statistics I", credits:3, prereqs:"MATH 131", modality:"Hybrid", max:60, instructor:"Chen" },
  { dept:"BUSN", number:"225", title:"Foundations of Business", credits:3, prereqs:"None", modality:"In-Person", max:200, instructor:"Garcia" },
  { dept:"INFO", number:"360", title:"Systems Analysis & Design", credits:3, prereqs:"INFO 320", modality:"Hybrid", max:35, instructor:"Lopez" },
  { dept:"BUSN", number:"212", title:"Business Problem Solving & Analytics", credits:3, prereqs:"MATH 131", modality:"Online", max:50, instructor:"Khan" }
];

// ---- Helpers ----
const $ = (sel, root=document) => root.querySelector(sel);

// Renders table rows + actions; wires click to save selected session
function renderRows(rows){
  const tbody = $("#resultsTable tbody");
  const COLS = 7; // Change to 6 if you do NOT have the Actions column in your HTML

  if (!rows || rows.length === 0){
    tbody.innerHTML = `<tr><td colspan="${COLS}" class="small">No courses match your filters.</td></tr>`;
    $("#resultCount").textContent = 0;
    return;
  }

  tbody.innerHTML = rows.map(r => {
    const sessionId = `${r.dept}-${r.number}`; // demo session id (swap for real CRN later)
    return `
      <tr>
        <td>${r.dept} ${r.number}</td>
        <td>${r.title}</td>
        <td>${r.credits}</td>
        <td>${r.prereqs}</td>
        <td>${r.modality}</td>
        <td>${r.max}</td>
        <td>
          <a class="btn roster-link"
             href="session-enrollment.html?session=${encodeURIComponent(sessionId)}"
             data-dept="${r.dept}" data-number="${r.number}" data-title="${r.title}">
             View Roster
          </a>
        </td>
      </tr>`;
  }).join("");

  // Save selection when a roster link is clicked (used by session-enrollment.html)
  tbody.querySelectorAll(".roster-link").forEach(a => {
    a.addEventListener("click", () => {
      try {
        localStorage.setItem("selectedSession", JSON.stringify({
          dept: a.dataset.dept,
          number: a.dataset.number,
          title: a.dataset.title
        }));
      } catch (e) { /* no-op if storage blocked */ }
    });
  });

  $("#resultCount").textContent = rows.length;
}

function applyFilters(){
  const dept = $("#department").value.trim().toUpperCase();
  const instr = $("#instructor").value.trim().toLowerCase();
  const num = $("#courseNumber").value.trim();
  const modality = $("#modality").value.trim();

  const filtered = COURSES.filter(c => {
    if (dept && c.dept !== dept) return false;
    if (instr && !c.instructor.toLowerCase().includes(instr)) return false;
    if (num && !c.number.startsWith(num)) return false;
    if (modality && c.modality !== modality)
