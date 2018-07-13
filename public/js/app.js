$.getJSON("/whattoeat", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#scrapes").
      append(
      `<div data-id="${data[i]._id}" class="theBigDiv">
        <img class="thePics" src="${data[i].image}">
        <a class="theLink" href="${data[i].link}">${data[i].title}</a>
        <p class="theAuthor">${data[i].author}</p>
        <p class="theText">
          ${data[i].text}
        </p>
      </div>`);
    }
  });
  
  $(document).on("click", "#search-food", function() {
    $("#scrapes").empty();
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).done(function() {
      location.reload();
    });
  });

  $(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/scrape/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/scrape/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  