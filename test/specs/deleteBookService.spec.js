import AuthorService from "../services/authorService.services.js";
import BookStoreService from "../services/bookStoreService.service.js";
import { expect } from 'chai';



function generateRandomUsername(prefix) {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${prefix}${randomPart}`;
}

let isbn = "9781449325862";
let token = "";
let invalidToken = "invalidToken";
let userID = "";
let invalidUserID = "invalidUserID";

let requestData = {
    "userName": "",
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

describe('Delete book with valid param', () => {

    it('Create User', async function () {
        this.timeout(20000);

        requestData.userName = generateRandomUsername("testuser");

        try {
            const response = await AuthorService.createUser(requestData);
            expect(response.status).to.equal(201);
            expect(response.data.username).to.equal(requestData.userName);

            userID = response.data.userID;

            createBookRequest.userId = userID;
            expect(userID).to.not.be.empty;

            console.log("user created with userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Authenticate User', async function () {

        this.timeout(20000);

        try {
            const response = await AuthorService.authenticateApi(requestData);
            token = response.data.token;

            expect(response.status).to.equal(200);
            expect(response.data.status).to.equal("Success");
            console.log("user Authenticated userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Post book', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.postBook(createBookRequest, token);
            expect(response.status).to.equal(201);


            expect(response.data).to.be.an('object');
            expect(response.data.books).to.be.an('array').with.length(1);
            expect(response.data.books[0]).to.deep.equal({
                isbn: isbn
            });

            console.log("Book Post isbn: ", isbn);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Book', async function () {
        this.timeout(20000);

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

                assert.fail(0, 1, errorMessage);
            }



        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Delete book', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.deleteBook(userID, token);
            expect(response.status).to.equal(204);

            console.log("Books deleted userID: ", userID);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Book deleted', async function () {
        this.timeout(20000);

        try {
            const userResponse = await AuthorService.getUser(userID, token);

            const targetISBN = createBookRequest.collectionOfIsbns.at(0).isbn;

            let found = false;

            for (const book of userResponse.books) {
                if (book.isbn === targetISBN) {
                    found = true;

                    console.log("Found book:", book);

                    assert.fail(`ISBN ${targetISBN} found in user's books.`);
                    break;
                }
            }

            if (!found) {
                expect(userResponse.books.length).to.equal(0);
                console.log(`ISBN ${targetISBN} not found in user's books.`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

});
describe('Delete book with invalid userID', () => {

    it('Create User', async function () {
        this.timeout(20000);

        requestData.userName = generateRandomUsername("testuser");

        try {
            const response = await AuthorService.createUser(requestData);
            expect(response.status).to.equal(201);
            expect(response.data.username).to.equal(requestData.userName);

            userID = response.data.userID;

            createBookRequest.userId = userID;
            expect(userID).to.not.be.empty;

            console.log("user created with userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Authenticate User', async function () {

        this.timeout(20000);

        try {
            const response = await AuthorService.authenticateApi(requestData);
            token = response.data.token;

            expect(response.status).to.equal(200);
            expect(response.data.status).to.equal("Success");
            console.log("user Authenticated userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Post book', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.postBook(createBookRequest, token);
            expect(response.status).to.equal(201);


            expect(response.data).to.be.an('object');
            expect(response.data.books).to.be.an('array').with.length(1);
            expect(response.data.books[0]).to.deep.equal({
                isbn: isbn
            });

            console.log("Book Post isbn: ", isbn);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Book', async function () {
        this.timeout(20000);

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

                assert.fail(0, 1, errorMessage);
            }



        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Delete book with invalid userID', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.deleteBook(invalidUserID, token);
            expect(response.status).to.equal(401);
            expect(response.data.code).to.equal('1207');
            expect(response.data.message).to.equal('User Id not correct!');

            console.log("Books not deleted userID: ", userID);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Books not deleted', async function () {
        this.timeout(20000);

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

                assert.fail(0, 1, errorMessage);
            }



        } catch (err) {
            console.error(err);
            throw err;
        }
    });

});
describe('Delete book with invalid token', () => {

    it('Create User', async function () {
        this.timeout(20000);

        requestData.userName = generateRandomUsername("testuser");

        try {
            const response = await AuthorService.createUser(requestData);
            expect(response.status).to.equal(201);
            expect(response.data.username).to.equal(requestData.userName);

            userID = response.data.userID;

            createBookRequest.userId = userID;
            expect(userID).to.not.be.empty;

            console.log("user created with userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Authenticate User', async function () {

        this.timeout(20000);

        try {
            const response = await AuthorService.authenticateApi(requestData);
            token = response.data.token;

            expect(response.status).to.equal(200);
            expect(response.data.status).to.equal("Success");
            console.log("user Authenticated userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Post book', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.postBook(createBookRequest, token);
            expect(response.status).to.equal(201);


            expect(response.data).to.be.an('object');
            expect(response.data.books).to.be.an('array').with.length(1);
            expect(response.data.books[0]).to.deep.equal({
                isbn: isbn
            });

            console.log("Book Post isbn: ", isbn);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Book', async function () {
        this.timeout(20000);

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

                assert.fail(0, 1, errorMessage);
            }



        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Delete book with invalid token', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.deleteBook(userID, invalidToken);
            expect(response.status).to.equal(401);
            expect(response.data.code).to.equal('1200');
            expect(response.data.message).to.equal('User not authorized!');

            console.log("Books not deleted userID: ", userID);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Books not deleted', async function () {
        this.timeout(20000);

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

                assert.fail(0, 1, errorMessage);
            }



        } catch (err) {
            console.error(err);
            throw err;
        }
    });

});