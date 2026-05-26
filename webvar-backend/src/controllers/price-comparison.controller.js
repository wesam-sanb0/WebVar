import puppeteer from "puppeteer";

// Utility to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Utility to sanitize text for JSON
const sanitizeText = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u200B-\u200F\u202A-\u202E]/g, "")
    .replace(/[^\x20-\x7E\u0621-\u064A0-9.,]/g, "")
    .trim();
};

// Utility to extract numeric price for comparison
const extractNumericPrice = (price) => {
  if (!price) return Infinity;
  const match = price.match(/[\d.,]+/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : Infinity;
};

// Utility to simplify product title for search
const simplifyTitle = (title) => {
  if (!title) return "";

  const stopWords = ["with", "and", "the", "for", "in", "on", "at", "to", "version", "international", "middle", "east"];
  const words = title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word) && word.length > 2);

  const keywords = words.filter((word) =>
    /(iphone|pro|plus|ai|256gb|64gb|5g|datatraveler|exodia|kingston|samsung|galaxy|note|ultra)/i.test(word)
  );

  const finalKeywords = keywords.length > 0 ? keywords : words.slice(0, 4);

  const searchQuery = finalKeywords.join(" ");
  console.log(`Simplified search query: ${searchQuery}`);
  return searchQuery;
};

// Utility to check title similarity (basic word overlap)
const areTitlesSimilar = (title1, title2) => {
  if (!title1 || !title2) return false;
  const words1 = title1.toLowerCase().split(/\s+/);
  const words2 = title2.toLowerCase().split(/\s+/);
  const commonWords = words1.filter((word) => words2.includes(word));
  const similarity = commonWords.length / Math.min(words1.length, words2.length);
  return similarity > 0.3;
};

// Utility to detect the retailer from the URL
const detectRetailer = (url) => {
  if (url.includes("amazon")) return "Amazon";
  if (url.includes("jumia")) return "Jumia";
  if (url.includes("noon")) return "Noon";
  return "Unknown";
};

// Retry operation with delay
const retryOperation = async (operation, maxRetries = 2, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retrying operation (${i + 1}/${maxRetries})...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Main price comparison handler
export const priceComparison = async (req, res) => {
  const { link } = req.body;

  if (!link || !isValidUrl(link)) {
    return res.status(400).json({ message: "Valid URL is required" });
  }

  try {
    let product;
    const retailer = detectRetailer(link);
    console.log(`Detected retailer: ${retailer}`);

    if (retailer === "Amazon") {
      product = await scrapeAmazon(link);
    }  else if (retailer === "Noon") {
      product = await scrapeNoonProduct(link);
    } else {
      return res.status(400).json({ message: "Unsupported retailer" });
    }

    if (!product.title) {
      return res.status(404).json({ message: `Could not retrieve product details from ${retailer}` });
    }

    product.link = link;

    const [productsFromWalmart, productsFromEbay, productsFromAmazon] = await Promise.all([
      scrapeWalmart(product.title),
      scrapeEbay(product.title),
      scrapeAmazonSearch(product.title),
    ]);

    // Flatten all results into a single array with site information for best deal calculation
    const allPrices = [
      { site: detectRetailer(product.link), ...product, numericPrice: extractNumericPrice(product.price) },
      ...productsFromWalmart.map((p) => ({
        site: "Walmart",
        ...p,
        numericPrice: extractNumericPrice(p.price),
      })),
      ...productsFromEbay.map((p) => ({
        site: "eBay",
        ...p,
        numericPrice: extractNumericPrice(p.price),
      })),
      ...productsFromAmazon.map((p) => ({
        site: "Amazon",
        ...p,
        numericPrice: extractNumericPrice(p.price),
      })),
    ].filter((p) => p && p.numericPrice !== Infinity);

    let bestDeal = null;
    if (allPrices.length) {
      bestDeal = allPrices.reduce((prev, current) =>
        current.numericPrice < prev.numericPrice ? current : prev
      );
    } else {
      bestDeal = { site: "None", message: "No matching products found on other sites" };
    }

    // Organize all results by retailer
    const allResults = {
      Walmart: productsFromWalmart,
      eBay: productsFromEbay,
      Amazon: productsFromAmazon,
    };

    return res.status(200).json({
      message: "Price comparison successful",
      product,
      bestDeal,
      allResults,
    });
  } catch (error) {
    console.error("Price comparison error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Amazon-specific scraper for product page
export const scrapeAmazon = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    await retryOperation(async () => {
      await page.waitForSelector("#productTitle", { timeout: 15000 });
    });

    const product = await page.evaluate(() => {
      const title = document.querySelector("#productTitle")?.innerText.trim();
      const priceSelectors = [
        ".a-price .a-offscreen",
        "#priceblock_ourprice",
        "#priceblock_dealprice",
        "#price_inside_buybox",
        ".a-size-medium.a-color-price.priceBlockBuyingPriceString",
      ];

      let price = "";
      for (const selector of priceSelectors) {
        price = document.querySelector(selector)?.innerText.trim();
        if (price) break;
      }

      return { title, price };
    });

    console.log(`Scraped product name from Amazon: ${product.title}`);

    return {
      title: sanitizeText(product.title),
      price: sanitizeText(product.price),
    };
  } catch (error) {
    console.error(`Failed to scrape Amazon ${url}:`, error.message);
    return { title: "", price: "" };
  } finally {
    if (browser) await browser.close();
  }
};

// Amazon scraper for search results
export const scrapeAmazonSearch = async (productTitle) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    );

    const simplifiedTitle = simplifyTitle(productTitle);
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(simplifiedTitle)}`;
    console.log(`Searching Amazon with URL: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    const productContainerSelector = "div.s-result-item[data-component-type='s-search-result']";
    await retryOperation(async () => {
      await page.waitForSelector(productContainerSelector, { timeout: 15000 });
    });

    const products = await page.evaluate((selector, originalTitle) => {
      const productElements = Array.from(document.querySelectorAll(selector));
      const results = [];
      for (const productElement of productElements) {
        const titleElement = productElement.querySelector("h2 a span");
        const priceElement = productElement.querySelector(".a-price .a-offscreen");
        const linkElement = productElement.querySelector("h2 a");
        const imageElement = productElement.querySelector("img.s-image");

        const title = titleElement?.innerText.trim();
        const price = priceElement?.innerText.trim();
        const link = linkElement ? `https://www.amazon.com${linkElement.getAttribute("href")}` : null;
        const imageUrl = imageElement?.getAttribute("src");

        if (title && price && link && imageUrl) {
          const words1 = originalTitle.toLowerCase().split(/\s+/);
          const words2 = title.toLowerCase().split(/\s+/);
          const commonWords = words1.filter((word) => words2.includes(word));
          const similarity = commonWords.length / Math.min(words1.length, words2.length);
          if (similarity > 0.3) {
            results.push({ title, price, link, imageUrl });
          }
        }
        if (results.length >= 5) break;
      }
      return results;
    }, productContainerSelector, productTitle);

    if (!products.length) {
      console.log("No relevant products found on Amazon");
      return [];
    }

    products.forEach((product, index) => {
      console.log(`Amazon result ${index + 1}: ${product.title} - ${product.price} - Image: ${product.imageUrl}`);
    });

    return products.map((product) => ({
      title: sanitizeText(product.title),
      price: sanitizeText(product.price),
      link: product.link,
      imageUrl: product.imageUrl,
    }));
  } catch (error) {
    console.error(`Failed to scrape Amazon for ${productTitle}:`, error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};

// Noon-specific scraper for product page
export const scrapeNoonProduct = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const titleSelectors = [
      ".CoreDetails_productTitle__JCoTk",
      "h1",
      "[data-qa='product-name']",
    ];

    const priceSelectors = [
      ".PriceOffer_priceNowText__08sYH",
      "span.amount",
      "[data-qa='price-block'] .amount",
    ];

    let titleFound = false;
    for (const selector of titleSelectors) {
      try {
        await retryOperation(async () => {
          await page.waitForSelector(selector, { timeout: 15000 });
        });
        titleFound = true;
        break;
      } catch (error) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!titleFound) {
      console.error("Failed to find title with any selector. Page HTML:", await page.content());
      throw new Error("Title selector not found");
    }

    const product = await page.evaluate((titleSelectors, priceSelectors) => {
      let title = "";
      let price = "";

      for (const selector of titleSelectors) {
        title = document.querySelector(selector)?.innerText.trim();
        if (title) break;
      }

      for (const selector of priceSelectors) {
        price = document.querySelector(selector)?.innerText.trim();
        if (price) break;
      }

      return { title, price };
    }, titleSelectors, priceSelectors);

    console.log(`Scraped product name from Noon: ${product.title}`);

    if (!product.title) {
      console.error("Title not extracted. Page HTML:", await page.content());
    }

    return {
      title: sanitizeText(product.title),
      price: sanitizeText(product.price),
    };
  } catch (error) {
    console.error(`Failed to scrape Noon product page ${url}:`, error.message);
    return { title: "", price: "" };
  } finally {
    if (browser) await browser.close();
  }
};

// eBay scraper for search results
export const scrapeEbay = async (productTitle) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    );

    const simplifiedTitle = simplifyTitle(productTitle);
    const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
      simplifiedTitle
    )}`;
    console.log(`Searching eBay with URL: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    const productContainerSelector = ".s-item";
    await retryOperation(async () => {
      await page.waitForSelector(productContainerSelector, { timeout: 15000 });
    });

    const products = await page.evaluate((selector, originalTitle) => {
      const productElements = Array.from(document.querySelectorAll(selector));
      const results = [];
      for (const productElement of productElements) {
        const titleElement = productElement.querySelector(".s-item__title");
        const priceElement = productElement.querySelector(".s-item__price");
        const linkElement = productElement.querySelector(".s-item__link");
        const imageElement = productElement.querySelector(".s-item__image img");

        const title = titleElement?.innerText.trim();
        const price = priceElement?.innerText.trim();
        const link = linkElement?.getAttribute("href");
        const imageUrl = imageElement?.getAttribute("src");

        if (title && price && link && title !== "Shop on eBay" && imageUrl) {
          const words1 = originalTitle.toLowerCase().split(/\s+/);
          const words2 = title.toLowerCase().split(/\s+/);
          const commonWords = words1.filter((word) => words2.includes(word));
          const similarity = commonWords.length / Math.min(words1.length, words2.length);
          if (similarity > 0.3) {
            results.push({ title, price, link, imageUrl });
          }
        }
        if (results.length >= 5) break;
      }
      return results;
    }, productContainerSelector, productTitle);

    if (!products.length) {
      console.log("No relevant products found on eBay");
      return [];
    }

    products.forEach((product, index) => {
      console.log(`eBay result ${index + 1}: ${product.title} - ${product.price} - Image: ${product.imageUrl}`);
    });

    return products.map((product) => ({
      title: sanitizeText(product.title),
      price: sanitizeText(product.price),
      link: product.link,
      imageUrl: product.imageUrl,
    }));
  } catch (error) {
    console.error(`Failed to scrape eBay for ${productTitle}:`, error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};

// Walmart scraper for search results
export const scrapeWalmart = async (productTitle) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    );

    const simplifiedTitle = simplifyTitle(productTitle);
    const searchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(simplifiedTitle)}`;
    console.log(`Searching Walmart with URL: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    const productContainerSelector = "div[data-testid='list-view'] > div";
    await retryOperation(async () => {
      await page.waitForSelector(productContainerSelector, { timeout: 15000 });
    });

    const products = await page.evaluate((selector, originalTitle) => {
      const productElements = Array.from(document.querySelectorAll(selector));
      const results = [];
      for (const productElement of productElements) {
        const titleElement = productElement.querySelector("span[data-automation-id='product-title']");
        const priceElement = productElement.querySelector("div[data-automation-id='product-price'] span");
        const linkElement = productElement.querySelector("a");
        const imageElement = productElement.querySelector("img");

        const title = titleElement?.innerText.trim();
        const price = priceElement?.innerText.trim();
        const link = linkElement?.getAttribute("href");
        const imageUrl = imageElement?.getAttribute("src");

        if (title && price && link && imageUrl) {
          const words1 = originalTitle.toLowerCase().split(/\s+/);
          const words2 = title.toLowerCase().split(/\s+/);
          const commonWords = words1.filter((word) => words2.includes(word));
          const similarity = commonWords.length / Math.min(words1.length, words2.length);
          if (similarity > 0.3) {
            results.push({ title, price, link: `https://www.walmart.com${link}`, imageUrl });
          }
        }
        if (results.length >= 5) break;
      }
      return results;
    }, productContainerSelector, productTitle);

    if (!products.length) {
      console.log("No relevant products found on Walmart");
      return [];
    }

    products.forEach((product, index) => {
      console.log(`Walmart result ${index + 1}: ${product.title} - ${product.price} - Image: ${product.imageUrl}`);
    });

    return products.map((product) => ({
      title: sanitizeText(product.title),
      price: sanitizeText(product.price),
      link: product.link,
      imageUrl: product.imageUrl,
    }));
  } catch (error) {
    console.error(`Failed to scrape Walmart for ${productTitle}:`, error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};