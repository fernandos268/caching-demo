const { gql } = require('apollo-server-express')

module.exports = gql`
    scalar CustomScalarObject

    input GetListInput {
        limit: Int!
        limitless: Boolean
        page: Int!
        # entity: String
    }

    input GetNodeInput {
        entity: String!
        id: String!
    }

    # ------------------------------------------------------------
    # UNION TYPES: conditional type returns
    # union NodeResult = Project | Visit | Photo
    # union GetListResult = ProjectsList | VisitsList | PhotosList

    # ------------------------------------------------------------
    # QUERY LIST RESULT TYPES
    # type ProjectsList {
    #     data: [Project]
    # }

    # type VisitsList {
    #     data: [Visit]
    # }

    # type PhotosList {
    #     data: [Photo]
    # }

    # type ListResult {
    #     list: GetListResult!
    #     count: Int!
    # }

    # extend type Query {
    #     GetList(input: GetListInput!): ListResult
    #     GetNode(input: GetNodeInput!): NodeResult
    # }

`
