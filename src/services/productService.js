import config from '../config/config';

class ProductService {
  async getAllProducts() {
    try {
      const response = await fetch(`${config.apiUrl}/api/products`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(formData) {
    try {
      const response = await fetch(`${config.apiUrl}/api/products`, {
        method: 'POST',
        body: formData, // FormData for multipart/form-data
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id, formData) {
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'PUT',
        body: formData, // FormData for multipart/form-data
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default new ProductService(); 