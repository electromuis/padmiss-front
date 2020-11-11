export default {
    methods: {
        $getCountries() {
            let me = this

            return new Promise((resolve, reject) => {
                if(this.$store.state.countries.length === 0) {
                    this.$graph(
                        'Countries',
                        {nodes: ['id', 'name']},
                        {sort: "name", limit: 1000},
                    ).then(res => {
                        res = res.nodes

                        let mapped = res.map(i => ({name: i.name, id: i.id}))
                        me.$store.commit('SET', {
                            key: 'countries',
                            value: mapped
                        })
                        resolve(this.$store.state.countries)
                    }).catch(reject)
                } else {
                    resolve(this.$store.state.countries)
                }
            })
        }
    }
}