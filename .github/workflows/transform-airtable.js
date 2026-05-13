const fs = require('fs');
const path = require('path');

// Read Airtable data
const airtableData = JSON.parse(fs.readFileSync('airtable_data.json', 'utf-8'));

// Transform records to services.json format
const services = airtableData.records.map(record => {
  const fields = record.fields;

  return {
    id: fields['service id'] || '',
    pageTitle: fields['Page Title'] || '',
    cardIcon: fields['Card Icon URL'] || '',
    cardDescription: fields['Card Description'] || '',
    mainBannerImage: fields['Main Banner Image URL'] || '',
    mainHeading: fields['Main Heading'] || '',
    introParagraph: fields['Intro Paragraph'] || '',
    overview: {
      paragraph: fields['Overview Paragraph'] || '',
      images: parseArray(fields['Overview Images'])
    },
    whatsIncluded: {
      paragraph: fields["What's Included Paragraph"] || '',
      checklist: parseArray(fields["What's Included Checklist Items"])
    }
  };
});

// Helper function to parse comma-separated or JSON array strings
function parseArray(value) {
  if (!value) return [];
  
  // If it's already an array (Airtable attachments), return as-is
  if (Array.isArray(value)) {
    return value;
  }
  
  // If it's a string, try to parse as JSON first
  if (typeof value === 'string') {
    value = value.trim();
    if (value.startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // Fall through to comma-split
      }
    }
    
    // Split by comma and trim each item
    return value.split(',').map(item => item.trim()).filter(item => item);
  }
  
  return [];
}

// Write to services.json
const outputPath = path.join(__dirname, '../../data/services.json');
fs.writeFileSync(outputPath, JSON.stringify(services, null, 2) + '\n');

console.log(`✓ Synced ${services.length} services from Airtable`);
