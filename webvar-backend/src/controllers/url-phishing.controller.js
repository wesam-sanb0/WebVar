import axios from 'axios';
import { config } from 'dotenv';
// import * as safeBrowsing  from 'google-safe-browsing';
// import { HfInference } from "@huggingface/inference";
import stringSimilarity from 'string-similarity';
import validator from 'validator';
config()
// export const checkUrlSafety = async (req, res, next) => {
//   const url = req.body.url;
//   const IPQS_API_KEY = process.env.IPQS_API_KEY;

//   if (!url) return res.status(400).json({ message: "Valid URL is required" });

//   try {
//     const response = await axios.get(
//       `https://ipqualityscore.com/api/json/url/${IPQS_API_KEY}/${encodeURIComponent(url)}`
//     );

//     const result = response.data;
//     console.log(result);

//     return res.status(200).json({
//       url,
//       is_phishing: result.phishing,
//       is_malware: result.malware,
//       suspicious: result.suspicious,
//       risk_score: result.risk_score,
//       domain_rank: result.domain_rank
//     });

//   } catch (error) {
//     console.error(error?.response?.data || error.message);
//     return res.status(500).json({
//       message: "Catch error",
//       error_msg: error?.response?.data || error.message
//     });
//   }
// };


export const checkUrlSafety = async (req, res) => {
  const { url } = req.body;

  // Validate input
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Perform manual check
    const manualResult = manualUrlCheck(url);

    // Perform Google Safe Browsing check
    const googleResult = await checkWithGoogleSafeBrowsing(url);

    // Combine results
    const results = [manualResult];
    if (googleResult) {
      results.push(googleResult);
    }

    // URL is safe only if all checks pass
    const isSafe = results.every((result) => result.isSafe);

    res.json({
      url,
      isSafe,
      details: results,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: 'Failed to check URL', message: error.message });
  }
};









const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

// Manual URL check to detect suspicious patterns
function manualUrlCheck(url) {
  const issues = [];

  // Check if the URL is valid and includes a protocol (http/https)
  if (!validator.isURL(url, { require_protocol: true })) {
    issues.push('Invalid URL or missing protocol (http/https)');
  }

  // Check for HTTPS (non-HTTPS URLs are often suspicious)
  if (!url.startsWith('https://')) {
    issues.push('URL does not use HTTPS, may be suspicious');
  }

  // Check for suspicious top-level domains (TLDs)
  const suspiciousTlds = ['.xyz', '.top', '.info', '.click', '.online', '.site'];
  const urlLower = url.toLowerCase();
  if (suspiciousTlds.some((tld) => urlLower.endsWith(tld))) {
    issues.push('Domain uses a suspicious TLD');
  }

  // Check for typosquatting (e.g., resembling "amazon")
  const knownDomains = ['amazon.com', 'google.com', 'paypal.com', 'facebook.com'];
  const urlDomain = new URL(url).hostname.toLowerCase();
  const similarityThreshold = 0.8; // Adjust as needed
  knownDomains.forEach((known) => {
    const similarity = stringSimilarity.compareTwoStrings(urlDomain, known);
    if (similarity > similarityThreshold && urlDomain !== known) {
      issues.push(`Domain resembles ${known}, possible typosquatting`);
    }
  });

  // Check for non-standard characters (e.g., Cyrillic used in homoglyph attacks)
  const suspiciousChars = /[а-яёіїґ]/;
  if (suspiciousChars.test(url)) {
    issues.push('URL contains suspicious characters that may be used in spoofing');
  }

  // Check for URL shorteners (often used to mask malicious links)
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'shortened'];
  if (shorteners.some((shortener) => urlLower.includes(shortener))) {
    issues.push('URL uses a shortening service, may be suspicious');
  }

  return {
    isSafe: issues.length === 0,
    issues,
  };
}

// Check URL using Google Safe Browsing API
async function checkWithGoogleSafeBrowsing(url) {
  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
      {
        client: { clientId: 'your-app', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return {
      isSafe: !response.data.matches || response.data.matches.length === 0,
      source: 'GoogleSafeBrowsing',
      details: response.data.matches || [],
    };
  } catch (error) {
    // Log error for debugging
    console.log(error)
    console.error('Error in Google Safe Browsing:', error.message);
    return null;
  }
}
