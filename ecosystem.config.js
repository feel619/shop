module.exports = {
    apps: [{
        name: "app",
        script: "./server.js",
        output: './log/out.log',
        error: './log/error.log',
        log: './log/combined.outerr.log',
    }]
}