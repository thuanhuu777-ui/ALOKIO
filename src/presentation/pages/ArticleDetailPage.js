class ArticleDetailPage {
  constructor({ articleService }) {
    this.articleService = articleService;
  }

  async render(container, query, id) {
    container.innerHTML = `
      <div class="container section">
        <div id="article-detail-loading" style="text-align:center; padding:2rem;">Đang tải bài viết...</div>
        <div id="article-detail-content" style="display:none;" class="article-detail">
          <!-- Content will be injected here -->
        </div>
      </div>
    `;

    const detailContent = container.querySelector('#article-detail-content');
    const loading = container.querySelector('#article-detail-loading');

    const article = await this.articleService.getArticleById(id);
    loading.style.display = 'none';

    if (!article) {
      detailContent.style.display = 'block';
      detailContent.innerHTML = `
        <h2 class="section__title">Không tìm thấy bài viết</h2>
        <p style="text-align:center;">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        <div style="text-align:center; margin-top:2rem;">
          <a href="#/articles" class="btn btn--primary">Quay lại danh sách</a>
        </div>
      `;
      return;
    }

    // Format content: convert newlines to paragraphs and headings
    const formattedContent = article.content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Nếu dòng ngắn và không kết thúc bằng dấu câu, coi như là tiêu đề (Heading)
        if (line.length < 80 && !/[.:!?]$/.test(line)) {
          return `<h3>${line}</h3>`;
        }
        return `<p>${line}</p>`;
      })
      .join('');

    detailContent.style.display = 'block';
    detailContent.innerHTML = `
      <div class="article-detail__header">
        <h1 class="article-detail__title">${article.title}</h1>
        <p class="article-detail__date">Ngày đăng: ${article.createdAt.toLocaleDateString('vi-VN')}</p>
      </div>
      <div class="article-detail__image">
        <img src="${mediaUrl(article.imageUrl)}" alt="${article.title}">
      </div>
      <div class="article-detail__body">
        ${formattedContent}
      </div>
      <div class="article-detail__footer">
        <a href="#/articles" class="btn btn--outline">Quay lại danh sách tin tức</a>
      </div>
    `;
  }
}
