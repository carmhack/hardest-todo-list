<template>
  <div class="container">
    <h2 class="title">Elenco Task</h2>
    <task-form :data="newTask"></task-form>
    <button>+</button>
  </div>
</template>

<script lang="ts">
import TaskForm, { ICategory } from '@/components/TaskForm.vue'

interface Task {
  id: string,
  text: string,
  completed: boolean,
  category: ICategory
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
        category: {
          color: '#9e9e9e',
          value: 'Principale',
          label: 'Principale'
        }
      },
      tasks: []
    }
  }
}
</script>
