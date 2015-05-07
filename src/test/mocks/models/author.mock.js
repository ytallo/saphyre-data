module.exports = function (sequelize, DataTypes) {

    var Author = sequelize.define('Author', {

        author_id : {
            type : DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement : true
        },

        name : DataTypes.STRING

    }, {
        tableName : 'table_author', // custom table name

        classMethods: {
            associate: function (models) {
                Author.hasMany(models.Article, {
                    as : 'Articles',
                    foreignKey : 'author_id'
                });
            }
        }
    });

    return Author;
};