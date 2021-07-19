<template>
  <div class="container">
    <div class="box">
      <h2 class="title">Elenco Task</h2>
      <task-form
        v-for="task in currentTasks"
        :key="task.id"
        :data="task"
        @changeCategory="onChangeCategory($event)"
        @changeText="onChangeText($event)"
        @checkTask="onCheckTask($event)"
      ></task-form>
      <button class="button add-new" @click="onAddNew">+</button>
    </div>

    <div class="box" v-if="completedTasks.length > 0">
      <h2 class="title">{{ completedTasksLabel }}</h2>
      <task-form
        v-for="task in completedTasks"
        :key="task.id"
        :data="task"
        @checkTask="onCheckTask($event)"
    ></task-form>
    </div>
  </div>
</template>

<script lang="ts">
import TaskForm from '@/components/TaskForm.vue'
import { defineComponent } from 'vue'
import Task from '../types/Task'

interface TasksState {
  newTask: Omit<Task, 'id'>,
  tasks: Task[]
}

export default defineComponent({
  name: 'Tasks',
  components: { TaskForm },
  computed: {
    completedTasksLabel () : string {
      const totalCompletedTasks = this.completedTasks.length
      if (totalCompletedTasks <= 1) {
        return totalCompletedTasks + ' task completato'
      } else {
        return totalCompletedTasks + ' task completati'
      }
    },
    completedTasks (): Task[] {
      return this.tasks.filter((task: Task) => task.completed)
    },
    currentTasks (): Task[] {
      return this.tasks.filter((task: Task) => !task.completed)
    }
  },
  data (): TasksState {
    return {
      newTask: {
        text: '',
        completed: false,
        category: 'Principale'
      },
      tasks: [
        {
          id: 1,
          text: 'Comprare il pane',
          completed: false,
          category: 'Spesa'
        },
        {
          id: 2,
          text: 'Lavare i piatti',
          completed: false,
          category: 'Casa'
        },
        {
          id: 3,
          text: 'Smontare telescopio',
          completed: true,
          category: 'Principale'
        }
      ]
    }
  },
  methods: {
    onCheckTask (taskId: number) {
      const findTask = this.tasks.find((task: Task) => task.id === taskId)
      if (findTask) {
        findTask.completed = !findTask.completed
      }
    },
    onChangeCategory (event: any) {
      const findTask = this.tasks.find((task: Task) => task.id === event.id)
      if (findTask) {
        findTask.category = event.category
      }
    },
    onChangeText (event: any) {
      const findTask = this.tasks.find((task: Task) => task.id === event.id)
      if (findTask) {
        findTask.text = event.value
      }
    },
    onAddNew () {
      this.tasks.push({ id: this.tasks.length + 1, ...this.newTask })
    }
  }
})
</script>

<style lang="scss" scoped>
button.button.add-new {
  margin-top: 10px;
  background-color: white;
  color: $primary-clr;
  font-size: 24px;
  font-weight: 700;
  padding: 12px 16px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
}
</style>
