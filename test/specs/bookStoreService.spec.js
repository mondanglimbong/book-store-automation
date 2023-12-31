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

let invalidUIdCreateBookRequest = {
    "userId": invalidUserID,
    "collectionOfIsbns": [
        {
            "isbn": isbn
        }
    ]
};

let invalidIsbnCreateBookRequest = {
    "userId": userID,
    "collectionOfIsbns": [
        {
            "isbn": "invalidIsbn"
        }
    ]
};
describe('Post book with valid param', () => {

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

});
describe('Post book with Invalid user id and valid isbn', () => {

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

    it('Post book with invalid userID', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.postBook(invalidUIdCreateBookRequest, token);

            console.log("response : " + JSON.stringify(response.data));

            expect(response.status).to.equal(401);
            expect(response.data.code).to.equal('1207');

        } catch (err) {
            console.error(err);
            throw err;
        }
    });


});
describe('Post book with valid user id and invalid isbn', () => {

    it('Create User', async function () {
        this.timeout(20000);
        requestData.userName = generateRandomUsername("testuser");
        try {
            const response = await AuthorService.createUser(requestData);
            expect(response.status).to.equal(201);
            expect(response.data.username).to.equal(requestData.userName);

            userID = response.data.userID;


            expect(userID).to.not.be.empty;

            invalidIsbnCreateBookRequest.userId = userID;

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

            console.log("Authenticate User token: " + JSON.stringify(token));
            expect(response.status).to.equal(200);
            expect(response.data.status).to.equal("Success");
            console.log("user Authenticated userID: ", userID);

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Post book with invalid userID', async function () {
        this.timeout(20000);

        try {


            const response = await BookStoreService.postBook(invalidIsbnCreateBookRequest, token);

            console.log("response : " + JSON.stringify(response.data));

            expect(response.status).to.equal(400);
            expect(response.data.code).to.equal('1205');
            expect(response.data.message).to.equal('ISBN supplied is not available in Books Collection!');

        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate ISBN not in books collection', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.getBooks();


            if (response.data && Array.isArray(response.data.books)) {

                const targetISBN = invalidIsbnCreateBookRequest.collectionOfIsbns.at(0).isbn;


                const isISBNNotInCollection = response.data.books.every(book => book.isbn !== targetISBN);



                console.log(`ISBN ${targetISBN} is not in the collection.`);
                expect(isISBNNotInCollection, `ISBN ${targetISBN} should not be in the collection.`).to.be.true;

            } else {

                console.log("Response does not contain books.");
                expect(response.data.books).to.be.an('array').that.is.empty;
            }
        } catch (err) {

            console.error(err);
            throw err;
        }
    });


});
describe('Post book with invalid token', () => {

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

    it('Post book with invalid token', async function () {
        this.timeout(20000);

        try {
            const response = await BookStoreService.postBook(createBookRequest, invalidToken);
            expect(response.status).to.equal(401);

            console.log("response : " + JSON.stringify(response.data));

            expect(response.status).to.equal(401);
            expect(response.data.code).to.equal('1200');

            console.log("Book Post isbn: ", isbn);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    it('Validate Book not created', async function () {
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
                console.log(`ISBN ${targetISBN} not found in user's books.`);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

});