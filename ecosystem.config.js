module.exports = {
    apps : [{
        name: "vuessr",
        script: "./index.js",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        },
        output: './logs/out.json',
        error: './logs/error.json',
        log_type:'json',
        log_date_format:'YYYY-MM-DD HH:mm',
        watch:true,
        ignore_watch:['node_modules','logs']
    }]
}
