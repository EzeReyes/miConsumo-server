import gql from 'graphql-tag';

const typeDefs = gql `

type Query {
    getExpensesByID(id:ID!): Expense
    getExpenses(user: ID!): [Expense]

    getToken: GetTokenResponse
    getUser(email: String!, password: String!): AuthResponse
    getUserPass(email: String!): User
    getUsers: [User]
    confirmUser(token: String): User

    getTask(user: ID!): [Task]

}

type Mutation {
    newExpense(input: InputExpense): String
    deleteExpense(id: ID): String
    updatedExpense(id: ID!, input: InputExpense): Expense

    newUser(input: InputUser): String
    deleteUser(id: ID): String
    updatedUser(id: ID!, input: InputUser): User
    newPass(email: String, password: String): String

    newTask(input: InputTask): String
    deleteTask(id: ID): String
    actualizarEstado(id: ID, realizado: Boolean): Task


}

type Expense {
    id: ID
    name: String
    cost: Float
    category: Category
    user: ID
}

type Task {
    id: ID
    name: String
    realizado: Boolean
    user: ID
}

enum Category {
    ALIMENTO
    HOBBIE
    SERVICIO
    ENTRENAMIENTO
    ROPA
    CALZADO
    OTROS
}

type GetTokenResponse {
    success: Boolean
    message: String
    user: User
}

type User {
    id: ID!
    name: String
    surname: String
    email: String
    token: String
    confirmado: Boolean
    password: String
}


type AuthResponse {
    success: Boolean!
    message: String!
    user: User
}

input InputExpense {
    name: String!
    cost: Float!
    category: Category!
    user: ID!
}

input InputUser {
    name: String!
    surname: String!
    email: String!
    password: String
}

input InputTask {
    name: String
    user: ID
}

`

    export default typeDefs;