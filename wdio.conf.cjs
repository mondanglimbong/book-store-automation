exports.config = {
    runner: 'local',
    specs: [
        './test/specs/*/.*.js'
    ],
    maxInstances: 5,
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless', '--disable-gpu'],
            },
        },
    ],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec', ['allure', { outputDir: './allure-results' }]],
    mochaOpts: {
        require: ['@babel/register'],
        timeout: 60000
    },
    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        if (error) {
            browser.takeScreenshot();
        }
    }
}