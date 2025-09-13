import hljs from "./highlight/es/core.js"
import plaintext from "./highlight/es/languages/plaintext.min.js"
import python from "./highlight/es/languages/python.min.js"
import Swal from "./sweetalert2.esm.all.js"
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
const PromptIcon = `
<svg t="1750831214843" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5463"
    width="256" height="256">
    <path
        d="M554.666667 128a32 32 0 1 1-0.512 64H213.333333a21.333333 21.333333 0 0 0-21.333333 21.333333v597.333334a21.333333 21.333333 0 0 0 21.333333 21.333333h597.333334a21.333333 21.333333 0 0 0 21.333333-21.333333V469.312l0.149333-3.050667A32 32 0 0 1 896 469.333333v341.333334a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333z"
        fill="#2c2c2c" p-id="5464"></path>
    <path d="M298.581333 521.194667m32 0l192 0q32 0 32 32l0 0q0 32-32 32l-192 0q-32 0-32-32l0 0q0-32 32-32Z"
        fill="#2c2c2c" p-id="5465"></path>
    <path d="M298.581333 670.528m32 0l320 0q32 0 32 32l0 0q0 32-32 32l-320 0q-32 0-32-32l0 0q0-32 32-32Z" fill="#2c2c2c"
        p-id="5466"></path>
    <path d="M789.333333 106.666667a128 128 0 1 1 0 256 128 128 0 0 1 0-256z m0 64a64 64 0 1 0 0 128 64 64 0 0 0 0-128z"
        fill="#2c2c2c" p-id="5467"></path>
</svg>
`
export class AIDocMe {
    serialized = {};
    openAIUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    apiKey = "76a878dc-4905-44c3-858c-8ef33006250f"
    model = "ep-20250522175540-clbcq"
    lang = "English"
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
    downloadCode() {
        const blob = new Blob([this.joinSeg()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a")
        a.style.display = "none";
        a.href = url
        a.download = this.serialized.file_name;
        a.click();
        URL.revokeObjectURL(url);
    }
    renderCode(el) {
        this._codeEl = el
        el.innerHTML = "";
        let joined = this.joinSeg()
        let pre = this.elPreCode(joined, { hl: "python" }).pre
        pre.style.width = "max-content"
        pre.style.minWidth = "100%"
        el.append(pre)
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
            `（"""或'''）。\n`,
            `**注意：你只可以写docstring，不可以附加上下文的代码**。\n`,
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
    methodDocstringRequestBody(methodName, methodSignature) {
        const systemPrompt = [`如下是一份代码的全文，请你根据代码的全文，`,
            `使用${this.lang}撰写这份代码方法中，\`${methodName}\`的method docstring，`,
            `这个方法的完整签名是\n\`\`\`python\n${methodSignature}\n\`\`\`\n`,
            `要尽量符合python docstring的规范，`,
            `并且每行应当控制在100个字符以内（可以更少点，80字符）。`,
            `如果这个代码已经有method docstring，`,
            `那么你应当结合其内容，重新写一份。`,
            `在撰写时，你一定要注意保留python docstring所要求的引号格式`,
            `（"""或'''）。\n`,
            `**注意：你只可以写docstring，不可以附加上下文的代码**。\n`,
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
    classDocstringRequestBody(className, classSignature) {
        const systemPrompt = [`如下是一份代码的全文，请你根据代码的全文，`,
            `使用${this.lang}撰写这份代码类中，\`${className}\`的class docstring，`,
            `这个类的完整签名是\n\`\`\`python\n${classSignature}\n\`\`\`\n`,
            `并且每行应当控制在100个字符以内（可以更少点，80字符）。`,
            `如果这个代码已经有class docstring，`,
            `那么你应当结合其内容，重新写一份。`,
            `在撰写时，你一定要注意保留python docstring所要求的引号格式`,
            `（"""或'''）。\n`,
            `**注意：你只可以写docstring，不可以附加上下文的代码**。\n`,
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
        try {
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
                    const parsed = JSON.parse(message)
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        result += content
                        code.innerHTML = this.cleandoc(result)
                        delete code.dataset.highlighted
                        hljs.highlightElement(code)
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
        } catch (e) {
            await Swal.fire({
                title: "Error",
                icon: "error",
                text: e
            })
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
        regen.style.marginRight = "2px"
        let prompt = document.createElement("button")
        prompt.innerHTML = `<img style="width:100%;height:100%;object-fit:contain;" src="data:image/svg+xml,${encodeURIComponent(PromptIcon)}">`
        prompt.style.height = "25px"
        prompt.style.padding = "0"
        prompt.style.marginRight = "2px"
        toolbar.append(regen, prompt)
        preCode.pre.append(toolbar)
        doc.append(preCode.pre)
        return { doc, toolbar, regen, prompt, code: preCode.code, pre: preCode.pre }
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

            ed.prompt.onclick = (e) => {
                let div = document.createElement("div")
                div.style.textAlign = "left"
                // div.classList.add("language-plaintext", "hljs")
                div.style.padding = "5px";
                let pureText = tts.moduleDocstringRequestBody().messages[0].content[0].text
                div.innerHTML = window.render(pureText, {
                    htmlTags: true,
                    typographer: false
                })
                Swal.fire({
                    title: "Prompt",
                    html: div
                })
            }
        }
        else if (content.doc_type == "METHOD") {
            ed.regen.onclick = (e) => {
                tts.aiGen(ed.code, tts.methodDocstringRequestBody(content.title, content.signature), content)
            }

            ed.prompt.onclick = (e) => {
                let div = document.createElement("div")
                div.style.textAlign = "left"
                // div.classList.add("language-plaintext", "hljs")
                div.style.padding = "5px";
                // div.style.whiteSpace = "pre-wrap"
                let pureText = tts.methodDocstringRequestBody(content.title, content.signature).messages[0].content[0].text
                div.innerHTML = window.render(pureText, {
                    htmlTags: true,
                    typographer: false
                })
                Swal.fire({
                    title: "Prompt",
                    html: div
                })
            }
        } else if (content.doc_type == "CLASS") {
            ed.regen.onclick = (e) => {
                tts.aiGen(ed.code, tts.classDocstringRequestBody(content.title, content.signature), content)
            }
            ed.prompt.onclick = (e) => {
                let div = document.createElement("div")
                div.style.textAlign = "left"
                // div.classList.add("language-plaintext", "hljs")
                div.style.padding = "5px";
                let pureText = tts.classDocstringRequestBody(content.title, content.signature).messages[0].content[0].text
                div.innerHTML = window.render(pureText, {
                    htmlTags: true,
                    typographer: false
                })
                Swal.fire({
                    title: "Prompt",
                    html: div
                })
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