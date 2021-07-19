<template>
  <div class="form" v-if="data">
    <input
      class="form__checkbox"
      type="checkbox"
      :checked="data.completed"
      @change="$emit('checkTask', data.id)"
    />
    <input
      class="form__input"
      :class="{'stroke': data.completed}"
      type="text"
      placeholder="es. fare la spesa"
      :value="data.text"
      @input="onInput"
      :disabled="data.completed"
    />
    <div class="form__dropdown">
      <div class="dropdown">
        <button
          class="dropdown__toggle"
          :class="{ 'active': dropdownOpen }"
          :style="{ 'background-color': 'rgba(' + hexToRgb(dropdownBackgroundColor) + ', 0.3)' }"
          type="button"
          aria-haspopup="true"
          @click="onDropdownToggle"
        >
          {{ (selectedOption && selectedOption.label) || 'Seleziona categoria' }}
        </button>
        <ul class="dropdown__menu" role="listbox" :aria-expanded="dropdownOpen">
          <li
            v-for="(category, index) in categoryOptions"
            :key="category.value"
            role="option"
            :tabindex="index"
            @click="onCategoryClick(category)"
          >
            <span class="optioncolor" :style="{ 'background-color': category.color }"></span>
            {{ category.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Category from '../types/Category'

interface TaskFormState {
  dropdownOpen: boolean,
  categoryOptions: Category[]
}

export default defineComponent({
  name: 'TaskForm',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    dropdownBackgroundColor () : string {
      let toRet = 'inherit'
      if (this.selectedOption) {
        toRet = this.selectedOption.color
      }
      return toRet
    },
    selectedOption (): Category | null {
      let toRet = null
      if (this.data.category) {
        const findCategory = this.categoryOptions.find((category: Category) =>
          category.value === this.data.category)
        if (findCategory) {
          toRet = findCategory
        }
      }
      return toRet
    }
  },
  data (): TaskFormState {
    return {
      dropdownOpen: false,
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
      ] as Category[]
    }
  },
  methods: {
    onDropdownToggle () {
      const completed = this.data.completed
      if (!completed) {
        this.dropdownOpen = !this.dropdownOpen
      }
    },
    onCategoryClick (category: Category) {
      this.$emit('changeCategory', { category: category.value, id: this.data.id })
      this.dropdownOpen = !this.dropdownOpen
    },
    onInput (event: any) {
      this.$emit('changeText', { value: event.target.value, id: this.data.id })
    },
    hexToRgb (hex: string): string {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0'
    }
  }
})
</script>

<style lang="scss" scoped>
.form {
  margin: 10px 0;
  position: relative;
  height: 60px;
  width: 100%;

  .stroke {
    text-decoration: line-through;
  }

  &__checkbox {
    position: absolute;
    left: 1%;
    top: 30%;
    width: 40px;
    height: 40%;
    border: 1px solid #bababa;
    border-radius: 10px;
    z-index: 10;
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    color: $primary-clr;
    padding: 16px 16px 16px 60px;
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

  &__dropdown {
    position: absolute;
    right: 1%;
    top: 10%;
    width: 120px;
    height: 80%;
    border: 1px solid #bababa;
    border-radius: 10px;

    .dropdown {
      position: relative;
      cursor: pointer;
      height: 100%;

      &__toggle {
        appearance: none;
        background-color: $white;
        color: $primary-clr;
        font-size: 14px;
        border: 0;
        border-radius: 10px;
        padding: 12px 35px 12px 12px;
        outline: none;
        position: relative;
        height: 100%;
        width: 100%;

        &::after {
          content: '';
          border-width: 6px;
          border-radius: 3px;
          border-style: solid;
          border-color: transparent;
          border-top-color: inherit;
          position: absolute;
          right: 12px;
          top: calc(50% + 3px);
          transform: translateY(-50%);
        }

        &.active:after {
          border-color: transparent;
          border-bottom-color: inherit;
          top: calc(50% - 3px);
        }
      }

      &__menu {
        background-color: $white;
        list-style: none;
        padding: 5px;
        margin: 0;
        z-index: 10;
        max-width: 320px;
        width: calc(100% + 24px);
        border-radius: 10px;
        max-height: 200px;
        overflow: auto;
        position: absolute;
        left: 50%;
        top: 80%;
        transform: translateX(-50%);
        visibility: hidden;

        &[aria-expanded="true"] {
          visibility: visible;
        }

        li {
          display: flex;
          align-items: center;
          height: 30px;
          padding: 0 12px;
          margin: 2px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 10px;

          &:hover,&:focus {
            outline: none;
            background-color: rgba(#4caf50, 0.1);
          }
        }

        .optioncolor {
          margin-right: 10px;
          width: 20px;
          height: 20px;
          border-radius: 50px;
          display: inline-block;
        }
      }
    }
  }
}
</style>
