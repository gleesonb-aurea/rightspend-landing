const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://rightspend.ai/aws-savings-calculator.html');
    await page.waitForTimeout(2000);

    console.log('=== Testing Growth Rate Slider Updates ===\n');

    // Get initial values
    const initialRisk = await page.textContent('#riskAnalysis');
    const initialSavings = await page.textContent('#rightspendSavings');

    console.log('Initial state (growth rate 20%):');
    console.log('Risk analysis:', initialRisk.substring(0, 100) + '...');
    console.log('Annual savings:', initialSavings);
    console.log('');

    // Move growth rate slider to negative
    console.log('Changing growth rate to -20%...');
    await page.fill('#growthRate', '-20');
    await page.waitForTimeout(1000);

    const negativeRisk = await page.textContent('#riskAnalysis');
    const negativeSavings = await page.textContent('#rightspendSavings');

    console.log('With -20% growth:');
    console.log('Risk analysis:', negativeRisk.substring(0, 100) + '...');
    console.log('Annual savings:', negativeSavings);
    console.log('');

    // Move growth rate slider to high positive
    console.log('Changing growth rate to 50%...');
    await page.fill('#growthRate', '50');
    await page.waitForTimeout(1000);

    const highRisk = await page.textContent('#riskAnalysis');
    const highSavings = await page.textContent('#rightspendSavings');

    console.log('With 50% growth:');
    console.log('Risk analysis:', highRisk.substring(0, 100) + '...');
    console.log('Annual savings:', highSavings);
    console.log('');

    // Check if chart updated
    const chartCanvas = await page.locator('#savingsChart');
    const isVisible = await chartCanvas.isVisible();
    console.log('Chart visible:', isVisible);

    // Take a screenshot to see the state
    await page.screenshot({ path: 'calculator-test.png' });
    console.log('\nScreenshot saved to calculator-test.png');

    await browser.close();
})();
