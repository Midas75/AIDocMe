import hljs from "./highlight/es/core.js"
import plaintext from "./highlight/es/languages/plaintext.min.js"
import python from "./highlight/es/languages/python.min.js"
const RegenIcon = `
<svg t="1749973696075" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2347"
    width="256" height="256">
    <path d="M262.393145 432.991484h300.54703v101.880349H262.393145z" p-id="2348"></path>
    <path
        d="M489.076921 1018.803491h-417.709431V0h881.26502v475.78123h-101.880349V101.880349h-677.504322v815.042793h315.829082v101.880349z"
        p-id="2349"></path>
    <path
        d="M262.393145 216.495742h499.21371v101.880349H262.393145zM797.672499 911.829124a105.802743 105.802743 0 0 1-45.183935 10.188035 106.974367 106.974367 0 0 1 0-213.948733c2.394188 0 4.839317 0 7.233505 0.254701l-12.989745 74.729236 205.900186-91.692314-163.008559-155.927874-12.582223 72.335048a211.707365 211.707365 0 0 0-24.756925-1.477266 208.854716 208.854716 0 0 0 0 417.709432 206.969929 206.969929 0 0 0 88.330263-19.561027 209.160357 209.160357 0 0 0 49.361029-32.245131l-67.19009-76.410262a106.363084 106.363084 0 0 1-25.113506 16.046155z"
        p-id="2350" data-spm-anchor-id="a313x.search_index.0.i0.775e3a81S7DIu0" class="selected" fill="#2c2c2c"></path>
</svg>
`
export class AIDocMe {
    serialized = {};
    fileName = "";
    openAIUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    apiKey = ""
    model = "ep-20250522175540-clbcq"
    lang = "英文"
    _codeEl = null
    _docEl = null
    _segEl = null
    constructor() {
        hljs.registerLanguage("python", python);
        hljs.registerLanguage("plaintext", plaintext);
    }
    joinSeg() {
        return this.serialized.seg.map(item => item.content).join("")
    }
    joinVisSeg() {
        let results = []
        const color1 = "#F0F0F0", color2 = "#d0d0d0"
        let color = true
        for (const item of this.serialized.seg) {
            let span = document.createElement("span")
            span.classList.add("language-plaintext", "hljs")
            span.style.borderLeft = "1px solid #000"
            span.style.borderRight = "1px solid #000"
            span.style.backgroundColor = color ? color1 : color2
            span.innerHTML = item.content
            color = !color
            results.push(span.outerHTML)
        }
        return results.join("")
    }
    hlCode() {
        document.querySelectorAll('code').forEach((e) => {
            if (!e.dataset.highlighted) {
                hljs.highlightElement(e);
            }
        })
    }
    renderCode(el) {
        this._codeEl = el
        el.innerHTML = "";
        let joined = this.joinSeg()
        el.append(this.elPreCode(joined, { hl: "python" }).pre)
        this.hlCode()
    }
    renderDoc(el) {
        this._docEl = el
        el.innerHTML = "";
        for (const c of this.serialized.content) {
            el.append(this.elTemplateElement(c))
        }
        this.hlCode()
    }
    renderSeg(el) {
        this._segEl = el
        el.innerHTML = "";
        el.append(this.elPreCode(this.joinVisSeg()).pre)
    }
    elCode(content, options = {}) {
        let code = document.createElement("code")
        code.classList.add(`language-${options.hl ?? "plaintext"}`)
        code.innerHTML = content
        return { code }
    }
    elPreCode(content, options = {}) {
        let pre = document.createElement("pre")
        // pre.style.minWidth = "100%"
        // pre.style.display = "inline-block"
        let code = this.elCode(content, options).code
        pre.append(code)
        return { pre, code }
    }
    moduleDocstringRequestBody() {
        const systemPrompt = [`如下是一份代码的全文，请你根据代码的全文，`,
            `使用${this.lang}撰写这份代码的module docstring，`,
            `要尽量符合python docstring的规范，`,
            `并且每行应当控制在100个字符以内（可以更少点，80字符）。`,
            `如果这个代码已经有module docstring，`,
            `那么你应当结合其内容，重新写一份。`,
            `在撰写时，你一定要注意保留python docstring所要求的引号格式`,
            `并且只可以写docstring，不可以附加上下文的代码，`,
            `因为你输出的内容将会直接被替换至python代码中作为docstring。`,
            `代码如下：\n`].join("")
        return {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: [{
                        type: "text",
                        text: systemPrompt
                    }, {
                        type: "text",
                        text: this.joinSeg()
                    }]
                }
            ],
            stream: true,
            thinking: {
                type: "disabled"
            }
        }
    }
    methodDocstringRequestBody(methodSignature) {
        const systemPrompt = [`如下是一份代码的全文，请你根据代码的全文，`,
            `使用${this.lang}撰写这份代码方法中，${methodSignature}的method docstring，`,
            `要尽量符合python docstring的规范，`,
            `并且每行应当控制在100个字符以内（可以更少点，80字符）。`,
            `如果这个代码已经有method docstring，`,
            `那么你应当结合其内容，重新写一份。`,
            `在撰写时，你一定要注意保留python docstring所要求的引号格式`,
            `（"""或'''），`,
            `并且只可以写docstring，不可以附加上下文的代码。`,
            `因为你输出的内容将会直接被替换至python代码中作为docstring。`,
            `代码如下：\n`].join("")
        return {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: [{
                        type: "text",
                        text: systemPrompt
                    }, {
                        type: "text",
                        text: this.joinSeg()
                    }]
                }
            ],
            stream: true,
            thinking: {
                type: "disabled"
            }
        }
    }
    classDocstringRequestBody(classSignature) {
        const systemPrompt = [`如下是一份代码的全文，请你根据代码的全文，`,
            `使用${this.lang}撰写这份代码方法中，${classSignature}的class docstring，`,
            `要尽量符合python docstring的规范，`,
            `并且每行应当控制在100个字符以内（可以更少点，80字符）。`,
            `如果这个代码已经有class docstring，`,
            `那么你应当结合其内容，重新写一份。`,
            `在撰写时，你一定要注意保留python docstring所要求的引号格式`,
            `（"""或'''），`,
            `并且只可以写docstring，不可以附加上下文的代码。`,
            `因为你输出的内容将会直接被替换至python代码中作为docstring。`,
            `代码如下：\n`].join("")
        return {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: [{
                        type: "text",
                        text: systemPrompt
                    }, {
                        type: "text",
                        text: this.joinSeg()
                    }]
                }
            ],
            stream: true,
            thinking: {
                type: "disabled"
            }
        }
    }
    cleandoc(doc) {
        if (typeof doc !== 'string') return null;

        doc = doc.trim();

        const tripleQuotes = ['"""', "'''"];
        for (const quote of tripleQuotes) {
            if (doc.startsWith(quote)) {
                doc = doc.slice(quote.length).trimStart();
                if (doc.endsWith(quote)) {
                    doc = doc.slice(0, -quote.length).trimEnd();
                }
                break;
            }
        }

        const lines = doc.replace(/\t/g, '    ').split('\n');

        if (lines.length === 0) return '';

        let margin = Infinity;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().length === 0) continue;
            const indent = line.length - line.trimStart().length;
            if (indent < margin) {
                margin = indent;
            }
        }

        lines[0] = lines[0].trimStart();
        if (margin !== Infinity) {
            for (let i = 1; i < lines.length; i++) {
                lines[i] = lines[i].slice(margin);
            }
        }
        while (lines.length && lines[0].trim() === '') {
            lines.shift();
        }
        while (lines.length && lines[lines.length - 1].trim() === '') {
            lines.pop();
        }

        return lines.join('\n');
    }
    async aiGen(code, requestBody, contentObject) {
        const response = await fetch(
            this.openAIUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            }
        )
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let result = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith("data:"));

            for (const line of lines) {
                const message = line.replace(/^data:\s*/, '');
                if (message === "[DONE]") {
                    break;
                }
                try {
                    const parsed = JSON.parse(message)
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        result += content
                        code.innerHTML = this.cleandoc(result)
                        delete code.dataset.highlighted
                        hljs.highlightElement(code)
                    }
                } catch (e) {
                    console.log(e)
                    break;
                }
            }

        }
        result += "\n"
        contentObject.doc = result
        this.updateSegDoc(contentObject.doc_i, result)
        if (this._codeEl) {
            this.renderCode(this._codeEl)
        }
        if (this._segEl) {
            this.renderSeg(this._segEl)
        }
    }
    getIndent(doc_i) {
        if (doc_i == 0) {
            return "";
        }
        else {
            const lastLine = this.serialized.seg[doc_i - 1].content.split('\n').pop();
            const trailingIndent = lastLine.match(/\s+$/);

            return trailingIndent ? trailingIndent[0] : "";
        }
    }
    updateSegDoc(doc_i, content) {
        const indent = this.getIndent(doc_i);
        console.log("[" + indent + "]", indent.length)
        if (indent.length == 0) {
            try {
                console.warn(JSON.stringify(this.serialized.seg[doc_i - 1].content))
            } catch (e) {

            }
        }
        const match = this.serialized.seg[doc_i].content.match(/[ \t\r\n]+$/)
        this.serialized.seg[doc_i].content = content.replace(/\n/g, "\n" + indent) + (match ? match[0] : "")
    }
    elDoc(content, options = {}) {
        let doc = document.createElement("div")
        let preCode = this.elPreCode(content, options)
        let toolbar = document.createElement("div")
        toolbar.style.paddingLeft = "5px"
        let regen = document.createElement("button")
        regen.innerHTML = `<img style="width:100%;height:100%;object-fit:contain;" src="data:image/svg+xml,${encodeURIComponent(RegenIcon)}">`
        regen.style.height = "25px"
        regen.style.padding = "0"
        toolbar.append(regen)
        preCode.pre.append(toolbar)
        doc.append(preCode.pre)
        return { doc, toolbar, regen, code: preCode.code, pre: preCode.pre }
    }
    elTemplateElement(content) {
        let container = document.createElement('div');
        let l = content.level + 1 + 2;
        if (l > 6) {
            l = 6;
        }
        let h = document.createElement(`h${l}`);
        let title = this.elCode(content.title, { hl: "python" }).code
        h.innerHTML = `${content.seq}`
        h.append(title)
        let ed = this.elDoc(content.doc, { hl: "plaintext" })
        let doc = ed.doc
        let tts = this
        if (content.doc_type == "MODULE") {
            ed.regen.onclick = (e) => {
                tts.aiGen(ed.code, tts.moduleDocstringRequestBody(), content)
            }
        }
        else if (content.doc_type == "METHOD") {
            ed.regen.onclick = (e) => {
                tts.aiGen(ed.code, tts.methodDocstringRequestBody(content.signature), content)
            }
        } else if (content.doc_type == "CLASS") {
            ed.regen.onclick = (e) => {
                tts.aiGen(ed.code, tts.classDocstringRequestBody(content.signature), content)
            }
        }
        container.append(h, doc);
        if (content.doc_type == "CLASS" || content.doc_type == "METHOD") {
            container.append(
                this.elPreCode(content.signature, { hl: "python" }).pre
            )
        }
        return container;
    }
} 