module.exports = ({
    local: {
        baseURL : 'http://localhost:8080/',
        launchOptions: { headless: false },
        timeout: 50000,
        username: 'admin@gmail.com',
        password: 'admin'
    },
    CI: {
        baseURL : 'http://localhost:8080/',
        username: 'admin@gmail.com',
        password: 'admin',
        launchOptions: { 
            executablePath: process.env.PUPPETEER_EXEC_PATH,
            headless: true,
            args: ['--no-sandbox'],
        },
        timeout: 50000,
    },
    test: {},
    prod: {}
})[process.env.TESTENV || 'local'];