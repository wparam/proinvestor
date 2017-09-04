module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', { title: 'AM', message: 'This is a test site'});
    });

    app.all(() => {
        console.log('hit all');
    });

    app.get('/test', (req, res) => {
        console.log('hit htest');
    });
}
