/**
 * Kirat Singh Blog Data and Renderer (blog.js)
 * Fetches post metadata from /blog-data/posts.json and post content from /blog-data/[slug].md
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

    // --- Main Logic to Fetch and Display Posts ---
    const blogListContainer = document.getElementById('blog-list');
    const blogPostContentContainer = document.getElementById('blog-post-content');
    const isBlogPage = !!document.getElementById('blog-post-content') || window.location.pathname.includes('blog');
    const HOMEPAGE_LIMIT = 3;

    // --- 1. SINGLE POST (blog.html with hash) ---
    if (isBlogPage && window.location.hash) {
        const slug = window.location.hash.substring(1);

        fetch(`blog-data/${slug}.md`)
            .then(response => {
                if (!response.ok) throw new Error(`Post not found at blog-data/${slug}.md`);
                return response.text();
            })
            .then(markdown => {
                const { data, body } = parseMarkdown(markdown);
                const postHtml = `
                    <article class="blog-post">
                        <h2>${data.title}</h2>
                        <p class="post-meta">${formatDate(data.date)}</p>
                        <div class="post-body">${renderMarkdown(body)}</div>
                        <a class="back-link" href="blog.html">&larr; back to all posts</a>
                    </article>
                `;
                if (blogPostContentContainer) {
                    blogPostContentContainer.innerHTML = postHtml;
                }
            })
            .catch(error => {
                if (blogPostContentContainer) {
                    blogPostContentContainer.innerHTML = `<p style="padding:0 24px;">Couldn't load that post. ${error.message}</p>`;
                }
                console.error('Error fetching post:', error);
            });
    }

    // --- 2. LISTING (index.html preview or blog.html full archive) ---
    else if (blogListContainer) {
        const url = `blog-data/posts.json?v=${new Date().getTime()}`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Could not load blog-data/posts.json');
                return response.json();
            })
            .then(posts => {
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                const postsToDisplay = isBlogPage ? posts : posts.slice(0, HOMEPAGE_LIMIT);

                blogListContainer.innerHTML = '';

                postsToDisplay.forEach(post => {
                    const postLink = `blog.html#${post.slug}`;
                    const postDate = formatDate(post.date);

                    const postHtml = `
                        <a href="${postLink}" class="post-row">
                            <div class="post-row-top">
                                <h3>${post.title}</h3>
                                <span class="post-date">${postDate}</span>
                            </div>
                            <p class="post-snippet">${post.snippet || ''}</p>
                        </a>
                    `;
                    blogListContainer.innerHTML += postHtml;
                });
            })
            .catch(error => {
                blogListContainer.innerHTML = `<p>Couldn't load posts right now. Check the console.</p>`;
                console.error('Error fetching blog posts index:', error);
            });
    }
});
