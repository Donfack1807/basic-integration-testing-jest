const { ObjectId, Collection } = require("mongodb")
const request = require("supertest")
const { response } = require("../src/app")
const app = require("../src/app")
const { connectToDB, closeConnection, getDB } = require("../src/database")

const baseUrl = "/todos"
const todo = [{
    _id: '61e931687474c53eca3a716c',
    title: 'Todo 1',
    completed: false,
    createdAt: '2022-01-20T09:54:48.139Z',
    updatedAt: '2022-01-20T09:54:48.139Z'
},
{
    _id: '61e931687474c53eca3a716d',
    title: 'Todo 2',
    completed: true,
    createdAt: '2022-01-20T09:54:48.139Z',
    updatedAt: '2022-01-20T10:32:50.952Z'
}]
const todo2 = [{
    _id: '61e931687474c53eca3a716d',
    title: 'Todo 2',
    completed: true,
    createdAt: '2022-01-20T09:54:48.139Z',
    updatedAt: '2022-01-20T10:32:50.952Z'
}]
const todo1 = [{
    _id: '61e931687474c53eca3a716c',
    title: 'Todo 1',
    completed: false,
    createdAt: '2022-01-20T09:54:48.139Z',
    updatedAt: '2022-01-20T09:54:48.139Z'
}]


beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const MONGODB_DB = process.env.MONGODB_DB || 'mytodos-test'

    await connectToDB(MONGODB_URI, MONGODB_DB)
})

beforeEach( async () => {
    const db = getDB()
    await db .createCollection("todos")
} )


describe("GET /todos", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.statusCode).toBe(200)
    })

    test("should respond with JSON", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.type).toBe("application/json")
    })

    test("should respond with list of existing todos", async () => {
        await getDB().collection("todos").insertMany(todo)
        const response = await request(app.callback()).get(baseUrl)
        console.log(response.body)
    })
})

describe("POST /todos", () => {
    const title = "Pour le post"
    const todo2 = {
        title : title,
        completed: false
    }
    const todo1 = {
        title : "",
        completed: false
    }
    test("should respond with 422", async () => {
        const response = await request(app.callback())
        .post(baseUrl)
        .send()
        .expect(422)

    })
    test("should respond with 400", async () => {
        const response = await request(app.callback())
        .post(baseUrl)
        .send(todo1)
        .expect(400)

    })
    test("should respond title", async () => {
        const response = await request(app.callback())
        .post(baseUrl)
        .send(todo2)
        console.log(response.body)
    })
});

describe("DELETE /todos", () => {
    test("should respond with a 200 status code", async () => {

        const db = getDB()
        await db.collection("todos").insertMany(todo1)
        const response = await request(app.callback())
        .delete(`/todos/$todo1.id`)
        .expect(204)
    })
    test("should respond with a 404 status code", async () => {
        const response = await request(app.callback())
        .delete(`/todos`)
        .expect(404)
    })
    test.only("should respond with a 404 status code", async () => {
        const response = await request(app.callback())
        .delete(`/todos/$todo2.id`)
        .expect(404)
    })

});

afterEach(async () => {
    const db = getDB()
    await db .dropCollection("todos")
} )

afterAll(async () => {
    closeConnection()
})
