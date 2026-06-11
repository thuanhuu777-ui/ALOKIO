class Article {
  constructor({ id, title, summary, content, image_url, created_at }) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.content = content;
    this.imageUrl = image_url;
    this.createdAt = new Date(created_at);
  }
}
