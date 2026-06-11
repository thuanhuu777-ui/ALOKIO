/* global supabaseClient, Article */
class ArticleRepository {
  async getAll() {
    try {
      if (!supabaseClient) return [];
      const { data, error } = await supabaseClient
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => new Article(item));
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!supabaseClient) return null;
      const { data, error } = await supabaseClient
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Article(data) : null;
    } catch (error) {
      console.error('Error fetching article:', error);
      return null;
    }
  }
}
