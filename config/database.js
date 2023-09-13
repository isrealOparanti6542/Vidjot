if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:
       'mongodb+srv://Isreal:<Goldmine10#>@cluster0.pkhckh1.mongodb.net/?retryWrites=true&w=majority'
    }
}else{
    module.exports = {mongoURI:
        'mongodb://localhost:27017/vidjot-dev'   
    }
}