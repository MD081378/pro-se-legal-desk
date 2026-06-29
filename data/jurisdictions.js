/** Seed jurisdiction data. Detailed entries can override statewide fallbacks. */
var jurisdictionData = {
  federal: {
    TX: {
      label: "Texas",
      cities: {
        "Dallas Division": {
          court: "U.S. District Court, Northern District of Texas",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["N.D. Texas Local Civil Rules", "https://www.txnd.uscourts.gov/local-civil-rules"],
            ["N.D. Texas Rules and Orders", "https://www.txnd.uscourts.gov/rules-and-orders"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        },
        "Houston Division": {
          court: "U.S. District Court, Southern District of Texas",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["S.D. Texas Rules", "https://www.txs.uscourts.gov/page/rules-forms-fees"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        },
        "Austin Division": {
          court: "U.S. District Court, Western District of Texas",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["W.D. Texas Local Rules", "https://www.txwd.uscourts.gov/court-information/rules-and-orders/local-court-rules/"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        }
      }
    },
    NY: {
      label: "New York",
      cities: {
        "Manhattan Division": {
          court: "U.S. District Court, Southern District of New York",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["S.D.N.Y. Local Rules", "https://www.nysd.uscourts.gov/rules"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        },
        "Brooklyn Division": {
          court: "U.S. District Court, Eastern District of New York",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["E.D.N.Y. Local Rules", "https://www.nyed.uscourts.gov/court-info/local-rules-and-orders"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        }
      }
    },
    CA: {
      label: "California",
      cities: {
        "Los Angeles Division": {
          court: "U.S. District Court, Central District of California",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["C.D. California Local Rules", "https://www.cacd.uscourts.gov/court-procedures/local-rules"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        },
        "San Francisco Division": {
          court: "U.S. District Court, Northern District of California",
          links: [
            ["Federal Rules of Civil Procedure", "https://www.law.cornell.edu/rules/frcp"],
            ["N.D. California Local Rules", "https://www.cand.uscourts.gov/rules/local-rules/"],
            ["U.S. Courts Civil Pro Se Forms", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"]
          ]
        }
      }
    }
  },

  state: {
    TX: {
      label: "Texas",
      cities: {
        "Dallas County": {
          court: "Texas State Court - Dallas County",
          links: [
            ["Texas Rules of Civil Procedure", "https://www.txcourts.gov/rules-forms/rules-standards/"],
            ["Texas Courts Forms", "https://www.txcourts.gov/rules-forms/forms/"],
            ["Dallas County Courts", "https://www.dallascounty.org/government/courts/"]
          ]
        },
        "Tarrant County": {
          court: "Texas State Court - Tarrant County",
          links: [
            ["Texas Rules of Civil Procedure", "https://www.txcourts.gov/rules-forms/rules-standards/"],
            ["Texas Courts Forms", "https://www.txcourts.gov/rules-forms/forms/"],
            ["Tarrant County Courts", "https://www.tarrantcountytx.gov/en/courts.html"]
          ]
        }
      }
    },
    NY: {
      label: "New York",
      cities: {
        "New York County": {
          court: "New York State Supreme Court - New York County",
          links: [
            ["New York State Court Rules", "https://ww2.nycourts.gov/rules/index.shtml"],
            ["New York Courts Forms", "https://ww2.nycourts.gov/forms/index.shtml"],
            ["New York County Supreme Court", "https://ww2.nycourts.gov/courts/1jd/supctmanh/index.shtml"]
          ]
        },
        "Kings County": {
          court: "New York State Supreme Court - Kings County",
          links: [
            ["New York State Court Rules", "https://ww2.nycourts.gov/rules/index.shtml"],
            ["New York Courts Forms", "https://ww2.nycourts.gov/forms/index.shtml"],
            ["Kings County Supreme Court", "https://ww2.nycourts.gov/courts/2jd/kings/civil/index.shtml"]
          ]
        }
      }
    },
    CA: {
      label: "California",
      cities: {
        "Los Angeles County": {
          court: "Superior Court of California, County of Los Angeles",
          links: [
            ["California Rules of Court", "https://courts.ca.gov/rules"],
            ["California Court Forms", "https://courts.ca.gov/forms"],
            ["Los Angeles Superior Court", "https://www.lacourt.org/"]
          ]
        },
        "San Francisco County": {
          court: "Superior Court of California, County of San Francisco",
          links: [
            ["California Rules of Court", "https://courts.ca.gov/rules"],
            ["California Court Forms", "https://courts.ca.gov/forms"],
            ["San Francisco Superior Court", "https://www.sfsuperiorcourt.org/"]
          ]
        }
      }
    }
  },

  local: {
    TX: {
      label: "Texas",
      cities: {
        Dallas: {
          court: "City of Dallas Municipal Court",
          links: [
            ["Texas Rules and Forms", "https://www.txcourts.gov/rules-forms/"],
            ["Dallas Municipal Court", "https://dallascityhall.com/departments/courtdetentionservices/Pages/default.aspx"]
          ]
        },
        Plano: {
          court: "City of Plano Municipal Court",
          links: [
            ["Texas Rules and Forms", "https://www.txcourts.gov/rules-forms/"],
            ["Plano Municipal Court", "https://www.plano.gov/399/Municipal-Court"]
          ]
        }
      }
    },
    NY: {
      label: "New York",
      cities: {
        "New York City": {
          court: "New York City Civil Court",
          links: [
            ["New York State Court Rules", "https://ww2.nycourts.gov/rules/index.shtml"],
            ["New York City Civil Court", "https://ww2.nycourts.gov/courts/nyc/civil/index.shtml"],
            ["New York Courts Forms", "https://ww2.nycourts.gov/forms/index.shtml"]
          ]
        }
      }
    },
    CA: {
      label: "California",
      cities: {
        "Los Angeles": {
          court: "Los Angeles Local Court Resources",
          links: [
            ["California Rules of Court", "https://courts.ca.gov/rules"],
            ["Los Angeles Superior Court", "https://www.lacourt.org/"],
            ["California Court Forms", "https://courts.ca.gov/forms"]
          ]
        }
      }
    }
  }
};
