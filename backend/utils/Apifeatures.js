class Apifeature {
    constructor(query, queryString) {
        this.query = query;           // Mongoose query
        this.queryString = queryString; // req.query
    }

    // Filtering
    filter() {
        const queryCopy = { ...this.queryString };
        const removeFields = ['page', 'limit', 'keyword', 'sort'];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Advanced filter: gte, lte, gt, lt
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // default
        }
        return this;
    }

    // Pagination
    pagination() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 20;
        const skip = limit * (page - 1);

        this.query = this.query.limit(limit).skip(skip);
        return this;
    }

    // Search
    search() {
        if (this.queryString.keyword) {
            const keyword = {
                title: { $regex: this.queryString.keyword, $options: 'i' }
            };
            this.query = this.query.find(keyword);
        }
        return this;
    }
}

export default Apifeature;
