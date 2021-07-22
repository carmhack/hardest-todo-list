<template>
  <div class="container">
    <div class="box">
      <div class="searchbox">
        <label for="search">Ricerca per testo</label>
        <input
          type="text"
          name="search"
          class="searchbar"
          placeholder="Cerca..."
          v-model="searchText"
        />
      </div>

      <h2 class="title">Elenco Task</h2>
      <task-form
        v-for="task in currentTasks"
        :key="task.id"
        :data="task"
        @changeCategory="onChangeCategory($event)"
        @changeText="onChangeText($event)"
        @checkTask="onCheckTask($event)"
        @deleteTask="onDeleteTask($event)"
      ></task-form>
      <button class="button add-new" @click="onAddNew">+</button>
    </div>

    <div v-if="completedTasks.length > 0" class="box">
      <h2 class="title">
        <span
          :class="[ showCompletedTasks ? 'mdi mdi-arrow-down' : 'mdi mdi-arrow-up' ]"
          @click="showCompletedTasks = !showCompletedTasks"
          style="cursor: pointer"
        ></span>
        {{ completedTasksLabel }}
      </h2>
      <div v-if="showCompletedTasks" class="completed-tasks-box">
        <task-form
            v-for="task in completedTasks"
            :key="task.id"
            :data="task"
            @checkTask="onCheckTask($event)"
            @deleteTask="onDeleteTask($event)"
        ></task-form>
        <h4 class="delete-label" @click="onDeleteCompletedTasks"><span class="mdi mdi-trash-can-outline"></span> Elimina i task completati</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TaskForm from '@/components/TaskForm.vue'
import { defineComponent } from 'vue'
import Task from '../types/Task'

interface TasksState {
  newTask: Omit<Task, 'id'>,
  tasks: Task[],
  showCompletedTasks: boolean,
  searchText: string
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
      const tasks = this.tasks
      const searchText = this.searchText
      let toRet = tasks.filter((task: Task) => !task.completed)
      if (searchText !== '') {
        toRet = toRet.filter((task: Task) => task.text.toLowerCase().includes(searchText.toLowerCase()))
      }
      return toRet
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
      ],
      showCompletedTasks: false,
      searchText: ''
    }
  },
  methods: {
    onAddNew () {
      this.tasks.push({ id: this.tasks.length + 1, ...this.newTask })
    },
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
    onDeleteTask (taskId: number) {
      const userConfirm = confirm('Sei sicuro di voler eliminare il task?')
      const findTask = this.tasks.find((task: Task) => task.id === taskId)
      if (userConfirm && findTask) {
        this.tasks = this.tasks.filter((task: Task) => task.id !== taskId)
      }
    },
    onDeleteCompletedTasks () {
      const userConfirm = confirm('Sei sicuro di voler eliminare tutti i task completati?')
      if (userConfirm) {
        this.deleteCompletedTasks()
      }
    },
    deleteCompletedTasks () {
      this.tasks = this.tasks.filter((task: Task) => !task.completed)
    }
  }
})
</script>

<style lang="scss" scoped>
.searchbox {
  width: 100%;
  margin-bottom: 20px;

  .searchbar {
    margin-top: 10px;
    display: block;
    width: 80%;
    height: 100%;
    background-color: $white;
    color: $primary-clr;
    padding: 16px;
    font-family: inherit;
    font-size: 18px;
    font-weight: 400;
    border: 0;
    border-radius: 10px;
    outline: none;
  }
}
.delete-label {
  text-align: center;
  color: red;
  font-weight: bold;
  cursor: pointer;
}
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
