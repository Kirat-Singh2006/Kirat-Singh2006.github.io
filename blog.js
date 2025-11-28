/**
 * Kirat Singh Blog Data and Renderer (blog.js)
 * Fetches post metadata from /blog-data/posts.json and post content from /blog-data/[slug].md
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Markdown Utility Functions ---
    // Function to parse front matter from markdown files
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

    // Function to render markdown to HTML (Improved for better paragraph handling)
    function renderMarkdown(markdown) {
        let html = markdown;

        // 1. Block-level elements
        html = html
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/`([^`]+)`/gim, '<code>$1</code>');

        // 2. Lists 
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        const listRegex = /(<li>.*<\/li>(\n<li>.*<\/li>)*)/g;
        html = html.replace(listRegex, '<ul>$1</ul>');


        // 3. Inline elements
        html = html
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>');

        // 4. Images and Links
        html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">');
        html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');

        // 5. Paragraph wrapping (Crucial fix: wrap non-block elements in <p> tags)
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

    // --- Main Logic to Fetch and Display Posts ---
    const blogListContainer = document.getElementById('blog-list');
    const blogPostContentContainer = document.getElementById('blog-post-content');
    const isBlogPage = window.location.pathname.endsWith('blog.html');
    
    // REMOVED: const maxPostsOnHomepage = 3;

    // --- 1. Logic for displaying a SINGLE POST (on blog.html with hash) ---
    if (isBlogPage && window.location.hash) {
        const slug = window.location.hash.substring(1);
        
        // Path to Markdown file inside the blog-data folder
        fetch(`/blog-data/${slug}.md`) 
            .then(response => {
                if (!response.ok) throw new Error(`Post not found at /blog-data/${slug}.md`); 
                return response.text();
            })
            .then(markdown => {
                const { data, body } = parseMarkdown(markdown);
                const postHtml = `
                    <article class="blog-post">
                        <h2>${data.title}</h2>
                        <p class="post-meta">Published: ${new Date(data.date).toDateString()}</p>
                        <div class="post-body">${renderMarkdown(body)}</div>
                    </article>
                    <p style="margin-top: 30px;"><a href="blog.html">← Back to all posts</a></p>
                `;
                if (blogPostContentContainer) {
                    blogPostContentContainer.innerHTML = postHtml;
                }
            })
            .catch(error => {
                if (blogPostContentContainer) {
                    blogPostContentContainer.innerHTML = `<p>Error loading blog post. Check your console for details on ${error.message}.</p>`;
                }
                console.error('Error fetching post:', error);
            });
    }

    // --- 2. Logic for INDEX/HOMEPAGE LISTING (on index.html or blog.html without hash) ---
    else if (blogListContainer) {
        
        // FINAL MANUAL FIX: Target the blog-data/posts.json file
        const url = `/blog-data/posts.json?v=${new Date().getTime()}`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error loading blog posts index. Please ensure blog-data/posts.json exists.'); 
                return response.json();
            })
            .then(posts => {
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));

                // FIX APPLIED HERE:
                // We use a simple ternary operator to set the limit:
                // If it's the blog page, use the entire length (all posts).
                // If it's NOT the blog page (i.e., the main index), use 3 (or whatever limit you want for the homepage snippet).
                const HOME_PAGE_LIMIT = 3;
                const limit = isBlogPage ? posts.length : HOME_PAGE_LIMIT;

                // If the user's path is 'blog.html', 'limit' will be posts.length.
                // If the user's path is 'index.html', 'limit' will be 3.
                const postsToDisplay = posts.slice(0, limit);

                blogListContainer.innerHTML = ''; 

                postsToDisplay.forEach(post => {
                    const postLink = `blog.html#${post.slug}`;
                    const postDate = new Date(post.date).toDateString();

                    const postHtml = `
                        <div class="blog-post-card">
                            <span class="blog-date">${postDate}</span>
                            <h3><a href="${postLink}">${post.title}</a></a></h3>
                            <p>${post.snippet || 'No snippet available.'}</p>
                            <a href="${postLink}" class="read-more-link">Read Post →</a>
                        </div>
                    `;
                    blogListContainer.innerHTML += postHtml;
                });
            })
            .catch(error => {
                blogListContainer.innerHTML = `<p>Error loading blog posts index. Please check the console and ensure blog-data/posts.json is correctly formatted.</p>`;
                console.error('Error fetching blog posts index:', error);
            });
    }
});
