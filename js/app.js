/** Main UI controller for Pro Se Legal Desk. */
function addDefaultJurisdictionsForAllStates() {
  Object.keys(stateInfoData).forEach(function(code) {
    var state = stateInfoData[code];

    if (!jurisdictionData.federal[code]) {
      jurisdictionData.federal[code] = {
        label: state.name,
        cities: {}
      };
    }
    if (!Object.keys(jurisdictionData.federal[code].cities).length) {
      jurisdictionData.federal[code].cities["Federal Court Resources"] = {
        court: "Federal court resources for " + state.name,
        links: [
          ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
          ["U.S. District Court Finder", "https://www.uscourts.gov/about-federal-courts/federal-courts-public/court-website-links"],
          ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"],
          ["PACER / CM-ECF", "https://pacer.uscourts.gov/"],
          [state.name + " Official Court Website", state.courtUrl]
        ]
      };
    }

    if (!jurisdictionData.state[code]) {
      jurisdictionData.state[code] = {
        label: state.name,
        cities: {}
      };
    }
    if (!Object.keys(jurisdictionData.state[code].cities).length) {
      jurisdictionData.state[code].cities["Statewide Court Resources"] = {
        court: state.courtSystem,
        links: [
          [state.name + " Official Court Website", state.courtUrl],
          ["Search " + state.name + " Civil Procedure Rules", "https://www.google.com/search?q=" + encodeURIComponent(state.name + " official civil procedure rules court")],
          ["Search " + state.name + " Court Forms", "https://www.google.com/search?q=" + encodeURIComponent(state.name + " official court forms civil")],
          ["Search " + state.name + " Filing Fees", "https://www.google.com/search?q=" + encodeURIComponent(state.name + " official court filing fees civil")]
        ]
      };
    }

    if (!jurisdictionData.local[code]) {
      jurisdictionData.local[code] = {
        label: state.name,
        cities: {}
      };
    }
    if (!Object.keys(jurisdictionData.local[code].cities).length) {
      jurisdictionData.local[code].cities["County / Local Court Resources"] = {
        court: "County or local court resources for " + state.name,
        links: [
          [state.name + " Official Court Website", state.courtUrl],
          ["Search County Court Rules", "https://www.google.com/search?q=" + encodeURIComponent(state.name + " county court local rules civil")],
          ["Search Local Court Forms", "https://www.google.com/search?q=" + encodeURIComponent(state.name + " local court civil forms")],
          ["Search Judge Standing Orders", "https://www.google.com/search?q=" + encodeURIComponent(state.name + " judge standing orders civil court")]
        ]
      };
    }
  });
}

function safeReadJson(key, fallback) {
  try {
    var stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn("Ignoring invalid saved data for", key, error);
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSavedSetup() {
  return safeReadJson("proSeCaseSetup", null);
}

function restoreCaseSetupForm() {
  var setup = getSavedSetup();
  if (!setup) return;

  document.getElementById("courtType").value = setup.courtTypeValue || "";
  loadJurisdictions();
  document.getElementById("state").value = setup.stateValue || "";
  loadCities();
  var citySelect = document.getElementById("city");
  if (setup.cityText !== "Not entered" && Array.prototype.some.call(citySelect.options, function(option) { return option.value === setup.cityText; })) {
    citySelect.value = setup.cityText;
  }
  loadCourtsAndRules();
  var courtSelect = document.getElementById("courtLocation");
  if (setup.courtText !== "Not entered" && Array.prototype.some.call(courtSelect.options, function(option) { return option.value === setup.courtText; })) {
    courtSelect.value = setup.courtText;
  }
  document.getElementById("caseStage").value = setup.stageText || "Pre-Filing";
  document.getElementById("dashboardFilingDate").value = setup.dashboardFilingDate || "";
}

function renderSavedCaseSummary() {
  var setup = getSavedSetup();
  var box = document.getElementById("caseSummary");
  if (!box) return;

  if (!setup) {
    box.innerHTML = "No setup saved yet.";
    return;
  }

  box.innerHTML =
    "<strong>Court Type:</strong> " + escapeHtml(setup.courtTypeText) + "<br>" +
    "<strong>State:</strong> " + escapeHtml(setup.stateText) + "<br>" +
    "<strong>City / County / Division:</strong> " + escapeHtml(setup.cityText) + "<br>" +
    "<strong>Court:</strong> " + escapeHtml(setup.courtText) + "<br>" +
    "<strong>Stage:</strong> " + escapeHtml(setup.stageText) + "<br>" +
    "<strong>Date Filed:</strong> " + escapeHtml(setup.dashboardFilingDate || "Not entered");
}

function requireCaseSetupSelection() {
  var requiredFields = [
    ["courtType", "Please select a court type."],
    ["state", "Please select a state."],
    ["city", "Please select a city, county, or division for the selected state."],
    ["courtLocation", "Please select a court."]
  ];

  for (var i = 0; i < requiredFields.length; i += 1) {
    var field = document.getElementById(requiredFields[i][0]);
    if (!field || !field.value) {
      alert(requiredFields[i][1]);
      if (field) field.focus();
      return false;
    }
  }

  return true;
}

function updateAllJurisdictionBoxes(setup) {
  if (!setup) setup = getSavedSetup();

  var boxIds = [
    "prefilingJurisdictionBox",
    "complaintJurisdictionBox",
    "filingJurisdictionBox",
    "courtAccessJurisdictionBox",
    "responseJurisdictionBox",
    "mtdJurisdictionBox",
    "calendarJurisdictionBox"
  ];

  boxIds.forEach(function(id) {
    var box = document.getElementById(id);
    if (!box) return;

    if (!setup || !setup.courtText || setup.courtText === "Not entered") {
      box.innerHTML = "Save your Case Setup on the Dashboard to show state-specific court information here.";
      return;
    }

    var html = "<h4>Selected Jurisdiction Carried Over from Dashboard</h4>" +
      "<p><strong>Court Type:</strong> " + escapeHtml(setup.courtTypeText) + "</p>" +
      "<p><strong>State:</strong> " + escapeHtml(setup.stateText) + "</p>" +
      "<p><strong>City / County / Division:</strong> " + escapeHtml(setup.cityText) + "</p>" +
      "<p><strong>Court:</strong> " + escapeHtml(setup.courtText) + "</p>";

    if (setup.selectedRules && setup.selectedRules.links) {
      html += "<h4>Rule / Court Links for This Selection</h4>";
      setup.selectedRules.links.forEach(function(link) {
        html += "<a class='resource-link' href='" + escapeHtml(link[1]) + "' target='_blank'>" + escapeHtml(link[0]) + "</a>";
      });
    }

    html += "<p class='small'>This is a planning workspace only. Users must verify current rules, filing requirements, standing orders, fees, service rules, and deadlines directly with the court.</p>";
    box.innerHTML = html;
  });
}

function updatePrefilingJurisdictionBox(setup) {
  updateAllJurisdictionBoxes(setup);
}

function getSavedCourtRuleLinks() {
  var setup = getSavedSetup();
  if (setup && setup.selectedRules && setup.selectedRules.links) {
    return setup.selectedRules.links;
  }
  return [];
}

function calculateDashboardDeadlines() {
  var box = document.getElementById("dashboardDeadlineSummary");
  var filingDateInput = document.getElementById("dashboardFilingDate");
  if (!box || !filingDateInput) return;

  var filingDate = filingDateInput.value;
  if (!filingDate) {
    box.innerHTML = "Enter a filing date in Case Setup and click Save Setup to see next-step reminders.";
    return;
  }

  if (!isValidDateValue(filingDate)) {
    box.innerHTML = "Enter a valid filing date in Case Setup and click Save Setup to see next-step reminders.";
    return;
  }

  var rules = getDashboardFilingRules();
  var html = "<h4>Suggested Next-Step Reminders from Filing Date</h4>";
  html += "<p><strong>Filing Date:</strong> " + filingDate + "</p>";
  html += "<table class='timeline-table'><thead><tr><th>Next Step</th><th>Suggested Date</th><th>Source</th><th>Business Rule</th></tr></thead><tbody>";

  rules.forEach(function(rule) {
    var dueDate = addDays(filingDate, rule.offsetDays);
    html += "<tr><td>" + rule.type + "</td><td>" + dueDate + "</td><td>" + (rule.confidence || "Rule-based estimate") + "</td><td>" + rule.notes + "</td></tr>";
  });

  html += "</tbody></table>";
  html += "<p class='small'>These are planning prompts, not legal advice. Defendant answer/response deadlines usually depend on service date, waiver date, court order, or local rule.</p>";
  html += "<button class='btn secondary' onclick='pushDashboardDeadlinesToCalendar()'>Add These to Calendar</button>";
  box.innerHTML = html;
}

function pushDashboardDeadlinesToCalendar() {
  var filingDateInput = document.getElementById("dashboardFilingDate");
  if (!filingDateInput || !filingDateInput.value) {
    alert("Please enter and save a filing date first.");
    return;
  }
  var email = document.getElementById("email").value.trim();
  if (!isValidDateValue(filingDateInput.value)) {
    alert("Please enter a valid filing date first.");
    filingDateInput.focus();
    return;
  }

  getDashboardFilingRules().forEach(function(rule) {
    createCalendarCard(rule.type, addDays(filingDateInput.value, rule.offsetDays), "3 days and 1 day before", rule.notes, email, "dashboard", {
      deadlineSource: rule.confidence || "Rule-based estimate"
    });
  });
  showPage("calendarPage", document.querySelector(".sidebar button[onclick*='calendarPage']"));
}

function openLogin() {
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("loginSection").scrollIntoView({ behavior: "smooth" });
}

function loginUser() {
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var email = emailInput.value.trim();
  var password = passwordInput.value.trim();

  if (!email || !emailInput.checkValidity()) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  if (!password) {
    alert("Please enter a password.");
    passwordInput.focus();
    return;
  }

  localStorage.setItem("proSeLoginEmail", email);
  document.getElementById("workspace").classList.remove("hidden");
  document.getElementById("workspace").scrollIntoView({ behavior: "smooth" });
}

function showPage(pageId, button) {
  var pages = document.querySelectorAll(".workspace-page");
  pages.forEach(function(page) {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  var buttons = document.querySelectorAll(".sidebar button");
  buttons.forEach(function(btn) {
    btn.classList.remove("active");
  });

  if (button) button.classList.add("active");

  updateAllJurisdictionBoxes();
  renderSavedCaseSummary();
}

function loadJurisdictions() {
  var courtType = document.getElementById("courtType").value;
  var stateSelect = document.getElementById("state");
  var citySelect = document.getElementById("city");
  var courtSelect = document.getElementById("courtLocation");

  stateSelect.innerHTML = "<option value=''>Select State</option>";
  citySelect.innerHTML = "<option value=''>Select City / County / Division</option>";
  courtSelect.innerHTML = "<option value=''>Select Court</option>";

  document.getElementById("ruleLinks").innerHTML = "Select a court type, state, and city/county to see rule links.";

  if (!courtType || !jurisdictionData[courtType]) return;

  Object.keys(jurisdictionData[courtType]).forEach(function(stateCode) {
    var label = jurisdictionData[courtType][stateCode].label;
    stateSelect.innerHTML += "<option value='" + stateCode + "'>" + label + "</option>";
  });
}

function loadCities() {
  var courtType = document.getElementById("courtType").value;
  var stateCode = document.getElementById("state").value;
  var citySelect = document.getElementById("city");
  var courtSelect = document.getElementById("courtLocation");

  citySelect.innerHTML = "<option value=''>Select City / County / Division</option>";
  courtSelect.innerHTML = "<option value=''>Select Court</option>";

  document.getElementById("ruleLinks").innerHTML = "Select a city/county to see rule links.";

  if (!courtType || !stateCode) return;

  var cityData = jurisdictionData[courtType][stateCode].cities;

  Object.keys(cityData).forEach(function(cityName) {
    citySelect.innerHTML += "<option value='" + cityName + "'>" + cityName + "</option>";
  });
}

function loadCourtsAndRules() {
  var courtType = document.getElementById("courtType").value;
  var stateCode = document.getElementById("state").value;
  var cityName = document.getElementById("city").value;
  var courtSelect = document.getElementById("courtLocation");

  courtSelect.innerHTML = "<option value=''>Select Court</option>";

  if (!courtType || !stateCode || !cityName) return;

  var selected = jurisdictionData[courtType][stateCode].cities[cityName];

  courtSelect.innerHTML += "<option value='" + selected.court + "' selected>" + selected.court + "</option>";

  showRuleLinks(selected, courtType, stateCode, cityName);
}

function showRuleLinks(selected, courtType, stateCode, cityName) {
  var html = "";

  html += "<h4>Selected Jurisdiction</h4>";
  html += "<p><strong>Level:</strong> " + courtType.toUpperCase() + "</p>";
  html += "<p><strong>State:</strong> " + stateCode + "</p>";
  html += "<p><strong>City / County / Division:</strong> " + cityName + "</p>";
  html += "<p><strong>Court:</strong> " + selected.court + "</p>";

  html += "<h4>Rule Links</h4>";

  selected.links.forEach(function(link) {
    html += "<a class='resource-link' href='" + link[1] + "' target='_blank'>" + link[0] + "</a>";
  });

  html += "<p class='small'>Always verify rules, standing orders, judge-specific procedures, filing fees, and deadlines directly with the court before filing.</p>";

  document.getElementById("ruleLinks").innerHTML = html;
}

function getSelectedCaseSetup() {
  var courtTypeValue = document.getElementById("courtType").value;
  var stateValue = document.getElementById("state").value;
  var cityValue = document.getElementById("city").value;
  var courtValue = document.getElementById("courtLocation").value;
  var stageValue = document.getElementById("caseStage").value;
  var dashboardFilingDateValue = document.getElementById("dashboardFilingDate") ? document.getElementById("dashboardFilingDate").value : "";

  var courtTypeText = courtTypeValue ? document.getElementById("courtType").options[document.getElementById("courtType").selectedIndex].text : "Not entered";
  var stateText = stateValue ? document.getElementById("state").options[document.getElementById("state").selectedIndex].text : "Not entered";
  var cityText = cityValue || "Not entered";
  var courtText = courtValue || "Not entered";

  var selectedRules = null;
  if (courtTypeValue && stateValue && cityValue && jurisdictionData[courtTypeValue] && jurisdictionData[courtTypeValue][stateValue]) {
    selectedRules = jurisdictionData[courtTypeValue][stateValue].cities[cityValue] || null;
  }

  return {
    courtTypeValue: courtTypeValue,
    courtTypeText: courtTypeText,
    stateValue: stateValue,
    stateText: stateText,
    cityText: cityText,
    courtText: courtText,
    stageText: stageValue,
    dashboardFilingDate: dashboardFilingDateValue,
    selectedRules: selectedRules
  };
}

function saveCaseSetup() {
  if (!requireCaseSetupSelection()) return;

  var setup = getSelectedCaseSetup();

  if (setup.dashboardFilingDate && !isValidDateValue(setup.dashboardFilingDate)) {
    alert("Please enter a valid filing date or leave the field blank.");
    document.getElementById("dashboardFilingDate").focus();
    return;
  }

  saveJson("proSeCaseSetup", {
    courtTypeValue: setup.courtTypeValue,
    courtTypeText: setup.courtTypeText,
    stateValue: setup.stateValue,
    stateText: setup.stateText,
    cityText: setup.cityText,
    courtText: setup.courtText,
    stageText: setup.stageText,
    dashboardFilingDate: setup.dashboardFilingDate,
    selectedRules: setup.selectedRules
  });

  renderSavedCaseSummary();
  updateAllJurisdictionBoxes(setup);
  calculateDashboardDeadlines();
  rerenderCalendarEvents();
  alert("Case setup saved. Your state/court details now carry over to the workspace tabs and calendar.");
}

function getResources(eventType) {
  var resources = {
    "Pre-Filing Review": [
      ["FRCP 8", "https://www.law.cornell.edu/rules/frcp/rule_8"],
      ["FRCP 10", "https://www.law.cornell.edu/rules/frcp/rule_10"],
      ["FRCP 11", "https://www.law.cornell.edu/rules/frcp/rule_11"],
      ["Local Civil Rules Example", "https://www.txnd.uscourts.gov/local-civil-rules"]
    ],
    "Complaint Draft Review": [
      ["FRCP 8", "https://www.law.cornell.edu/rules/frcp/rule_8"],
      ["FRCP 10", "https://www.law.cornell.edu/rules/frcp/rule_10"],
      ["FRCP 11", "https://www.law.cornell.edu/rules/frcp/rule_11"]
    ],
    "Filing Packet Review": [
      ["Civil Cover Sheet", "https://www.uscourts.gov/forms-rules/forms/civil-forms"],
      ["Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"],
      ["N.D. Texas Civil Rules", "https://www.txnd.uscourts.gov/civil-rules"]
    ],
    "Post-Filing Setup": [
      ["PACER", "https://pacer.uscourts.gov/"],
      ["U.S. Courts CM/ECF", "https://www.uscourts.gov/court-records/electronic-filing-cmecf"],
      ["U.S. Court Website Links", "https://www.uscourts.gov/about-federal-courts/federal-courts-public/court-website-links"]
    ],
    "Docket Monitoring Check": [
      ["PACER", "https://pacer.uscourts.gov/"],
      ["U.S. Courts Electronic Filing", "https://www.uscourts.gov/court-records/electronic-filing-cmecf"]
    ],
    "Court Order Review": [
      ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
      ["U.S. Court Website Links", "https://www.uscourts.gov/about-federal-courts/federal-courts-public/court-website-links"]
    ],
    "Service of Process": [
      ["FRCP 4", "https://www.law.cornell.edu/rules/frcp/rule_4"],
      ["Waiver of Service Form", "https://www.uscourts.gov/forms-rules/forms/notice-lawsuit-summons-subpoena/waiver-service-summons"]
    ],
    "Service Deadline": [
      ["FRCP 4", "https://www.law.cornell.edu/rules/frcp/rule_4"],
      ["Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
    ],
    "Defendant Response Deadline": [
      ["FRCP 12", "https://www.law.cornell.edu/rules/frcp/rule_12"]
    ],
    "Waiver Response Deadline": [
      ["FRCP 4", "https://www.law.cornell.edu/rules/frcp/rule_4"],
      ["FRCP 12", "https://www.law.cornell.edu/rules/frcp/rule_12"]
    ],
    "Motion Response Deadline": [
      ["FRCP 7", "https://www.law.cornell.edu/rules/frcp/rule_7"],
      ["FRCP 12", "https://www.law.cornell.edu/rules/frcp/rule_12"],
      ["FRCP 15", "https://www.law.cornell.edu/rules/frcp/rule_15"]
    ],
    "Motion Reply Deadline": [
      ["FRCP 7", "https://www.law.cornell.edu/rules/frcp/rule_7"],
      ["FRCP 12", "https://www.law.cornell.edu/rules/frcp/rule_12"],
      ["FRCP 15", "https://www.law.cornell.edu/rules/frcp/rule_15"]
    ],
    "Motion Response Review": [
      ["FRCP 7", "https://www.law.cornell.edu/rules/frcp/rule_7"],
      ["FRCP 12", "https://www.law.cornell.edu/rules/frcp/rule_12"],
      ["FRCP 15", "https://www.law.cornell.edu/rules/frcp/rule_15"]
    ],
    "Scheduling Order Deadline": [
      ["FRCP 16", "https://www.law.cornell.edu/rules/frcp/rule_16"]
    ],
    "Initial Disclosures": [
      ["FRCP 26", "https://www.law.cornell.edu/rules/frcp/rule_26"]
    ],
    "Discovery Cutoff": [
      ["FRCP 26", "https://www.law.cornell.edu/rules/frcp/rule_26"],
      ["FRCP 33", "https://www.law.cornell.edu/rules/frcp/rule_33"],
      ["FRCP 34", "https://www.law.cornell.edu/rules/frcp/rule_34"]
    ],
    "Hearing": [
      ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"]
    ],
    "Trial": [
      ["FRCP 38", "https://www.law.cornell.edu/rules/frcp/rule_38"],
      ["FRCP 50", "https://www.law.cornell.edu/rules/frcp/rule_50"],
      ["FRCP 51", "https://www.law.cornell.edu/rules/frcp/rule_51"]
    ]
  };

  return resources[eventType] || [];
}

function getChecklist(eventType) {
  var lists = {
    "Pre-Filing Review": ["Review FRCP 8", "Review FRCP 10", "Review FRCP 11", "Find local rules", "Find court forms", "Confirm filing requirements"],
    "Complaint Draft Review": ["Check caption", "Add parties", "Add jurisdiction", "Add venue", "Use numbered factual allegations", "Separate causes of action", "Add requested relief", "Add signature block"],
    "Filing Packet Review": ["Complaint", "Civil cover sheet", "Summons for each defendant", "Filing fee or IFP application", "Copies required by court", "Certificate of interested persons if required"],
    "Post-Filing Setup": ["Save filed complaint", "Save case number", "Confirm summons status", "Set up docket access", "Save judge assignment", "Review notices or orders"],
    "Docket Monitoring Check": ["Check docket", "Save new entries", "Review orders/notices", "Update calendar", "Check summons/service status"],
    "Court Order Review": ["Read order carefully", "Extract deadlines", "Calendar deadlines", "Check judge procedures", "Save copy"],
    "Service of Process": ["Confirm summons issued", "Select service method", "Track service attempt", "Save proof of service", "File proof if required", "Calendar response deadline"],
    "Service Deadline": ["Confirm service deadline", "Check summons status", "Confirm service method", "Save proof of service", "File proof if required"],
    "Defendant Response Deadline": ["Calendar due date", "Check docket", "Save answer or motion", "Identify next procedural step"],
    "Waiver Response Deadline": ["Confirm waiver was requested", "Track waiver return", "Calendar response date", "Check docket", "Verify applicable rule"],
    "Motion Response Deadline": ["Save motion", "Calendar response deadline", "Review applicable rules", "Check local formatting requirements", "Track hearing date"],
    "Motion Reply Deadline": ["Check if reply is allowed", "Verify deadline", "Review local rules", "Track hearing date", "Save all filings"],
    "Motion Response Review": ["Save motion", "Review local rule", "Check judge procedures", "Track response deadline", "Track hearing date"],
    "Scheduling Order Deadline": ["Upload order", "Extract all deadlines", "Calendar amendment deadline", "Calendar discovery cutoff", "Calendar motion deadline"],
    "Initial Disclosures": ["Calendar due date", "Review disclosure categories", "Organize names", "Organize documents", "Track service"],
    "Discovery Cutoff": ["Track written discovery", "Track productions", "Track depositions", "Calendar cutoff", "Review open items"],
    "Hearing": ["Calendar hearing", "Save notice", "Review judge procedures", "Prepare documents"],
    "Trial": ["Calendar trial date", "Review pretrial order", "Review jury instructions", "Organize exhibits"]
  };

  return lists[eventType] || ["Review applicable rules", "Calendar deadline", "Save related documents"];
}

function parseDateInput(value) {
  if (!value) return null;
  var parts = value.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDate(dateObj) {
  if (!dateObj) return "";
  var yyyy = dateObj.getFullYear();
  var mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  var dd = String(dateObj.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

function addDays(dateValue, days) {
  var dateObj = typeof dateValue === "string" ? parseDateInput(dateValue) : new Date(dateValue.getTime());
  if (!dateObj || Number.isNaN(dateObj.getTime())) return "";
  dateObj.setDate(dateObj.getDate() + days);
  return formatDate(dateObj);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, function(character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
  });
}

function isValidDateValue(value) {
  var date = parseDateInput(value);
  return Boolean(value && date && !Number.isNaN(date.getTime()));
}

function persistCalendarEvents() {
  var events = Array.prototype.slice.call(document.querySelectorAll("#calendarList .calendar-item")).map(function(item) {
    return item.dataset.event ? JSON.parse(item.dataset.event) : null;
  }).filter(Boolean);
  saveJson("proSeCalendarEvents", events);
}

function rerenderCalendarEvents() {
  var list = document.getElementById("calendarList");
  if (!list) return;

  var events = safeReadJson("proSeCalendarEvents", []);
  if (typeof list.replaceChildren === "function") {
    list.replaceChildren();
  } else {
    list.innerHTML = "";
  }
  events.forEach(function(event) {
    createCalendarCard(event.type, event.date, event.alertTime, event.notes, event.email, event.sourcePage, {
      deadlineSource: event.deadlineSource,
      skipAlertSchedule: true,
      skipPersist: true
    });
  });
}

function restoreCalendarEvents() {
  safeReadJson("proSeCalendarEvents", []).forEach(function(event) {
    createCalendarCard(event.type, event.date, event.alertTime, event.notes, event.email, event.sourcePage, {
      deadlineSource: event.deadlineSource,
      skipAlertSchedule: true
    });
  });
}

function persistProcessFields() {
  var fields = {};
  document.querySelectorAll("input[type='date'], input[type='email']").forEach(function(input) {
    if (input.id) fields[input.id] = input.value;
  });
  saveJson("proSeProcessFields", fields);
}

function restoreProcessFields() {
  var fields = safeReadJson("proSeProcessFields", {});
  Object.keys(fields).forEach(function(id) {
    var input = document.getElementById(id);
    if (input && !input.value) input.value = fields[id];
  });
  var savedEmail = localStorage.getItem("proSeLoginEmail");
  if (savedEmail && document.getElementById("email")) document.getElementById("email").value = savedEmail;
}

function getProcessEmail(pageKey) {
  var processEmail = document.getElementById(pageKey + "Email");
  var loginEmail = document.getElementById("email");
  return (processEmail && processEmail.value.trim()) || (loginEmail && loginEmail.value.trim()) || "";
}

function copyLoginEmailToProcess(pageKey) {
  var loginEmail = document.getElementById("email");
  var processEmail = document.getElementById(pageKey + "Email");
  if (loginEmail && processEmail) {
    processEmail.value = loginEmail.value.trim();
  }
}

function calculateProcessDeadlines(pageKey) {
  var dateInput = document.getElementById(pageKey + "Date");
  var timelineBox = document.getElementById(pageKey + "Timeline");
  var rules = getDeadlineRules(pageKey);

  if (!dateInput || !timelineBox || !rules) return;

  var sourceDate = dateInput.value;
  if (!isValidDateValue(sourceDate)) {
    alert("Please enter a valid date first.");
    dateInput.focus();
    return;
  }
  persistProcessFields();

  var email = getProcessEmail(pageKey);
  var html = "<h4>Calculated Timeline</h4>";
  html += "<p><strong>Source Date:</strong> " + sourceDate + "</p>";
  html += "<table class='timeline-table'><thead><tr><th>Event</th><th>Due Date</th><th>Source</th><th>Email Alerts</th></tr></thead><tbody>";

  rules.events.forEach(function(rule) {
    var dueDate = addDays(sourceDate, rule.offsetDays);
    html += "<tr><td>" + rule.type + "</td><td>" + dueDate + "</td><td>" + (rule.confidence || "Rule-based estimate") + "</td><td>3 days before<br>1 day before</td></tr>";
    createCalendarCard(rule.type, dueDate, "3 days and 1 day before", rule.notes, email, pageKey, {
      deadlineSource: rule.confidence || "Rule-based estimate"
    });
  });

  html += "</tbody></table>";
  html += "<p class='small'>These are automated planning reminders only. Verify every deadline against the applicable rules, local rules, judge procedures, and court orders.</p>";

  timelineBox.innerHTML = html;
  showPage("calendarPage", document.querySelector(".sidebar button[onclick*='calendarPage']"));
  document.getElementById("calendarPage").scrollIntoView({ behavior: "smooth" });
}

function addCalendarEvent() {
  var type = document.getElementById("eventType").value;
  var date = document.getElementById("eventDate").value;
  var alertTime = document.getElementById("alertTime").value;
  var deadlineSource = document.getElementById("deadlineSource").value;
  var notes = document.getElementById("eventNotes").value.trim();
  var email = document.getElementById("email").value.trim();

  if (!isValidDateValue(date)) {
    alert("Please enter a valid due date.");
    document.getElementById("eventDate").focus();
    return;
  }

  createCalendarCard(type, date, alertTime, notes, email, "manual", {
    deadlineSource: deadlineSource
  });
  document.getElementById("eventDate").value = "";
  document.getElementById("eventNotes").value = "";
}

function quickAddEvent(type, notes) {
  showPage("calendarPage", document.querySelector(".sidebar button[onclick*='calendarPage']"));
  document.getElementById("eventType").value = type;
  document.getElementById("eventNotes").value = notes;
  document.getElementById("calendarPage").scrollIntoView({ behavior: "smooth" });
}

function createCalendarCard(type, date, alertTime, notes, email, sourcePage, options) {
  options = options || {};
  var deadlineSource = options.deadlineSource || "Planning reminder";
  var duplicate = Array.prototype.some.call(document.querySelectorAll("#calendarList .calendar-item"), function(item) {
    if (!item.dataset.event) return false;
    try {
      var event = JSON.parse(item.dataset.event);
      return event.type === type && event.date === date && event.sourcePage === sourcePage;
    } catch (error) {
      return false;
    }
  });

  if (duplicate) return;

  var resources = getResources(type);
  var checklist = getChecklist(type);
  var alertDates = date ? [addDays(date, -3), addDays(date, -1)] : [];

  var resourceHtml = "";
  resources.forEach(function(item) {
    resourceHtml += "<a class='resource-link' href='" + item[1] + "' target='_blank'>" + item[0] + "</a>";
  });

  getSavedCourtRuleLinks().forEach(function(item) {
    resourceHtml += "<a class='resource-link' href='" + item[1] + "' target='_blank'>Selected court: " + item[0] + "</a>";
  });

  var checklistHtml = "<ul>";
  checklist.forEach(function(item) {
    checklistHtml += "<li><input type='checkbox' style='width:auto;'> " + item + "</li>";
  });
  checklistHtml += "</ul>";

  var alertHtml = "";
  if (alertDates.length) {
    alertHtml = "<span class='badge'>Email alert: " + alertDates[0] + "</span>" +
                "<span class='badge'>Email alert: " + alertDates[1] + "</span>";
  }

  var div = document.createElement("div");
  div.className = "calendar-item";
  div.dataset.event = JSON.stringify({ type: type, date: date, alertTime: alertTime, notes: notes, email: email, sourcePage: sourcePage, deadlineSource: deadlineSource });
  div.innerHTML =
    "<div class='calendar-card-header'>" +
      "<div><h4>" + escapeHtml(type) + "</h4><p class='small'>Procedural planning item</p></div>" +
      "<span class='badge confidence'>" + escapeHtml(deadlineSource) + "</span>" +
    "</div>" +
    "<div class='calendar-meta'>" +
      "<span class='badge'>Due: " + escapeHtml(date || "Add date") + "</span>" +
      "<span class='badge'>Reminder: " + escapeHtml(alertTime || "3 days and 1 day before") + "</span>" +
      alertHtml +
      (sourcePage ? "<span class='badge'>Source: " + escapeHtml(sourcePage) + "</span>" : "") +
    "</div>" +
    "<div class='calendar-card-body'>" +
      "<div><h4>Linked Resources</h4>" + (resourceHtml || "<p class='small'>No linked resources for this item yet.</p>") + "</div>" +
      "<div><h4>Checklist</h4>" + checklistHtml + "</div>" +
    "</div>" +
    (notes ? "<h4>Procedural Notes</h4><p>" + escapeHtml(notes) + "</p>" : "") +
    "<button class='btn secondary compact-action' onclick='removeCalendarEvent(this)'>Remove</button>";

  document.getElementById("calendarList").appendChild(div);
  if (!options.skipAlertSchedule) scheduleEmailAlerts(type, date, notes, email, sourcePage);
  if (!options.skipPersist) persistCalendarEvents();
}

function removeCalendarEvent(button) {
  button.parentElement.remove();
  persistCalendarEvents();
}

function scheduleEmailAlerts(type, date, notes, email, sourcePage) {
  if (!date) return;

  var queue = safeReadJson("proSeEmailAlertQueue", []);
  var alertDates = [addDays(date, -3), addDays(date, -1)];

  alertDates.forEach(function(alertDate, index) {
    queue.push({
      to: email || "No email entered",
      subject: "Pro Se Legal Desk Reminder: " + type,
      eventType: type,
      dueDate: date,
      alertDate: alertDate,
      daysBefore: index === 0 ? 3 : 1,
      notes: notes || "",
      sourcePage: sourcePage || "calendar"
    });
  });

  saveJson("proSeEmailAlertQueue", queue);
  renderEmailAlertQueue();
}

function renderEmailAlertQueue() {
  var box = document.getElementById("emailAlertQueue");
  if (!box) return;

  var queue = safeReadJson("proSeEmailAlertQueue", []);
  if (!queue.length) {
    box.innerHTML = "No email alerts scheduled yet.";
    return;
  }

  var html = "";
  queue.slice(-12).reverse().forEach(function(item) {
    html += "<div class='alert-queue-item'>" +
      "<strong>" + item.eventType + "</strong><br>" +
      "Send to: " + item.to + "<br>" +
      "Alert date: " + item.alertDate + " (" + item.daysBefore + " day(s) before)<br>" +
      "Deadline: " + item.dueDate +
      "</div>";
  });

  html += "<button class='btn secondary' onclick='clearEmailAlertQueue()'>Clear Alert Queue</button>";
  box.innerHTML = html;
}

function clearEmailAlertQueue() {
  localStorage.removeItem("proSeEmailAlertQueue");
  renderEmailAlertQueue();
}

function persistBlogSubmissions() {
  var drafts = Array.prototype.slice.call(document.querySelectorAll("#blogSubmissions .blog-post")).map(function(post) {
    return post.dataset.submission ? JSON.parse(post.dataset.submission) : null;
  }).filter(Boolean);
  saveJson("proSeBlogSubmissions", drafts);
}

function restoreBlogSubmissions() {
  safeReadJson("proSeBlogSubmissions", []).forEach(function(draft) {
    renderBlogSubmission(draft.title, draft.author, draft.body);
  });
}

function renderBlogSubmission(title, author, body) {
  var div = document.createElement("div");
  div.className = "blog-post";
  div.dataset.submission = JSON.stringify({ title: title, author: author, body: body });
  div.innerHTML =
    "<h4>" + escapeHtml(title) + "</h4>" +
    "<p><strong>Submitted by:</strong> " + escapeHtml(author || "Anonymous") + "</p>" +
    "<p>" + escapeHtml(body) + "</p>" +
    "<span class='badge'>Pending Review</span>";
  document.getElementById("blogSubmissions").appendChild(div);
}

function submitBlog() {
  var title = document.getElementById("blogTitle").value.trim();
  var author = document.getElementById("blogAuthor").value.trim();
  var body = document.getElementById("blogBody").value.trim();

  if (!title || !body) {
    alert("Please enter a title and submission.");
    return;
  }

  renderBlogSubmission(title, author, body);
  persistBlogSubmissions();

  document.getElementById("blogTitle").value = "";
  document.getElementById("blogAuthor").value = "";
  document.getElementById("blogBody").value = "";
}

function persistMemorialNames() {
  var names = Array.prototype.slice.call(document.querySelectorAll("#nameList div")).map(function(item) {
    return item.textContent;
  });
  saveJson("proSeMemorialNames", names);
}

function restoreMemorialNames() {
  var names = safeReadJson("proSeMemorialNames", []);
  if (!names.length) return;
  var list = document.getElementById("nameList");
  list.innerHTML = "";
  names.forEach(function(name) {
    var div = document.createElement("div");
    div.textContent = name;
    list.appendChild(div);
  });
}

function addMemorialName() {
  var name = document.getElementById("memorialName").value.trim();
  var birthDate = document.getElementById("birthDate").value;
  var deathDate = document.getElementById("deathDate").value;
  var showDates = document.getElementById("showDates").checked;

  if (!name) return;

  var display = name;

  if (showDates) {
    var birthYear = birthDate ? new Date(birthDate).getFullYear() : "";
    var deathYear = deathDate ? new Date(deathDate).getFullYear() : "";
    display += " " + birthYear + "–" + deathYear;
  }

  var div = document.createElement("div");
  div.textContent = display;
  document.getElementById("nameList").appendChild(div);

  document.getElementById("memorialName").value = "";
  document.getElementById("birthDate").value = "";
  document.getElementById("deathDate").value = "";
  document.getElementById("showDates").checked = false;
  document.getElementById("anniversaryEmail").checked = false;
  persistMemorialNames();
}


// Existing markup uses inline handlers, so expose these functions before startup
// work runs. That keeps the main buttons usable even if saved data is bad.
Object.assign(window, {
  addCalendarEvent,
  addMemorialName,
  calculateProcessDeadlines,
  clearEmailAlertQueue,
  copyLoginEmailToProcess,
  loadCities,
  loadCourtsAndRules,
  loadJurisdictions,
  loginUser,
  openLogin,
  pushDashboardDeadlinesToCalendar,
  quickAddEvent,
  removeCalendarEvent,
  saveCaseSetup,
  showPage,
  submitBlog
});

function initializeApp() {
  addDefaultJurisdictionsForAllStates();
  restoreCaseSetupForm();
  restoreProcessFields();
  restoreCalendarEvents();
  restoreBlogSubmissions();
  restoreMemorialNames();
  updateAllJurisdictionBoxes();
  renderSavedCaseSummary();
  calculateDashboardDeadlines();
  renderEmailAlertQueue();
  document.addEventListener("input", function(event) {
    if (event.target && event.target.id) persistProcessFields();
  });
}

try {
  initializeApp();
} catch (error) {
  console.error("Pro Se Legal Desk startup failed:", error);
  alert("Some saved data could not be loaded. The account form is still available, and you can continue using the workspace.");
}
