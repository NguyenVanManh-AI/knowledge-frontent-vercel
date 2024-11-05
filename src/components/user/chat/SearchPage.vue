<template>
    <div id="main">
        <div>
            <h3 class="title-channel mb-2">
                <i class="fa-solid fa-robot"></i> Chat Bot
            </h3>
        </div>
        <div class="container-result" ref="containerResult">
            <div class="mt-2" id="result">
                <div v-if="isLoadingHistory" class="d-flex justify-content-center container-loader">
                    <flower-spinner class="loading-component" :animation-duration="2000" :size="30" color="#06C755" />
                </div>
                <div v-if="!isLoadingHistory">
                    <HistoryChat v-for="(chat, index) in chats" :nth="index" :key="index" :chat="chat" />
                </div>
                <TypedText v-for="(text, index) in texts" :nth="index" :key="index" :content="text" />
            </div>
        </div>
        <div v-if="texts.length == 0 && chats.length == 0" class="intro-search">
            <i class="fa-solid fa-lightbulb"></i> Search information, signs and treatment solutions for your disease on
            the system !
        </div>
        <div class="col-auto">
            <div v-if="isLoading" class="d-flex justify-content-center container-loader">
                <flower-spinner class="loading-component" :animation-duration="2000" :size="30" color="#06C755" />
            </div>
            <div class="input-group container-search">
                <div class="input-group-prepend">
                    <div class="input-group-text" @click="searchPaper"><i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <input @keyup.enter="searchPaper" v-model="searchQuery" type="text" class="form-control input_search"
                    id="inlineFormInputGroup" placeholder="Enter something to Chat...">
            </div>
        </div>
        <!-- <div class="container-search">
                <input @keyup.enter="searchPaper" v-model="searchQuery" type="text" class="form-control"
                    id="formGroupExampleInput" placeholder="Enter something to Search..."> 
        </div> -->
    </div>
</template>

<script>
import config from '@/config';
import UserRequest from '@/restful/UserRequest';
import HistoryChat from '@/components/user/chat/HistoryChat.vue';
import TypedText from '@/components/user/chat/TypedText.vue';
import { FlowerSpinner } from 'epic-spinners';

export default {
    name: "SearchPage",
    components: {
        TypedText,
        HistoryChat,
        FlowerSpinner,
    },
    data() {
        return {
            isLoading: false,
            isLoadingHistory: false,
            config: config,
            searchQuery: '',
            chats: [],
            texts: [],
            user: {
				id: null,
				username: null,
				email: null,
				first_name: null,
				last_name: null,
				access_token: null,
                role: null,
			},
        }
    },
    mounted() {
        this.$emitEvent('eventTitleHeader', 'Chat Bot');
        document.title = "Chat Bot | Knowledge Advanced";
        this.user = JSON.parse(window.localStorage.getItem('user'));
        this.getHistoryChat();
    },
    updated() {
        this.scrollToBottom();
    },
    methods: {
        async getHistoryChat() {
            this.isLoadingHistory = true;
            try {
                var { data } = await UserRequest.get('chatbot/history/?id_user='+this.user.id);
                this.chats = data;
                this.isLoadingHistory = false;
            }
            catch (error) {
                this.isLoadingHistory = false;
                if (error.messages) this.$emitEvent('eventError', error.messages[0]);
            }
        },
        async searchPaper() { // với cách này đã cải thiện tốc độ gõ 
            this.isLoading = true;
            try {
                var dataSubmit = {
                    question: this.searchQuery,
                };
                var question_id = `typed-text-${Math.random().toString(36).substr(2, 9)}`
                this.texts.push(
                    { 
                        type: 'question', 
                        contentvalue: {
                            'question_content' : this.searchQuery,
                            'question_id' : question_id,
                        }
                    },
                );
                this.searchQuery = '';
                const { data } = await UserRequest.post('chatbot/', dataSubmit);
                this.addResultsSequentially(data.answer, data.cypher, question_id);
                this.addNewChat(dataSubmit.question, data.answer);
                this.$emitEvent('eventSuccess', 'Search success !');
                this.isLoading = false;
            }
            catch (error) {
                this.isLoading = false;
                if (error.messages) this.$emitEvent('eventError', error.messages[0]);
            }
        },
        async addNewChat(question, answer) {
            try {
                var dataSubmit = {
                    question: question,
                    answer: answer,
                };
                const { data } = await UserRequest.post('chatbot/create_new/', dataSubmit);
                console.log(data);
            }
            catch (error) {
                if (error.messages) this.$emitEvent('eventError', error.messages[0]);
            }
        },
        async addResultsSequentially(answer, cypher, id_question) {
            this.texts.push(
                { 
                    type: 'result', 
                    contentvalue: {
                        'answer' : answer, 
                        'cypher' : cypher,
                        'id_question' : id_question
                    }
                }
            );
            for (var i = 1; i < 10; i++) {
                await this.wait(500);
                this.scrollToBottom();
            }
        },
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.containerResult;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        }
    }
}
</script>

<style scoped>
/* loading */
.container-loader {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 99;
    align-content: center;
    display: flex !important;
    justify-content: center;
}

.input-group-text {
    cursor: pointer;
}

.input-group-text:hover {
    color: blue;
}


.intro-search {
    position: absolute;
    font-weight: bold;
    font-size: 30px;
    top: -10%;
    text-align: center;
    width: 100%;
    padding: 20%;
    color: silver;
}

.container-result {
    width: 100%;
    height: 530px;
    overflow: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;
    /* giúp cho hiệu ứng cuộn xuống mượt hơn */
}

#main {
    min-height: 88vh;
    position: relative;
}

.container-search {
    position: absolute;
    width: calc(100% - 40px);
    /* margin-top: 20px; */
    /* bottom: 10px; */
}

.input_search {
    display: inline-block;
    border-radius: 20px;
    background-color: #F4F4F4;
}

.container-search input {
    display: inline-block;
    border-radius: 20px;
    background-color: #F4F4F4;
}


.title-channel {
    font-size: 19px;
    color: var(--user-color);
}

tr th {
    color: var(--user-color);
}

#main {
    padding: 10px 20px;
}

#page {
    margin-right: auto;
}

table {
    font-size: 12px;
}

table img {
    max-width: 150px;
    height: auto;
    object-fit: cover;
}

.table-cell {
    font-weight: bold;
    vertical-align: middle;
}

table thead th,
table tbody th {
    vertical-align: middle;
    text-align: center;
}

table button {
    padding: 1px 3px;
    margin-right: 2px;
}

.form-control {
    height: calc(1.5em + .5rem + 2px);
    padding: .25rem .5rem;
    font-size: .875rem;
    border-radius: 0.2rem;
    line-height: 1.5;
}

@media screen and (min-width: 1201px) {
    table {
        max-width: 100%;
        vertical-align: middle;
    }

    td .fa-solid {
        font-size: 20px;
    }
}

@media screen and (min-width: 993px) and (max-width: 1200px) {
    table {
        max-width: 100%;
        vertical-align: middle;
    }

    table {
        font-size: 11px;
    }

    .fa-solid {
        font-size: 15px;
    }

    .table td,
    .table th {
        padding: 8px;
    }

    .form-control,
    .pagination {
        font-size: 12px !important;
    }

    .input-group-text {
        padding: 1px 9px;
    }

    #main {
        padding: 1% 1%;
        margin: 0;
    }

    .col-1,
    .col-2,
    .col-3 {
        padding-right: 8px;
    }

    table button {
        padding: 1px 2px;
    }

    table img {
        max-width: 110px;
    }

}

@media screen and (min-width: 769px) and (max-width: 992px) {
    .title-channel {
        font-size: 15px;
    }

    table {
        max-width: 100%;
        vertical-align: middle;
    }

    table {
        font-size: 11px;
    }

    .fa-solid {
        font-size: 16px;
    }

    .table td,
    .table th {
        padding: 8px;
    }

    .form-control,
    .pagination {
        font-size: 12px !important;
    }

    .input-group-text {
        padding: 0 6px;
    }

    #main {
        padding: 1% 1%;
        margin: 0;
    }

    #page {
        min-width: 65px;
    }

    .col-1,
    .col-2,
    .col-3 {
        padding-left: 0;
        padding-right: 3px;
    }

    .btn {
        padding: 1px 5px 0 5px;
    }

    table button {
        padding: 1px 2px;
    }

    table img {
        max-width: 100px;
    }

}

@media screen and (min-width: 577px) and (max-width: 768px) {

    .title-channel,
    table {
        max-width: 100%;
        vertical-align: middle;
    }

    table {
        font-size: 11px;
    }

    .fa-solid {
        font-size: 13px;
    }

    .table td,
    .table th {
        padding: 8px;
    }

    .form-control,
    .pagination {
        font-size: 12px !important;
    }

    #page {
        min-width: 45px;
    }

    .form-control {
        padding: 1px 1px;
    }

    #main {
        padding: 1% 1%;
        margin: 0;
    }

    .col-1,
    .col-2,
    .col-3 {
        padding-right: 5px;
    }

    .btn {
        padding: 1px 4px 0 4px;
    }

    .input-group-text {
        padding: 0 4px;
    }

    .input-group-prepend {
        font-size: 12px;

    }

    .mr-3 {
        margin-left: -1% !important;
        margin-right: 0px !important
    }

    table button {
        padding: 1px;
    }

    table img {
        max-width: 100px;
    }

}

@media screen and (min-width: 425px) and (max-width: 576px) {

    .title-channel,
    table {
        max-width: 100%;
        vertical-align: middle;
    }

    table {
        font-size: 10px;
    }

    .fa-solid {
        font-size: 10px;
    }

    .table td,
    .table th {
        padding: 5px;
    }

    .form-control,
    .pagination {
        font-size: 10px !important;
    }

    .form-control {
        padding: 1px 1px;
        height: 25px;
    }

    #page {
        min-width: 45px;
    }

    #main {
        padding: 1% 1%;
        margin: 0;
    }

    .col-1,
    .col-2,
    .col-3 {
        padding-right: 5px;
    }

    .btn {
        padding: 0px 4px;
    }

    .input-group-text {
        padding: 0 3px;
    }

    .input-group-prepend {
        font-size: 11px;
    }

    .mr-3 {
        margin-left: -2% !important;
        margin-right: 0px !important
    }

    table button {
        padding: 1px;
    }

    .mt-3 {
        margin-top: 0 !important;
    }

    table img {
        max-width: 80px;
    }

}

@media screen and (min-width: 375px) and (max-width: 424px) {

    .title-channel,

    table {
        max-width: 100%;
        vertical-align: middle;
    }

    table {
        font-size: 9px;
    }

    .fa-solid {
        font-size: 10px;
    }

    .table td,
    .table th {
        padding: 4px;
    }

    .form-control,
    .pagination {
        font-size: 9px !important;
    }

    .form-control {
        padding: 0.5px 0;
        height: 25px;
    }

    #page {
        min-width: 40px;
    }

    #main {
        padding: 1% 1%;
        margin: 0;
    }

    .col-1,
    .col-2,
    .col-3 {
        padding-right: 0;
    }

    .btn {
        padding: 0px 4px;
    }

    .input-group-text {
        padding: 0 2px;
    }

    .input-group-prepend {
        font-size: 10px;

    }

    #main .ml-2 {
        margin-left: 3px !important;
    }

    .mr-3 {
        margin-left: 0px !important;
        margin-right: 0px !important;
    }

    table button {
        padding: 0.7px;
    }

    .mt-3 {
        margin-top: 0 !important;
    }

    table img {
        max-width: 70px;
    }

}
</style>
