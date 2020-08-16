const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://akshara:<password>@c-0.6xazj.mongodb.net/<dbName>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})