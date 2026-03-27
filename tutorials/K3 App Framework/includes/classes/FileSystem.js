K3AF.FileSystem = new (function () {


    this.getExecutedFiles = function getExecutedFiles() {
        return EXECUTED_FILES;
    };

    var EXECUTED_FILES = typeof K3AF.FileSystem === 'undefined' ? {} : K3AF.FileSystem.getExecutedFiles();
    EXECUTED_FILES['includes/classes/FileSystem.js'] = Date.now();

    /**
     * Filtert alle nicht .js Dateien heraus
     * @param a
     * @returns {boolean}
     */
    this.ONLY_JS = function ONLY_JS(a) {
        return a.endsWith('.js');
    };
    /**
     * Filtert, so dass nur noch Ordner returned werden
     * @param a
     * @returns {boolean}
     */
    this.ONLY_DIR = function ONLY_DIR(a) {
        return a.endsWith('/');
    };
    /**
     * Filtert alle Ordner raus
     * @param a
     * @return {boolean}
     */
    this.NO_DIR = function NO_DIR(a) {
        return !a.endsWith('/');
    };
    /**
     * filtert den www Ordner
     * @param a
     * @returns {boolean}
     */
    this.EXCLUDE_WWW = function EXCLUDE_WWW(a) {
        return !a.startsWith('www/') && !a.startsWith('shared/www/');
    };


    /**
     * Bindet die Datei im globalen Kontext ein. Die Datei wird geflagged und kann nicht erneut durch require eingebunden werden.
     * @param {string} file
     * @returns undefined
     */
    this.require = function require(file) {
        var normalized = this.normalizePath(file);
        if (this.exists(normalized)) {
            if (typeof EXECUTED_FILES[normalized] === 'undefined') {
                require(normalized);
                EXECUTED_FILES[normalized] = new Date();
            } else {
                K3AF.debug('File ' + normalized + ' (' + file + ')' + ' already executed at ' + EXECUTED_FILES[normalized].toLocaleString());
            }
        } else {
            K3AF.error('File ' + normalized + '(' + file + ')' + ' not found.');
        }

    };

    /**
     * Führt die angegebene Datei im globalen Kontext aus.
     * @param {string} file
     * @returns undefined
     */
    this.execute = function execute(file) {
        var normalized = this.normalizePath(file);
        if (this.exists(normalized)) {
            KnuddelsServer.execute(normalized);
            EXECUTED_FILES[normalized] = new Date();
        } else {
            KnuddelsServer.getDefaultLogger().error('File ' + normalized + '(' + file + ')' + ' not found.');
        }

    };

    /**
     * Updated alle Dateien der App und gibt eine Liste der geänderten Dateien zurück.
     * @returns {String[]}
     */
    this.updateAppFiles = function updateAppFiles() {
        return KnuddelsServer.getAppAccess().getOwnInstance().getRootInstance().updateAppFiles();
    };


    /**
     *
     * @param {String} path
     * @param {boolean} [recursive=false]
     * @param {function[]} [filter=[]]
     * @returns {String[]}
     */
    this.listFiles = function listFiles(path, recursive, filter) {
        recursive = typeof recursive === 'undefined' ? false : recursive;
        filter = typeof filter === 'undefined' ? [] : filter;

        var _files = KnuddelsServer.listFiles(path);
        _files.forEach(function (file) {
            if (recursive && file.endsWith('/')) {
                _files = _files.concat(this.listFiles(file, true));
            }
        }, this);

        filter.forEach(function (func) {
            _files = _files.filter(func);
        });


        return _files;
    };


    this.requireDir = function requireDir(path, recursive, filter) {
        recursive = typeof recursive === 'undefined' ? false : recursive;
        filter = typeof filter === 'undefined' ? [] : filter;
        var files = this.listFiles(path, recursive, [this.ONLY_JS].concat(filter));
        files.forEach(function (file) {
            this.require(file);
        }, this);
    };

    this.executeDir = function executeDir(path, recursive, filter) {
        recursive = typeof recursive === 'undefined' ? false : recursive;
        filter = typeof filter === 'undefined' ? [] : filter;
        var files = this.listFiles(path, recursive, [this.ONLY_JS].concat(filter));
        files.forEach(function (file) {
            this.execute(file);
        }, this);
    };


    /**
     *
     * @returns String
     * @param {String} path
     */
    this.normalizePath = function normalizePath(path) {
        return this.dirname(path) + this.basename(path);
    };

    /**
     *
     * @returns String
     * @param {String} path
     */
    this.basename = function basename(path) {
        var tmp = path.endsWith('/') ? path.substr(0, path.length - 1) : path;
        var base = tmp.replace(/.*\//, "");

        return path.endsWith('/') ? base + '/' : base;

    };

    /**
     *
     * @returns String
     * @param {String} path
     */
    this.dirname = function dirname(path) {
        var parts = path.split('/');
        if(parts.length === 1) return '';
        var pathCombine = [];

        parts.forEach(function (part) {
            if (part === '') {
                return;
            }
            if (part === '.') {
                return;
            }
            if (part === '..') {
                pathCombine.pop();
                return;
            }
            pathCombine.push(part);
        });


        if (pathCombine.length === 1) {
            return pathCombine[0];
        }
        pathCombine.pop();

        return pathCombine.join('/') + '/';

    };


    /**
     *
     * @returns boolean
     * @param {String} path
     */
    this.exists = function exists(path) {
        var filename = this.basename(path);
        var dir = this.dirname(path);
        var files = this.listFiles(dir);
        return files.indexOf(dir + filename) >= 0;
    };

    /**
     *
     * @returns String[]
     */
    this.updateAppFiles = function updateAppFiles() {
        return KnuddelsServer.getAppAccess().getOwnInstance().getRootInstance().updateAppFiles();
    };


    return this;
});
