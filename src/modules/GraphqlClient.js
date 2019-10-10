import ApiClient from './ApiClient'
import Query from 'graphql-query-builder'

let queryString = (type, fields, filter, encodeFilter) => {
    if(filter === undefined) {
        filter = {}
    } else {
        if(encodeFilter === true) {
            let newFilter = {}
            if(filter.limit) {
                newFilter.limit = filter.limit
            }
            delete filter.limit
            if(filter.sort) {
                newFilter.sort = filter.sort
            }
            delete filter.sort
            if(filter.offset) {
                newFilter.offset = filter.offset
            }
            delete filter.offset
            newFilter.queryString = JSON.stringify(filter)
            filter = newFilter
        }
    }
    let q = new Query(type, filter)
    q.find(fields)

    return q.toString()
}

export default class {
    static async multiQuery(queries) {
        return new Promise(((resolve, reject) => {
            let q = '{ '

            Object.keys(queries).forEach(k => {
                let v = queries[k]

                q += k + ': ' +queryString(v[0], v[1], v[2], v[3]) + ' '
            })

            q += '}'

            let request = {query: q}

            ApiClient.post('/graphiql', request, {}).then((response) => {
                if (response.data) {
                    resolve(response.data)
                } else {
                    reject()
                }
            }).catch(reject)
        }))
    }

    static async query(type, fields, filter, encodeFilter) {
        return new Promise(((resolve, reject) => {
            let request = {query: "{" + queryString(type, fields, filter, encodeFilter) + "}"}

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