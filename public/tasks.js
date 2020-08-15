const Task = require('../src/models/task')

const completeTask = async(id)=>{
    await Task.findByIdAndDelete(id);
}

