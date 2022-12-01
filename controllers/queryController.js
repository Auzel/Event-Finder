

class Query { 
    constructor(query) {
        this.query_object = {};
        this.aggregation = [];

        if (query.where != null) {
            var where = JSON.parse(query.where);
            this.aggregation.push({$match: where});
        }

        if (query.sort != null) {
            console.log(query.sort);
            var sort = JSON.parse(query.sort);
            this.aggregation.push({$sort: sort});
        }

        if (query.select != null) {
            var select = JSON.parse(query.select);
            this.aggregation.push({$project: select});
        }

        if (query.skip != null && !Number.isNaN(query.skip) && query.skip >= 0) {
            this.skip = parseInt(query.skip);
            this.aggregation.push({$skip: this.skip});
        }
        else {
            this.aggregation.push({$skip: 0});
            this.skip = 0;
        }

        if (query.limit != null && !Number.isNaN(query.limit)) {
            var limitVal = parseInt(query.limit);
            if (limitVal >= 0) {
                this.aggregation.push({$limit: limitVal});
            }
        }
        else {
            this.aggregation.push({$limit: 1000});
        }

        if (query.count == "true") {
            this.count = true;
        }
        else {
            this.count = false;
        }

    }
}


exports.Query = Query;