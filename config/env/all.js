module.exports = {
    app:{},
    static: {
        js: ['public/**/*.js'],
        css: ['']
    },
    sessionSecret: 'cat',
    port: process.env.PORT || 4000,
    templateEngine: 'ejs'
};