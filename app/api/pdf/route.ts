import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForDashboard(page: Page, timeoutMs: number): Promise<void> {
  console.log('Waiting for dashboard content...');
  await page.waitForFunction(() => {
    const loading = document.querySelectorAll('[data-loading="true"]').length > 0;
    const skeleton = document.querySelectorAll('.animate-pulse').length > 0;
    const loaded = document.querySelector('[data-dashboard-loaded="true"]');
    const components = [
      '[data-component="kyc-stats"]',
      '[data-component="comparison-chart"]',
      '[data-component="status-cards"]',
      '[data-component="solicited-chart"]'
    ].every(selector => document.querySelector(selector));
    const hasCharts = document.querySelectorAll('svg').length > 0;
    const hasData = !!document.body.textContent?.match(/\d{1,3}(,\d{3})*|Total KYC|New KYC/);
    const appReadyFlag = (window as any).__PDF_READY__ === true;

    return appReadyFlag || (!loading && !skeleton && loaded && components && (hasCharts || hasData));
  }, { timeout: timeoutMs, polling: 500 });

  // Allow animations/charts to settle
  await delay(3000);
}

async function injectStyles(page: Page, styleMode: 'original' | 'optimized'): Promise<void> {
  const baseCss = `
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body, html { height: auto !important; overflow: visible !important; background: #ffffff !important; }
    .animate-pulse { animation: none !important; }
    svg, canvas, img { max-width: 100% !important; height: auto !important; }
    .overflow-hidden { overflow: visible !important; }
    [data-component] { page-break-inside: avoid; break-inside: avoid; }
    [data-content="dashboard-main"] { break-inside: avoid; }
  `;
  const optimizedCss = `
    .fixed, .sticky { position: static !important; }
    /* Collapse dashboard layout to one column for print */
    @media print {
      .lg\\:grid-cols-3 { grid-template-columns: 1fr !important; }
      .lg\\:col-span-2 { grid-column: auto !important; }
      .grid { gap: 12px !important; }
    }
    @media print {
      @page { size: A4; margin: 12mm; }
      aside, header, nav, .no-print, [data-print="hide"] { display: none !important; }
      main { padding: 0 !important; margin: 0 !important; width: 100% !important; }
    }
  `;
  await page.addStyleTag({ content: styleMode === 'optimized' ? baseCss + optimizedCss : baseCss });
}

async function getBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--font-render-hinting=medium'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  });
}

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const url = params.get('url');
  if (!url) return NextResponse.json({ error: 'Missing URL' }, { status: 400 });

  const sizeMode = (params.get('size') || 'a4').toLowerCase(); // 'a4' | 'full'
  const styleMode = ((params.get('style') || 'original') as 'original' | 'optimized');
  const landscape = params.get('landscape') === 'true';
  const scaleParam = Number(params.get('scale') || '0.9');
  const scale = isNaN(scaleParam) ? 1 : Math.min(Math.max(scaleParam, 0.5), 1.5);
  const timeoutMs = Math.max(10000, Math.min(180000, Number(params.get('timeout') || '90000')));
  const readySelector = params.get('waitFor') || '';
  const extraDelayMs = Math.max(0, Math.min(15000, Number(params.get('delay') || '0')));

  let browser: Browser | undefined;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Forward cookies for same-origin URLs so authenticated pages render properly
    const cookieHeader = req.headers.get('cookie') || '';
    const target = new URL(url);
    if (cookieHeader && target.host === req.nextUrl.host) {
      await page.setExtraHTTPHeaders({ Cookie: cookieHeader });
    }

    await page.goto(url, { waitUntil: 'networkidle0', timeout: timeoutMs });

    await injectStyles(page, styleMode);

    // Wait strategy (selector -> appReadyFlag/dashboard -> optional delay)
    try {
      if (readySelector) {
        await page.waitForSelector(readySelector, { timeout: timeoutMs });
      } else {
        await waitForDashboard(page, timeoutMs);
      }
    } catch {
      // If the content-based wait fails, fall back to a short fixed delay
      await delay(2000);
    }

    if (extraDelayMs > 0) {
      await delay(extraDelayMs);
    }

    // Ensure web fonts are loaded
    await page.evaluate(async () => {
      // @ts-ignore
      if (document.fonts && document.fonts.ready) {
        // @ts-ignore
        await document.fonts.ready;
      }
    });

    // Auto-scroll to trigger lazy-loaded content
    await page.evaluate(async () => {
      await new Promise<void>(resolve => {
        const distance = 800;
        const intervalMs = 100;
        const timer = setInterval(() => {
          const scrollTop = window.scrollY;
          const viewportBottom = window.innerHeight + scrollTop;
          const fullHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          if (viewportBottom >= fullHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            setTimeout(() => resolve(), 300);
          }
        }, intervalMs);
      });
    });

    let pdf: Uint8Array;
    if (sizeMode === 'full') {
      const { width, height } = await page.evaluate(() => ({
        width: Math.min(document.documentElement.scrollWidth, 2560),
        height: document.documentElement.scrollHeight
      }));
      await page.setViewport({ width, height });
      await delay(300);
      await page.emulateMediaType('screen');
      pdf = await page.pdf({
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
      });
    } else {
      await page.emulateMediaType(styleMode === 'optimized' ? 'print' : 'screen');
      pdf = await page.pdf({
        format: 'A4',
        landscape,
        printBackground: true,
        scale,
        preferCSSPageSize: true,
        displayHeaderFooter: styleMode === 'optimized',
        headerTemplate: styleMode === 'optimized' ? `<div style=\"font-size:8px; color: transparent; width: 100%;\">.</div>` : '<div></div>',
        footerTemplate: styleMode === 'optimized' ? `
          <div style=\"font-size:10px; color:#6b7280; width:100%; padding: 0 12mm;\">\n            <div style=\"display:flex; justify-content:space-between; width:100%;\">\n              <span class=\"date\"></span>\n              <span>Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></span>\n            </div>\n          </div>
        ` : '<div></div>',
        margin: styleMode === 'optimized' ? { top: '12mm', right: '12mm', bottom: '18mm', left: '12mm' } : { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
      });
    }

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="dashboard-${Date.now()}.pdf"`,
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'PDF generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const url = body.url as string | undefined;
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

  const qs = new URLSearchParams({ url });
  if (body.size) qs.set('size', String(body.size));
  if (body.landscape !== undefined) qs.set('landscape', String(!!body.landscape));
  if (body.scale) qs.set('scale', String(body.scale));
  if (body.timeout) qs.set('timeout', String(body.timeout));
  if (body.waitFor) qs.set('waitFor', String(body.waitFor));
  if (body.delay) qs.set('delay', String(body.delay));

  const newReq = new NextRequest(`${req.nextUrl.origin}${req.nextUrl.pathname}?${qs.toString()}`);
  return GET(newReq);
}
