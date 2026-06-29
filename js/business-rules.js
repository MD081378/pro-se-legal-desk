/** Reusable procedural reminder rules. These are planning prompts, not legal advice. */
var deadlineBusinessRules = {
  dashboardFiling: {
    sourceLabel: "Dashboard Filing Date",
    events: [
      { type: "Post-Filing Setup", offsetDays: 1, notes: "Save filed complaint, case number, receipt, summons status, and docket access details." },
      { type: "Docket Monitoring Check", offsetDays: 3, notes: "Check for summons issuance, clerk notices, deficiency notices, judge assignment, and orders." },
      { type: "Court Order Review", offsetDays: 5, notes: "Look for standing orders, judge-specific procedures, deficiency notices, referral orders, and local scheduling requirements." },
      { type: "Service of Process", offsetDays: 7, notes: "Confirm service plan, summons status, addresses, and proof-of-service requirements." },
      { type: "Docket Monitoring Check", offsetDays: 14, notes: "Check whether proof of service, summons returns, notices, orders, or appearance activity has been filed." },
      { type: "Service of Process", offsetDays: 30, notes: "Verify service attempts and decide whether any additional service action, alias summons, or court guidance is needed." },
      { type: "Service Deadline", offsetDays: 60, notes: "Midpoint service review. Confirm the applicable service deadline and document all attempts." },
      { type: "Service Deadline", offsetDays: 75, notes: "Early warning before the federal 90-day service period example; verify the applicable rule and court order." },
      { type: "Service Deadline", offsetDays: 90, notes: "Federal FRCP 4(m) service-period example. State/local deadlines may differ and must be verified." },
      { type: "Court Order Review", offsetDays: 95, notes: "If service has not been completed, review whether a court order, extension request, or corrective filing may be required." }
    ]
  },
  prefiling: {
    sourceLabel: "Pre-Filing Start Date",
    events: [
      { type: "Pre-Filing Review", offsetDays: 0, notes: "Review court selection, jurisdiction, venue, FRCP 8, FRCP 10, FRCP 11, local rules, forms, fees, and service requirements." },
      { type: "Court Order Review", offsetDays: 2, notes: "Check judge, court, and clerk pages for standing orders, pro se instructions, local forms, and filing procedures." },
      { type: "Complaint Draft Review", offsetDays: 5, notes: "Build a complaint outline with caption, parties, jurisdiction, venue, numbered allegations, claims, relief, and signature block." },
      { type: "Complaint Draft Review", offsetDays: 7, notes: "Begin or review complaint structure, parties, jurisdiction, venue, numbered allegations, claims, relief, and signature block." },
      { type: "Filing Packet Review", offsetDays: 10, notes: "Collect civil cover sheet, summons forms, fee/IFP materials, copies, certificates, and any required local forms." },
      { type: "Pre-Filing Review", offsetDays: 12, notes: "Perform a final rule check for venue, filing method, signature requirements, exhibits, certificates, and local formatting." },
      { type: "Filing Packet Review", offsetDays: 14, notes: "Start gathering summons, civil cover sheet, fee/IFP materials, copies, and court-specific forms." }
    ]
  },
  complaint: {
    sourceLabel: "Complaint Draft Start Date",
    events: [
      { type: "Complaint Draft Review", offsetDays: 2, notes: "Check whether jurisdiction, venue, parties, standing, and requested relief are clearly separated." },
      { type: "Pre-Filing Review", offsetDays: 3, notes: "Double-check local rules, standing orders, court forms, and filing method before finalizing the complaint." },
      { type: "Complaint Draft Review", offsetDays: 7, notes: "Review caption, parties, jurisdiction, venue, numbered allegations, causes of action, relief, and signature block." },
      { type: "Complaint Draft Review", offsetDays: 10, notes: "Check pleading organization, numbered paragraphs, exhibit labels, signature block, and certificate requirements." },
      { type: "Filing Packet Review", offsetDays: 14, notes: "Prepare filing packet and check court-specific formatting, forms, fees, and copy requirements." },
      { type: "Filing Packet Review", offsetDays: 21, notes: "Final pre-filing packet review: complaint, summons, civil cover sheet, fee/IFP, copies, envelopes, and local forms." }
    ]
  },
  filing: {
    sourceLabel: "Complaint Filing Date",
    events: [
      { type: "Post-Filing Setup", offsetDays: 1, notes: "Save case number, filed complaint, filing receipt, summons status, docket access, and service plan." },
      { type: "Docket Monitoring Check", offsetDays: 3, notes: "Check docket for clerk notices, assigned judge, orders, deficiency notices, or summons issuance." },
      { type: "Court Order Review", offsetDays: 5, notes: "Review any standing orders, deficiency notices, judge procedures, and clerk instructions issued after filing." },
      { type: "Service of Process", offsetDays: 7, notes: "Confirm service method, summons issuance, addresses, and proof-of-service requirements." },
      { type: "Docket Monitoring Check", offsetDays: 14, notes: "Check docket for summons returns, notices, appearance activity, orders, or service-related filings." },
      { type: "Service of Process", offsetDays: 30, notes: "Review service progress and decide whether additional attempts, corrected addresses, or alias summons are needed." },
      { type: "Service Deadline", offsetDays: 60, notes: "Midpoint service audit. Confirm deadline, document attempts, and identify any obstacle before the deadline approaches." },
      { type: "Service Deadline", offsetDays: 75, notes: "Early reminder before the federal 90-day service-period example. Verify the current rule/order." },
      { type: "Service Deadline", offsetDays: 90, notes: "Federal FRCP 4(m) example. State and local rules may differ." },
      { type: "Docket Monitoring Check", offsetDays: 95, notes: "If service is complete, check for answer, motion, default-related activity, or court scheduling orders." }
    ]
  },
  courtAccess: {
    sourceLabel: "Case Number / Filing Confirmation Date",
    events: [
      { type: "Post-Filing Setup", offsetDays: 0, notes: "Save case number, review PACER/CM-ECF or court docket access, and save filed documents." },
      { type: "Docket Monitoring Check", offsetDays: 3, notes: "Check docket entries, summons status, deficiency notices, judge assignment, notices, and orders." },
      { type: "Court Order Review", offsetDays: 7, notes: "Review judge-specific standing orders, local procedures, and any initial orders." },
      { type: "Docket Monitoring Check", offsetDays: 14, notes: "Check for new orders, service activity, notices, appearance entries, or scheduling instructions." },
      { type: "Court Order Review", offsetDays: 21, notes: "Reconcile all docket entries with your calendar and update any service, response, or order-driven reminders." }
    ]
  },
  response: {
    sourceLabel: "Service Date",
    events: [
      { type: "Docket Monitoring Check", offsetDays: 7, notes: "Check docket for proof of service, appearance, waiver, answer, motion, extension request, or court notice." },
      { type: "Docket Monitoring Check", offsetDays: 14, notes: "Check docket for appearance, answer, motion, waiver, extension request, or court order." },
      { type: "Defendant Response Deadline", offsetDays: 21, notes: "Federal default answer/response example under FRCP 12(a). Verify any waiver, extension, state rule, local rule, or court order." },
      { type: "Docket Monitoring Check", offsetDays: 22, notes: "After the expected response date, check for answer, motion, extension, default-related activity, or court order." },
      { type: "Waiver Response Deadline", offsetDays: 60, notes: "Federal waiver example may allow 60 days from request sent. Use only if waiver procedure applies and verify the rule." },
      { type: "Docket Monitoring Check", offsetDays: 61, notes: "If waiver timing applies, check for answer, motion, appearance, default issues, or extension activity." }
    ]
  },
  mtd: {
    sourceLabel: "Motion Filing Date",
    events: [
      { type: "Court Order Review", offsetDays: 1, notes: "Check whether the court entered a briefing schedule, hearing notice, page limit, or amendment-related order." },
      { type: "Motion Response Review", offsetDays: 3, notes: "Review motion, local rule, judge procedures, page limits, hearing notice, and amendment timing." },
      { type: "Motion Response Review", offsetDays: 7, notes: "Confirm response deadline, local formatting rules, certificate requirements, exhibit handling, and hearing status." },
      { type: "Motion Response Deadline", offsetDays: 14, notes: "Planning response reminder. Motion deadlines vary by local rule, judge procedure, and order." },
      { type: "Motion Reply Deadline", offsetDays: 21, notes: "Planning reply-deadline reminder after the response period. Verify whether a reply is allowed and when due." },
      { type: "Docket Monitoring Check", offsetDays: 22, notes: "Check docket for reply, hearing notice, order, amendment deadline, or briefing changes." },
      { type: "Court Order Review", offsetDays: 30, notes: "Review any order or scheduling change and update the calendar for amendment, hearing, or further briefing deadlines." }
    ]
  }
};

function getDeadlineRules(pageKey) {
  return deadlineBusinessRules[pageKey] || null;
}

function getDashboardFilingRules() {
  return deadlineBusinessRules.dashboardFiling.events;
}
