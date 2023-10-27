import axios from 'axios';

const BOOKSTORE_BASE_URL = "https://bookstore.toolsqa.com/";

class AuthorService {

    async createUser(data) {
        try {
            const response = await axios.post(BOOKSTORE_BASE_URL + "Account/v1/User", data, {
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            return response; // Assuming you want to return the response data.
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async authenticateApi(data) {
        try {
            return await axios.post(BOOKSTORE_BASE_URL + "Account/v1/GenerateToken", data, {
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getUser(userId, accessToken) {
        try {
            const response = await axios.get(BOOKSTORE_BASE_URL + `Account/v1/User/${userId}`, {
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                console.error(`Failed to get user. Status code: ${response.status}`);
                return null; // You can handle the error as per your requirements.
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


}
export default new AuthorService();