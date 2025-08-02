require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://assessment.ksensetech.com/api/patients';
const MAX_PAGES = 10;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// GET request to query data.
async function fetchPage(page) {
  const url = `${BASE_URL}?page=${page}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });

    if (!res.ok) {
      console.error(`HTTP error ${res.status} on page ${page}`);
      return [];
    }

    const data = await res.json();

    // Always wrap the data as an array
    return Array.isArray(data.data) ? data.data : [data];

  } catch (error) {
    console.error(`Failed to fetch page ${page}:`, error.message);
    return [];
  }
}

async function fetchAllPatients() {
  let allPatients = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const patients = await fetchPage(page);
    if (patients.length === 0) {
      console.log(`No data on page ${page}, stopping.`);
      break;
    }
    allPatients = allPatients.concat(patients);
    console.log(`Fetched page ${page} with ${patients.length} patients`);

    await delay(5000); // 5 sec delay to avoid API issues
  }

  return allPatients;
}

// Parses the file with patients and returns a list of high risk patients. I.e. total risk score ≥ 4.
// Total Risk Score = (BP Score) + (Temp Score) + (Age Score)
// Calculate 1. BP Score 2. Temp Score 3. Age Score
// It has to calculate a risk score for each patient.
function getBPScore(blood_pressure) {
  if (typeof blood_pressure !== 'string' || !blood_pressure.includes('/')) {
    return 0;
  }

  const parts = blood_pressure.split('/');

  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    return 0;
  }

  const sys = Number(parts[0]);
  const di = Number(parts[1]);

  if (isNaN(sys) || isNaN(di)) {
    return 0;
  }

  if (sys < 120 && di < 80) {
    return 0;
  } else if ((sys >= 120 && sys <= 129) && (di < 80)) {
    return 1;
  } else if ((sys >= 130 && sys <= 139) || (di >= 80 && di <= 89)) {
    return 2;
  } else if ((sys >= 140) || (di >= 90)) {
    return 3;
  } else {
    return 0; // invalid data
  }
}


function getTemperatureRisk(temperature) {
  if (typeof temperature != 'number') {
    return 0;
  }

  if (temperature <= 99.5) {
    return 0;
  }
  if ((temperature >= 99.6) && (temperature <= 100.9)) {
    return 1;
  }
  if (temperature >= 101.0) {
    return 2;
  }
    
  return 0; // invalid data
}

function getAgeRisk(age) {
  if ((typeof age != 'number') || isNaN(age)){
    return 0;
  }

  if (age < 40) {
    return 0;
  }
  if ((age >= 40) && (age <= 65)) {
    return 1;
  }
  if (age > 65) {
    return 2;
  }

  return 0; // invalid data
}

function isHighRisk(patient) {
  let total = getBPScore(patient.blood_pressure) + getAgeRisk(patient.age) + getTemperatureRisk(patient.temperature);

  if (total >= 4) {
    return true;
  } else {
    return false;
  }
}


function getHighRiskPatients(fileName) { 
  const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));

  // Flatten the data so the format is uniform.
  const allPatients = data.flatMap(item => Array.isArray(item.patients) ? item.patients : [item]);

  // Filter patients with high risk and return their IDs
  return allPatients.filter(patient => isHighRisk(patient)).map(patient => patient.patient_id);
}


// Fever Patients: Patient IDs with temperature ≥ 99.6°F
function getFeverPatients(fileName) {
  const my_data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
  const allPatients = my_data.flatMap(item => Array.isArray(item.patients) ? item.patients : [item]);

  return allPatients
    .filter(patient => typeof patient.temperature === 'number' && patient.temperature >= 99.6)
    .map(patient => patient.patient_id);
}

function getPatientsWithDataIssues(fileName) {
  const my_data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  const allPatients = my_data.flatMap(item => Array.isArray(item.patients) ? item.patients : [item]);

  return allPatients
    .filter(patient => {
      const bp = patient?.blood_pressure;
      const bpParts = typeof bp === 'string' ? bp.split('/') : [];

      return (
        !patient?.patient_id ||
        typeof patient.name !== 'string' ||
        typeof patient.age !== 'number' || patient.age < 0 ||
        typeof patient.gender !== 'string' || !['M', 'F'].includes(patient.gender) ||
        typeof bp !== 'string' ||
        bpParts.length !== 2 ||
        !bpParts[0].trim() || isNaN(Number(bpParts[0])) ||
        !bpParts[1].trim() || isNaN(Number(bpParts[1])) ||

        typeof patient.temperature !== 'number' ||
        typeof patient.visit_date !== 'string' ||
        typeof patient.diagnosis !== 'string' ||
        typeof patient.medications !== 'string'
      );
    })
    .map(patient => patient.patient_id || null);
}

async function main() {
  // Assume these functions return arrays of patient IDs
  let fileName = "all_patients.json";

  const high_risk_patients = getHighRiskPatients(fileName);
  const fever_patients = getFeverPatients(fileName);
  const data_quality_issues = getPatientsWithDataIssues(fileName);

  // console.log(high_risk_patients);

  const results = {
    high_risk_patients,
    fever_patients,
    data_quality_issues,
  };

  fetch('https://assessment.ksensetech.com/api/submit-assessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY 
    },
    body: JSON.stringify(results),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Assessment Results:\n', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error submitting results:', error);
  });
}


main();
