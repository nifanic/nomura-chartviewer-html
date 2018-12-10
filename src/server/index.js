/**
 * Created by nifanic on 2018-12-06.
 */
const express = require('express');
const cors = require('cors');
const os = require('os');
const apiServer = express();
const PORT = process.env.PORT || 8085;
const path = require('path');
const PATH_TO = require('../config/paths');

apiServer.use(cors());
apiServer.use(express.static(PATH_TO.public));
apiServer.get('/api/v1/getUsername', (req, res, next) => {
	try {
		res.status(200).send({ username: os.userInfo().username });
	} catch (e) {
		next(e)
	}
});
apiServer.get('*', (req, res) => {
	res.sendFile(path.join(PATH_TO.public, 'index.html'));
});
apiServer.listen(PORT, () => console.log(`CORS-enabled 👻 API server listening on port ${PORT}...`));
