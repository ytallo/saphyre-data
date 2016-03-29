# Saphyre - Data

[![Build Status](https://travis-ci.org/saphyre/saphyre-data.svg?branch=master)](https://travis-ci.org/saphyre/saphyre-data) [![Coverage Status](https://coveralls.io/repos/github/saphyre/saphyre-data/badge.svg?branch=master)](https://coveralls.io/github/saphyre/saphyre-data?branch=master) [![npm version](https://badge.fury.io/js/saphyre-data.svg)](https://badge.fury.io/js/saphyre-data)

This module is used to handle big databases without the need to create complex queries. The queries are dynamically generated by this module just by chosing the modifiers to get the result.

## Query Modifiers

There are some options you can use to change query.
They are all named and can be used in a request. Also, there's no need to join tables, all associations are handled by Sequelize within each *option*.

### Projection

Projections are used to indicate the fields to select from the database, this option is similar to SQL SELECT, but you can name every projection with all fields required.

It's also possible to create custom middlewares to customize the data.

### Criteria

Criterias are used to indicate the filter option from the database, this option is similar to SQL WHERE, but you can name every criteria with all fields required and it's required inputs.

### Sort

Sorts are used to indicate the order option from the database, this option is similar to SQL ORDER BY bu you can name every sort with all fields required.

## API

### Projection

    var SaphyreData = require('saphyre-data'),
        data = new SaphyreData(),
        model = data.createModel('article', Article);
    // Article is a Sequelize Model
        
    // creating a projection to be used on list
    model.projection('list', {
        'article_id' : 'id', // article_id as id
        'created_at' : 'created_at',
        'title' : 'title',
        
        // the association Author will be automatically joined
        'Author.user_id' : 'author.id', 
        // an object author will be created
        'Author.nickname' : 'author.nickname', 
        // nickname will be a property of the author object recently created
        'Author.slug' : 'author.slug',
        
        // Association Category will be automatically joined
        'Category.name' : 'category' 
    }).use(function (article) {
        article.author.thumbnail = '/users/thumbnail/' + article.author.id;
    }).use(function (article) {
        console.log(article);
    });
    
Its possible to use functions on a projection

    'Tags.tag_id' : {
        alias : 'tags_count',
        func : SaphyreData.functions.count
    }
    
If you want to create aditional queries (for each row), necessary in HasMany:

    'Tags' : {
        list : 'tags', // the name of the result list in each row
        projection : {
            'tag_id' : 'id'
            'name' : 'name' // internally Tags.name
        },
        sort : { // optional
            'name' : 'ASC'
        }
    }
    
For HasMany and HasOne the QueryBuilder will LEFT JOIN the table, if you want to INNER JOIN the table:

    'Tags.tag_id' : {
        alias : 'tags_count',
        func : SaphyreData.functions.count,
        joinType : 'inner' // case sensitive
    }
    
#### Console output for each row
    {
        "id" : 1,
        "created_at" : Tue Feb 17 2015 12:50:47 GMT-0300 (BRT),
        "title" : "Article title",
        "author" : {
            "id" : 1,
            "nickname" : "Author",
            "slug" : "author-slug",
            "thumbnail" : "/users/thumbnail/1"
        },
        "category" : "Category Name"
    }
    
### Criteria

    model.criteria('author', {
        name : 'id', // this is the name of the parameter
        property : 'author_id', // the property to check
        operator : SaphyreData.OPERATOR.EQUAL // the operator
    });
    
It's also possible to use an array of parameters
    
    model.criteria('custom', [
        {/* param 1 */}, 
        {/* param 2 */}
    ]);

It's also possible to use an array of parameters with OR operator

    model.criteriaOR('custom', [
        {/* param 1 */},
        {/* param 2 */}
    ]);
    
There's an option to pass a static value to criteria parameters:

    model.criteria('non-removed', {
        name : 'status',
        property : 'status',
        operator : SaphyreData.OPERATOR.EQUAL,
        value : ArticleStatus.REMOVED
    });
    
It's also possible to use dynamic values, passing a function will evoke everytime a query is constructed.

    model.criteria('today', {
        name : 'date',
        property : 'publish_dt',
        operator : SaphyreData.OPERATOR.GREATER_EQUAL,
        value : function () {
            return new Date();
        }
    });
    
### Sort

    model.sort('recent', { 'publish_dt' : 'DESC' });
    
It's possible to sort on a RAW text, like alias.

    model.sort('recent', {
        'publish_dt' : {
            raw : true,
            direction : 'DESC'
        }
    });
    
    
## Data retrieval

    model.requestList({
        projection : 'list',
        criteria : {
            'non-removed' : true, // in this case, there's no value to pass
            'author' : 1 // it's possible to use 0..N criterias
        },
        page : 1,
        pageSize : 20,
        sort : 'recent'
    }).then(function (result) {
        // result.list -> the list
        // result.count -> the total elements
    });
    
    model.single({
        projection : 'list',
        criteria : {
            'non-removed' : true, // in this case, there's no value to pass
            'author' : 1 // it's possible to use 0..N criterias
        },
        sort : 'recent'
    }).then(function (theFirstItem) {
        
    });

    model.list({
        projection : 'list',
        criteria : {
            'non-removed' : true, // in this case, there's no value to pass
            'author' : 1 // it's possible to use 0..N criterias
        },
        page : 1, // won`t be considered, no pagination will be done
        pageSize : 20, // won`t be considered, no pagination will be done
        sort : 'recent'
    }).then(function (nonPaginatedList) {

    });

    model.count({
        criteria : { // only criteria is considered on counts
            'non-removed' : true, // in this case, there's no value to pass
            'author' : 1 // it's possible to use 0..N criterias
        },
    }).then(function (aNumber) {

    });
    
## Operators

    SaphyreData.OPERATOR.NOT_EQUAL
    SaphyreData.OPERATOR.EQUAL
    SaphyreData.OPERATOR.LESS_EQUAL
    SaphyreData.OPERATOR.GREATER_EQUAL
    SaphyreData.OPERATOR.LESS_THAN
    SaphyreData.OPERATOR.GREATER_THAN
    SaphyreData.OPERATOR.LIKE
    SaphyreData.OPERATOR.ILIKE
    SaphyreData.OPERATOR.BETWEEN
    SaphyreData.OPERATOR.HAS
    
When using **BETWEEN**, the value passed must be an array with length >= 2