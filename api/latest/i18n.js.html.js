tui.util.defineNamespace("fedoc.content", {});
fedoc.content["i18n.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Implements i18n\n * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.\n */\n\nconst util = tui.util;\n\nlet sharedInstance;\n\nconst DEFAULT_CODE = 'en_US';\n\n/**\n * I18n\n * @exports I18n\n * @class\n */\nclass I18n {\n    constructor() {\n        this._code = DEFAULT_CODE;\n        this._langs = new util.Map();\n    }\n\n    /**\n     * Set locale code\n     * @param {string} code locale code\n     */\n    setCode(code) {\n        this._code = code;\n    }\n\n    /**\n     * Set language set\n     * @param {string|string[]} codes locale code\n     * @param {object} data language set\n     */\n    setLang(codes, data) {\n        codes = [].concat(codes);\n\n        codes.forEach(code => {\n            if (!this._langs.has(code)) {\n                this._langs.set(code, data);\n            } else {\n                const langData = this._langs.get(code);\n                this._langs.set(code, util.extend(langData, data));\n            }\n        });\n    }\n\n    /**\n     * Get text of key\n     * @param {string} key key of text\n     * @param {string} code locale code\n     * @returns {string}\n     */\n    get(key, code) {\n        if (!code) {\n            code = this._code;\n        }\n\n        let langSet = this._langs.get(code);\n\n        if (!langSet) {\n            langSet = this._langs.get(DEFAULT_CODE);\n        }\n\n        const text = langSet[key];\n\n        if (!text) {\n            throw new Error(`There is no text key \"${key}\" in ${code}`);\n        }\n\n        return text;\n    }\n\n    static getSharedInstance() {\n        if (!sharedInstance) {\n            sharedInstance = new I18n();\n        }\n\n        return sharedInstance;\n    }\n}\n\nexport {I18n};\nexport default I18n.getSharedInstance();\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"