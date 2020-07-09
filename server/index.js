const express = require ('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json())


//Routes//

app.post('/todos',async function(request,response){
    try{
        const {description} = request.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
            );
        
        response.json(newTodo.rows[0]);
    }catch(err){
        console.log(err.message);
    }
})


app.get('/todos',async function(request,response){
    try{
        const allTodos = await pool.query('SELECT * FROM todo');
        response.json(allTodos.rows);

    }catch(err){
        console.log(err.message);
    }
})

app.get('/todos/:id',async function(request,response){
    try{
        const {id} = request.params;
            const todo = await pool.query(
            'SELECT * FROM todo WHERE todo_id=$1',
            [id]
            );
                response.json(todo.rows[0]);
    }catch(err){
        console.log(err.message);
    }
})


app.put('/todos/:id',async function(request,response){
    try{
        const {id} = request.params;
        const {description} = request.body;
        const updateTodo = await pool.query(
            'UPDATE todo SET description=$1 WHERE todo_id=$2',
            [description,id]   
        );
        response.json("todo updated");
    }catch(err){
        console.log(err.message);
    }
})

app.delete('/todos/:id',async function(request,response){
    try{
        const {id} = request.params;
        const deleteTodo = await pool.query(
            'DELETE FROM todo WHERE todo_id=$1',
            [id]
        );
            response.json("todo was deleted");
    }  catch(err){
        console.log(err.message);
    }  
})

app.listen(5000,()=>{
    console.log('listening on port 5000');
})