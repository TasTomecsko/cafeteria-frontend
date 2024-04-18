<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { navIconType } from '@/enums/navIconTypes';

const props = defineProps([
    "nevigateTo",
    "buttonText",
    "navMenuIconType"
]);
</script>

<template>
    <RouterLink class="link" :to="props.nevigateTo">
        <div class="button-grid">
            <div>
                {{ props.buttonText }}
            </div>
            <div :class="{
                'home': props.navMenuIconType == navIconType.HOME,
                'meal': props.navMenuIconType == navIconType.MEALS,
                'menu': props.navMenuIconType == navIconType.MENUS,
                'user': props.navMenuIconType == navIconType.USERS
            }">
            </div>
        </div>
    </RouterLink>
</template>

<style scoped>
.link {
    font-size: 20px;
    color: black;
    text-decoration: none;
    padding: 8px 8px 8px 8px;
    border-radius: 5px;
    border: 1px solid transparent;
    background-color: rgb(160, 225, 255);
    text-align: start;
    transition: .5s;
    display: flex;
	flex-direction: row;
	align-items: center;
    margin-right: 15px;
}
.link:hover {
    background-color: whitesmoke;
    transition: .5s;
}
.link.router-link-active {
    background-color: rgb(30, 185, 255);
    border: 1px solid rgb(255, 255, 255);
}
.link.router-link-active:hover {
    background-color: rgb(0, 190, 255)
}
.button-grid {
    display: grid;
    grid-template-columns: 130px 32px;
}

.home {
    background-image: url('@/assets/images/NavBar/MenuIcons/Home.svg');
    background-repeat: no-repeat;
    background-position: center;
}
.link.router-link-active .home {
    background-image: url('@/assets/images/NavBar/MenuIcons/HomeActive.svg');
    background-repeat: no-repeat;
    background-position: center;
}

.meal {
    background-image: url('@/assets/images/NavBar/MenuIcons/Meal.svg');
    background-repeat: no-repeat;
    background-position: center;
}
.link.router-link-active .meal {
    background-image: url('@/assets/images/NavBar/MenuIcons/MealActive.svg');
    background-repeat: no-repeat;
    background-position: center;
}

.menu {
    background-image: url('@/assets/images/NavBar/MenuIcons/Menu.svg');
    background-repeat: no-repeat;
    background-position: center;
}
.link.router-link-active .menu {
    background-image: url('@/assets/images/NavBar/MenuIcons/MenuActive.svg');
    background-repeat: no-repeat;
    background-position: center;
}

.user {
    background-image: url('@/assets/images/NavBar/MenuIcons/Users.svg');
    background-repeat: no-repeat;
    background-position: center;
}
.link.router-link-active .user {
    background-image: url('@/assets/images/NavBar/MenuIcons/UsersActive.svg');
    background-repeat: no-repeat;
    background-position: center;
}
</style>