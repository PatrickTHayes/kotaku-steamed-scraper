$.ajax({
    url:"/scrape",
    success:function(data){
        console.log("success");
        $.ajax({
            url:"/articles/notes",
            success: function (articles){
                console.log(articles)
                for (var i=0;i<articles.length;i++){
                    $("#articleHolder").append(/*"<p> "+articles[i].title + "</p>")*/
                    `<div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                          <img class="activator" src="`+articles[i].imgLink+`">
                        </div>
                        <div class="card-content">
                          <span class="card-title activator grey-text text-darken-4">`+articles[i].title+`<i class="material-icons right">more_vert</i></span>
                          <p><a href=`+articles[i].link+`>This is a link to the article</a></p>
                        </div>
                        <div class="card-reveal">
                          <span class="card-title grey-text text-darken-4">`+articles[i].title+`<i class="material-icons right">close</i></span>
                          <p>`+articles[i].content+`</p>
                          <div class="input-field col s12">
                              <input id="`+articles[i]._id+`" type="text" class="validate">
                              <label for="`+articles[i]._id+`">Add a note!</label>
                          </div>
                          <div class="center-align">Notes</div>
                          <div id="note`+articles[i]._id+`"></div>
                          <a class="btn-floating halfway-fab waves-effect waves-light red" data-id="`+articles[i]._id+`" onclick="submitNote('`+articles[i]._id+`')"><i class="material-icons">add</i></a>
                        </div>
                    </div>`//+articles[i].note.body for the note, unfortunately not all have notes.
                )
                    if(articles[i].hasOwnProperty('note')){
                        $("#note"+articles[i]._id).text(articles[i].note.body);
                    }
                }
            }
        })
    }
})
function submitNote (id){
    console.log("submit function ran")
    let data ={note: $("#"+id+"").val()};
    console.log(data);
    $.ajax("/update/"+id, {
        type:"POST",
        data:data
    }).then(function(){
        console.log("update fired");
        location.reload();
    }
        
    )
}