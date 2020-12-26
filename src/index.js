import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './column'

const App = () => {
  const [data, setData] = useState(initialData)

  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) { // if there is no destination end the execution
      return
    }

    if ( // if the droppable and the index are the same the item was dropped into the position it started in, end the exection
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = data.columns[source.droppableId]
    const newTasksIds = Array.from(column.taskIds) // 'array.from' makes sure that the state isn't passed by reference to avoid directly modifying state 
    newTasksIds.splice(source.index, 1) // remove the moved draggable from tasks
    newTasksIds.splice(destination.index, 0, draggableId) // add the moved draggable back but in it's new position


    const newColumn = {
      ...column,
      taskIds: newTasksIds
    }

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn
      }
    })
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId]
        const tasks = column.taskIds.map(taskId => data.tasks[taskId])

        return (
          <Column key={column.id} column={column} tasks={tasks} />
        )
      })}
    </DragDropContext>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))