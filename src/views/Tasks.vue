<template>
  <div class="container">
    <h2 class="title">Elenco Task</h2>
    <task-form :data="newTask"></task-form>
    <button>+</button>
  </div>
</template>

<script lang="ts">
import TaskForm from '@/components/TaskForm.vue'

interface Task {
  id: string,
  text: string,
  completed: boolean,
  category: string
}

interface TasksState {
  newTask: Omit<Task, 'id'>,
  tasks: Task[]
}

export default {
  name: 'Tasks',
  components: { TaskForm },
  data (): TasksState {
    return {
      newTask: {
        text: '',
        completed: false,
        category: 'Principale'
      },
      tasks: []
    }
  }
}
</script>
