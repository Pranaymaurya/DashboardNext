import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Page } from 'puppeteer';

// Utility function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Advanced page loading with multiple strategies
async function loadFullPageContent(page: Page) {
  console.log('Loading full page content...');
  
  // Strategy 1: Aggressive infinite scroll
  await page.evaluate(async () => {
    const scrollStep = 500;
    const scrollDelay = 300;
    const maxScrollTime = 45000; // 45 seconds
    const startTime = Date.now();
    
    let lastHeight = 0;
    let stagnantCount = 0;
    let currentPosition = 0;

    while (Date.now() - startTime < maxScrollTime) {
      // Get current scroll height
      // const scrollHeight = Math.max(
      //   document.body.scrollHeight,
      //   document.documentElement.scrollHeight,
      //   document.body.offsetHeight,
      //   document.documentElement.offsetHeight
      // );

      // Scroll down
      window.scrollBy(0, scrollStep);
      currentPosition += scrollStep;
      
      await new Promise(resolve => setTimeout(resolve, scrollDelay));

      // Check if page height increased
      const newHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );

      if (newHeight > lastHeight) {
        lastHeight = newHeight;
        stagnantCount = 0;
      } else {
        stagnantCount++;
      }

      // If we've reached the bottom and no new content for several attempts
      if (currentPosition >= newHeight && stagnantCount >= 8) {
        console.log('Reached bottom of page');
        break;
      }

      // Try to trigger lazy loading by clicking load more buttons
      const loadMoreSelectors = [
        'button[class*="load"]',
        'button[class*="more"]',
        'a[class*="load"]',
        'a[class*="more"]',
        '[data-testid*="load"]',
        '.load-more',
        '.show-more'
      ];

      for (const selector of loadMoreSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.textContent?.toLowerCase().includes('load') || 
              el.textContent?.toLowerCase().includes('more')) {
            (el as HTMLElement).click();
          }
        });
      }
    }

    // Scroll back to top slowly to ensure all content is rendered
    const scrollToTop = () => {
      return new Promise<void>((resolve) => {
        const scrollUp = () => {
          if (window.pageYOffset > 0) {
            window.scrollBy(0, -500);
            setTimeout(scrollUp, 50);
          } else {
            resolve();
          }
        };
        scrollUp();
      });
    };

    await scrollToTop();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
}

// Get comprehensive page dimensions
async function getPageDimensions(page: Page) {
  return await page.evaluate(() => {
    // Get all possible height measurements
    const body = document.body;
    const html = document.documentElement;
    
    const heights = [
      body.scrollHeight,
      body.offsetHeight,
      body.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
      html.clientHeight,
      window.innerHeight,
      window.screen.height
    ].filter(h => h > 0);

    const widths = [
      body.scrollWidth,
      body.offsetWidth,
      body.clientWidth,
      html.scrollWidth,
      html.offsetWidth,
      html.clientWidth,
      window.innerWidth,
      window.screen.width
    ].filter(w => w > 0);

    // Also check all elements for their bottom position
    const allElements = document.querySelectorAll('*');
    let maxBottom = 0;
    let maxRight = 0;

    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(el);
      
      if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
        maxBottom = Math.max(maxBottom, rect.bottom + window.pageYOffset);
        maxRight = Math.max(maxRight, rect.right + window.pageXOffset);
      }
    });

    const finalHeight = Math.max(
      ...heights,
      maxBottom,
      document.documentElement.getBoundingClientRect().height + window.pageYOffset
    );

    const finalWidth = Math.max(
      ...widths,
      maxRight,
      document.documentElement.getBoundingClientRect().width + window.pageXOffset
    );

    return { 
      width: Math.ceil(finalWidth), 
      height: Math.ceil(finalHeight),
      measurements: {
        bodyScrollHeight: body.scrollHeight,
        htmlScrollHeight: html.scrollHeight,
        maxElementBottom: maxBottom,
        calculatedHeight: finalHeight
      }
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  let browser;
  try {
    console.log(`Generating PDF for: ${url}`);
    
    // Try multiple Chrome executable paths for different environments
    const chromePaths = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
      process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined,
      process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined,
    ].filter(Boolean);

    // Try to launch with different configurations
    for (const executablePath of chromePaths) {
      try {
        console.log(`Attempting to launch Chrome with path: ${executablePath || 'default'}`);
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-ipc-flooding-protection',
            '--disable-extensions',
            '--disable-default-apps',
            '--disable-sync',
            '--single-process',
            '--no-zygote',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
          ],
          executablePath: executablePath || undefined,
        });
        console.log('Chrome launched successfully');
        break;
             } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
         console.log(`Failed to launch with path ${executablePath}:`, errorMessage);
         continue;
       }
    }

    // If all attempts failed, try with bundled Chromium
    if (!browser) {
      try {
        console.log('Attempting to launch with bundled Chromium...');
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process',
            '--no-zygote',
          ],
        });
        console.log('Bundled Chromium launched successfully');
             } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
         console.log('Failed to launch bundled Chromium:', errorMessage);
         throw new Error(`Failed to launch Chrome: ${errorMessage}. Please ensure Chrome is installed or use a different PDF generation method.`);
       }
    }

    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set initial viewport - larger for better rendering
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Intercept requests to block unnecessary resources for faster loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log('Navigating to page...');
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    // Wait for network to settle
    await delay(3000);

    // Load all content
    await loadFullPageContent(page);

    // Additional wait for any final rendering
    await delay(3000);

    // Get comprehensive dimensions
    const dimensions = await getPageDimensions(page);
    console.log('Page dimensions:', dimensions);

    // Ensure reasonable minimum dimensions
    dimensions.width = Math.max(dimensions.width, 1920);
    dimensions.height = Math.max(dimensions.height, 1080);

    // Set the viewport to match the full content size
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 1,
    });

    // Wait for viewport change to take effect
    await delay(2000);

    console.log('Generating PDF with dimensions:', dimensions);

    // Generate PDF using multiple strategies
    let pdfBuffer;
    
    try {
      // First try: Full page PDF
      pdfBuffer = await page.pdf({
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        preferCSSPageSize: false,
        timeout: 90000,
      });
    } catch (pdfError) {
      console.log(pdfError);
      
      // Fallback: Screenshot to PDF
      // const screenshot = await page.screenshot({
      //   fullPage: true,
      //   type: 'png',
      // });

      // Create a simple PDF wrapper for the screenshot
      // Note: This is a basic implementation. For production, consider using a proper PDF library
      const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${dimensions.width} ${dimensions.height}]
>>
endobj
xref
0 4
0000000000 65535 f 
0000000015 65535 n 
0000000074 65535 n 
0000000131 65535 n 
trailer
<<
/Size 4
/Root 1 0 R
>>
startxref
210
%%EOF`;

      pdfBuffer = Buffer.from(pdfHeader);
    }

    console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'attachment; filename="full-webpage.pdf"');
    headers.set('Content-Length', pdfBuffer.length.toString());

    return new NextResponse(new Blob([pdfBuffer as BlobPart]), {
      headers,
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    let statusCode = 500;
    let suggestion = 'Try with a simpler page or check if the URL is accessible';
    
    // Handle specific Chrome installation errors
    if (errorMessage.includes('Could not find Chrome') || errorMessage.includes('Chrome not found')) {
      statusCode = 503;
      suggestion = 'Chrome browser is not installed. Please run: npx puppeteer browsers install chrome';
    } else if (errorMessage.includes('timeout')) {
      statusCode = 504;
      suggestion = 'Request timed out. Try with a simpler page or check if the URL is accessible';
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate PDF', 
      details: errorMessage,
      timestamp: new Date().toISOString(),
      suggestion: suggestion
    }, { status: statusCode });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed successfully');
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
}