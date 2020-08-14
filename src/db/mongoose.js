const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://akshara:Bjarne@c-0.6xazj.mongodb.net/task-manager-api?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})