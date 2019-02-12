import ApiClient from './ApiClient'
import Query from 'graphql-query-builder'

export default class {
    static async query(type, fields, filter, encodeFilter) {
        return new Promise(((resolve, reject) => {
            if(filter === undefined) {
                filter = {}
            } else {
                if(encodeFilter === true) {
                    let newFilter = {
                        queryString: JSON.stringify(filter)
                    }
                    if(filter.limit) {
                        newFilter.limit = filter.limit
                    }
                    filter = newFilter
                }
            }
            let q = new Query(type, filter)
            q.find(fields)

            let request = {query: "{" + q.toString() + "}"}

            ApiClient.post('/graphiql', request, {}).then((response) => {
                if(response.data && response.data[type]) {
                    resolve(response.data[type])
                } else {
                    reject()
                }
            }).catch(reject)
        }))
    }
}