module.exports = {
    Query: {
        async GetList(parent, { input }, { dataSources }) {
            const {
                entity,
                page,
                limitless,
                limit
            } = input
            switch (entity) {
                case 'Project':
                    const list = await dataSources.ljpAPI.getProjects({ page, limitless, limit });
                    return {
                        __typename: 'ProjectsList',
                        list,
                        count: list.length
                    }
                default: ''
            }
        },
        GetNode(parent, { input }, { dataSources }) {

        },
    },
    Mutation: {

    },
    GetListResult: {
        __isTypeOf(obj, context, info) {
            const input = info.variableValues.input
            if (input.entity === 'Project') {
                return obj instanceof GetListResult
            }
        }
    }
}
