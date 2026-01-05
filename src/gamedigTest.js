const { GameDig } = require('gamedig');

const TYPE = 'minecraft';
const HOST = '127.0.0.1';
const PORT = 25565;

(async () => {
    try {
        const result = await GameDig.query({
            type: TYPE,
            host: HOST,
            port: PORT,
            maxAttempts: 1,
            socketTimeout: 2000
        });
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();
