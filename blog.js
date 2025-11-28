// blog.js

document.addEventListener('DOMContentLoaded', () => {
    const blogListContainer = document.getElementById('blog-list');

    // Mock blog post data (This will now populate your blog section!)
    const mockBlogPosts = [
        {
            title: "Exploring C's Dark Side: Writing a Custom Memory Allocator",
            date: "November 20, 2025",
            summary: "A deep dive into how I built a simplified `malloc` and `free` to truly understand pointer arithmetic and heap management.",
            link: "https://github.com/kirat-singh2006/c-memory-allocator"
        },
        {
            title: "From Zero to Hero: Setting Up a Secure Python Environment",
            date: "October 15, 2025",
            summary: "Tips and tricks for managing virtual environments, dependencies, and keeping your Python projects isolated and secure.",
            link: "#"
        },
        {
            title: "The Subtle Art of Debugging CSS: Why My Div Wouldn't Center",
            date: "September 5, 2025",
            summary: "A confession and tutorial on mastering Flexbox and Grid to solve the universal problem of layout alignment.",
            link: "#"
        }
    ];

    function renderBlogPosts() {
        if (!blogListContainer) return;

        blogListContainer.innerHTML = ''; 

        mockBlogPosts.forEach(post => {
            const card = document.createElement('div');
            card.classList.add('blog-post-card');
            
            card.innerHTML = `
                <span class="blog-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.summary}</p>
                <a href="${post.link}" class="read-more-link" target="_blank">Read More &raquo;</a>
            `;
            blogListContainer.appendChild(card);
        });
    }

    renderBlogPosts();
});
