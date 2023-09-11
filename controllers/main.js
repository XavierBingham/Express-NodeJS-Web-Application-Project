module.exports = {

    //Data-Retrieval
    index: function(req, res){
        res.render('./index.ejs');
    },

    about: function(req, res){
        res.render('./about.ejs');
    },

    contact: function(req, res){
        res.render('./contact.ejs');
    },

}