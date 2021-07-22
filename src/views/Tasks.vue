<template>
  <div class="container">
    <div class="box">
      <div class="search">
        <div class="search__box">
          <label for="search__label">Ricerca per testo</label>
          <div>
            <input
              type="text"
              name="search"
              class="search__input"
              placeholder="Cerca..."
              v-model="searchText"
            />
            <span class="mdi mdi-filter" @click="showCategoriesFilter = !showCategoriesFilter"></span>
          </div>
          <div v-if="showCategoriesFilter" class="search__categories">
            <h3>Ricerca per categorie</h3>
            <div
              class="search__category"
              v-for="category in categoryOptions"
              :key="category.value"
            >
              <input
                type="checkbox"
                :name="category.value"
                :id="category.value"
                @change="onCategoryFilter(category.value)"
              >
              <label :for="category.value">{{ category.label }}</label>
            </div>
          </div>
        </div>
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
import Category from '@/types/Category'
import { defineComponent } from 'vue'
import Task from '../types/Task'

interface TasksState {
  newTask: Omit<Task, 'id'>,
  tasks: Task[],
  searchText: string,
  categoryOptions: Category[],
  selectedCategories: string[],
  showCompletedTasks: boolean,
  showCategoriesFilter: boolean
}

export default defineComponent({
  name: 'Tasks',
  components: { TaskForm },
  mounted () {
    if (localStorage.tasks) {
      this.tasks = JSON.parse(localStorage.tasks)
    }
  },
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
      const selectedCategories = this.selectedCategories

      let toRet = tasks.filter((task: Task) => !task.completed)

      // Filtro categorie
      if (selectedCategories.length > 0) {
        toRet = toRet.filter((task: Task) => selectedCategories.includes(task.category))
      }

      // Filtro testuale
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
      ],
      searchText: '',
      categoryOptions: [
        {
          color: '#9e9e9e',
          value: 'Principale',
          label: 'Principale'
        },
        {
          color: '#4caf50',
          value: 'Casa',
          label: 'Casa'
        },
        {
          color: '#ff9800',
          value: 'Lavoro',
          label: 'Lavoro'
        },
        {
          color: '#9c27b0',
          value: 'Spesa',
          label: 'Spesa'
        }
      ] as Category[],
      selectedCategories: [] as string[],
      showCompletedTasks: false,
      showCategoriesFilter: false
    }
  },
  methods: {
    saveOnLocalStorage (tasks: Task[]) {
      localStorage.tasks = JSON.stringify(tasks)
    },
    onAddNew () {
      this.tasks.push({ id: this.tasks.length + 1, ...this.newTask })
      this.saveOnLocalStorage(this.tasks)
    },
    onCheckTask (taskId: number) {
      const findTask = this.tasks.find((task: Task) => task.id === taskId)
      if (findTask) {
        findTask.completed = !findTask.completed
        this.saveOnLocalStorage(this.tasks)
      }
    },
    onChangeCategory (event: any) {
      const findTask = this.tasks.find((task: Task) => task.id === event.id)
      if (findTask) {
        findTask.category = event.category
        this.saveOnLocalStorage(this.tasks)
      }
    },
    onChangeText (event: any) {
      const findTask = this.tasks.find((task: Task) => task.id === event.id)
      if (findTask) {
        findTask.text = event.value
        this.saveOnLocalStorage(this.tasks)
      }
    },
    onDeleteTask (taskId: number) {
      const userConfirm = confirm('Sei sicuro di voler eliminare il task?')
      const findTask = this.tasks.find((task: Task) => task.id === taskId)
      if (userConfirm && findTask) {
        this.tasks = this.tasks.filter((task: Task) => task.id !== taskId)
        this.saveOnLocalStorage(this.tasks)
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
      this.saveOnLocalStorage(this.tasks)
    },
    onCategoryFilter (categoryValue: string) {
      const selectedCategories = this.selectedCategories
      const find = selectedCategories.find((category: string) => category === categoryValue)
      if (find) {
        // Elimino categoria perchè già presente
        selectedCategories.splice(selectedCategories.indexOf(categoryValue), 1)
      } else {
        selectedCategories.push(categoryValue)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  margin-bottom: 20px;

  &__box {
    position: relative;
  }

  &__input {
    margin-top: 10px;
    display: inline-block;
    width: 90%;
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

    &:focus {
      border: 2px solid $accent-clr;
    }
  }

  span {
    font-size: 26px;
    margin-left: 20px;
    cursor: pointer;
  }

  &__categories {
    background-color: rgba($accent-clr, 0.6);
    margin-top: 12px;
    padding: 12px;
    border-radius: 10px;
  }

  &__category {
    margin: 6px 0;

    label {
      font-size: 16px;
      padding-left: 6px;
    }
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
