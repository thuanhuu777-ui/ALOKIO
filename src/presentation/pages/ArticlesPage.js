class ArticlesPage {
  constructor({ articleService }) {
    this.articleService = articleService;
  }

  async render(container) {
    container.innerHTML = `
      <section class="section container">
        <h2 class="section__title">Tin tức & Bài viết</h2>
        <div id="articles-loading" style="text-align:center; padding:2rem;">Đang tải...</div>
        <div id="articles-grid" class="articles-grid"></div>
      </section>
    `;

    const grid = container.querySelector('#articles-grid');
    const loading = container.querySelector('#articles-loading');

    const articles = await this.articleService.getAllArticles();
    loading.style.display = 'none';

    if (articles.length === 0) {
      grid.innerHTML = '<p>Hiện chưa có bài viết nào.</p>';
      return;
    }

    grid.innerHTML = articles.map(article => `
      <article class="article-card">
        <a href="#/article/${article.id}" class="article-card__img-link">
          <img src="${mediaUrl(article.imageUrl)}" alt="${article.title}" loading="lazy">
        </a>
        <div class="article-card__content">
          <h3 class="article-card__title">
            <a href="#/article/${article.id}">${article.title}</a>
          </h3>
          <p class="article-card__date">${article.createdAt.toLocaleDateString('vi-VN')}</p>
          <p class="article-card__summary">${article.summary}</p>
          <a href="#/article/${article.id}" class="article-card__readmore">Đọc tiếp</a>
        </div>
      </article>
    `).join('');
  }
}
