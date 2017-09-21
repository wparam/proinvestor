module.exports = {
    app:{},
    static: {
        js: ['public/**/*.js'],
        css: ['']
    },
    port: process.env.PORT || 4000,
    templateEngine: 'ejs'
}