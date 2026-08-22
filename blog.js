/**
 * Kirat Singh Blog Data and Renderer (blog.js)
 * Fetches post metadata from blog-data/posts.json and post content from blog-data/[slug].md
 *
 * blog.html has a single mount point, #blog-post-content, that this file
 * routes into based on the URL hash — either the full post archive (no hash)
 * or a single post (#slug). Because clicking an in-page anchor link only
 * changes the hash (no full page reload, no fresh DOMContentLoaded), routing
 * is driven by a 'hashchange' listener as well as the initial load.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Markdown Utility Functions ---
    function parseMarkdown(markdown) {
        const parts = markdown.split('---');
        if (parts.length < 3) return { data: {}, body: markdown };
        const frontMatter = parts[1];
        const body = parts.slice(2).join('---').trim();
        const lines = frontMatter.split('\n').filter(line => line.trim() !== '');
        const data = {};
        lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim().replace(/"/g, '');
            data[key.trim()] = value;
        });
        return { data, body };
    }

    function renderMarkdown(markdown) {
        let html = markdown;

        html = html
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/`([^`]+)`/gim, '<code>$1</code>');

        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        const listRegex = /(<li>.*<\/li>(\n<li>.*<\/li>)*)/g;
        html = html.replace(listRegex, '<ul>$1</ul>');

        html = html
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>');

        html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">');
        html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');

        const lines = html.split('\n').filter(line => line.trim() !== '');
        html = lines.map(line => {
            if (line.match(/^<(h|u|p|img|d|t)/i)) {
                return line;
            } else {
                return `<p>${line}</p>`;
            }
        }).join('');

        return html;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function postRowHtml(post) {
        const postLink = `blog.html#${post.slug}`;
        return `
            <a href="${postLink}" class="post-row">
                <div class="post-row-top">
                    <h3>${post.title}</h3>
                    <span class="post-date">${formatDate(post.date)}</span>
                </div>
                <p class="post-snippet">${post.snippet || ''}</p>
            </a>
        `;
    }

    function fetchPosts() {
        const url = `blog-data/posts.json?v=${new Date().getTime()}`;
        return fetch(url).then(response => {
            if (!response.ok) throw new Error('Could not load blog-data/posts.json');
            return response.json();
        }).then(posts => {
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            return posts;
        });
    }

    // --- Homepage preview (index.html): fixed, never routes on hash ---
    const HOMEPAGE_LIMIT = 3;
    const isBlogPage = !!document.getElementById('blog-post-content') || window.location.pathname.includes('blog');

    if (!isBlogPage) {
        const blogListContainer = document.getElementById('blog-list');
        if (blogListContainer) {
            fetchPosts()
                .then(posts => {
                    blogListContainer.innerHTML = posts.slice(0, HOMEPAGE_LIMIT).map(postRowHtml).join('');
                })
                .catch(error => {
                    blogListContainer.innerHTML = `<p>Couldn't load posts right now. Check the console.</p>`;
                    console.error('Error fetching blog posts index:', error);
                });
        }
        return;
    }

    // --- blog.html: router driven by the URL hash ---
    const mount = document.getElementById('blog-post-content');
    if (!mount) return;

    function renderArchive() {
        mount.innerHTML = `
            <div class="blog-page-head">
              <h1>the blog</h1>
              <p>experiments, wins, and the occasional "why did i even try this"</p>
            </div>
            <div class="blog-list-full"><div id="blog-list">Loading…</div></div>
        `;
        const listEl = document.getElementById('blog-list');
        fetchPosts()
            .then(posts => {
                listEl.innerHTML = posts.map(postRowHtml).join('');
            })
            .catch(error => {
                listEl.innerHTML = `<p>Couldn't load posts right now. Check the console.</p>`;
                console.error('Error fetching blog posts index:', error);
            });
    }

    function renderPost(slug) {
        mount.innerHTML = `<p style="padding:56px 24px 0; max-width:640px; margin:0 auto;">Loading…</p>`;
        fetch(`blog-data/${slug}.md`)
            .then(response => {
                if (!response.ok) throw new Error(`Post not found at blog-data/${slug}.md`);
                return response.text();
            })
            .then(markdown => {
                const { data, body } = parseMarkdown(markdown);
                mount.innerHTML = `
                    <article class="blog-post">
                        <h2>${data.title}</h2>
                        <p class="post-meta">${formatDate(data.date)}</p>
                        <div class="post-body">${renderMarkdown(body)}</div>
                        <a class="back-link" href="blog.html">&larr; back to all posts</a>
                    </article>
                `;
            })
            .catch(error => {
                mount.innerHTML = `<p style="padding:56px 24px 0; max-width:640px; margin:0 auto;">Couldn't load that post. ${error.message}</p>`;
                console.error('Error fetching post:', error);
            });
    }

    function route() {
        const slug = decodeURIComponent(window.location.hash.substring(1));
        if (slug) {
            renderPost(slug);
        } else {
            renderArchive();
        }
        window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', route);
    route();
});
