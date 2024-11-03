<template>
    <div class="container-question">
      <p class="additional-content"><i class="fa-solid fa-circle-question"></i> {{ chat.question }}</p>
    </div>
    <div class="paper-details">
      <p><span>{{ chat.answer }}</span></p>
    </div>
  </template>
  <script>
  export default {
    name: "HistoryChat",
    props: {
      chat: Object,
    },
    data() {
      return {
        
      };
    },
    mounted() {

    },
    methods: {

    }
  };
  </script>
  
  
  <style scoped>
  .search-by {
    width: 100%;
    display: flex;
    justify-content: start;
    position: relative;
    display: flex;
    justify-content: center;
  }
  
  .search-line {
    background-color: #007BFF;
    height: 2px;
    width: 60%;
    position: absolute;
    top: 12px;
  }
  
  .search-by-content {
    color: #007BFF;
    z-index: 1;
    text-align: center;
    width: fit-content;
    /* border: 1px solid #ddd; */
    background-color: white;
    padding: 0px 10px;
    margin-bottom: 10px;
    font-weight: bold;
    border-radius: 10px;
    width: 16%;
  }
  
  
  .card-header {
    padding: 0 !important;
  }
  
  .p-title {
    color: #28A745;
    font-weight: bold;
    font-size: 20px;
  }
  
  .container-question {
    width: 100%;
    display: flex;
    justify-content: end;
  }
  
  .additional-content {
    color: red;
    text-align: end;
    width: fit-content;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    padding: 5px;
    margin-bottom: 10px;
    font-weight: bold;
    border-radius: 10px;
    max-width: 50%;
  }
  
  .paper-details {
    width: fit-content;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .paper-details h2 {
    margin-top: 0;
  }
  
  .paper-details p {
    margin: 5px 0;
  }
  
  .paper-details a {
    color: #0069D9 !important;
  }
  
  .name_keyword_span {
    background-color: #28A644;
    border-radius: 10px;
    padding: 0px 6px;
    margin: 3px;
    color: white;
    font-weight: bold;
  }
  
  .modal-dialog {
      max-width: 500px;
  }
  
  .container-keywords {
    display: flex;
    flex-wrap: wrap;
  }
  </style>
  