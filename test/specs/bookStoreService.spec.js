import AuthorService from "../services/authorService.services.js";
import BookStoreService from "../services/booksStoreService.service.js";
import { expect } from 'chai';

const username = generateRandomUsername("testuser");

function generateRandomUsername(prefix) {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${prefix}${randomPart}`;
}

let isbn = "9781449325862";
let token = "";
let userID = "";

let requestData = {
    "userName": username,
    "password": "Testpassword123@",
};

let createBookRequest = {
    "userId": userID,
    "collectionOfIsbns": [
        {
            "isbn": isbn
        }
    ]
};

describe('Bookstore Test Suite', () => {

    it('Create User', async function () {
        this.timeout(20000);

        try {
            const response = await AuthorService.createUser(requestData);
            expect(response.status).to.equal(201);
            expect(response.data.username).to.equal(requestData.userName);

            userID = response.data.userID;

            createBookRequest.userId = userID; // Update the userID in createBookRequest
            expect(userID).to.not.be.empty;

            console.log("user created with userID: ", userID);

        } catch (err) {
            console.error(err);
        }
    });

    it('Authenticate User', async function () {

        this.timeout(10000);

        try {
            const response = await AuthorService.authenticateApi(requestData);
            token = response.data.token;

            expect(response.status).to.equal(200);
            expect(response.data.status).to.equal("Success");
            console.log("user Authenticated userID: ", userID);

        } catch (err) {
            console.error(err);
        }
    });

    it('Post book with valid param', async function () {
        this.timeout(10000);

        try {
            const response = await BookStoreService.postBook(createBookRequest, token);
            expect(response.status).to.equal(201);

            // Check the response structure and data.
            expect(response.data).to.be.an('object');
            expect(response.data.books).to.be.an('array').with.length(1);
            expect(response.data.books[0]).to.deep.equal({
                isbn: isbn
            });

            console.log("Book Post isbn: ", isbn);
        } catch (err) {
            console.error(err);
        }
    });



    it('Validate Book', async function () {
        this.timeout(10000);

        try {
            const userResponse = await AuthorService.getUser(userID, token);

            const targetISBN = createBookRequest.collectionOfIsbns.at(0).isbn;

            let found = false;

            for (const book of userResponse.books) {
                if (book.isbn === targetISBN) {
                    found = true;

                    console.log("Found book:", book);


                    expect(book.isbn).to.equal(targetISBN);


                    break;
                }
            }

            if (!found) {
                const errorMessage = `ISBN ${targetISBN} not found in user's books.`;

                // Fail the test explicitly
                assert.fail(0, 1, errorMessage);
            }



        } catch (err) {
            console.error(err);
        }
    });

});




