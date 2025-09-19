class HtmlUtils {
    /**
     * @param {string} tag 
     * @param {Object} [props]
     * @returns {HTMLElement}
     */
    create(tag, props = {}) {
        const element = document.createElement(tag);
        Object.assign(element, props);
        return element;
    }
    
    /**
     * @param {string} url 
     * @returns {HTMLLinkElement}
     */
    styles(url) {
        return Html.create("link", { rel: "stylesheet", href: url });
    }

    /**
     * @param {string[]} data 
     * @param {function(item: any): string}
     * @returns {HTMLUListElement}
     */
    renderList(data, renderFn) {
        const ul = Html.create("ul");
        for (const item of data) {
            const li = Html.create("li");
            li.textContent = renderFn(item);
            ul.appendChild(li);
        }
        return ul;
    }

    /**
     * @param {string} url
     * @param {Object} [props]
     * @returns {Promise<SVGElement>}
     */
    async icon(url, props = {}) {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`Failed to load SVG icon from ${url}`);
            return Html.create("span", { textContent: "⚠️" });
        }
        const rawSvg = await res.text();
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = rawSvg.trim();
        const svgEl = tempContainer.querySelector("svg");
        if (!svgEl) {
            console.warn(`No <svg> found in ${url}`);
            return Html.create("span", { textContent: "❌" });
        }
        Object.assign(svgEl, props);
        return svgEl;
    }
}

export const Html = new HtmlUtils();