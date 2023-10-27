import axios from 'axios';
const BOOKSTORE_BASE_URL = "https://bookstore.toolsqa.com/";

class BookStoreService {
    async postBook(data, accessToken) {
        try {
            const response = await axios.post(BOOKSTORE_BASE_URL + "BookStore/v1/Books", data, {
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default new BookStoreService();