const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('=== Test 1: Initial Load - Check scroll position ===');
    await page.goto('https://rightspend.ai/aws-savings-calculator.html');
    await page.waitForTimeout(2000);

    // Get scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log('Initial scroll Y:', scrollY);
    console.log('Is lead capture form visible?', await page.isVisible('#leadCaptureSection'));

    // Check if calculator is visible
    const calcVisible = await page.isVisible('.bg-white.rounded-2xl.shadow-2xl');
    console.log('Calculator panel visible:', calcVisible);

    console.log('\n=== Test 2: Check initial calculation values ===');
    const monthlySpend = await page.inputValue('#monthlySpend');
    const coverage = await page.inputValue('#currentCoverage');
    const growthRate = await page.inputValue('#growthRate');

    console.log('Monthly spend:', monthlySpend);
    console.log('Coverage:', coverage);
    console.log('Growth rate:', growthRate);

    // Get calculated values
    const currentCost = await page.textContent('#currentCost');
    const uncoveredSpend = await page.textContent('#uncoveredSpend');
    const rightspendSavings = await page.textContent('#rightspendSavings');
    const traditionalSavings = await page.textContent('#traditionalSavings');

    console.log('\n=== Current Display Values ===');
    console.log('Current Cost (annual):', currentCost);
    console.log('Uncovered Spend (monthly):', uncoveredSpend);
    console.log('RightSpend Savings (annual):', rightspendSavings);
    console.log('Traditional Savings (annual):', traditionalSavings);

    // Manual calculation check
    const spend = parseFloat(monthlySpend);
    const cov = parseFloat(coverage);
    const uncovered = spend * (1 - cov / 100);
    const currentAnnual = spend * 12;

    console.log('\n=== Expected Calculations ===');
    console.log('Monthly spend:', spend);
    console.log('Coverage:', cov, '%');
    console.log('Uncovered monthly should be:', spend, '*', '(1 -', cov/100, ') =', uncovered);
    console.log('Current annual cost should be:', spend, '* 12 =', currentAnnual);

    console.log('\n=== Test 3: Change values and recalculate ===');
    await page.fill('#monthlySpend', '100000');
    await page.waitForTimeout(1000);

    const currentCost2 = await page.textContent('#currentCost');
    const uncoveredSpend2 = await page.textContent('#uncoveredSpend');
    console.log('After changing spend to $100,000:');
    console.log('Current Cost:', currentCost2);
    console.log('Uncovered Spend:', uncoveredSpend2);

    // Expected:
    // Monthly: $100,000, Coverage: 30%
    // Uncovered: 100000 * (1 - 0.30) = 100000 * 0.70 = $70,000/month
    // Current annual: 100000 * 12 = $1,200,000

    console.log('\n=== Test 4: High coverage scenario (70%) ===');
    await page.fill('#currentCoverage', '70');
    await page.waitForTimeout(1000);

    const currentCost3 = await page.textContent('#currentCost');
    const uncoveredSpend3 = await page.textContent('#uncoveredSpend');
    const rightspendSavings3 = await page.textContent('#rightspendSavings');

    console.log('With 70% coverage:');
    console.log('Current Cost:', currentCost3);
    console.log('Uncovered Spend:', uncoveredSpend3);
    console.log('RightSpend Savings:', rightspendSavings3);

    // Expected:
    // Monthly: $100,000, Coverage: 70%
    // Uncovered: 100000 * (1 - 0.70) = 100000 * 0.30 = $30,000/month
    // Current annual should still be: 100000 * 12 = $1,200,000 (this is WRONG - should account for existing coverage!)

    console.log('\n=== Test 5: Check if auto-scroll happens ===');
    await page.fill('#monthlySpend', '50000');
    await page.waitForTimeout(1500);

    const scrollY2 = await page.evaluate(() => window.scrollY);
    console.log('Scroll after calculation:', scrollY2);
    console.log('Is lead capture section still visible?', await page.isVisible('#leadCaptureSection'));

    console.log('\n=== Test 6: Negative growth rate ===');
    await page.fill('#growthRate', '-20');
    await page.waitForTimeout(1000);

    const riskAnalysis = await page.textContent('#riskAnalysis');
    console.log('Risk analysis text:', riskAnalysis);

    await page.waitForTimeout(3000);
    await browser.close();
})();
