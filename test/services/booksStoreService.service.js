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
                validateStatus: function (status) {
                    return status === 401|| status === 400 || status === 201;
                },
            });

            return response;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async getBooks() {
        try {
            const response = await axios.get(BOOKSTORE_BASE_URL + "BookStore/v1/Books", {
                headers: {
                    "accept": "application/json",
                }
            });

            return response;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async deleteBook(userId, accessToken) {
        try {
            const response = await axios.delete(BOOKSTORE_BASE_URL + `BookStore/v1/Books?UserId=${userId}`, {
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                validateStatus: function (status) {
                    return status === 401|| status === 204;
                },
            });

            return response;
        } catch (err) {
            console.error(err);
            return err;
        }
    }


}

export default new BookStoreService();