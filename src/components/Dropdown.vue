<template>
<section class="dropDownMenuWrapper">

<button class="dropDownMenuButton" ref="menu" @click="openClose">{{menuTitle}}</button>

<div class="iconWrapper">
    <div class="arrow-down" v-if="!isOpen"></div>
    <div class="arrow-up" v-else></div>
</div>

<section class="dropdownMenu" v-if="isOpen">
  <div class="menuArrow" />
  <slot/>
</section>

</section>

</template>

<script>
export default {
    name: 'DropdownVue',
    props: ["menuTitle"],
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        openClose() {
            var _this = this
            const closeListerner = (e) => {
                if ( _this.catchOutsideClick(e, _this.$refs.menu ) )
                window.removeEventListener('click', closeListerner) , _this.isOpen = false
            }
            window.addEventListener('click', closeListerner)
            this.isOpen = !this.isOpen
        },
        catchOutsideClick(event, dropdown)  {
            if( dropdown == event.target )
            return false
            if( this.isOpen && dropdown != event.target )
            return true
        }
    }

}
</script>

<style lang="scss" scoped>
.dropDownMenuWrapper {
  display:inline-block;
  position: relative;
  width: 200px;
  height: 70px;
  margin-right: 15px;
  border-radius: 20px;
  background: white;
  border: 5px solid #52ACFF;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 20px;

  * {
    box-sizing: border-box;
    text-align: left;
  }

  .dropDownMenuButton {
    border: none;
    font-size: inherit;
    background: none;
    outline: none;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 70px 0 20px;
    margin: 0;
    line-height: 1;
    width: 100%;
    height: 100%;
    z-index: 2;
    cursor: pointer;
  }

  .dropDownMenuButton--dark {
    color: #eee;
  }

  .iconWrapper {
    width: 25px;
    height: 25px;
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 1;
    // CSS triangles instead of Unicode glyphs, which many fonts render as "?"
    .arrow-up,
    .arrow-down {
        width: 0;
        height: 0;
        margin: 9px auto 0;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
    }
    .arrow-up {
        border-bottom: 12px solid #52ACFF;
    }
    .arrow-down {
        border-top: 12px solid #52ACFF;
    }

  }

  .iconWrapper--noTitle {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: auto;
    height: auto;
    transform: none;
  }

  .dropdownMenu {
    position: absolute;
    top: 100%;
    width: 100%;
    min-width: 200px;
    min-height: 10px;
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    background: white;
    padding: 10px 20px;
    animation: menu 0.3s ease forwards;

    // .option {
    //   width: 100%;
    //   border-bottom: 1px solid #eee;
    //   padding: 20px 0;
    //   cursor: pointer;
    //   position: relative;
    //   z-index: 2;

    //   &:last-child {
    //     border-bottom: 0;
    //   }

    //   * {
    //     color: inherit;
    //     text-decoration: none;
    //     background: none;
    //     border: 0;
    //     padding: 0;
    //     outline: none;
    //     cursor: pointer;
    //   }

    // }

    .desc {
      opacity: 0.5;
      display: block;
      width: 100%;
      font-size: 14px;
      margin: 3px 0 0 0;
      cursor: default;
    }

  }

  .dropdownMenu--dark {
    background: #333;
    border: none;

    .option {
      border-bottom: 1px solid #888;
    }

    * {
      color: #eee;
    }

  }

  // keep below the rules it overrides
  @media (max-width: 860px) {
    display: block;
    width: 100%;
    height: 56px;
    margin-right: 0;
    border-width: 4px;
    border-radius: 16px;
    box-sizing: border-box;

    .dropDownMenuButton { padding-right: 50px; }
    .iconWrapper { top: 9px; right: 16px; }
  }

  @keyframes menu {
    from { transform: translate3d( 0, 30px ,0 ) }
    to { transform: translate3d( 0, 20px ,0 ) }
  }

}

.dropDownMenuWrapper:hover {
    box-shadow: 0 0 10px #93bae5;
}

</style>