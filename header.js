// header.js

import { ref } from 'vue';

export default {
    setup() {
        // You can define variables or reactive references here
        const count = ref(0);

        // Return the variables or functions to be used in the component
        return {
            count,
            // Add other variables or methods here
        };
    },
    template: `<div class="align-items-center card header d-flex flex-row justify-content-between"> 
    <div class="d-inline-block" >21120090</div>
    <h1 class="d-inline-block">Movie info</h1>
    <div class="d-inline-block">21090</div>
    </div>`,
};