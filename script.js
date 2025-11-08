// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.dataset.section;
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');

        // If blog section, show list view
        if (targetSection === 'blog') {
            showBlogList();
        }
        
        // Animate skill bars when skills section is shown
        if (targetSection === 'skills') {
            animateSkills();
        }
    });
});

// Blog functionality
const blogListView = document.getElementById('blog-list-view');
const blogContentView = document.getElementById('blog-content-view');
const blogPostsContainer = document.getElementById('blog-posts-container');

// Load blog posts dynamically
function loadBlogPosts() {
    if (typeof blogPosts === 'undefined') {
        console.error('Blog posts data not loaded');
        return;
    }

    // Clear existing content
    blogPostsContainer.innerHTML = '';
    blogContentView.innerHTML = '';

    // Create blog post cards
    blogPosts.forEach(post => {
        // Create card for blog list
        const card = document.createElement('article');
        card.className = 'blog-post';
        card.dataset.post = post.id;
        card.innerHTML = `
            <h3 class="blog-post-title">${post.title}</h3>
            <div class="blog-post-meta">${post.date} • ${post.readTime}</div>
            <p class="blog-post-excerpt">${post.excerpt}</p>
        `;
        card.addEventListener('click', () => showBlogPost(post.id));
        blogPostsContainer.appendChild(card);

        // Create full blog post content
        const fullPost = document.createElement('article');
        fullPost.id = post.id;
        fullPost.className = 'blog-content';
        fullPost.innerHTML = `
            <a href="#" class="back-btn" onclick="showBlogList(); return false;">← Back to all posts</a>
            <h2>${post.title}</h2>
            <div class="blog-post-meta">${post.date} • ${post.readTime}</div>
            ${post.content}
        `;
        blogContentView.appendChild(fullPost);
    });
}

function showBlogPost(postId) {
    blogListView.style.display = 'none';
    blogContentView.classList.add('active');
    
    const allPosts = blogContentView.querySelectorAll('article');
    allPosts.forEach(post => {
        if (post.id === postId) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showBlogList() {
    blogListView.style.display = 'block';
    blogContentView.classList.remove('active');
    const allPosts = blogContentView.querySelectorAll('article');
    allPosts.forEach(post => post.style.display = 'none');
}

// Skill bar animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 100);
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    // Load blog posts
    loadBlogPosts();
    
    // Animate skills if skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection && skillsSection.classList.contains('active')) {
        animateSkills();
    }
});
