import ApiClient from './ApiClient'
import Query from 'graphql-query-builder-v2'

let queryString = (type, fields, filter) => {
    // Translate arguments to API V2 arguments

    let newFilter = {}

    if(filter.limit) {
        newFilter.last = filter.limit
    }
    delete filter.limit

    if(filter.sort) {
        let field = filter.sort;
        if(field[0] === '-') {
            field = field.substr(1)
            newFilter.order_by = {[field]: Query.Enum('DESC')}
        }
        else {
            newFilter.order_by = {[field]: Query.Enum('ASC')}
        }
    }
    delete filter.sort

    if(filter.offset) {
        newFilter.offset = filter.offset
    }
    delete filter.offset

    // newFilter.queryString = JSON.stringify(filter)

    let q = new Query(type, newFilter)
    q.find(fields)

    return q.toString();
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

            ApiClient.post('/graphql', request, {}).then((response) => {
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

            ApiClient.post('/graphql', request, {}).then((response) => {
                if(response.data && response.data[type]) {
                    if(response.data[type].nodes) {
                        response.data[type].nodes.forEach(n => {
                            if(n.id) {
                                n.id = parseInt(n.id)
                            }
                        })
                    }
                    else if(response.data[type].id) {
                        response.data[type].id = parseInt(response.data[type].id)
                    }

                    resolve(response.data[type])
                } else {
                    reject()
                }
            }).catch(reject)
        }))
    }
}