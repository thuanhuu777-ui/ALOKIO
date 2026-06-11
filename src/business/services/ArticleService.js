class ArticleService {
  constructor(articleRepository) {
    this.repository = articleRepository;
  }

  async getAllArticles() {
    return await this.repository.getAll();
  }

  async getArticleById(id) {
    return await this.repository.getById(id);
  }
}
