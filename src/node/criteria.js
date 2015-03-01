var _ = require('lodash');

function Criteria(config) {
    this.config = config;
}

Criteria.prototype.apply = function (queryBuilder, values) {
    var config = this.config;
    if (_.isObject(config)) {
        config = [config];
    }

    _.forEach(config, function (item) {
        var value = item.value,
            property = item.property,
            operator = item.operator,
            vl = values[item.name];

        if (value !== undefined) {
            if (_.isFunction(value)) {
                value = value();
            }
            operator(queryBuilder, value, property);
        } else {
            operator(queryBuilder, vl, property);
        }
    });

};

function equal(queryBuilder, value, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' = ?', value);
}

function notEqual(queryBuilder, value, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' <> ?', value);
}

function lessEqual(queryBuilder, value, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' <= ?', value);
}

function greaterEqual(queryBuilder, value, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' >= ?', value);
}

function lessThan(queryBuilder, value, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' < ?', value);
}

function greaterThan(queryBuilder, value, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' < ?', value);
}

function like(queryBuilder, value, path) {
    value = '%' + value.replace(/(%)|(_)|(\*)/g, '*$1$2$3').replace(/\*{2}/g, '%') + '%';
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' LIKE ? ESCAPE ?', value, '*');
}

function ilike(queryBuilder, value, path) {
    value = '%' + value.toUpperCase().replace(/(%)|(_)|(\*)/g, '*$1$2$3').replace(/\*{2}/g, '%') + '%';
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where('UPPER(' + property + ') LIKE ? ESCAPE ?', value, '*');
}

function between(queryBuilder, values, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' BETWEEN ? AND ?', values[0], values[1]);
}

function criteriaIn(queryBuilder, values, path) {
    var property = queryBuilder.applyPath(path).property;
    queryBuilder.query.where(property + ' IN ?', values);
}

function notIn(queryBuilder, values, path) {
    if (values && values.length > 0) {
        var property = queryBuilder.applyPath(path).property;
        queryBuilder.query.where(property + ' NOT IN ?', values);
    }
}

function has(queryBuilder, values, path) {
    // TODO
}

Criteria.prototype.OPERATOR = {
    NOT_EQUAL : notEqual,
    EQUAL : equal,
    LESS_EQUAL : lessEqual,
    GREATER_EQUAL : greaterEqual,
    LESS_THAN : lessThan,
    GREATER_THAN : greaterThan,
    LIKE : like,
    ILIKE : ilike,
    BETWEEN : between,
    HAS : has,
    IN : criteriaIn,
    NOT_IN : notIn
};

module.exports = Criteria;