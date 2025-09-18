document.addEventListener('DOMContentLoaded', () => {
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

    // Function to render markdown to HTML
    function renderMarkdown(markdown) {
        let html = markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/<\/li>\n<li>/gim, '</li><li>')
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
            .replace(/^(?!<h|<ul|<p|<l).*$/gim, '<p>$&</p>');
        html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">');
        html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
        return html;
    }

    // Main logic to fetch and display posts
    const blogListContainer = document.getElementById('blog-list');
    const blogPostContentContainer = document.getElementById('blog-post-content');
    const isBlogPage = window.location.pathname.endsWith('blog.html');

    if (isBlogPage && window.location.hash) {
        const slug = window.location.hash.substring(1);
        fetch(`/_blog/${slug}.md`)
            .then(response => {
                if (!response.ok) throw new Error('Post not found');
                return response.text();
            })
            .then(markdown => {
                const { data, body } = parseMarkdown(markdown);
                const postHtml = `
                    <div class="blog-post">
                        <h2>${data.title}</h2>
                        <p class="post-meta">${new Date(data.date).toDateString()}</p>
                        <div class="post-body">${renderMarkdown(body)}</div>
                    </div>
                `;
                blogPostContentContainer.innerHTML = postHtml;
            })
            .catch(error => {
                blogPostContentContainer.innerHTML = `<p>Error loading blog post.</p>`;
                console.error('Error fetching post:', error);
            });
    } else if (blogListContainer) {
        fetch('/_blog/posts.json')
            .then(response => {
                if (!response.ok) throw new Error('posts.json not found');
                return response.json();
            })
            .then(posts => {
                const recentPosts = posts.slice(0, 3);
                recentPosts.forEach(post => {
                    const postLink = `blog.html#${post.slug}`;
                    const postDate = new Date(post.date).toDateString();
                    const postHtml = `
                        <div class="blog-card">
                            <h3><a href="${postLink}">${post.title}</a></h3>
                            <p class="post-date">${postDate}</p>
                        </div>
                    `;
                    blogListContainer.innerHTML += postHtml;
                });
            })
            .catch(error => {
                blogListContainer.innerHTML = `<p>Error loading blog posts. Please check the console for details.</p>`;
                console.error('Error fetching blog posts:', error);
            });
    }
});
