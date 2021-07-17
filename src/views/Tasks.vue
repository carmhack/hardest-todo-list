<template>
  <div class="container">
    <h2 class="title">Elenco Task</h2>
    <task-form :data="newTask"></task-form>
    <button>+</button>
  </div>
</template>

<script lang="ts">
import TaskForm, { Category } from '@/components/TaskForm.vue'
import { defineComponent } from 'vue'

interface Task {
  id: string,
  text: string,
  completed: boolean,
  category: Category
}

interface TasksState {
  newTask: Omit<Task, 'id'>,
  tasks: Task[]
}

export default defineComponent({
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
})
</script>
