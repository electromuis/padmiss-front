import ApiClient from './ApiClient'

export default class {
    static query(q) {
        return new Promise(((resolve, reject) => {
            let request = {query: "{" + q.toString() + "}"}

            ApiClient.post('/graphiql', request, {}).then((response) => {
                if(response.data) {
                    resolve(response.data)
                } else {
                    reject()
                }
            }).catch(reject)
        }))
    }
}