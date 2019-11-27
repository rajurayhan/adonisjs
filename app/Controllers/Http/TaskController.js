// 'use strict'
const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {

  async index ({ view }) {
    const tasks = await Task.all()
    //console.log(tasks.toJSON())
    return view.render('tasks.index', { tasks: tasks.toJSON() })
  }

  async store({ request, session , response }){
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255'
    })
    if(validation.fails()){
      session.withErrors(validation.messages())
            .flashAll()

      return response.redirect('back')
    }

    // persist to database

    const task  = new Task()
    task.title  = request.input('title')

    await task.save();
    // Fash success message to session
    session.flash({ notification: 'Task added!' })

    return response.redirect('back')
  }

  async destroy({ params, response, session }){
    // console.log(params.id);
    const task = await Task.find(params.id)
    // console.log(task.toJSON())
    // if(confirm){
    //   await task.delete()
    // }
    await task.delete()

    // Fash success message to session
    session.flash({ notification: 'Task deleted!' })

    return response.redirect('back')
  }
}

module.exports = TaskController
