<template>
  <div class="neo4j-browser">
    <iframe :src="neo4jBrowserUrl" frameborder="0" width="100%" height="800px"></iframe>
    <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal">
      <i class="fa-solid fa-circle-question"></i>
    </button>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document" style="max-width: 50vw;">
        <div class="modal-content">
          <div class="modal-body">
            <a target="_blank" class="text-primary" href="https://workspace-preview.neo4j.io/workspace/query?ntid=google-oauth2%7C116361259175955640215">https://workspace-preview.neo4j.io</a>
            <br>self.uri = "neo4j+s://ffdfad2c.databases.neo4j.io"                   # Địa chỉ database
            <br>self.username = "neo4j"                                              # Username
            <br>self.password = "niQisz0U5weBUMit5DuSDTxMXmDsU91qykqIEOJTA4o"        # Password
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Thay đổi URL này thành URL của Neo4j Browser của bạn
      neo4jBrowserUrl: "https://workspace-preview.neo4j.io/workspace/query?ntid=google-oauth2%7C116361259175955640215",
    };
  },
};


// uri = "neo4j+s://ffdfad2c.databases.neo4j.io"                   # Địa chỉ database
// username = "neo4j"                                              # Username
// password = "niQisz0U5weBUMit5DuSDTxMXmDsU91qykqIEOJTA4o"        # Password
 
// MATCH (n)-[r]-(related)
// WHERE n.id CONTAINS "tuyến_thượng_thận"
// RETURN n, r, related

</script>

<style scoped>
.neo4j-browser {
  overflow: hidden;
}

iframe {
  border: none;
}
</style>