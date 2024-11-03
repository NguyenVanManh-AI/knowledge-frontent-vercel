<template>
  <div class="container-question" v-if="content.type == 'question'">
    <p type="button" data-toggle="modal" :data-target="'#' + content.contentvalue.question_id"
      class="additional-content"><i class="fa-solid fa-circle-question"></i> {{ content.contentvalue.question_content }}
    </p>
  </div>
  <div v-if="content.type == 'result'" class="paper-details">
    <!-- Modal -->
    <div class="modal fade" :id="content.contentvalue.id_question" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"><strong>Cypher</strong></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-success">
            {{ content.contentvalue.cypher }}
          </div>
        </div>
      </div>
    </div>
    <p><span :ref="'title' + nth"></span></p>
  </div>
</template>

<script>
import TypeIt from "typeit";
export default {
  name: "TypedText",
  props: {
    content: Object,
    nth: Number,
  },
  data() {
    return {

    };
  },
  mounted() {
    console.log(this.content);
    if (this.content.type === 'result') {
      this.showResultDetails();
    }
  },
  methods: {
    showResultDetails() {
      new TypeIt(this.$refs['title' + this.nth], { speed: 1, lifelike: true, cursor: false }).type(this.content.contentvalue.answer).go();
    },
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
