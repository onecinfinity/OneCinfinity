const fs = require('fs');
const path = require('path');

// Read Airtable data
let airtableRaw;
try {
  airtableRaw = fs.readFileSync('airtable_data.json', 'utf-8');
} catch (err) {
  console.error('ERROR: Could not read airtable_data.json — make sure the fetch step created the file.');
  console.error(err.message);
  process.exit(1);
}

let airtableData;
try {
  airtableData = JSON.parse(airtableRaw);
} catch (err) {
  console.error('ERROR: airtable_data.json is not valid JSON. Contents:');
  console.error(airtableRaw.slice(0, 2000));
  console.error(err.message);
  process.exit(1);
}

if (!airtableData || !Array.isArray(airtableData.records)) {
  console.error('ERROR: Unexpected Airtable response structure. Full response:');
  console.error(JSON.stringify(airtableData, null, 2).slice(0, 4000));
  console.error('\nLikely causes: invalid AIRTABLE_TOKEN, wrong base/table endpoint, or Airtable returned an error object.');
  process.exit(1);
}

// Transform records to services.json format
const services = airtableData.records.map(record => {
  const fields = record.fields || {};

  return {
    id: fields['service id'] || fields['Service ID'] || fields['service id ' ] || '',
    pageTitle: fields['Page Title'] || fields['page title'] || '',
    cardIcon: firstUrlOrValue(fields['Card Icon URL'] || fields['Card Icon'] || ''),
    cardDescription: fields['Card Description'] || fields['Card Description '] || '',
    mainBannerImage: firstUrlOrValue(fields['Main Banner Image URL'] || fields['Main Banner'] || ''),
    mainHeading: fields['Main Heading'] || fields['Main heading'] || '',
    introParagraph: fields['Intro Paragraph'] || fields['Intro Paragraph '] || '',
    overview: {
      paragraph: fields['Overview Paragraph'] || fields['Overview'] || '',
      images: parseArray(fields['Overview Images'] || fields['Overview Images '] || fields['Overview Images (URLs)'] || [])
    },
    whatsIncluded: {
      paragraph: fields["What's Included Paragraph"] || fields['Whats Included Paragraph'] || '',
      checklist: parseArray(fields["What's Included Checklist Items"] || fields['Checklist Items'] || fields['Whats Included Checklist Items'] || [])
    }
  };
});

// Helper: extract URL from Airtable attachment objects, or return string values
function firstUrlOrValue(value) {
  if (!value) return '';
  if (Array.isArray(value)) {
    // Airtable attachments: [{id,name,url,...}, ...]
    return value.map(v => (v && v.url) ? v.url : (typeof v === 'string' ? v : '')).filter(Boolean)[0] || '';
  }
  if (typeof value === 'object' && value.url) return value.url;
  return String(value);
}

// Helper function to parse comma-separated, JSON array strings, or Airtable attachments arrays
function parseArray(value) {
  if (!value) return [];
  
  // Attachments array from Airtable
  if (Array.isArray(value)) {
    return value.map(item => {
      if (!item) return null;
      if (typeof item === 'string') return item;
      if (item.url) return item.url;
      if (item.filename) return item.filename;
      return JSON.stringify(item);
    }).filter(Boolean);
  }

  // If it's an object with attachments property
  if (typeof value === 'object') {
    if (value.url) return [value.url];
    return [JSON.stringify(value)];
  }

  // If it's a string, try JSON parse
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return [];
    if (s.startsWith('[')) {
      try { return JSON.parse(s); } catch (e) { /* fallback */ }
    }
    return s.split(',').map(i => i.trim()).filter(Boolean);
  }

  return [];
}

// Write to services.json
const outputPath = path.join(__dirname, '../../data/services.json');
try {
  fs.writeFileSync(outputPath, JSON.stringify(services, null, 2) + '\n');
  console.log(`✓ Synced ${services.length} services from Airtable`);
} catch (err) {
  console.error('ERROR: Could not write services.json');
  console.error(err.message);
  process.exit(1);
}
