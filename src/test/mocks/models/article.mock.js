module.exports = function (sequelize, DataTypes) {

    var Article = sequelize.define('Article', {

        article_id : {
            type : DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement : true
        },

        title : DataTypes.STRING,
        content : DataTypes.BLOB,
        date : DataTypes.DATE

    }, {

        paranoid : true,

        classMethods: {
            associate: function (models) {
                Article.belongsTo(models.Author, {
                    as : 'Author',
                    foreignKey : 'author_id'
                });

                Article.belongsToMany(models.Tag, {
                    as : 'Tags',
                    through : 'ArticleTag',
                    foreignKey : 'article_id',
                    otherKey : 'tag_id'
                });

                Article.hasOne(models.ArticleInfo, {
                    as : 'Info',
                    foreignKey : 'article_id'
                });

                Article.hasMany(models.ArticleViewModel, {
                    as : 'Views',
                    foreignKey : 'article_id'
                });
            }
        }
    });

    return Article;
};