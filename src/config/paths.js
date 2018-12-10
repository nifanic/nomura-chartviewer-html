const path = require('path');
const appDir = path.resolve(__dirname, '../..');

const resolveApp = (relativePath) => {
	return path.resolve(appDir, relativePath);
};

module.exports = {
	build: resolveApp('build'),
	public: resolveApp('dist'),
	src: resolveApp('src'),
	appDir: appDir
};